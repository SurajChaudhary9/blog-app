import { createSlice } from '@reduxjs/toolkit'
import tokenManager from '../../services/tokenManager'

const initialState = {
  user: null,
  token: tokenManager.getToken(),
  refreshToken: tokenManager.getRefreshToken(),
  isAuthenticated: !!tokenManager.getToken(),
  loading: false,
  error: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Signup
    signupStart: (state) => {
      state.loading = true
      state.error = null
    },
    signupSuccess: (state, action) => {
      state.loading = false
      state.user = action.payload.user
      state.error = null
    },
    signupFailure: (state, action) => {
      state.loading = false
      state.error = action.payload
    },

    // Login
    loginStart: (state) => {
      state.loading = true
      state.error = null
    },
    loginSuccess: (state, action) => {
      state.loading = false
      state.token = action.payload.token
      state.refreshToken = action.payload.refreshToken
      state.user = action.payload.user
      state.isAuthenticated = true
      state.error = null
    },
    loginFailure: (state, action) => {
      state.loading = false
      state.error = action.payload
      state.isAuthenticated = false
    },

    // Logout
    logout: (state) => {
      state.user = null
      state.token = null
      state.refreshToken = null
      state.isAuthenticated = false
      state.error = null
    },

    // Reset password
    resetPasswordStart: (state) => {
      state.loading = true
      state.error = null
    },
    resetPasswordSuccess: (state) => {
      state.loading = false
      state.error = null
    },
    resetPasswordFailure: (state, action) => {
      state.loading = false
      state.error = action.payload
    },

    // Forgot password
    forgotPasswordStart: (state) => {
      state.loading = true
      state.error = null
    },
    forgotPasswordSuccess: (state) => {
      state.loading = false
      state.error = null
    },
    forgotPasswordFailure: (state, action) => {
      state.loading = false
      state.error = action.payload
    },

    // Clear error
    clearError: (state) => {
      state.error = null
    },
  },
})

export const {
  signupStart,
  signupSuccess,
  signupFailure,
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  resetPasswordStart,
  resetPasswordSuccess,
  resetPasswordFailure,
  forgotPasswordStart,
  forgotPasswordSuccess,
  forgotPasswordFailure,
  clearError,
} = authSlice.actions

export default authSlice.reducer
