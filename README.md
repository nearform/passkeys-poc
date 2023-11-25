# NearForm Passkeys POC

This application is a proof of concept for using passkey based authentication. The code is split into server and client packages, the former is built on Fastify and the latter is built on React. Besides Node and NPM, it relies on Docker to run a Mongo container for data persistence.

The server code is under `/packages/server`. The logic for handling passkeys is in `packages/server/sr/plugins/fastify-passkey-auth.js`.

The client code is under `/packages/frontend`. It is a React application with one public page use for registration and authentication and one protected page that is viewable once a user is authenticated. Passkey logic is in `packages/frontend/src/components/RegistrationForm.js` and `packages/frontend/src/components/AuthenticationForm.js`.

Client and server both rely on packages from https://simplewebauthn.dev/ to simplify the process of using passkeys.

This project has a companion blog post at https://add-post.url if you'd like to read more about it.

### Features

With the application running, a user is able to register one or more accounts using passkey based authentication. After an account is registered it will be available as an authentication credential. Authentication credentials are discoverable by the Authentication form via autofill after clicking on the username field or via the browser's passkey dropdown after clicking on the Authenticate button.

After choosing a credential a user will be required to authenticate with their system to access the credential and then be redirected to the application's protected page.

Registration and authentication are also available via an external Android or iOS device, but there are some restrictions on device/browser/OS interoperability. In our testing, the following scenarios worked:

* An iOS device can be used to create and authenticate via Safari on an OSX device. It is not necessary for the user to be logged in to their Apple ID on the OSX device.
* An Android device can be used to create and authenticate via Chrome on a Windows device. It is not necessary to be logged in to Chrome on the Windows machine.

To test registration and authentication with your Android or iOS device ensure that Bluetooth is active on your mobile device and your computer. When selecting from registration or authentication options choose the one that reads 'Use a phone, table, or security key' (or similar, messaging varies by browser), then scan the QR code that appears over the browser and follow any authentication prompts that appear.

Passkey authentication is available in Chrome, Safari, and Edge on Windows or OSX machines when using device bound (locally hosted by the browser or OS) passkeys. Cross device authentication is available using Chrome or Edge on Windows, OSX, or Ubuntu and multi-device key registered on an Android or iOS device. While Firefox does support WebAuthn authentication with hardware keys, it does not yet support passkeys. More information on device compatability can be found [here](https://passkeys.dev/device-support/).

### Running the application

To start the application run:

`npm i`

`npm start`

Open http://localhost:3000 in your browser

Running `npm start` will spin up a Mongo container named `mongo_db_instance`. After stopping the project you will also need to stop this container with `docker stop mongo_db_instance`.

You can also start the database, server, and client in there own terminals with these individual commands:

`docker-compose up`

`npm run dev --workspace=server`

`npm run start --workspace=frontend`
