import React from 'react'
import ForgotPasswordForm from '../components/Auth/ForgotPasswordForm'

const ForgotPasswordPage = () => {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-center mb-2 text-gray-900">Forgot Password</h1>
        <p className="text-center text-gray-600 mb-8">
          Enter your email address and we'll send you a link to reset your password.
        </p>
        <div className="bg-white p-8 rounded-lg shadow">
          <ForgotPasswordForm />
        </div>
      </div>
    </div>
  )
}

export default ForgotPasswordPage
