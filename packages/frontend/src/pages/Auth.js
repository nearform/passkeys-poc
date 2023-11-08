import { useEffect, useState } from 'react';

import RegistrationForm from "../components/RegistrationForm";
import AuthenticationForm from "../components/AuthenticationForm";
import Toast from '../components/Toast';

const MODES = {
  REGISTRATION: 'REGISTRATION',
  AUTHENTICATION: 'AUTHENTICATION',
}

export default function Auth() {
  const [mode, setMode] = useState(MODES.REGISTRATION)
  const [error, setError] = useState()
  const [justRegisteredUserName, setJustRegisteredUserName] = useState()
  const setRegistrationMode = () => {
    setMode(MODES.REGISTRATION)
  }
  const setAuthenticationMode = (registeringUserName) => {
    setJustRegisteredUserName(registeringUserName)
    setMode(MODES.AUTHENTICATION)
  }

  useEffect(() => {
    if (justRegisteredUserName) {
      const clearId = setTimeout(() => setJustRegisteredUserName(undefined), 3000)
      return () => clearTimeout(clearId)
    }
  }, [justRegisteredUserName])

  useEffect(() => {
    if (error) {
      const clearId = setTimeout(() => setError(undefined), 3000)
      return () => clearTimeout(clearId)
    }
  }, [error])

  return (
    <>
      <div className="p-8 rounded-lg shadow-uniform w-96 mx-auto my-6">
        {
          mode === MODES.REGISTRATION ?
            <RegistrationForm switchMode={setAuthenticationMode} setError={setError} /> :
            <AuthenticationForm switchMode={setRegistrationMode} setError={setError} />
        }
      </div>
      {!!justRegisteredUserName && (
        <Toast>
          <h3 className="font-bold">
            {`Congratulations! You've successfully registered a new account for ${justRegisteredUserName}`}
          </h3>
          <p>Use the current form to authenticate and access your account.</p>
        </Toast>
      )}
      {!!error && (
        <Toast isError={true}>
          <h3 className="font-bold">{error}</h3>
        </Toast>
      )}
    </>
  )
}
