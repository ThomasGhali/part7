const Notification = ({ notification }) => {
  const { message, isError } = notification
  const type = isError ? 'success' : 'error'

  return <div className={`notification ${type}`}>{message}</div>
}

export default Notification