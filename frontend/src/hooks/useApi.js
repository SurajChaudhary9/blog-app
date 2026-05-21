import { useState, useCallback } from 'react'
import api from '../services/api'

const useApi = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const request = useCallback(async (method, url, data = null) => {
    setLoading(true)
    setError(null)
    try {
      const config = { method, url }
      if (data) {
        config.data = data
      }
      const response = await api(config)
      return response.data
    } catch (err) {
      const message = err.response?.data?.message || err.message
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return { loading, error, request }
}

export default useApi
