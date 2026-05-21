import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'react-toastify'
import useAuth from '../../hooks/useAuth'

const signupSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
})

const SignupForm = () => {
  const navigate = useNavigate()
  const { signup, loading, error } = useAuth()
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(signupSchema),
  })

  const onSubmit = async (data) => {
    try {
      await signup(data)
      toast.success('Signup successful! Check your email for verification.')
      navigate('/login')
    } catch (err) {
      toast.error(error || 'Signup failed')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md mx-auto">
      <div>
        <label className="form-label">First Name</label>
        <input
          type="text"
          className="form-input"
          placeholder="John"
          {...register('firstName')}
        />
        {errors.firstName && <span className="error-message">{errors.firstName.message}</span>}
      </div>

      <div>
        <label className="form-label">Last Name</label>
        <input
          type="text"
          className="form-input"
          placeholder="Doe"
          {...register('lastName')}
        />
        {errors.lastName && <span className="error-message">{errors.lastName.message}</span>}
      </div>

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
        {loading ? 'Signing up...' : 'Sign Up'}
      </button>

      <p className="text-center text-sm">
        Already have an account? <Link to="/login" className="text-blue-600 hover:underline">Login</Link>
      </p>
    </form>
  )
}

export default SignupForm
