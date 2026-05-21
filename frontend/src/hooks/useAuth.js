import { useSelector, useDispatch } from 'react-redux'
import { useCallback } from 'react'
import authService from '../services/authService'
import tokenManager from '../services/tokenManager'
import {
  signupStart,
  signupSuccess,
  signupFailure,
  loginStart,
  loginSuccess,
  loginFailure,
  logout as logoutAction,
  resetPasswordStart,
  resetPasswordSuccess,
  resetPasswordFailure,
  forgotPasswordStart,
  forgotPasswordSuccess,
  forgotPasswordFailure,
  clearError,
} from '../store/authSlice'

const useAuth = () => {
  const dispatch = useDispatch()
  const { user, token, isAuthenticated, loading, error } = useSelector(
    (state) => state.auth
  )

  const signup = useCallback(
    async (data) => {
      dispatch(signupStart())
      try {
        const response = await authService.signup(data)
        dispatch(signupSuccess(response))
        return response
      } catch (err) {
        const message = err.response?.data?.message || err.message
        dispatch(signupFailure(message))
        throw err
      }
    },
    [dispatch]
  )

  const login = useCallback(
    async (credentials) => {
      dispatch(loginStart())
      try {
        const response = await authService.login(credentials)
        dispatch(loginSuccess(response))
        return response
      } catch (err) {
        const message = err.response?.data?.message || err.message
        dispatch(loginFailure(message))
        throw err
      }
    },
    [dispatch]
  )

  const logout = useCallback(async () => {
    try {
      await authService.logout()
    } finally {
      dispatch(logoutAction())
      tokenManager.clearTokens()
    }
  }, [dispatch])

  const resetPassword = useCallback(
    async (token, newPassword) => {
      dispatch(resetPasswordStart())
      try {
        const response = await authService.resetPassword(token, newPassword)
        dispatch(resetPasswordSuccess())
        return response
      } catch (err) {
        const message = err.response?.data?.message || err.message
        dispatch(resetPasswordFailure(message))
        throw err
      }
    },
    [dispatch]
  )

  const forgotPassword = useCallback(
    async (email) => {
      dispatch(forgotPasswordStart())
      try {
        const response = await authService.forgotPassword(email)
        dispatch(forgotPasswordSuccess())
        return response
      } catch (err) {
        const message = err.response?.data?.message || err.message
        dispatch(forgotPasswordFailure(message))
        throw err
      }
    },
    [dispatch]
  )

  const handleClearError = useCallback(() => {
    dispatch(clearError())
  }, [dispatch])

  return {
    user,
    token,
    isAuthenticated,
    loading,
    error,
    signup,
    login,
    logout,
    resetPassword,
    forgotPassword,
    clearError: handleClearError,
  }
}

export default useAuth
