import React from 'react'
import { useSelector } from 'react-redux'

const DashboardPage = () => {
  const { user } = useSelector((state) => state.auth)

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">Dashboard</h1>
      <div className="bg-white p-8 rounded-lg shadow">
        <h2 className="text-2xl font-semibold mb-4">Welcome, {user?.firstName}!</h2>
        <div className="space-y-4">
          <p><strong>Email:</strong> {user?.email}</p>
          <p><strong>Name:</strong> {user?.firstName} {user?.lastName}</p>
          <p className="text-gray-600 mt-6">
            You are successfully logged in. Phase 2 (Blog CRUD operations) coming soon!
          </p>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
