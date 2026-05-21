import React from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'react-toastify'
import useAuth from '../../hooks/useAuth'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

const LoginForm = () => {
  const navigate = useNavigate()
  const { login, loading, error } = useAuth()
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data) => {
    try {
      await login(data)
      toast.success('Login successful!')
      navigate('/dashboard')
    } catch (err) {
      toast.error(error || 'Login failed')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md mx-auto">
      <div>
        <label className="form-label">Email</label>
        <input
          type="email"
          className="form-input"
          placeholder="john@example.com"
          {...register('email')}
        />
        {errors.email && <span className="error-message">{errors.email.message}</span>}
      </div>

      <div>
        <label className="form-label">Password</label>
        <input
          type="password"
          className="form-input"
          placeholder="••••••••"
          {...register('password')}
        />
        {errors.password && <span className="error-message">{errors.password.message}</span>}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="btn btn-primary w-full"
      >
        {loading ? 'Logging in...' : 'Login'}
      </button>

      <div className="flex justify-between text-sm">
        <Link to="/forgot-password" className="text-blue-600 hover:underline">
          Forgot Password?
        </Link>
        <Link to="/signup" className="text-blue-600 hover:underline">
          Sign Up
        </Link>
      </div>
    </form>
  )
}

export default LoginForm
