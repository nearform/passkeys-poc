
function RegistrationSuccess({ error }) {
  return (
    <div className="mx-auto p-8 bg-red-200 rounded-lg max-w-sm text-center text-sm">
      <h3 className="font-bold">{error}</h3>
    </div>
  )
}

export default RegistrationSuccess
