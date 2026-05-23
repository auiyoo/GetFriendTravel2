import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import useAuthStore from '../store/authStore'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const { login, isLoading } = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    const result = await login(form.email, form.password)
    if (result.success) {
      toast.success('เข้าสู่ระบบสำเร็จ! 🎉')
      navigate('/dashboard')
    } else {
      toast.error(result.message)
    }
  }

  const loginDemo = async (email) => {
    const result = await login(email, 'password123')
    if (result.success) { toast.success('เข้าสู่ระบบ Demo สำเร็จ!'); navigate('/dashboard') }
    else toast.error('Demo login ล้มเหลว - กรุณา seed ข้อมูลก่อน')
  }

  return (
    <div className="min-h-screen flex">
      {/* Left - Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <Link to="/" className="flex items-center gap-2 mb-8">
            <span className="text-2xl">✈️</span>
            <span className="font-extrabold text-xl bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">GetFriendTravel</span>
          </Link>

          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">ยินดีต้อนรับกลับมา! 👋</h1>
          <p className="text-gray-500 mb-8">เข้าสู่ระบบเพื่อหาเพื่อนร่วมทริป</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">อีเมล</label>
              <input type="email" placeholder="your@email.com" className="input"
                value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">รหัสผ่าน</label>
              <input type="password" placeholder="••••••••" className="input"
                value={form.password} onChange={e => setForm({...form, password: e.target.value})} required />
            </div>
            <button type="submit" disabled={isLoading} className="btn-primary w-full flex items-center justify-center gap-2">
              {isLoading ? <span className="animate-spin">⏳</span> : '🔑'}
              {isLoading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
            </button>
          </form>

          {/* Demo Accounts */}
          <div className="mt-6 p-4 bg-blue-50 rounded-xl">
            <p className="text-sm font-semibold text-blue-700 mb-3">🧪 ทดลองใช้งาน Demo:</p>
            <div className="space-y-2">
              {[
                { label: '👨 สมชาย (ชอบวัฒนธรรม)', email: 'somchai@demo.com' },
                { label: '👩 มาลี (ชอบทะเล Luxury)', email: 'malee@demo.com' },
                { label: '🎒 กีรติ (Backpacker)', email: 'keerati@demo.com' }
              ].map(d => (
                <button key={d.email} onClick={() => loginDemo(d.email)}
                  className="w-full text-left text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-100 px-3 py-2 rounded-lg transition-all">
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          <p className="mt-6 text-center text-gray-500 text-sm">
            ยังไม่มีบัญชี?{' '}
            <Link to="/register" className="text-primary-600 font-semibold hover:underline">สมัครสมาชิกฟรี</Link>
          </p>
        </motion.div>
      </div>

      {/* Right - Visual */}
      <div className="hidden lg:flex flex-1 gradient-bg items-center justify-center">
        <div className="text-center text-white p-12">
          <div className="text-8xl mb-6">🌏</div>
          <h2 className="text-3xl font-extrabold mb-4">โลกรอคุณอยู่</h2>
          <p className="text-white/80 text-lg">มีเพื่อนร่วมทางทำให้ทุกการเดินทางสนุกขึ้น 100 เท่า</p>
        </div>
      </div>
    </div>
  )
}
