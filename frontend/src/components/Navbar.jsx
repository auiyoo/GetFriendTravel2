import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import useAuthStore from '../store/authStore'

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

  const handleLogout = () => { logout(); navigate('/') }

  return (
    <nav className="sticky top-0 z-50"
      style={{ background: 'rgba(7,7,15,0.85)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-2 group">
            <span className="text-2xl">✈️</span>
            <span className="font-black text-lg gradient-text">GetFriendTravel</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map(item => {
              const active = location.pathname === item.path
              return (
                <Link key={item.path} to={item.path}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    active
                      ? 'text-white'
                      : 'text-white/50 hover:text-white hover:bg-white/5'
                  }`}
                  style={active ? {
                    background: 'rgba(139,92,246,0.15)',
                    border: '1px solid rgba(139,92,246,0.3)',
                    color: '#C4B5FD'
                  } : {}}>
                  <span>{item.emoji}</span>
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </div>

          {/* Profile + Logout */}
          <div className="flex items-center gap-2">
            <button onClick={() => navigate('/profile')}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all hover:bg-white/5">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-black"
                style={{ background: 'linear-gradient(135deg, #7C3AED, #EC4899)' }}>
                {user?.name?.[0] || '?'}
              </div>
              <span className="hidden sm:block text-sm font-semibold text-white/70">{user?.name?.split(' ')[0]}</span>
            </button>
            <button onClick={handleLogout}
              className="hidden md:block text-sm text-white/30 hover:text-red-400 px-3 py-2 rounded-xl hover:bg-red-500/10 transition-all font-medium">
              ออก
            </button>
            <button className="md:hidden p-2 rounded-xl hover:bg-white/5" onClick={() => setMenuOpen(!menuOpen)}>
              <span className="text-white/60 text-lg">{menuOpen ? '✕' : '☰'}</span>
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
            style={{ borderTop: '1px solid rgba(255,255,255,0.06)', background: 'rgba(7,7,15,0.95)' }}>
            <div className="px-4 py-3 space-y-1">
              {navItems.map(item => {
                const active = location.pathname === item.path
                return (
                  <Link key={item.path} to={item.path} onClick={() => setMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all ${
                      active ? 'text-violet-300' : 'text-white/50 hover:text-white hover:bg-white/5'
                    }`}
                    style={active ? { background: 'rgba(139,92,246,0.12)' } : {}}>
                    <span className="text-xl">{item.emoji}</span>
                    <span>{item.label}</span>
                  </Link>
                )
              })}
              <button onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400/70 hover:text-red-400 hover:bg-red-500/10 font-semibold text-sm transition-all">
                <span className="text-xl">🚪</span><span>ออกจากระบบ</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
