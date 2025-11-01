import axios from 'axios'

const getUsers = async () => {
  const response = await axios.get('/api/users')
  return response.data
}

export default { getUsers }