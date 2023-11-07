
function RegistrationSuccess({ name }) {
  return (
    <div className="mx-auto p-8 bg-orange-200 rounded-lg max-w-sm text-center text-sm">
      <h3 className="font-bold">{`Congratulations! You've successfully registered a new account for ${name}`}</h3>
      <p>Use the current form to authenticate and access your account.</p>
    </div>
  )
}

export default RegistrationSuccess
