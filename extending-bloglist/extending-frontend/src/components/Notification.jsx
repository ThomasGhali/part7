import { useSelector } from 'react-redux'

const Notification = () => {
  const { message, isError } = useSelector((state) => state.notifications)
  const type = isError ? 'success' : 'error'

  return <div className={`notification ${type}`}>{message}</div>
}

export default Notification
