import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { startAuthentication } from '@simplewebauthn/browser'

import NoWebAuthn from './NoWebAuthn'

function AuthenticationForm({ switchMode, setError }) {
  const [userName, setUserName] = useState('')
  const navigate = useNavigate()
  const handleAuthenticate = async () => {
    const resp = await fetch('/auth/login/start', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ userName }),
      // credentials: 'include'
    })

    let asseResp
    try {
      const authOpts = await resp.json()
      // Pass the options to the authenticator and wait for a response
      // @TODO: adding true as a second argument here should enable autofill
      asseResp = await startAuthentication(authOpts)
    } catch (error) {
      console.log(error)
      return setError('Login Failed!')
    }

    const verificationResp = await fetch('/auth/login/finish', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(asseResp)
    })

    const verificationJSON = await verificationResp.json()

    if (verificationJSON && verificationJSON.userName) {
      navigate('/user')
    } else {
      setError('Login Failed!')
    }
  }

  return (
    <div className="bg-white">
      <h1 className="text-2xl mb-4 text-center">Authentication Form</h1>
      <div className="mb-4">
        <label
          htmlFor="userName"
          className="block text-sm font-medium text-gray-700"
        >
          User Name
        </label>
        <input
          type="text"
          autoComplete="username webauthn"
          value={userName}
          onChange={e => setUserName(e.target.value)}
          className="mt-1 p-2 w-full border rounded-md"
        />
      </div>

      <div className="flex gap-4">
        <button
          onClick={handleAuthenticate}
          className="flex-1 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-2"
        >
          Authenticate
        </button>
      </div>
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
