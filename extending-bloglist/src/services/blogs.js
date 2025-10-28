import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const createBlog = async (newBlog) => {
  const config = {
    headers: { Authorization: token }
  }

  const response = await axios.post(baseUrl, newBlog, config)
  return response.data
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const updateBlog = async updatedblog => {
  const baseUrl = `/api/blogs/${updatedblog.id}`
  const { title, author, url, likes, user: { id } } = updatedblog
  const newBlog = {
    title,
    url,
    author,
    likes,
    user: id
  }

  const response = await axios.put(baseUrl, newBlog)

  return response.data
}

const deleteBlog = async (blogId) => {
  const baseUrl = `/api/blogs/${blogId}`
  const config = {
    headers: { Authorization: token }
  }

  const response = await axios.delete(baseUrl, config)
  return response.data
}

export const blogsService = {
  getAll,
  createBlog,
  setToken,
  updateBlog,
  deleteBlog
}

export default blogsService