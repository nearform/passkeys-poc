import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

function User() {
  const navigate = useNavigate()
  const [user, setUser] = useState()
  const [loggedOut, setLoggedOut] = useState(false)
  const [logoutCountdown, setLogoutCountdown] = useState(3)
  const [logoutMessage, setLogoutMessage] = useState('You\'ve logged out')

  const handleLogout = async () => {
    const response = await fetch('/logout')

    if (response.ok) {
      const data = await response.json()
      setLogoutMessage(data.message)
    }

    setLoggedOut(true)
  }

  useEffect(() => {
    const getUser = async () => {
      const response = await fetch('/user')

      if (!response.ok) {
        return navigate('/')
      }

      const data = await response.json()

      setUser(data)
    }

    getUser()
  }, [navigate])

  useEffect(() => {
    if (loggedOut) {
      const clearId = setInterval(() => {
        if (logoutCountdown <= 0) {
          clearInterval(clearId)
          return navigate('/')
        }
        setLogoutCountdown(current => current - 1)
      }, 1000)

      return () => clearInterval(clearId)
    }
  }, [loggedOut, logoutCountdown, navigate])

  return loggedOut ? (
    <div className="p-8 rounded-lg shadow-uniform w-96 mx-auto my-6">
      <p>{logoutMessage}</p>
      <p>Redirecting in {logoutCountdown}</p>
    </div>
  ) : (
    <div className="p-8 rounded-lg shadow-uniform max-w-2xl mx-auto my-6">
      <h1 className="text-2xl mb-4 text-center">Your User Data</h1>
      <pre>{JSON.stringify(user, null, 2)}</pre>
      <button onClick={handleLogout}>logout</button>
    </div>
  )
}

export default User
