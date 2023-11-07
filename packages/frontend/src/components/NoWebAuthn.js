function NoWebAuthn() {
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

export default NoWebAuthn
