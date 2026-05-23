import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import api from '../services/api'
import useAuthStore from '../store/authStore'

const STYLE_LABELS = {
  beach: '🏖️ ทะเล', nature: '🌿 ธรรมชาติ', culture: '⛩️ วัฒนธรรม', food: '🍜 อาหาร',
  adventure: '🧗 ผจญภัย', shopping: '🛍️ ช้อปปิ้ง', nightlife: '🎉 ไนท์ไลฟ์',
  luxury: '💎 Luxury', budget: '🎒 แบ็คแพ็ค', wellness: '♨️ Wellness'
}

export default function TripDetail() {
  const { id } = useParams()
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const [trip, setTrip] = useState(null)
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [joining, setJoining] = useState(false)
  const [message, setMessage] = useState('')
  const [showJoinForm, setShowJoinForm] = useState(false)

  useEffect(() => {
    loadTrip()
  }, [id])

  const loadTrip = async () => {
    try {
      const [tripRes, matchRes] = await Promise.all([
        api.get(`/trips/${id}`),
        api.get(`/trips/${id}/matches`).catch(() => ({ data: [] }))
      ])
      setTrip(tripRes.data)
      setMatches(matchRes.data.slice(0, 6))
    } catch { toast.error('ไม่พบทริป'); navigate('/discover') }
    setLoading(false)
  }

  const joinTrip = async () => {
    setJoining(true)
    try {
      await api.post(`/trips/${id}/join`, { message })
      toast.success('ส่งคำขอเข้าร่วมแล้ว! 🎉')
      setShowJoinForm(false)
      loadTrip()
    } catch (err) {
      toast.error(err.response?.data?.message || 'เกิดข้อผิดพลาด')
    }
    setJoining(false)
  }

  const respondToRequest = async (userId, action) => {
    try {
      await api.put(`/trips/${id}/respond`, { userId, action })
      toast.success(action === 'accept' ? '✅ รับเข้ากลุ่มแล้ว' : '❌ ปฏิเสธแล้ว')
      loadTrip()
    } catch { toast.error('เกิดข้อผิดพลาด') }
  }

  const requestPrivateTour = (companyId) => {
    navigate(`/tours?request=${id}`)
  }

  if (loading) return <div className="flex justify-center py-20"><div className="text-5xl animate-bounce">✈️</div></div>
  if (!trip) return null

  const isCreator = trip.creator?._id === user?._id
  const isMember = trip.currentMembers?.some(m => m._id === user?._id)
  const isPending = trip.pendingRequests?.includes(user?._id)
  const duration = trip.duration || Math.ceil((new Date(trip.dateRange?.end) - new Date(trip.dateRange?.start)) / (1000*60*60*24))

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-3xl p-8 mb-6 text-white ${trip.tripType === 'international' ? 'gradient-bg' : 'bg-gradient-to-br from-green-500 to-teal-600'}`}
      >
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div>
            <div className="text-6xl mb-3">{trip.destination?.flag || '🌍'}</div>
            <h1 className="text-3xl font-extrabold mb-1">{trip.title || trip.destination?.country || trip.destination?.province}</h1>
            <p className="text-white/80">{trip.destination?.country || ''} {trip.destination?.province || ''}</p>
          </div>
          <div className="flex flex-col gap-2 text-right">
            <span className="bg-white/20 px-4 py-2 rounded-xl text-sm font-medium self-end">
              {trip.currentMembers?.length || 0} / {trip.groupSize?.max} คน
            </span>
            <span className="text-white/80 text-sm">{duration} วัน</span>
          </div>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left - Trip Info */}
        <div className="lg:col-span-2 space-y-5">
          {/* Details */}
          <div className="card p-6">
            <h2 className="font-bold text-lg text-gray-900 mb-4">📋 รายละเอียดทริป</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              {[
                { label: '📅 วันออกเดินทาง', value: new Date(trip.dateRange?.start).toLocaleDateString('th-TH', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) },
                { label: '📅 วันกลับ', value: new Date(trip.dateRange?.end).toLocaleDateString('th-TH', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) },
                { label: '💰 งบประมาณ/คน', value: `${trip.budget?.min?.toLocaleString()} - ${trip.budget?.max?.toLocaleString()} ${trip.budget?.currency}` },
                { label: '👥 จำนวนสมาชิก', value: `${trip.groupSize?.min}-${trip.groupSize?.max} คน` }
              ].map((item, i) => (
                <div key={i} className="bg-gray-50 rounded-xl p-3">
                  <div className="text-xs text-gray-500 mb-1">{item.label}</div>
                  <div className="font-semibold text-gray-900">{item.value}</div>
                </div>
              ))}
            </div>
            {trip.description && (
              <div className="mt-4 p-4 bg-blue-50 rounded-xl text-gray-700 text-sm leading-relaxed">
                💬 {trip.description}
              </div>
            )}
          </div>

          {/* Styles */}
          <div className="card p-5">
            <h3 className="font-bold text-gray-900 mb-3">🎯 สไตล์การเที่ยว</h3>
            <div className="flex flex-wrap gap-2">
              {trip.travelStyles?.map(s => (
                <span key={s} className="badge bg-primary-50 text-primary-700 font-medium">
                  {STYLE_LABELS[s] || s}
                </span>
              ))}
            </div>
          </div>

          {/* Attractions */}
          {trip.selectedAttractions?.length > 0 && (
            <div className="card p-5">
              <h3 className="font-bold text-gray-900 mb-3">📍 สถานที่ที่อยากไป</h3>
              <div className="flex flex-wrap gap-2">
                {trip.selectedAttractions.map(a => (
                  <span key={a} className="badge bg-yellow-50 text-yellow-700">⭐ {a}</span>
                ))}
              </div>
            </div>
          )}

          {/* Members */}
          <div className="card p-5">
            <h3 className="font-bold text-gray-900 mb-3">👥 สมาชิกกลุ่ม</h3>
            <div className="flex flex-wrap gap-3">
              {/* Creator */}
              <div className="flex flex-col items-center gap-1">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-yellow-400 to-orange-400 flex items-center justify-center text-white font-bold text-xl shadow-md">
                  {trip.creator?.name?.[0]}
                </div>
                <span className="text-xs text-gray-600">{trip.creator?.name?.split(' ')[0]}</span>
                <span className="text-xs text-yellow-600 font-semibold">👑 ผู้สร้าง</span>
              </div>
              {trip.currentMembers?.map(m => (
                <div key={m._id} className="flex flex-col items-center gap-1">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary-400 to-secondary-400 flex items-center justify-center text-white font-bold text-xl">
                    {m.name?.[0]}
                  </div>
                  <span className="text-xs text-gray-600">{m.name?.split(' ')[0]}</span>
                </div>
              ))}
              {/* Empty slots */}
              {Array.from({ length: Math.max(0, trip.groupSize?.max - (trip.currentMembers?.length || 0) - 1) }).slice(0, 3).map((_, i) => (
                <div key={i} className="flex flex-col items-center gap-1">
                  <div className="w-14 h-14 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center text-2xl text-gray-300">+</div>
                  <span className="text-xs text-gray-400">ว่าง</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pending Requests (for creator) */}
          {isCreator && trip.pendingRequests?.length > 0 && (
            <div className="card p-5 border-l-4 border-yellow-400">
              <h3 className="font-bold text-gray-900 mb-3">💌 คำขอรอการตอบ ({trip.pendingRequests.length})</h3>
              <div className="space-y-3">
                {trip.pendingRequests.map(userId => (
                  <div key={userId} className="flex items-center gap-3 bg-yellow-50 rounded-xl p-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-secondary-400 flex items-center justify-center text-white font-bold">?</div>
                    <div className="flex-1"><p className="text-sm font-semibold text-gray-900">ผู้ใช้ {userId.slice(-6)}</p></div>
                    <div className="flex gap-2">
                      <button onClick={() => respondToRequest(userId, 'accept')}
                        className="bg-green-500 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-green-600 transition-all">✅ รับ</button>
                      <button onClick={() => respondToRequest(userId, 'decline')}
                        className="bg-red-100 text-red-600 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-red-200 transition-all">❌ ปฏิเสธ</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Similar trips */}
          {matches.length > 0 && !isCreator && (
            <div className="card p-5">
              <h3 className="font-bold text-gray-900 mb-3">🤝 ทริปคล้ายกัน (Compatible)</h3>
              <div className="space-y-2">
                {matches.slice(0, 3).map(m => (
                  <Link key={m.trip._id} to={`/trips/${m.trip._id}`}>
                    <div className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl transition-all">
                      <span className="text-2xl">{m.trip.destination?.flag || '🌍'}</span>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{m.trip.destination?.country || m.trip.destination?.province}</p>
                        <p className="text-xs text-gray-400">คะแนนความเข้ากัน</p>
                      </div>
                      <div className="text-right">
                        <div className="text-primary-600 font-bold">{m.score}%</div>
                        <div className="w-16 h-1.5 bg-gray-200 rounded-full mt-1">
                          <div className="h-full bg-primary-500 rounded-full" style={{ width: `${m.score}%` }} />
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="space-y-5">
          {/* Creator Profile */}
          <div className="card p-5">
            <h3 className="font-bold text-gray-900 mb-4">👤 ผู้สร้างทริป</h3>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary-400 to-secondary-400 flex items-center justify-center text-white font-bold text-xl">
                {trip.creator?.name?.[0]}
              </div>
              <div>
                <p className="font-bold text-gray-900">{trip.creator?.name}</p>
                <p className="text-sm text-gray-500">{trip.creator?.age ? `${trip.creator.age} ปี` : ''} {trip.creator?.gender === 'male' ? '♂️' : trip.creator?.gender === 'female' ? '♀️' : ''}</p>
              </div>
            </div>
            {trip.creator?.bio && <p className="text-sm text-gray-600 mb-4">{trip.creator.bio}</p>}

            {/* Contact - only show if member */}
            {(isMember || isCreator) && (
              <div className="space-y-2">
                {trip.creator?.phone?.verified && (
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-green-500">📱 ✓</span>
                    <span className="text-gray-700">{trip.creator.phone.number}</span>
                  </div>
                )}
                {trip.creator?.line?.verified && (
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-green-500">💬 ✓</span>
                    <span className="text-gray-700">Line: {trip.creator.line.id}</span>
                  </div>
                )}
                {trip.creator?.facebook?.verified && (
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-green-500">📘 ✓</span>
                    <a href={trip.creator.facebook.url} target="_blank" rel="noreferrer"
                      className="text-blue-600 hover:underline">Facebook</a>
                  </div>
                )}
              </div>
            )}
            {!isMember && !isCreator && (
              <p className="text-xs text-gray-400 italic mt-2">ข้อมูลติดต่อจะแสดงหลังเข้าร่วมกลุ่ม</p>
            )}
          </div>

          {/* Actions */}
          {!isCreator && (
            <div className="card p-5">
              {trip.status === 'open' && !isMember && !isPending ? (
                showJoinForm ? (
                  <div>
                    <h3 className="font-bold text-gray-900 mb-3">✉️ ส่งข้อความพร้อมคำขอ</h3>
                    <textarea className="input resize-none mb-3" rows={3}
                      placeholder="แนะนำตัว บอกว่าทำไมอยากร่วมทริปนี้..."
                      value={message} onChange={e => setMessage(e.target.value)} />
                    <div className="flex gap-2">
                      <button className="btn-outline flex-1" onClick={() => setShowJoinForm(false)}>ยกเลิก</button>
                      <button className="btn-primary flex-1" disabled={joining} onClick={joinTrip}>
                        {joining ? '⏳...' : '🙋 ขอเข้าร่วม'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <button className="btn-primary w-full text-lg py-4" onClick={() => setShowJoinForm(true)}>
                    🙋 ขอร่วมทริปนี้!
                  </button>
                )
              ) : isMember ? (
                <div className="text-center">
                  <div className="text-3xl mb-2">🎉</div>
                  <p className="font-bold text-green-600">คุณเป็นสมาชิกแล้ว!</p>
                </div>
              ) : isPending ? (
                <div className="text-center">
                  <div className="text-3xl mb-2">⏳</div>
                  <p className="font-semibold text-gray-600">รอการอนุมัติ...</p>
                </div>
              ) : null}
            </div>
          )}

          {/* Creator Actions */}
          {isCreator && (
            <div className="space-y-3">
              <Link to={`/plan/${id}`} className="btn-primary w-full text-center block">
                🗺️ ดู/สร้างแผนทริป
              </Link>
              <Link to="/tours" className="btn-secondary w-full text-center block">
                🧳 จอง Private Tour
              </Link>
            </div>
          )}

          {/* Trip Plan Button */}
          {isMember && (
            <Link to={`/plan/${id}`} className="btn-primary w-full text-center block">
              🗺️ ดูแผนการเดินทาง
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
