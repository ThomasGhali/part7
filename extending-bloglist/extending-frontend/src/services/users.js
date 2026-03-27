import axios from 'axios'

const getUsers = async () => {
  const response = await axios.get('/api/users')
  console.log('users from services: ', response.data)
  return response.data
}

export default { getUsers }