import React, { useState } from 'react'
import { startRegistration } from '@simplewebauthn/browser'

function RegistrationForm({ switchMode, setError }) {
  const [username, setUsername] = useState('')
  const handleRegister = async (event) => {
    event.preventDefault()
    const resp = await fetch('/auth/register/start', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username }),
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
      },
      body: JSON.stringify(attResp)
    })

    const verificationJSON = await verificationResp.json()

    if (verificationJSON && verificationJSON.username) {
      switchMode(verificationJSON.username);
    } else {
      setError('Registration Failed!')
    }
  }

  return (
    <div className="bg-white">
      <form onSubmit={handleRegister}>
        <h1 className="text-2xl mb-4 text-center">Registration Form</h1>
        <div className="mb-4">
          <label
            htmlFor="username"
            className="block text-sm font-medium text-gray-700"
          >
            Username
          </label>
          <input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            className="mt-1 p-2 w-full border rounded-md"
          />
        </div>

        <div className="flex gap-4">
          <button
            className="flex-1 bg-green-500 hover:bg-green-700 disabled:bg-green-100 text-white font-bold py-2 px-4 rounded mb-2"
            disabled={username === ''}
            type="submit"
          >
            Register
          </button>
        </div>
      </form>
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
