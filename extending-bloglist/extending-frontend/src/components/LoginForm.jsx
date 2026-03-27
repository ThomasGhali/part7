import { useState, useEffect } from 'react'

import { useDispatch } from 'react-redux'

import { setLoggedUser } from '../slices/loggedUserSlice'
import { showNotification } from '../slices/notificationsSlice'
import { fetchBlogs } from '../slices/blogsSlice'

import blogService from '../services/blogs'
import loginService from '../services/login'

const LoginForm = () => {
  const dispatch = useDispatch()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  // check saved loggins onMount
  useEffect(() => {
    const loggedInUser = window.localStorage.getItem('loggedBlogsAppUser')
    if (loggedInUser) {
      const userData = JSON.parse(loggedInUser)
      dispatch(setLoggedUser(userData))
      blogService.setToken(userData.token)
    }
  }, [dispatch])

  const handleLogin = async event => {
    event.preventDefault()

    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogsAppUser', JSON.stringify(user))
      dispatch(setLoggedUser(user))
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

  return (
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
}

export default LoginForm
