import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'

const User = () => {
  const users = useSelector(state => state.users)
  const id = useParams().id

  console.log('users in User: ', users)
  console.log('id: ',id)
  return (
    <>

    </>
  )
}

export default User
