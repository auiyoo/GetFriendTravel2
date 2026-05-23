import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import useAuthStore from '../store/authStore'

const STYLES = [
  { id: 'beach', label: 'ทะเล', emoji: '🏖️' }, { id: 'nature', label: 'ธรรมชาติ', emoji: '🌿' },
  { id: 'culture', label: 'วัฒนธรรม', emoji: '⛩️' }, { id: 'food', label: 'อาหาร', emoji: '🍜' },
  { id: 'adventure', label: 'ผจญภัย', emoji: '🧗' }, { id: 'shopping', label: 'ช้อปปิ้ง', emoji: '🛍️' },
  { id: 'nightlife', label: 'ไนท์ไลฟ์', emoji: '🎉' }, { id: 'luxury', label: 'Luxury', emoji: '💎' },
  { id: 'budget', label: 'แบ็คแพ็ค', emoji: '🎒' }, { id: 'wellness', label: 'Wellness', emoji: '♨️' },
]

export default function Register() {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({ name: '', email: '', password: '', age: '', gender: '', bio: '', travelStyles: [] })
  const { register, isLoading } = useAuthStore()
  const navigate = useNavigate()

  const toggle = (id) => setForm(f => ({
    ...f, travelStyles: f.travelStyles.includes(id) ? f.travelStyles.filter(s => s !== id) : [...f.travelStyles, id]
  }))

  const submit = async () => {
    if (!form.name || !form.email || !form.password) { toast.error('กรุณากรอกข้อมูลให้ครบ'); return }
    const r = await register(form)
    if (r.success) { toast.success('สมัครสำเร็จ! 🎉'); navigate('/profile') }
    else toast.error(r.message)
  }

  const steps = ['บัญชี', 'สไตล์', 'แนะนำตัว']

  return (
    <div className="min-h-screen bg-dark-900 flex">
      <div className="flex-1 flex items-center justify-center px-6 py-12 relative">
        <div className="bg-orb w-72 h-72 top-10 -right-20 opacity-20" style={{ background: 'radial-gradient(circle, #EC4899, transparent)' }} />
        <div className="bg-orb w-60 h-60 bottom-10 -left-10 opacity-15" style={{ background: 'radial-gradient(circle, #7C3AED, transparent)' }} />

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-lg relative z-10">
          <Link to="/" className="flex items-center gap-2 mb-6">
            <span className="text-2xl">✈️</span>
            <span className="font-black text-xl gradient-text">GetFriendTravel</span>
          </Link>

          {/* Progress */}
          <div className="flex items-center gap-3 mb-8">
            {steps.map((s, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-black transition-all ${
                    i + 1 < step ? 'text-white' : i + 1 === step ? 'text-violet-300' : 'text-white/20'
                  }`} style={i + 1 <= step ? {
                    background: i + 1 < step ? 'linear-gradient(135deg,#7C3AED,#EC4899)' : 'rgba(139,92,246,0.2)',
                    border: i + 1 === step ? '2px solid rgba(139,92,246,0.6)' : 'none'
                  } : { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                    {i + 1 < step ? '✓' : i + 1}
                  </div>
                  <span className={`text-xs font-semibold ${i + 1 === step ? 'text-violet-300' : 'text-white/20'}`}>{s}</span>
                </div>
                {i < 2 && <div className={`flex-1 h-0.5 w-8 ${i + 1 < step ? 'bg-violet-500' : 'bg-white/10'}`} />}
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="s1" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
                <h1 className="text-2xl font-black text-white mb-1">สร้างบัญชี 📋</h1>
                <p className="text-white/40 text-sm mb-6">ขั้นตอน 1/3</p>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-white/50 mb-2">ชื่อ-นามสกุล *</label>
                    <input className="input" placeholder="ชื่อ นามสกุล" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-white/50 mb-2">อีเมล *</label>
                    <input type="email" className="input" placeholder="your@email.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-white/50 mb-2">รหัสผ่าน *</label>
                    <input type="password" className="input" placeholder="อย่างน้อย 6 ตัวอักษร" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-white/50 mb-2">อายุ</label>
                      <input type="number" className="input" placeholder="25" min={18} max={80} value={form.age} onChange={e => setForm({ ...form, age: e.target.value })} />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-white/50 mb-2">เพศ</label>
                      <select className="input" value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })}>
                        <option value="">เลือก</option>
                        <option value="male">ชาย</option>
                        <option value="female">หญิง</option>
                        <option value="other">อื่นๆ</option>
                      </select>
                    </div>
                  </div>
                </div>
                <button className="btn-primary w-full py-3.5 mt-6" onClick={() => {
                  if (!form.name || !form.email || !form.password) { toast.error('กรุณากรอกข้อมูลให้ครบ'); return }
                  setStep(2)
                }}>ถัดไป →</button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="s2" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
                <h1 className="text-2xl font-black text-white mb-1">สไตล์การเที่ยว 🌟</h1>
                <p className="text-white/40 text-sm mb-6">ขั้นตอน 2/3 · เลือกได้หลายอย่าง</p>
                <div className="grid grid-cols-2 gap-3">
                  {STYLES.map(s => (
                    <button key={s.id} onClick={() => toggle(s.id)}
                      className={`flex items-center gap-3 p-3.5 rounded-2xl border-2 text-left transition-all ${
                        form.travelStyles.includes(s.id)
                          ? 'border-violet-500 text-violet-300'
                          : 'border-white/10 text-white/50 hover:border-white/20 hover:text-white/70'
                      }`}
                      style={form.travelStyles.includes(s.id) ? { background: 'rgba(139,92,246,0.15)' } : { background: 'rgba(255,255,255,0.03)' }}>
                      <span className="text-2xl">{s.emoji}</span>
                      <span className="text-sm font-semibold">{s.label}</span>
                      {form.travelStyles.includes(s.id) && <span className="ml-auto text-violet-400">✓</span>}
                    </button>
                  ))}
                </div>
                <div className="flex gap-3 mt-6">
                  <button className="btn-outline flex-1 py-3" onClick={() => setStep(1)}>← ย้อนกลับ</button>
                  <button className="btn-primary flex-1 py-3" onClick={() => setStep(3)}>ถัดไป →</button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="s3" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
                <h1 className="text-2xl font-black text-white mb-1">แนะนำตัวเอง ✍️</h1>
                <p className="text-white/40 text-sm mb-6">ขั้นตอน 3/3</p>
                <div>
                  <label className="block text-sm font-semibold text-white/50 mb-2">เกี่ยวกับฉัน</label>
                  <textarea className="input resize-none" rows={5}
                    placeholder="ชอบเที่ยวแบบไหน ชอบอะไรเป็นพิเศษ ข้อกำหนดใดๆ..."
                    value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} />
                </div>
                <div className="mt-4 p-4 rounded-2xl" style={{ background: 'rgba(234,179,8,0.08)', border: '1px solid rgba(234,179,8,0.2)' }}>
                  <p className="text-sm text-yellow-400/80 font-medium">💡 เพิ่ม Tel/FB/Line ได้หลังสมัคร เพื่อยืนยันตัวตน</p>
                </div>
                <div className="flex gap-3 mt-6">
                  <button className="btn-outline flex-1 py-3" onClick={() => setStep(2)}>← ย้อนกลับ</button>
                  <button className="btn-primary flex-1 py-3" disabled={isLoading} onClick={submit}>
                    {isLoading ? '⏳ กำลังสมัคร...' : '🎉 สมัครสมาชิก'}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <p className="mt-6 text-center text-white/30 text-sm">
            มีบัญชีแล้ว?{' '}
            <Link to="/login" className="text-violet-400 font-bold hover:text-violet-300">เข้าสู่ระบบ</Link>
          </p>
        </motion.div>
      </div>

      <div className="hidden lg:flex flex-1 items-center justify-center relative overflow-hidden"
        style={{ background: 'rgba(236,72,153,0.05)', borderLeft: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="bg-orb w-80 h-80 opacity-30" style={{ background: 'radial-gradient(circle, #EC4899, transparent)' }} />
        <div className="text-center relative z-10 p-12">
          <motion.div animate={{ y: [-10, 10, -10] }} transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}>
            <div className="text-9xl mb-6">👥</div>
          </motion.div>
          <h2 className="text-3xl font-black text-white mb-3">พบเพื่อนใหม่</h2>
          <p className="text-white/40 text-lg">ทุกทริปคือจุดเริ่มต้นของมิตรภาพใหม่</p>
        </div>
      </div>
    </div>
  )
}
