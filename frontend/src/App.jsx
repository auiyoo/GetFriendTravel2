import { Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import useAuthStore from './store/authStore'

import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'
import CreateTrip from './pages/CreateTrip'
import Discover from './pages/Discover'
import TripDetail from './pages/TripDetail'
import MyMatches from './pages/MyMatches'
import TripPlan from './pages/TripPlan'
import TourCompanies from './pages/TourCompanies'
import Navbar from './components/Navbar'

const ProtectedRoute = ({ children }) => {
  const { token } = useAuthStore()
  if (!token) return <Navigate to="/login" replace />
  return children
}

export default function App() {
  const { initAuth } = useAuthStore()

  useEffect(() => { initAuth() }, [])

  return (
    <div className="min-h-screen bg-dark-900">
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<ProtectedRoute><Navbar /><Dashboard /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Navbar /><Profile /></ProtectedRoute>} />
        <Route path="/create-trip" element={<ProtectedRoute><Navbar /><CreateTrip /></ProtectedRoute>} />
        <Route path="/discover" element={<ProtectedRoute><Navbar /><Discover /></ProtectedRoute>} />
        <Route path="/trips/:id" element={<ProtectedRoute><Navbar /><TripDetail /></ProtectedRoute>} />
        <Route path="/matches" element={<ProtectedRoute><Navbar /><MyMatches /></ProtectedRoute>} />
        <Route path="/plan/:tripId" element={<ProtectedRoute><Navbar /><TripPlan /></ProtectedRoute>} />
        <Route path="/tours" element={<ProtectedRoute><Navbar /><TourCompanies /></ProtectedRoute>} />
      </Routes>
    </div>
  )
}
