const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', {
    username: 1,
    name: 1,
    id: 1,
  })

  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const body = request.body
  const user = request.user

  if (!user)
    return response
      .status(401)
      .json({ error: 'invalid token or user not found' })

  if (body.title === undefined || body.url === undefined) {
    return response.status(400).json({ error: 'title & url required' })
  }

  if (body.likes === undefined) {
    body.likes = 0
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id,
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  const populatedBlog = await savedBlog.populate('user', {
    username: 1,
    name: 1,
    id: 1,
  })

  response.status(201).json(populatedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
  const blogId = request.params.id
  const blog = await Blog.findById(blogId)

  const user = request.user

  if (!blog) return response.status(404).json({ error: 'blog not found' })

  if (!user) return response.status(401).json({ error: 'invalid token' })

  if (blog.user._id.toString() !== user._id.toString()) {
    return response.status(401).json({ error: 'user unauthorized' })
  }

  const result = await User.updateOne(
    { blogs: blogId },
    { $pull: { blogs: blogId } }
  )

  if (result.modifiedCount === 0) {
    return response.status(400).json({ error: 'user doesn\'t have that blog in his blogs array' })
  }

  await blog.deleteOne()
  response.status(200).json(blog)
})

blogsRouter.put('/:id', async (req, res) => {
  const blogId = req.params.id
  const updatedBlog = await Blog.findByIdAndUpdate(blogId, req.body, {
    new: true,
    runValidators: true,
    context: 'query',
  })

  if (!updatedBlog) return res.status(404).end()

  const populatedBlog = await updatedBlog.populate('user', {
    username: 1,
    name: 1,
    id: 1,
  })

  res.json(populatedBlog)
})

module.exports = blogsRouter
