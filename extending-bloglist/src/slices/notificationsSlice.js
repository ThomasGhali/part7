import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: null,
  reducers: {
    changeNotification(state, action) {
      return action.payload
    },
  },
})

export const { changeNotification } = notificationSlice.actions

export const showNotification = (message, isError = false) => {
  return (dispatch) => {
    dispatch(changeNotification({ message, isError }))
    setTimeout(() => dispatch(changeNotification(null)), 5000)
  }
}

export default notificationSlice.reducer
