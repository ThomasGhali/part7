import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import { showNotification } from './slices/notificationsSlice'
import { useDispatch, useSelector } from 'react-redux'
import { createBlog, fetchBlogs, setBlogs } from './slices/blogsSlice'
import { setUser } from './slices/userSlice'

const App = () => {
  // react states
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const blogFormRef = useRef()

  // redux states
  const notification = useSelector(state => state.notifications)
  const blogs = useSelector(state => state.blogs)
  const user = useSelector(state => state.user)

  const dispatch = useDispatch()

  // fetch blogs
  useEffect(() => {
    dispatch(fetchBlogs())
  }, [dispatch])

  // check saved loggins onMount
  useEffect(() => {
    const loggedInUser = window.localStorage.getItem('loggedBlogsAppUser')
    if (loggedInUser) {
      const userData = JSON.parse(loggedInUser)
      dispatch(setUser(userData))
      blogService.setToken(userData.token)
    }
  }, [dispatch])

  const handleLogin = async event => {
    event.preventDefault()

    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogsAppUser', JSON.stringify(user))
      dispatch(setUser(user))
      dispatch(showNotification(`Welcome back ${username}`, true))
      setUsername('')
      setPassword('')
      blogService.setToken(user.token)

      dispatch(fetchBlogs())
    } catch (error) {
      const errorMsg =
        error.response?.status === 500
          ? 'Cannot connect to server'
          : 'wrong username or password'
      dispatch(showNotification(errorMsg))
    }
  }

  const handleCreateBlog = async newBlog => {
    try {
      await dispatch(createBlog(newBlog))
      blogFormRef.current.toggleVisibility()
    } catch (error) {
      const errorMsg =
        error.response?.status === 500
          ? 'Cannot connect to server'
          : 'unable to create new blog'
      dispatch(showNotification(errorMsg))
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogsAppUser')
    dispatch(showNotification('logged out successfully', true))
    dispatch(setUser(null))
    dispatch(setBlogs([]))
  }

  const loginForm = () => (
    <>
      <form onSubmit={handleLogin}>
        <div>
          <label>
            Username
            <input
              type="text"
              value={username}
              onChange={({ target }) => setUsername(target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={({ target }) => setPassword(target.value)}
            />
          </label>
        </div>
        <button type="submit">Log in</button>
      </form>
    </>
  )

  const blogListRender = () => {
    const sortBlogs = [...blogs].sort(
      (blogA, blogB) => blogB.likes - blogA.likes
    )

    return (
      <>
        {sortBlogs.map(blog => (
          <Blog key={blog.id} blog={blog} />
        ))}
      </>
    )
  }

  return (
    <>
      {notification && <Notification />}
      {user === null ? (
        <>
          <h2>Log in:</h2>
          {loginForm()}
        </>
      ) : (
        <>
          <h2>blogs</h2>
          <p>
            {user.name} is logged in{' '}
            <button onClick={handleLogout}>Log out</button>
          </p>
          <Togglable buttonLabel="Create new blog" ref={blogFormRef}>
            <BlogForm createBlog={handleCreateBlog} />
          </Togglable>
          {blogListRender()}
        </>
      )}
    </>
  )
}

export default App
