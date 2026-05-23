import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import api from '../services/api'
import useAuthStore from '../store/authStore'

const STYLE_LABELS = {
  beach: '🏖️ ทะเล', nature: '🌿 ธรรมชาติ', culture: '⛩️ วัฒนธรรม', food: '🍜 อาหาร',
  adventure: '🧗 ผจญภัย', shopping: '🛍️ ช้อปปิ้ง', nightlife: '🎉 ไนท์ไลฟ์',
  luxury: '💎 Luxury', budget: '🎒 แบ็คแพ็ค', wellness: '♨️ Wellness',
}

const STYLE_COLOR = {
  beach: '#06B6D4', nature: '#22C55E', culture: '#F97316', food: '#EAB308',
  adventure: '#EF4444', shopping: '#EC4899', nightlife: '#A855F7',
  luxury: '#F59E0B', budget: '#6366F1', wellness: '#14B8A6',
}

export default function Discover() {
  const { user } = useAuthStore()
  const [trips, setTrips] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState({ type: 'all', style: '', search: '' })

  useEffect(() => {
    api.get('/trips?status=open').then(r => { setTrips(r.data); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  const filtered = trips.filter(t => {
    if (filter.type !== 'all' && t.tripType !== filter.type) return false
    if (filter.style && !t.travelStyles?.includes(filter.style)) return false
    if (filter.search) {
      const q = filter.search.toLowerCase()
      return (t.destination?.country || t.destination?.province || '').toLowerCase().includes(q)
        || (t.title || '').toLowerCase().includes(q)
    }
    return true
  })

  const isMe = (trip) => trip.creator?._id === user?._id
  const days = (trip) => trip.dateRange
    ? Math.ceil((new Date(trip.dateRange.end) - new Date(trip.dateRange.start)) / 86400000)
    : 0

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black text-white">🔍 ค้นหาทริป</h1>
          <p className="text-white/40 text-sm mt-0.5">{trips.length} ทริปเปิดรับสมาชิก</p>
        </div>
        <Link to="/create-trip" className="btn-primary px-6 py-2.5 text-sm self-start">✈️ สร้างทริปของฉัน</Link>
      </div>

      {/* Filters */}
      <div className="card p-4 mb-6 flex flex-wrap gap-3">
        <input className="input flex-1 min-w-48 text-sm py-2.5" placeholder="🔍 ค้นหาปลายทาง..."
          value={filter.search} onChange={e => setFilter({ ...filter, search: e.target.value })} />
        <select className="input w-40 text-sm py-2.5" value={filter.type} onChange={e => setFilter({ ...filter, type: e.target.value })}>
          <option value="all">ทุกประเภท</option>
          <option value="international">🌍 ต่างประเทศ</option>
          <option value="domestic">🇹🇭 ในประเทศ</option>
        </select>
        <select className="input w-44 text-sm py-2.5" value={filter.style} onChange={e => setFilter({ ...filter, style: e.target.value })}>
          <option value="">ทุกสไตล์</option>
          {Object.entries(STYLE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-3 animate-bounce">✈️</div>
          <p className="text-white/40">กำลังโหลดทริป...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-3">🔍</div>
          <p className="text-white/40 text-lg mb-4">ไม่พบทริปที่ตรงกับเงื่อนไข</p>
          <Link to="/create-trip" className="btn-primary px-6 py-3">สร้างทริปของคุณ</Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((trip, i) => (
            <motion.div key={trip._id}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}>
              <Link to={`/trips/${trip._id}`}>
                <div className="card overflow-hidden h-full flex flex-col group" style={{ cursor: 'pointer' }}>
                  {/* Card Top Banner */}
                  <div className="relative h-28 flex items-end p-4 overflow-hidden"
                    style={{
                      background: trip.tripType === 'international'
                        ? 'linear-gradient(135deg, rgba(124,58,237,0.6), rgba(236,72,153,0.4))'
                        : 'linear-gradient(135deg, rgba(6,182,212,0.5), rgba(34,197,94,0.4))',
                    }}>
                    <div className="absolute top-3 right-3 text-xs font-bold px-2.5 py-1 rounded-full"
                      style={{ background: 'rgba(0,0,0,0.3)', color: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(8px)' }}>
                      {trip.tripType === 'international' ? '🌍 ต่างประเทศ' : '🇹🇭 ในประเทศ'}
                    </div>
                    <div>
                      <div className="text-4xl leading-none mb-1">{trip.destination?.flag || '🌍'}</div>
                      <h3 className="font-black text-white text-lg leading-tight">
                        {trip.destination?.country || trip.destination?.province}
                      </h3>
                      {trip.title && <p className="text-white/60 text-xs">{trip.title}</p>}
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-4 flex-1 flex flex-col">
                    {/* Creator */}
                    <div className="flex items-center gap-3 pb-3 mb-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                      <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-black text-sm flex-shrink-0"
                        style={{ background: 'linear-gradient(135deg,#7C3AED,#EC4899)' }}>
                        {trip.creator?.name?.[0] || '?'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-white text-sm">{isMe(trip) ? '👑 ทริปของฉัน' : trip.creator?.name}</p>
                        <div className="flex gap-1.5 text-xs text-white/30 mt-0.5">
                          {trip.creator?.phone?.verified && <span>📱✓</span>}
                          {trip.creator?.line?.verified && <span>💬✓</span>}
                          {trip.creator?.facebook?.verified && <span>📘✓</span>}
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="font-black text-white text-sm">{trip.currentMembers?.length || 0}<span className="text-white/30">/{trip.groupSize?.max}</span></div>
                        <div className="text-xs text-white/30">คน</div>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="space-y-1.5 text-xs text-white/50 mb-3">
                      <div className="flex gap-2">
                        <span>📅</span>
                        <span>
                          {new Date(trip.dateRange?.start).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' })}
                          {days(trip) > 0 && ` (${days(trip)} วัน)`}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <span>💰</span>
                        <span>{trip.budget?.min?.toLocaleString()}–{trip.budget?.max?.toLocaleString()} ฿/คน</span>
                      </div>
                    </div>

                    {/* Styles */}
                    <div className="flex flex-wrap gap-1.5 mb-3 flex-1">
                      {trip.travelStyles?.slice(0, 3).map(s => (
                        <span key={s} className="text-xs px-2 py-0.5 rounded-full font-semibold"
                          style={{ background: `${STYLE_COLOR[s] || '#8B5CF6'}20`, color: STYLE_COLOR[s] || '#C4B5FD', border: `1px solid ${STYLE_COLOR[s] || '#8B5CF6'}30` }}>
                          {STYLE_LABELS[s] || s}
                        </span>
                      ))}
                    </div>

                    {/* CTA */}
                    <div className="flex items-center justify-between mt-auto pt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                      <span className="text-xs px-2.5 py-1 rounded-full font-bold"
                        style={{ background: 'rgba(34,197,94,0.15)', color: '#86EFAC', border: '1px solid rgba(34,197,94,0.25)' }}>
                        🟢 เปิดรับ
                      </span>
                      <span className="text-violet-400 font-bold text-sm group-hover:text-violet-300 transition-colors">
                        {isMe(trip) ? 'จัดการ →' : 'ดูรายละเอียด →'}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
