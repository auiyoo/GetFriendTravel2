import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import api from '../services/api'
import useAuthStore from '../store/authStore'

const STYLE_LABELS = {
  beach: '🏖️ ทะเล', nature: '🌿 ธรรมชาติ', culture: '⛩️ วัฒนธรรม', food: '🍜 อาหาร',
  adventure: '🧗 ผจญภัย', shopping: '🛍️ ช้อปปิ้ง', nightlife: '🎉 ไนท์ไลฟ์',
  luxury: '💎 Luxury', budget: '🎒 แบ็คแพ็ค', wellness: '♨️ Wellness'
}

export default function Discover() {
  const { user } = useAuthStore()
  const [trips, setTrips] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState({ type: 'all', style: '', search: '' })

  useEffect(() => { loadTrips() }, [])

  const loadTrips = async () => {
    setLoading(true)
    try {
      const r = await api.get('/trips?status=open')
      setTrips(r.data)
    } catch { }
    setLoading(false)
  }

  const filtered = trips.filter(t => {
    if (filter.type !== 'all' && t.tripType !== filter.type) return false
    if (filter.style && !t.travelStyles?.includes(filter.style)) return false
    if (filter.search) {
      const q = filter.search.toLowerCase()
      const dest = (t.destination?.country || t.destination?.province || '').toLowerCase()
      const title = (t.title || '').toLowerCase()
      if (!dest.includes(q) && !title.includes(q)) return false
    }
    return true
  })

  const getDuration = (trip) => {
    if (!trip.dateRange) return ''
    const days = Math.ceil((new Date(trip.dateRange.end) - new Date(trip.dateRange.start)) / (1000*60*60*24))
    return `${days} วัน`
  }

  const isMyTrip = (trip) => trip.creator?._id === user?._id

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">🔍 ค้นหาทริป</h1>
          <p className="text-gray-500">พบทริปที่เปิดรับสมาชิก {trips.length} ทริป</p>
        </div>
        <Link to="/create-trip" className="btn-primary flex items-center gap-2 self-start">
          ✈️ สร้างทริปของฉัน
        </Link>
      </div>

      {/* Filters */}
      <div className="card p-4 mb-6 flex flex-wrap gap-3">
        <input
          className="input flex-1 min-w-48"
          placeholder="🔍 ค้นหาปลายทาง..."
          value={filter.search}
          onChange={e => setFilter({...filter, search: e.target.value})}
        />
        <select className="input w-40" value={filter.type} onChange={e => setFilter({...filter, type: e.target.value})}>
          <option value="all">ทุกประเภท</option>
          <option value="international">ต่างประเทศ 🌍</option>
          <option value="domestic">ในประเทศ 🇹🇭</option>
        </select>
        <select className="input w-44" value={filter.style} onChange={e => setFilter({...filter, style: e.target.value})}>
          <option value="">ทุกสไตล์</option>
          {Object.entries(STYLE_LABELS).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-400">
          <div className="text-5xl mb-3 animate-bounce">✈️</div>
          <p>กำลังโหลดทริป...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-3">🔍</div>
          <p className="text-gray-500 text-lg">ไม่พบทริปที่ตรงกับเงื่อนไข</p>
          <Link to="/create-trip" className="btn-primary mt-4 inline-block">สร้างทริปของคุณเอง</Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((trip, i) => (
            <motion.div
              key={trip._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link to={`/trips/${trip._id}`}>
                <div className="card overflow-hidden hover:border-primary-200 hover:-translate-y-1 transition-all">
                  {/* Header */}
                  <div className={`p-5 ${trip.tripType === 'international' ? 'gradient-bg' : 'bg-gradient-to-r from-green-500 to-teal-500'} text-white`}>
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-4xl">{trip.destination?.flag || '🌍'}</span>
                        <h3 className="font-extrabold text-lg mt-2">
                          {trip.destination?.country || trip.destination?.province}
                        </h3>
                        {trip.title && <p className="text-white/80 text-sm">{trip.title}</p>}
                      </div>
                      <span className="bg-white/20 text-white text-xs px-2 py-1 rounded-full">
                        {trip.tripType === 'international' ? '🌍 ต่างประเทศ' : '🇹🇭 ในประเทศ'}
                      </span>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-5">
                    {/* Creator */}
                    <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-secondary-400 flex items-center justify-center text-white font-bold">
                        {trip.creator?.name?.[0] || '?'}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-sm text-gray-900">
                          {isMyTrip(trip) ? '👑 ทริปของฉัน' : trip.creator?.name}
                        </p>
                        <div className="flex gap-2 text-xs text-gray-400">
                          {trip.creator?.phone?.verified && <span>📱 ยืนยันแล้ว</span>}
                          {trip.creator?.line?.verified && <span>💬 Line</span>}
                          {trip.creator?.facebook?.verified && <span>📘 Facebook</span>}
                        </div>
                      </div>
                      <div className="text-right text-xs text-gray-500">
                        <div className="font-semibold text-primary-600">{trip.currentMembers?.length || 0}/{trip.groupSize?.max}</div>
                        <div>คน</div>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                      <div className="flex gap-2">
                        <span>📅</span>
                        <span>
                          {new Date(trip.dateRange?.start).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' })}
                          {' → '}{getDuration(trip)}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <span>💰</span>
                        <span>{trip.budget?.min?.toLocaleString()} - {trip.budget?.max?.toLocaleString()} บาท/คน</span>
                      </div>
                    </div>

                    {/* Styles */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {trip.travelStyles?.slice(0, 3).map(s => (
                        <span key={s} className="badge bg-primary-50 text-primary-600 text-xs">
                          {STYLE_LABELS[s] || s}
                        </span>
                      ))}
                    </div>

                    {/* Selected Attractions */}
                    {trip.selectedAttractions?.length > 0 && (
                      <div className="text-xs text-gray-500 mb-3">
                        📍 {trip.selectedAttractions.slice(0, 2).join(' • ')}
                        {trip.selectedAttractions.length > 2 && ` +${trip.selectedAttractions.length - 2}`}
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <span className="badge bg-green-50 text-green-600 text-xs">🟢 เปิดรับสมาชิก</span>
                      <span className="text-primary-600 font-semibold text-sm">{isMyTrip(trip) ? 'จัดการ →' : 'ดูรายละเอียด →'}</span>
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
