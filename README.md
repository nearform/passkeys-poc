# Research Results

In our [previous research](https://github.com/nearform/hub-draft-issues/issues/59), we explored WebAuthn and identified two primary challenges:

- **Cross-device Accessibility**: Users encountered challenges because platform authenticators were restricted to their native devices. This limitation hindered multi-device access to accounts.

- **Implementation Complexity**: Direct deployment of WebAuthn introduced significant complexities for standard use cases.

In light of these challenges, we explored **passkeys** and assessed their potential in resolving the issues mentioned.

Passkeys, a collaborative initiative by leading tech giants—Google, Apple, and Microsoft, conform to standards set by the World Wide Web Consortium and the FIDO Alliance. Essentially, it is WebAuthn enriched with cloud synchronization capabilities.

Built on WebAuthn, Passkeys introduce several features pertinent to our research:

- **Synced Passkeys**: These credentials, which allow password-free sign-ins, can be synchronized across different devices or cloud platforms and can be retrieved from backups. For instance, a passkey created on an Android device can be accessed on another Android device linked to the same account or restored from a cloud backup if the original device is lost and a replacement is set up.

- **Cross-Device Authentication (CDA)**: This feature enables the utilization of a passkey from one device to sign in on another. Within the CDA framework, the client (the device used for authentication) and the authenticator (which provides the passkey) play key roles. For instance, if I wish to register using a desktop, I can initiate a Cross-Device Authentication and use an Android device to generate the passkeys. When I need to use this passkey on a different device, I can activate Cross-Device Authentication and employ my phone as an authenticator without generating a new passkey. It's worth noting that while CDA can be applied during the registration/authentication phase, there are constraints:

  - **Limited device support**: https://passkeys.dev/device-support/
  - **Hardware support** Both the client and the authenticator need to be proximate and equipped with Bluetooth/NFC.
  - **Vendor lock-in**: There are possible issues if you want to move from one vendor to another.

- **Autofill UI**: Browsers incorporate this feature, which, when triggered by including webauthn in the autocomplete field, simplifies the selection and use of passkeys and the initiation of Cross-Device Authentication.

Collectively, these three features have greatly enhanced the user experience with passkeys.

From an implementation perspective, it's notable that one can still create device-bound passkeys. These keys are exclusive to a specific device and are non-transferable. In such instances, the Passkeys experience mirrors that of WebAuthn, except that the association between the keys and their corresponding websites is retained. Consequently, from an implementation standpoint, we can either:

- Create a restricted registration/authentication process where only Cross-Device Authentication is permissible.
- Or implement at least the following features:
  - A **recovery mechanism** for inaccessible passkeys (using SMS, email, or even passwords).
  - A system to **manage** (add/delete) passkeys associated with users' accounts.

For actual passkey implementation, there are tools that considerably streamline the process. The library used for the POC is https://simplewebauthn.dev/, which comprises all the necessary utilities for integrating passkeys on both the client and server sides.

# Running the POC

an experiment for a React app and a fastify server to use passkeys for authentcation.

to run the experiment run:

`npm i`

`docker-compose up -d`

to spin up the mongo db instance to store the users

`npm run dev --workspace=server`

`npm run start --workspace=frontend`

open http://localhost:3000 in your browser
