import React, { useState } from 'react'
import {
  startAuthentication,
  startRegistration,
  browserSupportsWebAuthn
} from '@simplewebauthn/browser'

function UserForm() {
  const [username, setUsername] = useState('')

  if (!browserSupportsWebAuthn()) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl mb-4">User Form</h1>
        <p className="text-red-500">
          Your browser does not support WebAuthn. Please use a different browser
          to continue.
        </p>
      </div>
    )
  }

  const handleRegister = async () => {
    const resp = await fetch('/auth/register/start', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username }),
      credentials: 'include'
    })

    let attResp
    try {
      attResp = await startRegistration(await resp.json())
    } catch (error) {
      if (error.name === 'InvalidStateError') {
        console.log(error)
      }
      throw error
    }

    const verificationResp = await fetch('/auth/register/finish', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        credentials: 'include'
      },
      body: JSON.stringify(attResp)
    })

    const verificationJSON = await verificationResp.json()

    if (verificationJSON && verificationJSON.username) {
      window.alert('Registration successfull!')
    } else {
      window.alert('Registration Failed!')
    }
  }

  const handleAuthenticate = async () => {
    const resp = await fetch('/auth/login/start', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username }),
      credentials: 'include'
    })

    let asseResp
    try {
      // Pass the options to the authenticator and wait for a response
      asseResp = await startAuthentication(await resp.json())
    } catch (error) {
      console.log(error)
    }

    const verificationResp = await fetch('/auth/login/finish', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(asseResp)
    })

    const verificationJSON = await verificationResp.json()

    if (verificationJSON && verificationJSON.username) {
      window.alert('Logged in!')
    } else {
      window.alert('Login Failed')
    }
  }

  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-96">
      <h1 className="text-2xl mb-4">User Form</h1>

      <div className="mb-4">
        <label
          htmlFor="username"
          className="block text-sm font-medium text-gray-700"
        >
          Username
        </label>
        <input
          type="text"
          id="username"
          autocomplete="username webauthn"
          value={username}
          onChange={e => setUsername(e.target.value)}
          className="mt-1 p-2 w-full border rounded-md"
        />
      </div>

      <div className="flex gap-4">
        <button
          onClick={handleRegister}
          className="flex-1 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Register
        </button>
        <button
          onClick={handleAuthenticate}
          className="flex-1 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Authenticate
        </button>
      </div>
    </div>
  )
}

export default UserForm
