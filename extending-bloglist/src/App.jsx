import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import { showNotification } from './reducers/notificationsReducer'
import { useDispatch, useSelector } from 'react-redux'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const blogFormRef = useRef()

  // redux states
  const notification = useSelector((state) => state.notifications)

  const dispatch = useDispatch()

  // fetch blogs
  useEffect(() => {
    blogService
      .getAll()
      .then((blogs) => setBlogs(blogs))
      .catch((error) => dispatch(showNotification(error.message)))
  }, [])

  // check saved loggins onMount
  useEffect(() => {
    const loggedInUser = window.localStorage.getItem('loggedBlogsAppUser')
    if (loggedInUser) {
      const userData = JSON.parse(loggedInUser)
      setUser(userData)
      blogService.setToken(userData.token)
    }
  }, [])

  const getBlogs = () => blogService.getAll().then((blogs) => setBlogs(blogs))

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogsAppUser', JSON.stringify(user))
      setUser(user)
      dispatch(showNotification(`Welcome back ${username}`, true))
      setUsername('')
      setPassword('')
      blogService.setToken(user.token)

      await getBlogs()
    } catch (error) {
      const errorMsg =
        error.response?.status === 500
          ? 'Cannot connect to server'
          : 'wrong username or password'
      dispatch(showNotification(errorMsg))
    }
  }

  const handleCreateBlog = async (newBlog) => {
    try {
      await blogService.createBlog(newBlog)
      blogFormRef.current.toggleVisibility()
      await getBlogs()

      dispatch(showNotification(
        `a new blog ${newBlog.title} by ${newBlog.author} added`,
        true
      ))
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
    setUser(null)
    setBlogs([])
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

  const addLike = async (blog) => {
    await blogService.updateBlog({ ...blog, likes: blog.likes + 1 })

    setBlogs((prev) =>
      prev.map((b) => (b.id === blog.id ? { ...b, likes: b.likes + 1 } : b))
    )
  }

  const blogListRender = () => {
    const sortBlogs = [...blogs].sort(
      (blogA, blogB) => blogB.likes - blogA.likes
    )

    return (
      <>
        {sortBlogs.map((blog) => (
          <Blog
            key={blog.id}
            loggedUser={user.name}
            blog={blog}
            addLike={addLike}
            setBlogs={setBlogs}
          />
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
