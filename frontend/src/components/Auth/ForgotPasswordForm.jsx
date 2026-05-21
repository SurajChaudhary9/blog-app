import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'react-toastify'
import useAuth from '../../hooks/useAuth'

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
})

const ForgotPasswordForm = () => {
  const { forgotPassword, loading, error } = useAuth()
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
  })

  const onSubmit = async (data) => {
    try {
      await forgotPassword(data.email)
      toast.success('Check your email for password reset link')
      reset()
    } catch (err) {
      toast.error(error || 'Failed to send reset email')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md mx-auto">
      <div>
        <label className="form-label">Email Address</label>
        <input
          type="email"
          className="form-input"
          placeholder="your-email@example.com"
          {...register('email')}
        />
        {errors.email && <span className="error-message">{errors.email.message}</span>}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="btn btn-primary w-full"
      >
        {loading ? 'Sending...' : 'Send Reset Link'}
      </button>
    </form>
  )
}

export default ForgotPasswordForm
