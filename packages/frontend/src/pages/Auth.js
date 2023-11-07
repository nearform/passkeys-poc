import { useEffect, useState } from 'react';

import RegistrationForm from "../components/RegistrationForm";
import AuthenticationForm from "../components/AuthenticationForm";
import RegistrationSuccess from '../components/RegistrationSuccess';
import RegistrationError from '../components/RegistrationError';

const MODES = {
  REGISTRATION: 'REGISTRATION',
  AUTHENTICATION: 'AUTHENTICATION',
}

export default function App() {
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
            <AuthenticationForm switchMode={setRegistrationMode} />
        }
      </div>
      {!!justRegisteredUserName && <RegistrationSuccess name={justRegisteredUserName} />}
      {!!error && <RegistrationError error={error} />}
    </>
  )
}
