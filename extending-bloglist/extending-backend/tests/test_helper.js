const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    'title': 'demo title 1',
    'author': 'demo author 1',
    'url': 'demo url 1',
    'likes': 5
  },
  {
    'title': 'demo title 2',
    'author': 'demo author 2',
    'url': 'demo url 2',
    'likes': 10
  }
]

const blogsInDb = async () => {
  const blogsReturned = await Blog.find({})
  return blogsReturned.map(b => b.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

const createUser = async (api, userData) => {
  const response = await api
    .post('/api/users')
    .send(userData)

  return response.body
}

const loginUser = async (api, userData) => {
  const response = await api
    .post('/api/login')
    .send(userData)

  return response.body
}

module.exports = { blogsInDb, initialBlogs, usersInDb, createUser, loginUser }