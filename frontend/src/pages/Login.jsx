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
    if (result.success) { toast.success('ยินดีต้อนรับกลับมา! 🎉'); navigate('/dashboard') }
    else toast.error(result.message)
  }

  const loginDemo = async (email) => {
    const result = await login(email, 'password123')
    if (result.success) { toast.success('Demo login สำเร็จ!'); navigate('/dashboard') }
    else toast.error('กรุณา seed ข้อมูลก่อน')
  }

  return (
    <div className="min-h-screen bg-dark-900 flex">
      {/* Left */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 relative">
        <div className="bg-orb w-72 h-72 top-0 left-0 opacity-20" style={{ background: 'radial-gradient(circle, #7C3AED, transparent)' }} />
        <div className="bg-orb w-60 h-60 bottom-0 right-0 opacity-15" style={{ background: 'radial-gradient(circle, #EC4899, transparent)' }} />

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md relative z-10">

          <Link to="/" className="flex items-center gap-2 mb-8">
            <span className="text-2xl">✈️</span>
            <span className="font-black text-xl gradient-text">GetFriendTravel</span>
          </Link>

          <h1 className="text-3xl font-black text-white mb-1">ยินดีต้อนรับกลับ 👋</h1>
          <p className="text-white/40 mb-8">เข้าสู่ระบบเพื่อหาเพื่อนร่วมทริป</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-white/60 mb-2">อีเมล</label>
              <input type="email" placeholder="your@email.com" className="input"
                value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div>
              <label className="block text-sm font-semibold text-white/60 mb-2">รหัสผ่าน</label>
              <input type="password" placeholder="••••••••" className="input"
                value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
            </div>
            <button type="submit" disabled={isLoading}
              className="btn-primary w-full py-3.5 text-base flex items-center justify-center gap-2">
              {isLoading ? <><span className="animate-spin">⏳</span> กำลังเข้าสู่ระบบ...</> : '🔑 เข้าสู่ระบบ'}
            </button>
          </form>

          {/* Demo */}
          <div className="mt-6 p-4 rounded-2xl" style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.2)' }}>
            <p className="text-sm font-bold text-violet-400 mb-3">🧪 ลอง Demo Account</p>
            <div className="space-y-2">
              {[
                { label: '👨 สมชาย — ชอบวัฒนธรรม', email: 'somchai@demo.com' },
                { label: '👩 มาลี — ชอบทะเล Luxury', email: 'malee@demo.com' },
                { label: '🎒 กีรติ — Backpacker', email: 'keerati@demo.com' },
              ].map(d => (
                <button key={d.email} onClick={() => loginDemo(d.email)}
                  className="w-full text-left text-sm text-violet-300 hover:text-white px-3 py-2 rounded-xl hover:bg-white/5 transition-all">
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          <p className="mt-6 text-center text-white/30 text-sm">
            ยังไม่มีบัญชี?{' '}
            <Link to="/register" className="text-violet-400 font-bold hover:text-violet-300">สมัครฟรี</Link>
          </p>
        </motion.div>
      </div>

      {/* Right Visual */}
      <div className="hidden lg:flex flex-1 items-center justify-center relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.2), rgba(236,72,153,0.2))', borderLeft: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="bg-orb w-96 h-96 opacity-40" style={{ background: 'radial-gradient(circle, #7C3AED, transparent)' }} />
        <div className="text-center relative z-10 p-12">
          <motion.div animate={{ y: [-10, 10, -10] }} transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}>
            <div className="text-9xl mb-6">🌏</div>
          </motion.div>
          <h2 className="text-3xl font-black text-white mb-3">โลกรอคุณอยู่</h2>
          <p className="text-white/40 text-lg">มีเพื่อนร่วมทางทำให้<br />ทุกการเดินทางสนุกขึ้น 100 เท่า</p>
        </div>
      </div>
    </div>
  )
}
