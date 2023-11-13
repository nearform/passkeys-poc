import React, { useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import {
  browserSupportsWebAuthnAutofill,
  startAuthentication,
} from '@simplewebauthn/browser'

function AuthenticationForm({ switchMode, setError }) {
  const navigate = useNavigate()
  const handleAuthenticate = async (event) => {
    event.preventDefault()
    authenticate()
  }
  const authenticate = useCallback(async (autofill = false) => {
    const resp = await fetch('/auth/login/start')

    let asseResp
    try {
      const authOpts = await resp.json()
      // Pass the options to the authenticator and wait for a response
      asseResp = await startAuthentication(authOpts, autofill)
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.log(error)
        return setError('Login Failed!')
      } else {
        // the startAuthentication call in useEffect below will be canceled if
        // the Authenticate button is clicked.
        return console.log(
          error.message,
          'Autofill authentication was probably interupted by manual authentication'
        )
      }
    }

    const verificationResp = await fetch('/auth/login/finish', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(asseResp)
    })

    if (!verificationResp.ok) {
      return setError('Login Failed!')
    }

    const verificationJSON = await verificationResp.json()

    if (verificationJSON && verificationJSON.username) {
      navigate('/user')
    } else {
      setError('Login Failed!')
    }
  }, [navigate, setError])

  useEffect(() => {
    // initialize passkey autofill and kick off the authentication process
    // so passkeys are available for selection from the username field.
    const startAutoFill = async () => {
      const supportsAutofill = await browserSupportsWebAuthnAutofill()

      if (supportsAutofill) {
        authenticate(true)
      }
    }
    startAutoFill()
  }, [authenticate])

  return (
    <div className="bg-white">
      <form onSubmit={handleAuthenticate}>
        <h1 className="text-2xl mb-4 text-center">Authentication Form</h1>
        <div className="mb-4">
          <label
            htmlFor="username"
            className="block text-sm font-medium text-gray-700"
          >
            User Name
          </label>
          <input
            type="text"
            className="mt-1 p-2 w-full border rounded-md"
            name="username"
            autoComplete="username webauthn"
          />
        </div>
        <div className="flex gap-4">
          <button
            className="flex-1 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-2"
          >
            Authenticate
          </button>
        </div>
      </form>
      <p className="text-center">Don't have an account yet?</p>
      <button
        className="mx-auto block underline decoration-dotted text-sky-600 hover:text-sky-300"
        onClick={switchMode}
      >
        Click here to register
      </button>
    </div>
  )
}

export default AuthenticationForm
