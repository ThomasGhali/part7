import { createSlice } from '@reduxjs/toolkit'
import blogsService from '../services/blogs'
import { showNotification } from './notificationsReducer'

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
  },
})

export const { setBlogs } = blogSlice.actions

export const fetchBlogs = () => {
  return async (dispatch) => {
    try {
      const blogs = await blogsService.getAll()
      dispatch(setBlogs(blogs))
    } catch (error) {
      dispatch(showNotification(error.message))
    }
  }
}

export const createBlog = (newBlog) => {
  return async (dispatch) => {
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

export default blogSlice.reducer
