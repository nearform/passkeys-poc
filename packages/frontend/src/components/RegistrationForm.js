import React, { useState } from 'react'
import {
  startRegistration,
  browserSupportsWebAuthn
} from '@simplewebauthn/browser'

import NoWebAuthn from './NoWebAuthn'

function RegistrationForm({ switchMode, setError }) {
  const [userName, setUserName] = useState('')
  const [displayName, setDisplayName] = useState('')

  if (!browserSupportsWebAuthn()) {
    return <NoWebAuthn />
  }

  const handleRegister = async () => {
    const resp = await fetch('/auth/register/start', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ userName, displayName }),
      credentials: 'include'
    })

    let attResp
    try {
      const responseData = await resp.json()
      attResp = await startRegistration(responseData)
    } catch (error) {
      console.log(error)
      setError('Registration Failed!')
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

    if (verificationJSON && verificationJSON.userName) {
      switchMode(verificationJSON.userName);
    } else {
      setError('Registration Failed!')
    }
  }

  return (
    <div className="bg-white">
      <h1 className="text-2xl mb-4 text-center">Registration Form</h1>
      <div className="mb-4">
        <label
          htmlFor="userName"
          className="block text-sm font-medium text-gray-700"
        >
          User Name
        </label>
        <input
          type="text"
          id="userName"
          autoComplete="userName webauthn"
          value={userName}
          onChange={e => setUserName(e.target.value)}
          className="mt-1 p-2 w-full border rounded-md"
        />
      </div>

      <div className="mb-4">
        <label
          htmlFor="displayName"
          className="block text-sm font-medium text-gray-700"
        >
          Display Name
        </label>
        <input
          type="text"
          id="displayName"
          autoComplete="displayName webauthn"
          value={displayName}
          onChange={e => setDisplayName(e.target.value)}
          className="mt-1 p-2 w-full border rounded-md"
        />
      </div>

      <div className="flex gap-4">
        <button
          onClick={handleRegister}
          className="flex-1 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-2"
        >
          Register
        </button>
      </div>
      <p className="text-center">Already have an account?</p>
      <button
        className="mx-auto block underline decoration-dotted  text-sky-600 hover:text-sky-300"
        onClick={() => switchMode()}
      >
        Click here to authenticate
      </button>
    </div>
  )
}

export default RegistrationForm
