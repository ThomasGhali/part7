import { createSlice } from '@reduxjs/toolkit'
import blogsService from '../services/blogs'
import { showNotification } from './notificationsSlice'

const blogSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    setBlogs(state, action) {
      return action.payload
    },
    addBlog(state, action) {
      state.push(action.payload)
    },
    removeBlog(state, action) {
      const index = state.findIndex(b => b.id === action.payload)
      if (index !== -1) state.splice(index, 1)
    },
    likeBlog(state, action) {
      const blog = state.find(blog => blog.id === action.payload)
      if (blog) blog.likes += 1
    },
  },
})

export const { setBlogs } = blogSlice.actions

export const fetchBlogs = () => {
  return async dispatch => {
    try {
      const blogs = await blogsService.getAll()
      dispatch(setBlogs(blogs))
    } catch (error) {
      dispatch(showNotification(error.message))
    }
  }
}

export const createBlog = newBlog => {
  return async dispatch => {
    await blogsService.createBlog(newBlog)
    await dispatch(fetchBlogs())

    dispatch(
      showNotification(
        `a new blog ${newBlog.title} by ${newBlog.author} added`,
        true
      )
    )
  }
}

const { removeBlog, likeBlog } = blogSlice.actions

export const deleteBlog = blog => {
  return async dispatch => {
    if (!window.confirm(`Remove ${blog.title} by ${blog.author}?`)) return

    try {
      await blogsService.deleteBlog(blog.id)
      dispatch(removeBlog(blog.id))
      dispatch(showNotification('Blog deleted', true))
    } catch (error) {
      const errorMsg =
        error.status === 401
          ? 'User unauthorized to do such action'
          : error.message
      dispatch(showNotification(errorMsg))
    }
  }
}

export const addLike = blog => {
  return async dispatch => {
    await blogsService.updateBlog({ ...blog, likes: blog.likes + 1 })
    dispatch(likeBlog(blog.id))
  }
}

export default blogSlice.reducer
