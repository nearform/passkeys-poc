import React, { useState } from 'react'
import { startRegistration } from '@simplewebauthn/browser'

function RegistrationForm({ switchMode, setError }) {
  const [userName, setUserName] = useState('')
  const handleRegister = async (event) => {
    event.preventDefault()
    const resp = await fetch('/auth/register/start', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ userName }),
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

    if (verificationJSON && verificationJSON.userName) {
      switchMode(verificationJSON.userName);
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
            htmlFor="userName"
            className="block text-sm font-medium text-gray-700"
          >
            User Name
          </label>
          <input
            type="text"
            value={userName}
            onChange={e => setUserName(e.target.value)}
            className="mt-1 p-2 w-full border rounded-md"
          />
        </div>

        <div className="flex gap-4">
          <button
            className="flex-1 bg-green-500 hover:bg-green-700 disabled:bg-green-100 text-white font-bold py-2 px-4 rounded mb-2"
            disabled={userName === ''}
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
