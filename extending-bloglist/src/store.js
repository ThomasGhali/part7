import { configureStore } from '@reduxjs/toolkit'
import notificationsReducer from './reducers/notificationsReducer'

const store = configureStore({
  reducer: {
    notifications: notificationsReducer,
  },
})

export default store