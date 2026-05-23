import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import useAuthStore from '../store/authStore'
import { motion, AnimatePresence } from 'framer-motion'

const navItems = [
  { path: '/dashboard', label: 'หน้าหลัก', emoji: '🏠' },
  { path: '/discover', label: 'ค้นหาทริป', emoji: '🔍' },
  { path: '/create-trip', label: 'สร้างทริป', emoji: '✈️' },
  { path: '/matches', label: 'คำขอ', emoji: '💌' },
  { path: '/tours', label: 'บ.ทัวร์', emoji: '🧳' },
]

export default function Navbar() {
  const { user, logout } = useAuthStore()
  const location = useLocation()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-2">
            <span className="text-2xl">✈️</span>
            <span className="font-extrabold text-xl bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              GetFriendTravel
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-medium text-sm transition-all ${
                  location.pathname === item.path
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <span>{item.emoji}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </div>

          {/* Profile */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/profile')}
              className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-50 transition-all"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-secondary-500 flex items-center justify-center text-white font-bold text-sm">
                {user?.name?.[0] || '?'}
              </div>
              <span className="hidden sm:block text-sm font-medium text-gray-700">{user?.name}</span>
            </button>
            <button
              onClick={handleLogout}
              className="hidden md:block text-gray-500 hover:text-red-500 text-sm transition-colors px-2 py-1 rounded-lg"
            >
              ออกจากระบบ
            </button>
            {/* Mobile menu button */}
            <button className="md:hidden p-2 rounded-xl hover:bg-gray-100" onClick={() => setMenuOpen(!menuOpen)}>
              <span className="text-xl">{menuOpen ? '✕' : '☰'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-gray-100 bg-white"
          >
            <div className="px-4 py-3 space-y-1">
              {navItems.map(item => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                    location.pathname === item.path
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-xl">{item.emoji}</span>
                  <span>{item.label}</span>
                </Link>
              ))}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 font-medium transition-all"
              >
                <span className="text-xl">🚪</span>
                <span>ออกจากระบบ</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
