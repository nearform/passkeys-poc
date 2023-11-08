import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

const UserData = ({ label, value }) => (
  <label className="mb-4 grid-cols-[0.3fr_1fr] grid">
    <span>{label}: </span>
    <input type="text" defaultValue={value} disabled className="w-100 flex-1 rounded-lg px-2 bg-slate-200" />
  </label>
)

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

  if (loggedOut) {
    return (
      <div className="p-8 rounded-lg shadow-uniform w-96 mx-auto my-6">
        <p>{logoutMessage}</p>
        <p>Redirecting in {logoutCountdown}</p>
      </div>
    )
  }

  return (
    <div className="p-8 rounded-lg shadow-uniform w-[600px] mx-auto my-6 flex flex-col">
      <h1 className="text-2xl mb-4 text-center">Your User Data</h1>
      <UserData label="User Name" value={user?.userName} />
      <UserData label="Public Key" value={user?.registration?.publicKey} />
      <UserData label="Transports" value={user?.registration?.transports?.join(', ')} />
      <UserData
        label="Registered"
        value={
          user?.registration?.registered ? new Date(user.registration.registered).toISOString() : ''
        }
      />
      <UserData
        label="Last Used"
        value={
          user?.registration?.last_used ? new Date(user.registration.last_used).toISOString() : ''
        }
      />
      <button
        className="flex-1 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-2"
        onClick={handleLogout}
      >
        logout
      </button>
    </div>
  )
}

export default User
