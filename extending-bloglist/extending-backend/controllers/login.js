const loginRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const config = require('../utils/config')

loginRouter.post('/', async (request, response) => {
  const { username, password } = request.body

  const user = await User.findOne({ username })

  const passwordValid =
    user === null ? false : await bcrypt.compare(password, user.passwordHash)

  if (!(user && passwordValid))
    return response.status(401).json({ error: 'invalid username or password' })

  const tokenPayload = {
    username: user.username,
    id: user._id,
  }

  const token = jwt.sign(tokenPayload, config.SECRET)

  response.status(200).json({ token, username: user.username, name: user.name })
})

module.exports = loginRouter
