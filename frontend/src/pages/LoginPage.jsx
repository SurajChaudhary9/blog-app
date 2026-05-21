import React from 'react'
import LoginForm from '../components/Auth/LoginForm'

const LoginPage = () => {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-900">Login</h1>
        <div className="bg-white p-8 rounded-lg shadow">
          <LoginForm />
        </div>
      </div>
    </div>
  )
}

export default LoginPage
