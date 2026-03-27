import { configureStore } from '@reduxjs/toolkit'
import notificationsReducer from './slices/notificationsSlice.js'
import blogsReducer from './slices/blogsSlice.js'
import loggedUserReducer from './slices/loggedUserSlice.js'
import usersReducer from './slices/usersSlice.js'

const store = configureStore({
  reducer: {
    notifications: notificationsReducer,
    blogs: blogsReducer,
    loggedUser: loggedUserReducer,
    users: usersReducer,
  },
})

export default store
