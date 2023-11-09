import fp from 'fastify-plugin'
import {
  generateAuthenticationOptions,
  generateRegistrationOptions,
  verifyRegistrationResponse,
  verifyAuthenticationResponse
} from '@simplewebauthn/server'
import { isoBase64URL } from '@simplewebauthn/server/helpers'
import Errors from 'http-errors'

const RP_ID = 'localhost'
const RP_NAME = 'SimpleWebAuthn Demo'

/** @type {import('fastify').FastifyPluginAsync} */
async function passkeys(fastify) {
  fastify.post('/auth/register/start', async request => {
    const user = request.body

    try {
      const authenticatorSelection = {
        residentKey: 'preferred',
        requireResidentKey: false,
        userVerification: 'preferred'
      }
      const attestationType = 'none'
      const id = crypto.randomUUID()
      const options = await generateRegistrationOptions({
        rpName: RP_NAME,
        rpID: RP_ID,
        userID: id,
        userName: user.userName,
        attestationType,
        authenticatorSelection
      })

      request.session.challenge = options.challenge
      request.session.registratingUser = {
        ...user,
        id
      }

      return options
    } catch (e) {
      request.log.error(e)
      throw new Errors.InternalServerError(e.message)
    }
  })

  fastify.post('/auth/register/finish', async request => {
    // Set expected values.
    const expectedChallenge = request.session.challenge
    const user = request.session.registratingUser
    const expectedOrigin = 'http://localhost:3000'
    const expectedRPID = RP_ID
    const credential = request.body

    try {
      // Use SimpleWebAuthn's handy function to verify the registration request.
      const verification = await verifyRegistrationResponse({
        response: credential,
        expectedChallenge,
        expectedOrigin,
        expectedRPID,
        requireUserVerification: false
      })

      const { verified, registrationInfo } = verification

      // If the verification failed, throw.
      if (!verified) {
        throw Errors.Unauthorized()
      }

      const { credentialPublicKey, credentialID } = registrationInfo

      // Base64URL encode ArrayBuffers.
      const base64PublicKey = isoBase64URL.fromBuffer(credentialPublicKey)
      const base64CredentialID = isoBase64URL.fromBuffer(credentialID)

      // Store the registration result.
      const registration = {
        id: base64CredentialID,
        publicKey: base64PublicKey,
        transports: credential.response.transports || [],
        registered: new Date().getTime(),
        last_used: null,
        userName: user.userName
      }

      const users = fastify.mongo.db.collection('users')

      await users.updateOne(
        { ...user },
        { $set: { registration } },
        { upsert: true }
      )

      // Delete the challenge from the session.
      delete request.session.challenge
      delete request.session.origin

      // Respond with the user information.
      return user
    } catch (e) {
      delete request.session.challenge
      throw new Errors.InternalServerError(e.message)
    }
  })

  fastify.get('/auth/login/start', async request => {
    const options = await generateAuthenticationOptions({
      rpID: RP_ID,
      allowCredentials: [],
      userVerification: 'preferred'
    })

    request.session.challenge = options.challenge
    return options
  })

  fastify.post('/auth/login/finish', async (request, reply) => {
    // Set expected values.
    const credential = request.body
    const expectedChallenge = request.session.challenge
    const expectedOrigin = 'http://localhost:3000'
    const expectedRPID = RP_ID

    const users = fastify.mongo.db.collection('users')

    try {
      // Find the matching credential from the credential ID
      const user = await users.findOne({
        'registration.id': credential.id
      })

      if (!user) {
        throw Errors.Unauthorized()
      }

      // Decode ArrayBuffers and construct an authenticator object.
      const authenticator = {
        credentialPublicKey: isoBase64URL.toBuffer(user.registration.publicKey),
        credentialID: isoBase64URL.toBuffer(user.registration.id),
        transports: user.registration.transports
      }

      // Use SimpleWebAuthn's handy function to verify the authentication request.
      const verification = await verifyAuthenticationResponse({
        response: credential,
        expectedChallenge,
        expectedOrigin,
        expectedRPID,
        authenticator,
        requireUserVerification: false
      })

      const { verified } = verification

      // If the authentication failed, throw.
      if (!verified) {
        throw Errors.Unauthorized()
      }

      // Delete the challenge from the session.
      delete request.session.challenge

      users.updateOne(
        { id: user.id },
        { $set: { 'registration.last_used': new Date().getTime() } }
      )

      // Start a new session.
      request.session.user = user
      reply.send(user)
    } catch (e) {
      request.log.error(e)
      delete request.session.challenge
      throw Errors.Unauthorized()
    }
  })
}

export default fp(passkeys)
