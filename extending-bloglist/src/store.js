import { configureStore } from '@reduxjs/toolkit'
import notificationsReducer from './reducers/notificationsReducer'
import blogsReducer from './reducers/blogsReducer.js'

const store = configureStore({
  reducer: {
    notifications: notificationsReducer,
    blogs: blogsReducer,
  },
})

export default store
