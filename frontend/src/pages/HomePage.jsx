import React from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'

const HomePage = () => {
  const { isAuthenticated } = useSelector((state) => state.auth)

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center space-y-8">
        <h1 className="text-5xl font-bold text-gray-900">Welcome to Blog App</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Share your thoughts and stories with the world. Phase 1: Secure authentication system with email verification and password reset.
        </p>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800">Phase 1 Features:</h2>
          <ul className="text-left max-w-md mx-auto space-y-2 text-gray-700">
            <li>✅ Email/Password Signup & Login with JWT</li>
            <li>✅ Secure Password Reset with Tokens</li>
            <li>✅ Token-based Authentication</li>
            <li>✅ Logout with Token Invalidation</li>
            <li>✅ Email Service Integration</li>
          </ul>
        </div>

        <div className="flex gap-4 justify-center mt-8">
          {!isAuthenticated ? (
            <>
              <Link to="/signup" className="btn btn-primary px-8 py-3 text-lg">
                Get Started
              </Link>
              <Link to="/login" className="btn btn-secondary px-8 py-3 text-lg">
                Login
              </Link>
            </>
          ) : (
            <Link to="/dashboard" className="btn btn-primary px-8 py-3 text-lg">
              Go to Dashboard
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

export default HomePage
