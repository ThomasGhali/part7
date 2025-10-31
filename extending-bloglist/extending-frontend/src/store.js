import { configureStore } from '@reduxjs/toolkit'
import notificationsReducer from './slices/notificationsSlice.js'
import blogsReducer from './slices/blogsSlice.js'
import userReducer from './slices/userSlice.js'

const store = configureStore({
  reducer: {
    notifications: notificationsReducer,
    blogs: blogsReducer,
    user: userReducer,
  },
})

export default store
