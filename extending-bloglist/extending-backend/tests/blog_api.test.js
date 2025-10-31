const { test, after, describe, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const { initialBlogs, blogsInDb, createUser, loginUser } = require('./test_helper')

const api = supertest(app)


describe('when there are some initially saved blogs', () => {
  let token = null
  // clear users & blogs, create new user & blog
  beforeEach(async () => {
    await User.deleteMany({})
    const newUser = {
      username: 'hedgehog123',
      name: 'Sonic',
      password: 'passcode123'
    }

    // create user and save its token
    await createUser(api, newUser)
    const login = await loginUser(api, { username: newUser.username, password: newUser.password })
    token = login.token

    await Blog.deleteMany({})
    // make new blog with token
    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(initialBlogs[0])
      .expect(201)
  })

  describe('blogs are returned', () => {
    test('as json', async () => {
      await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
    })

    test('with right amount', async () => {
      const response = await api.get('/api/blogs')

      assert.strictEqual(response.body.length, 1)
    })

    test('with "id" keys not "_id"', async () => {
      const blogs = await blogsInDb()

      assert(blogs[0].id)
      assert(!blogs[0]._id)
    })
  })

  describe('blog is added', () => {
    test('if content is valid', async () => {
      const newBlogObj = {
        'title': 'A visit to Toronto',
        'author': 'Thomas Ghali',
        'url': 'www.demo-url.com',
        'likes': 3
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlogObj)
        .expect(201)

      const blogsAtEnd = await blogsInDb()

      assert(blogsAtEnd.find(b => b.title === 'A visit to Toronto'))
    })

    test('with it\'s "likes" default to 0 if not provided', async () => {
      const newBlogObj = {
        'title': 'A visit to Toronto',
        'author': 'Thomas Ghali',
        'url': 'www.demo-url.com'
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlogObj)
        .expect(201)

      const blogsAtEnd = await blogsInDb()

      const newBlogInDb = blogsAtEnd.find(b => b.title === 'A visit to Toronto')

      assert.strictEqual(newBlogInDb.likes, 0)
    })

    test('unless its title is missing: 400 bad request', async () => {
      const newBlogObj = {
        'author': 'Thomas Ghali',
        'url': 'www.demo-url.com',
        'likes': 3
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlogObj)
        .expect(400)
    })

    test('unless its url is missing: 400 bad request', async () => {
      const newBlogObj = {
        'title': 'A visit to Toronto',
        'author': 'Thomas Ghali',
        'likes': 3
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlogObj)
        .expect(400)
    })

    test('unless token not provided: 401 unauthorized', async () => {
      const newBlogObj = {
        'title': 'A visit to Toronto',
        'author': 'Thomas Ghali',
        'url': 'www.demo-url.com',
        'likes': 3
      }

      const response = await api
        .post('/api/blogs')
        .send(newBlogObj)
        .expect(401)

      assert.strictEqual(response.body.error, 'invalid token or user not found')
    })
  })

  describe('deletion of a blog', () => {
    test('succeeds with status 204 if id is valid', async () => {
      const blogsAtStart = await blogsInDb()
      const blogToDelete = blogsAtStart[0]

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204)

      const blogsAtEnd = await blogsInDb()

      assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1)
      assert(!blogsAtEnd.find(b => b.title === blogToDelete.title))
    })

    test('fails with 401 if token not provided', async () => {
      const blogsAtStart = await blogsInDb()
      const blogToDelete = blogsAtStart[0]

      const response = await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .expect(401)

      const blogsAtEnd = await blogsInDb()

      assert.strictEqual(blogsAtEnd.length, blogsAtStart.length)
      assert(blogsAtEnd.find(b => b.title === blogToDelete.title))
      assert.strictEqual(response.body.error, 'invalid token')
    })
  })

  describe('updating of a blog', () => {
    let blogToUpdate
    let blogId
    let newBlogObj

    beforeEach(async () => {
      const blogsAtStart = await blogsInDb()
      blogToUpdate = blogsAtStart[0]
      blogId = blogToUpdate.id
      newBlogObj = { ...blogToUpdate, likes: 23 }
    })

    test('fails with status 404 if blog with given id not in database', async () => {
      const wrongId = new mongoose.Types.ObjectId().toString()

      await api
        .put(`/api/blogs/${wrongId}`)
        .send(newBlogObj)
        .expect(404)

      const blogsAtEnd = await blogsInDb()
      const blogToUpdateEnd = blogsAtEnd.find(b => b.id === blogId)

      assert.strictEqual(blogToUpdateEnd.likes, blogToUpdate.likes)
    })

    test('succeeds to update with valid id', async () => {
      await api
        .put(`/api/blogs/${blogId}`)
        .send(newBlogObj)
        .expect(200)

      const blogsAtEnd = await blogsInDb()
      const blogToUpdateEnd = blogsAtEnd.find(b => b.id === blogId)

      assert.strictEqual(newBlogObj.likes, blogToUpdateEnd.likes)
    })
  })
})


after(async () => {
  await mongoose.connection.close()
})