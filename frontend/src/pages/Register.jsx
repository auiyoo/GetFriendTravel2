import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import useAuthStore from '../store/authStore'

const TRAVEL_STYLES = [
  { id: 'beach', label: 'ทะเล / เกาะ', emoji: '🏖️' },
  { id: 'nature', label: 'ธรรมชาติ / เดินป่า', emoji: '🌿' },
  { id: 'culture', label: 'วัฒนธรรม / วัด', emoji: '⛩️' },
  { id: 'food', label: 'กินอาหาร / Street Food', emoji: '🍜' },
  { id: 'adventure', label: 'ผจญภัย / Extreme', emoji: '🧗' },
  { id: 'shopping', label: 'ช้อปปิ้ง', emoji: '🛍️' },
  { id: 'nightlife', label: 'ไนท์ไลฟ์ / บาร์', emoji: '🎉' },
  { id: 'luxury', label: 'Luxury / 5 ดาว', emoji: '💎' },
  { id: 'budget', label: 'Budget / แบ็คแพ็ค', emoji: '🎒' },
  { id: 'wellness', label: 'Spa / พักผ่อน', emoji: '♨️' }
]

export default function Register() {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    name: '', email: '', password: '', age: '', gender: '',
    bio: '', travelStyles: []
  })
  const { register, isLoading } = useAuthStore()
  const navigate = useNavigate()

  const toggleStyle = (id) => {
    setForm(f => ({
      ...f,
      travelStyles: f.travelStyles.includes(id)
        ? f.travelStyles.filter(s => s !== id)
        : [...f.travelStyles, id]
    }))
  }

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.password) {
      toast.error('กรุณากรอกข้อมูลให้ครบถ้วน'); return
    }
    const result = await register(form)
    if (result.success) {
      toast.success('สมัครสมาชิกสำเร็จ! 🎉')
      navigate('/profile')
    } else {
      toast.error(result.message)
    }
  }

  return (
    <div className="min-h-screen flex">
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-lg">
          <Link to="/" className="flex items-center gap-2 mb-6">
            <span className="text-2xl">✈️</span>
            <span className="font-extrabold text-xl bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">GetFriendTravel</span>
          </Link>

          {/* Progress */}
          <div className="flex gap-2 mb-8">
            {[1, 2, 3].map(s => (
              <div key={s} className={`flex-1 h-2 rounded-full transition-all ${s <= step ? 'gradient-bg' : 'bg-gray-200'}`} />
            ))}
          </div>

          {step === 1 && (
            <div>
              <h1 className="text-2xl font-extrabold text-gray-900 mb-2">ข้อมูลบัญชี 📋</h1>
              <p className="text-gray-500 mb-6">ขั้นตอน 1/3</p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">ชื่อ-นามสกุล *</label>
                  <input className="input" placeholder="ชื่อ นามสกุล" value={form.name}
                    onChange={e => setForm({...form, name: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">อีเมล *</label>
                  <input type="email" className="input" placeholder="your@email.com" value={form.email}
                    onChange={e => setForm({...form, email: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">รหัสผ่าน *</label>
                  <input type="password" className="input" placeholder="อย่างน้อย 6 ตัวอักษร" value={form.password}
                    onChange={e => setForm({...form, password: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">อายุ</label>
                    <input type="number" className="input" placeholder="25" min={18} max={80} value={form.age}
                      onChange={e => setForm({...form, age: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">เพศ</label>
                    <select className="input" value={form.gender} onChange={e => setForm({...form, gender: e.target.value})}>
                      <option value="">เลือก</option>
                      <option value="male">ชาย</option>
                      <option value="female">หญิง</option>
                      <option value="other">อื่นๆ</option>
                    </select>
                  </div>
                </div>
              </div>
              <button className="btn-primary w-full mt-6" onClick={() => {
                if (!form.name || !form.email || !form.password) { toast.error('กรุณากรอกข้อมูลให้ครบ'); return }
                setStep(2)
              }}>ถัดไป →</button>
            </div>
          )}

          {step === 2 && (
            <div>
              <h1 className="text-2xl font-extrabold text-gray-900 mb-2">สไตล์การเที่ยว 🌟</h1>
              <p className="text-gray-500 mb-6">ขั้นตอน 2/3 - เลือกได้หลายอย่าง</p>
              <div className="grid grid-cols-2 gap-3">
                {TRAVEL_STYLES.map(style => (
                  <button key={style.id} onClick={() => toggleStyle(style.id)}
                    className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left ${
                      form.travelStyles.includes(style.id)
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                    }`}>
                    <span className="text-2xl">{style.emoji}</span>
                    <span className="text-sm font-medium">{style.label}</span>
                  </button>
                ))}
              </div>
              <div className="flex gap-3 mt-6">
                <button className="btn-outline flex-1" onClick={() => setStep(1)}>← ย้อนกลับ</button>
                <button className="btn-primary flex-1" onClick={() => setStep(3)}>ถัดไป →</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h1 className="text-2xl font-extrabold text-gray-900 mb-2">แนะนำตัวเอง ✍️</h1>
              <p className="text-gray-500 mb-6">ขั้นตอน 3/3 - บอกให้เพื่อนนักเดินทางรู้จักคุณ</p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">เกี่ยวกับฉัน</label>
                  <textarea className="input resize-none" rows={4}
                    placeholder="ชอบเที่ยวแบบไหน ชอบอะไรเป็นพิเศษ อยากเที่ยวที่ไหน..."
                    value={form.bio} onChange={e => setForm({...form, bio: e.target.value})} />
                </div>
              </div>
              <div className="p-4 bg-yellow-50 rounded-xl mt-4">
                <p className="text-sm text-yellow-700 font-medium">💡 สามารถเพิ่มเบอร์โทร Facebook และ Line ได้ในหน้าโปรไฟล์ เพื่อให้ยืนยันตัวตนได้</p>
              </div>
              <div className="flex gap-3 mt-6">
                <button className="btn-outline flex-1" onClick={() => setStep(2)}>← ย้อนกลับ</button>
                <button className="btn-primary flex-1" disabled={isLoading} onClick={handleSubmit}>
                  {isLoading ? '⏳ กำลังสมัคร...' : '🎉 สมัครสมาชิก'}
                </button>
              </div>
            </div>
          )}

          <p className="mt-6 text-center text-gray-500 text-sm">
            มีบัญชีแล้ว?{' '}
            <Link to="/login" className="text-primary-600 font-semibold hover:underline">เข้าสู่ระบบ</Link>
          </p>
        </motion.div>
      </div>

      <div className="hidden lg:flex flex-1 gradient-bg items-center justify-center">
        <div className="text-center text-white p-12">
          <div className="text-8xl mb-6">👥</div>
          <h2 className="text-3xl font-extrabold mb-4">พบเพื่อนใหม่</h2>
          <p className="text-white/80 text-lg">ทุกทริปคือการเริ่มต้นมิตรภาพใหม่ที่อาจยืนยาวตลอดชีวิต</p>
        </div>
      </div>
    </div>
  )
}
