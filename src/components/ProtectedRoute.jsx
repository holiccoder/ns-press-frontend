import React from 'react'
import { Navigate } from 'react-router-dom'
import { getToken } from '../services/api'

/**
 * ProtectedRoute component
 * Protects routes by checking if user is authenticated (has a valid token)
 * If user is not authenticated, redirects to login page
 */
const ProtectedRoute = ({ element }) => {
  const token = getToken()
  
  if (!token) {
    return <Navigate to="/login" replace />
  }
  
  return element
}

export default ProtectedRoute
