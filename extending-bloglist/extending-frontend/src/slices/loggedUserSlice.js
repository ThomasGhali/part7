import { createSlice } from '@reduxjs/toolkit'

const loggedUserSlice = createSlice({
  name: 'user',
  initialState: null,
  reducers: {
    setLoggedUser(state, action) {
      return action.payload
    },
  },
})

export const { setLoggedUser } = loggedUserSlice.actions

export default loggedUserSlice.reducer
