import usersService from '../services/users'
import { showNotification } from '../slices/notificationsSlice'
import { useState, useEffect } from 'react'

const User = ({ user }) => {
  return (
    <tr>
      <td>{user.name}</td>
      <td>{user.blogs.length}</td>
    </tr>
  )
}

const Users = () => {
  const [users, setUsers] = useState([])

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const fetchedUsers = await usersService.getUsers()
        setUsers(fetchedUsers)
      } catch (error) {
        showNotification(error)
      }
    }

    fetchUsers()
  }, [])

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
          {users.map(user => (
            <User user={user} key={user.id} />
          ))}
        </tbody>
      </table>
    </>
  )
}

export default Users
