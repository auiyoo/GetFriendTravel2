import { useState } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import api from '../services/api'
import useAuthStore from '../store/authStore'

const STYLES = [
  { id: 'beach', label: 'ทะเล', emoji: '🏖️' }, { id: 'nature', label: 'ธรรมชาติ', emoji: '🌿' },
  { id: 'culture', label: 'วัฒนธรรม', emoji: '⛩️' }, { id: 'food', label: 'อาหาร', emoji: '🍜' },
  { id: 'adventure', label: 'ผจญภัย', emoji: '🧗' }, { id: 'shopping', label: 'ช้อปปิ้ง', emoji: '🛍️' },
  { id: 'nightlife', label: 'ไนท์ไลฟ์', emoji: '🎉' }, { id: 'luxury', label: 'Luxury', emoji: '💎' },
  { id: 'budget', label: 'แบ็คแพ็ค', emoji: '🎒' }, { id: 'wellness', label: 'Wellness', emoji: '♨️' },
]

export default function Profile() {
  const { user, updateUser } = useAuthStore()
  const [form, setForm] = useState({ name: user?.name || '', age: user?.age || '', gender: user?.gender || '', bio: user?.bio || '', travelStyles: user?.travelStyles || [] })
  const [contacts, setContacts] = useState({ phone: user?.phone?.number || '', facebook: user?.facebook?.url || '', line: user?.line?.id || '' })
  const [verifying, setVerifying] = useState({})
  const [saving, setSaving] = useState(false)

  const toggle = (id) => setForm(f => ({ ...f, travelStyles: f.travelStyles.includes(id) ? f.travelStyles.filter(s => s !== id) : [...f.travelStyles, id] }))

  const save = async () => {
    setSaving(true)
    try {
      const r = await api.put('/users/profile', form)
      updateUser(r.data.user)
      toast.success('บันทึกสำเร็จ! ✅')
    } catch { toast.error('เกิดข้อผิดพลาด') }
    setSaving(false)
  }

  const verify = async (type) => {
    const value = contacts[type]
    if (!value) { toast.error('กรุณากรอกข้อมูลก่อน'); return }
    setVerifying(v => ({ ...v, [type]: true }))
    try {
      const r = await api.post('/auth/verify-contact', { type, value })
      updateUser(r.data.user)
      toast.success(`✅ ยืนยัน ${type} สำเร็จ!`)
    } catch { toast.error('เกิดข้อผิดพลาด') }
    setVerifying(v => ({ ...v, [type]: false }))
  }

  const verifyCount = [user?.phone?.verified, user?.facebook?.verified, user?.line?.verified].filter(Boolean).length

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-black text-white mb-1">👤 โปรไฟล์ของฉัน</h1>
        <p className="text-white/40 text-sm mb-8">จัดการข้อมูลและยืนยันตัวตน</p>
      </motion.div>

      {/* Verify Score */}
      <div className="card p-5 mb-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-black text-white">🔐 ความน่าเชื่อถือ</h2>
          <span className="text-sm font-bold px-3 py-1 rounded-full"
            style={verifyCount === 3
              ? { background: 'rgba(34,197,94,0.15)', color: '#86EFAC', border: '1px solid rgba(34,197,94,0.3)' }
              : verifyCount >= 1
              ? { background: 'rgba(234,179,8,0.15)', color: '#FDE047', border: '1px solid rgba(234,179,8,0.3)' }
              : { background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.1)' }}>
            {verifyCount === 3 ? '⭐ ยืนยันครบ' : verifyCount >= 1 ? '🔶 บางส่วน' : '⚠️ ยังไม่ยืนยัน'}
          </span>
        </div>
        <div className="flex gap-3">
          {[
            { key: 'phone', label: 'เบอร์โทร', emoji: '📱', verified: user?.phone?.verified },
            { key: 'facebook', label: 'Facebook', emoji: '📘', verified: user?.facebook?.verified },
            { key: 'line', label: 'Line ID', emoji: '💬', verified: user?.line?.verified },
          ].map(item => (
            <div key={item.key} className="flex-1 p-3 rounded-2xl text-center text-sm"
              style={item.verified
                ? { background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)' }
                : { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div className="text-2xl mb-1">{item.emoji}</div>
              <div className={`font-semibold text-xs ${item.verified ? 'text-green-400' : 'text-white/30'}`}>
                {item.verified ? '✅ ยืนยันแล้ว' : '❌ ยังไม่ยืนยัน'}
              </div>
              <div className="text-white/20 text-xs mt-0.5">{item.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-5">
        {/* Basic Info */}
        <div className="card p-6">
          <h2 className="font-black text-white mb-5">📝 ข้อมูลส่วนตัว</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-white/50 mb-2">ชื่อ-นามสกุล</label>
              <input className="input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-white/50 mb-2">อายุ</label>
                <input type="number" className="input" min={18} max={80} value={form.age} onChange={e => setForm({ ...form, age: e.target.value })} />
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
            <div>
              <label className="block text-sm font-semibold text-white/50 mb-2">เกี่ยวกับฉัน</label>
              <textarea className="input resize-none" rows={3} placeholder="ชอบเที่ยวแบบไหน..."
                value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} />
            </div>
          </div>
        </div>

        {/* Travel Styles */}
        <div className="card p-6">
          <h2 className="font-black text-white mb-4">🌟 สไตล์การเที่ยว</h2>
          <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
            {STYLES.map(s => (
              <button key={s.id} onClick={() => toggle(s.id)}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl border-2 text-xs transition-all ${
                  form.travelStyles.includes(s.id) ? 'border-violet-500 text-violet-300' : 'border-white/10 text-white/40 hover:border-white/20'
                }`}
                style={form.travelStyles.includes(s.id) ? { background: 'rgba(139,92,246,0.15)' } : { background: 'rgba(255,255,255,0.02)' }}>
                <span className="text-2xl">{s.emoji}</span>
                <span className="font-semibold">{s.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Contact & Verify */}
        <div className="card p-6">
          <h2 className="font-black text-white mb-1">📞 ข้อมูลติดต่อ & ยืนยันตัวตน</h2>
          <p className="text-white/30 text-xs mb-5">จะแสดงเฉพาะสมาชิกในกลุ่มทริปเท่านั้น</p>
          <div className="space-y-4">
            {[
              { key: 'phone', label: 'เบอร์โทรศัพท์', emoji: '📱', placeholder: '08x-xxx-xxxx', verified: user?.phone?.verified, type: 'tel' },
              { key: 'facebook', label: 'Facebook URL', emoji: '📘', placeholder: 'https://facebook.com/username', verified: user?.facebook?.verified, type: 'url' },
              { key: 'line', label: 'Line ID', emoji: '💬', placeholder: 'your_line_id', verified: user?.line?.verified, type: 'text' },
            ].map(item => (
              <div key={item.key}>
                <label className="block text-sm font-semibold text-white/50 mb-2">
                  {item.emoji} {item.label}
                  {item.verified && <span className="ml-2 text-green-400 text-xs font-bold">✅ ยืนยันแล้ว</span>}
                </label>
                <div className="flex gap-2">
                  <input type={item.type} className="input flex-1 text-sm py-2.5" placeholder={item.placeholder}
                    value={contacts[item.key]} onChange={e => setContacts({ ...contacts, [item.key]: e.target.value })} />
                  <button onClick={() => verify(item.key)}
                    disabled={verifying[item.key] || item.verified}
                    className="px-4 py-2.5 rounded-xl text-sm font-bold transition-all flex-shrink-0"
                    style={item.verified
                      ? { background: 'rgba(34,197,94,0.15)', color: '#86EFAC', border: '1px solid rgba(34,197,94,0.3)', cursor: 'default' }
                      : { background: 'linear-gradient(135deg,#7C3AED,#EC4899)', color: 'white' }}>
                    {item.verified ? '✅' : verifying[item.key] ? '⏳' : 'ยืนยัน'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button className="btn-primary w-full py-4 text-base font-black" disabled={saving} onClick={save}>
          {saving ? '⏳ กำลังบันทึก...' : '💾 บันทึกโปรไฟล์'}
        </button>
      </div>
    </div>
  )
}
