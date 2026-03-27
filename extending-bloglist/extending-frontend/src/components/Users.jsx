import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { saveUsers } from '../slices/usersSlice'

const UserItem = ({ user }) => {
  return (
    <tr>
      <td>
        <Link to={`/users/${user.id}`}>{user.name}</Link>
      </td>
      <td>{user.blogs.length}</td>
    </tr>
  )
}

const Users = () => {
  const users = useSelector(state => state.users)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(saveUsers())
  }, [dispatch])

  return (
    <>
      <h2>Users</h2>
      <table>
        <thead>
          <tr>
            <th>users</th>
            <th>blogs created</th>
          </tr>
        </thead>
        <tbody>
          {users ? (
            users.map(user => <UserItem user={user} key={user.id} />)
          ) : (
            <p>There appears to be no users</p>
          )}
        </tbody>
      </table>
    </>
  )
}

export default Users
