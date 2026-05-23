import { useState } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import api from '../services/api'
import useAuthStore from '../store/authStore'

const TRAVEL_STYLES = [
  { id: 'beach', label: 'ทะเล', emoji: '🏖️' }, { id: 'nature', label: 'ธรรมชาติ', emoji: '🌿' },
  { id: 'culture', label: 'วัฒนธรรม', emoji: '⛩️' }, { id: 'food', label: 'อาหาร', emoji: '🍜' },
  { id: 'adventure', label: 'ผจญภัย', emoji: '🧗' }, { id: 'shopping', label: 'ช้อปปิ้ง', emoji: '🛍️' },
  { id: 'nightlife', label: 'ไนท์ไลฟ์', emoji: '🎉' }, { id: 'luxury', label: 'Luxury', emoji: '💎' },
  { id: 'budget', label: 'แบ็คแพ็ค', emoji: '🎒' }, { id: 'wellness', label: 'Wellness', emoji: '♨️' }
]

export default function Profile() {
  const { user, updateUser } = useAuthStore()
  const [form, setForm] = useState({
    name: user?.name || '', age: user?.age || '', gender: user?.gender || '',
    bio: user?.bio || '', travelStyles: user?.travelStyles || []
  })
  const [contacts, setContacts] = useState({
    phone: user?.phone?.number || '',
    facebook: user?.facebook?.url || '',
    line: user?.line?.id || ''
  })
  const [verifying, setVerifying] = useState({ phone: false, facebook: false, line: false })
  const [saving, setSaving] = useState(false)

  const toggleStyle = (id) => {
    setForm(f => ({
      ...f,
      travelStyles: f.travelStyles.includes(id)
        ? f.travelStyles.filter(s => s !== id)
        : [...f.travelStyles, id]
    }))
  }

  const saveProfile = async () => {
    setSaving(true)
    try {
      const r = await api.put('/users/profile', form)
      updateUser(r.data.user)
      toast.success('บันทึกโปรไฟล์สำเร็จ! ✅')
    } catch { toast.error('เกิดข้อผิดพลาด') }
    setSaving(false)
  }

  const verifyContact = async (type) => {
    const value = contacts[type]
    if (!value) { toast.error('กรุณากรอกข้อมูลก่อน'); return }
    setVerifying({ ...verifying, [type]: true })
    try {
      const r = await api.post('/auth/verify-contact', { type, value })
      updateUser(r.data.user)
      toast.success(`ยืนยัน ${type} สำเร็จ! ✅`)
    } catch { toast.error('เกิดข้อผิดพลาด') }
    setVerifying({ ...verifying, [type]: false })
  }

  const verifyScore = [user?.phone?.verified, user?.facebook?.verified, user?.line?.verified].filter(Boolean).length

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-extrabold text-gray-900 mb-2">👤 โปรไฟล์ของฉัน</h1>
        <p className="text-gray-500 mb-8">จัดการข้อมูลและยืนยันตัวตน</p>
      </motion.div>

      {/* Verification Score */}
      <div className="card p-5 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-gray-900">🔐 ระดับความน่าเชื่อถือ</h2>
          <span className={`badge text-sm font-bold ${
            verifyScore === 3 ? 'bg-green-100 text-green-700' :
            verifyScore >= 1 ? 'bg-yellow-100 text-yellow-700' :
            'bg-gray-100 text-gray-500'
          }`}>
            {verifyScore === 3 ? '⭐ ยืนยันครบ' : verifyScore >= 1 ? '🔶 ยืนยันบางส่วน' : '⚠️ ยังไม่ยืนยัน'}
          </span>
        </div>
        <div className="flex gap-3">
          {[
            { key: 'phone', label: 'เบอร์โทร', emoji: '📱', verified: user?.phone?.verified },
            { key: 'facebook', label: 'Facebook', emoji: '📘', verified: user?.facebook?.verified },
            { key: 'line', label: 'Line ID', emoji: '💬', verified: user?.line?.verified }
          ].map(item => (
            <div key={item.key} className={`flex-1 p-3 rounded-xl text-center text-sm ${item.verified ? 'bg-green-50' : 'bg-gray-50'}`}>
              <div className="text-2xl mb-1">{item.emoji}</div>
              <div className={`font-medium ${item.verified ? 'text-green-600' : 'text-gray-500'}`}>
                {item.verified ? '✅ ยืนยันแล้ว' : '❌ ยังไม่ยืนยัน'}
              </div>
              <div className="text-xs text-gray-400">{item.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-5">
        {/* Basic Info */}
        <div className="card p-6">
          <h2 className="font-bold text-gray-900 mb-5">📝 ข้อมูลส่วนตัว</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">ชื่อ-นามสกุล</label>
              <input className="input" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">อายุ</label>
                <input type="number" className="input" min={18} max={80}
                  value={form.age} onChange={e => setForm({...form, age: e.target.value})} />
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
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">เกี่ยวกับฉัน</label>
              <textarea className="input resize-none" rows={3}
                placeholder="ชอบเที่ยวแบบไหน ชอบอะไรเป็นพิเศษ..."
                value={form.bio} onChange={e => setForm({...form, bio: e.target.value})} />
            </div>
          </div>
        </div>

        {/* Travel Styles */}
        <div className="card p-6">
          <h2 className="font-bold text-gray-900 mb-4">🌟 สไตล์การเที่ยว</h2>
          <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
            {TRAVEL_STYLES.map(s => (
              <button key={s.id} onClick={() => toggleStyle(s.id)}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 text-xs transition-all ${
                  form.travelStyles.includes(s.id)
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-600'
                }`}>
                <span className="text-2xl">{s.emoji}</span>
                <span>{s.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Contact & Verification */}
        <div className="card p-6">
          <h2 className="font-bold text-gray-900 mb-2">📞 ข้อมูลติดต่อ & ยืนยันตัวตน</h2>
          <p className="text-sm text-gray-500 mb-5">ข้อมูลติดต่อจะแสดงเฉพาะสมาชิกในกลุ่มทริปเท่านั้น</p>
          <div className="space-y-4">
            {[
              { key: 'phone', label: 'เบอร์โทรศัพท์', emoji: '📱', placeholder: '08x-xxx-xxxx', verified: user?.phone?.verified, type: 'tel' },
              { key: 'facebook', label: 'Facebook URL', emoji: '📘', placeholder: 'https://facebook.com/username', verified: user?.facebook?.verified, type: 'url' },
              { key: 'line', label: 'Line ID', emoji: '💬', placeholder: 'your_line_id', verified: user?.line?.verified, type: 'text' }
            ].map(item => (
              <div key={item.key}>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  {item.emoji} {item.label}
                  {item.verified && <span className="ml-2 text-green-500 text-xs font-normal">✅ ยืนยันแล้ว</span>}
                </label>
                <div className="flex gap-2">
                  <input type={item.type} className="input flex-1" placeholder={item.placeholder}
                    value={contacts[item.key]}
                    onChange={e => setContacts({...contacts, [item.key]: e.target.value})} />
                  <button
                    onClick={() => verifyContact(item.key)}
                    disabled={verifying[item.key] || item.verified}
                    className={`px-4 py-2 rounded-xl font-medium text-sm transition-all ${
                      item.verified
                        ? 'bg-green-100 text-green-600 cursor-default'
                        : 'bg-primary-600 text-white hover:bg-primary-700'
                    }`}>
                    {item.verified ? '✅' : verifying[item.key] ? '⏳' : 'ยืนยัน'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button className="btn-primary w-full text-lg py-4" disabled={saving} onClick={saveProfile}>
          {saving ? '⏳ กำลังบันทึก...' : '💾 บันทึกโปรไฟล์'}
        </button>
      </div>
    </div>
  )
}
