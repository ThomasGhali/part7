import Notification from './components/Notification'
import Blogs from './components/Blogs'
import LoginForm from './components/LoginForm'
import Users from './components/Users'
import User from './components/User'

import { useDispatch, useSelector } from 'react-redux'

import { showNotification } from './slices/notificationsSlice'
import { setBlogs } from './slices/blogsSlice'
import { setLoggedUser } from './slices/loggedUserSlice'

import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'

const App = () => {
  // redux states
  const notification = useSelector(state => state.notifications)
  const loggedUser = useSelector(state => state.loggedUser)

  const dispatch = useDispatch()

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogsAppUser')
    dispatch(showNotification('logged out successfully', true))
    dispatch(setLoggedUser(null))
    dispatch(setBlogs([]))
  }

  const padding = {
    padding: 5,
  }

  return (
    <>
      {notification && <Notification />}
      {loggedUser === null ? (
        <>
          <h2>Log in:</h2>
          <LoginForm />
        </>
      ) : (
        <>
          <h2>blogs</h2>
          <p>
            {loggedUser.name} is logged in{' '}
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
              <Route path="/users/:id" element={<User />} />
            </Routes>
          </Router>
        </>
      )}
    </>
  )
}

export default App
