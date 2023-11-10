import React from 'react'
import { useNavigate } from 'react-router-dom';
import { startAuthentication } from '@simplewebauthn/browser'

function AuthenticationForm({ switchMode, setError }) {
  const navigate = useNavigate()
  const handleAuthenticate = async (event) => {
    event.preventDefault()
    const resp = await fetch('/auth/login/start')

    let asseResp
    try {
      const authOpts = await resp.json()
      // Pass the options to the authenticator and wait for a response
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
    <form
      className="bg-white"
      onSubmit={handleAuthenticate}
    >
      <h1 className="text-2xl mb-4 text-center">Authentication Form</h1>
      <div className="flex gap-4">
        <button
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
    </form>
  )
}

export default AuthenticationForm
