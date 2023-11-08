function Toast({ children, isError }) {
  const bgColor = isError ? 'bg-red-200' : 'bg-orange-200'

  return (
    <div className={`mx-auto p-8 ${bgColor} rounded-lg max-w-sm text-center text-sm`}>
      {children}
    </div>
  )
}

export default Toast
