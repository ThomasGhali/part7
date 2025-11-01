import { useState, useEffect } from 'react'

import blogService from './services/blogs'
import loginService from './services/login'

import Notification from './components/Notification'
import Users from './components/Users'
import Blogs from './components/Blogs'

import { useDispatch, useSelector } from 'react-redux'
import { showNotification } from './slices/notificationsSlice'
import { fetchBlogs, setBlogs } from './slices/blogsSlice'
import { setUser } from './slices/userSlice'

import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'

const App = () => {
  // react states
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  // redux states
  const notification = useSelector(state => state.notifications)
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

  const padding = {
    padding: 5,
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
          <Router>
            <div>
              <Link style={padding} to="/">
                home
              </Link>
              <Link style={padding} to="/users">
                users
              </Link>
            </div>
            <Routes>
              <Route path="/" element={<Blogs />} />
              <Route path="/users" element={<Users />} />
            </Routes>
          </Router>
        </>
      )}
    </>
  )
}

export default App
