import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import api from '../services/api'
import useAuthStore from '../store/authStore'

export default function Dashboard() {
  const { user } = useAuthStore()
  const [myTrips, setMyTrips] = useState([])
  const [recentTrips, setRecentTrips] = useState([])
  const [matchCount, setMatchCount] = useState(0)

  useEffect(() => {
    Promise.all([
      api.get('/trips/my').catch(() => ({ data: [] })),
      api.get('/trips?status=open').catch(() => ({ data: [] })),
      api.get('/matches').catch(() => ({ data: [] }))
    ]).then(([myT, recent, matches]) => {
      setMyTrips(myT.data.slice(0, 3))
      setRecentTrips(recent.data.slice(0, 4))
      setMatchCount(matches.data.filter(m => m.status === 'pending').length)
    })
  }, [])

  const statusColor = (s) => ({
    open: 'bg-green-100 text-green-700',
    forming: 'bg-yellow-100 text-yellow-700',
    confirmed: 'bg-blue-100 text-blue-700',
    completed: 'bg-gray-100 text-gray-600'
  }[s] || 'bg-gray-100 text-gray-600')

  const statusLabel = (s) => ({
    open: '🟢 เปิดรับ', forming: '🟡 กำลังรวมกลุ่ม', confirmed: '🔵 ยืนยันแล้ว', completed: '✅ เสร็จสิ้น'
  }[s] || s)

  const verifyCount = [user?.phone?.verified, user?.facebook?.verified, user?.line?.verified].filter(Boolean).length

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="gradient-bg rounded-3xl p-8 mb-8 text-white"
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold mb-2">
              สวัสดี, {user?.name?.split(' ')[0]}! ✈️
            </h1>
            <p className="text-white/80">พร้อมออกเดินทางแล้วหรือยัง? มีทริปรอคุณอยู่</p>
            {matchCount > 0 && (
              <div className="mt-3 inline-flex items-center gap-2 bg-yellow-400 text-yellow-900 px-4 py-2 rounded-full text-sm font-bold">
                💌 มีคำขอร่วมทริปใหม่ {matchCount} รายการ
              </div>
            )}
          </div>
          <div className="flex gap-3 flex-wrap">
            <Link to="/create-trip" className="bg-white text-primary-700 font-bold px-6 py-3 rounded-xl hover:shadow-lg transition-all">
              ✈️ สร้างทริป
            </Link>
            <Link to="/discover" className="border-2 border-white text-white font-bold px-6 py-3 rounded-xl hover:bg-white/10 transition-all">
              🔍 หาเพื่อนเที่ยว
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'ทริปของฉัน', value: myTrips.length, emoji: '✈️', link: '/create-trip' },
          { label: 'คำขอรอตอบ', value: matchCount, emoji: '💌', link: '/matches' },
          { label: 'ยืนยันตัวตน', value: `${verifyCount}/3`, emoji: '✅', link: '/profile' },
          { label: 'ทริปเปิดอยู่', value: recentTrips.length, emoji: '🌍', link: '/discover' }
        ].map((stat, i) => (
          <Link key={i} to={stat.link}>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="card p-5 flex items-center gap-4 hover:border-primary-200 cursor-pointer"
            >
              <div className="w-12 h-12 rounded-2xl bg-primary-50 flex items-center justify-center text-2xl">
                {stat.emoji}
              </div>
              <div>
                <div className="text-2xl font-extrabold text-gray-900">{stat.value}</div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* My Trips */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-title">ทริปของฉัน</h2>
            <Link to="/create-trip" className="text-primary-600 text-sm font-semibold hover:underline">+ สร้างทริปใหม่</Link>
          </div>
          {myTrips.length === 0 ? (
            <div className="card p-10 text-center">
              <div className="text-5xl mb-3">✈️</div>
              <p className="text-gray-500 mb-4">ยังไม่มีทริป สร้างทริปแรกได้เลย!</p>
              <Link to="/create-trip" className="btn-primary inline-block">สร้างทริป</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {myTrips.map(trip => (
                <Link key={trip._id} to={`/trips/${trip._id}`}>
                  <div className="card p-4 hover:border-primary-200 flex items-center gap-4">
                    <div className="text-3xl">{trip.destination?.flag || '🌍'}</div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-900 truncate">{trip.title || trip.destination?.country || trip.destination?.province}</p>
                      <p className="text-sm text-gray-500">
                        {trip.dateRange && new Date(trip.dateRange.start).toLocaleDateString('th-TH', { day: 'numeric', month: 'short' })}
                        {' - '}{trip.duration} วัน • {trip.currentMembers?.length || 0} คนแล้ว
                      </p>
                    </div>
                    <span className={`badge text-xs ${statusColor(trip.status)}`}>{statusLabel(trip.status)}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Recent Open Trips */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-title">ทริปล่าสุด</h2>
            <Link to="/discover" className="text-primary-600 text-sm font-semibold hover:underline">ดูทั้งหมด</Link>
          </div>
          <div className="space-y-3">
            {recentTrips.map(trip => (
              <Link key={trip._id} to={`/trips/${trip._id}`}>
                <div className="card p-4 hover:border-primary-200 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-secondary-400 flex items-center justify-center text-white font-bold text-lg">
                    {trip.creator?.name?.[0] || '?'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-900 truncate">
                      {trip.destination?.flag} {trip.destination?.country || trip.destination?.province}
                    </p>
                    <p className="text-sm text-gray-500">
                      โดย {trip.creator?.name} • งบ {trip.budget?.min?.toLocaleString()}-{trip.budget?.max?.toLocaleString()} บาท
                    </p>
                  </div>
                  <div className="text-sm text-primary-600 font-semibold">จอย →</div>
                </div>
              </Link>
            ))}
            {recentTrips.length === 0 && (
              <div className="card p-10 text-center">
                <div className="text-5xl mb-3">🔍</div>
                <p className="text-gray-500">ยังไม่มีทริปเปิดรับสมาชิก</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Profile Completion */}
      {verifyCount < 3 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-8 card p-6 border-l-4 border-yellow-400"
        >
          <div className="flex items-start gap-4">
            <span className="text-3xl">⚠️</span>
            <div className="flex-1">
              <p className="font-bold text-gray-900 mb-1">โปรไฟล์ยังไม่ครบ</p>
              <p className="text-gray-500 text-sm mb-3">ยืนยันข้อมูลติดต่อเพื่อเพิ่มความน่าเชื่อถือ และให้เพื่อนนักเดินทางติดต่อคุณได้</p>
              <Link to="/profile" className="btn-primary text-sm px-4 py-2">เพิ่มข้อมูลติดต่อ</Link>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
