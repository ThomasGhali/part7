import { createSlice } from '@reduxjs/toolkit'
import usersService from '../services/users'
import { showNotification } from './notificationsSlice'

const usersSlice = createSlice({
  name: 'users',
  initialState: [],
  reducers: {
    setUsers(state, action) {
      return action.payload
    },
  },
})

const { setUsers } = usersSlice.actions

export const saveUsers = () => {
  return async dispatch => {
    try {
      const fetchedUsers = await usersService.getUsers()
      dispatch(setUsers(fetchedUsers))
    } catch (error) {
      dispatch(showNotification(error))
    }
  }
}

export default usersSlice.reducer
