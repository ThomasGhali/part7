const { test, describe, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const User = require('../models/user')
const supertest = require('supertest')
const app = require('../app')
const mongoose = require('mongoose')
const { usersInDb } = require('./test_helper')
const bcrypt = require('bcrypt')

const api = supertest(app)



describe('when there is initially one user in DB', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('rock123', 10)
    const demoUser = new User({ username: 'demo_user180', name: 'Demo User', passwordHash })

    await demoUser.save()
  })

  test('is successful with fresh username', async () => {
    const usersAtStart = await usersInDb()

    const validUserData = {
      username: 'john king',
      name: 'John Ghali',
      password: 'john123'
    }

    await api
      .post('/api/users')
      .send(validUserData)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map(user => user.username)
    assert(usernames.includes(validUserData.username))
  })

  test('fails with proper statuscode & message for already taken username', async () => {
    const existingUser = { username: 'demo_user180', name: 'Demo User', password: 'rock123' }
    const usersAtStart = await usersInDb()

    const result = await api
      .post('/api/users')
      .send(existingUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await usersInDb()
    assert(result.body.error.includes('expected `username` to be unique'))

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('fails with invalid username', async () => {
    const invalidUserData = {
      username: 'jo',
      name: 'John Ghali',
      password: 'john123'
    }

    await api
      .post('/api/users')
      .send(invalidUserData)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await usersInDb()
    const usernames = usersAtEnd.map(user => user.username)
    assert(!usernames.includes(invalidUserData.username))
  })

  test('fails with invalid password', async () => {
    const invalidUserData = {
      username: 'john king',
      name: 'John Ghali',
      password: '12'
    }

    await api
      .post('/api/users')
      .send(invalidUserData)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await usersInDb()
    const usernames = usersAtEnd.map(user => user.username)
    assert(!usernames.includes(invalidUserData.username))
  })
})

after(async () => {
  await mongoose.connection.close()
})