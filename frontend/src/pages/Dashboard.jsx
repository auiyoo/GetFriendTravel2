import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import api from '../services/api'
import useAuthStore from '../store/authStore'

const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } }

const statusStyle = (s) => ({
  open: { bg: 'rgba(34,197,94,0.15)', color: '#86EFAC', border: 'rgba(34,197,94,0.3)', label: '🟢 เปิดรับ' },
  forming: { bg: 'rgba(234,179,8,0.15)', color: '#FDE047', border: 'rgba(234,179,8,0.3)', label: '🟡 รวมกลุ่ม' },
  confirmed: { bg: 'rgba(6,182,212,0.15)', color: '#67E8F9', border: 'rgba(6,182,212,0.3)', label: '🔵 ยืนยัน' },
  completed: { bg: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.4)', border: 'rgba(255,255,255,0.1)', label: '✅ เสร็จ' },
}[s] || { bg: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.4)', border: 'rgba(255,255,255,0.1)', label: s })

export default function Dashboard() {
  const { user } = useAuthStore()
  const [myTrips, setMyTrips] = useState([])
  const [recentTrips, setRecentTrips] = useState([])
  const [matchCount, setMatchCount] = useState(0)

  useEffect(() => {
    Promise.all([
      api.get('/trips/my').catch(() => ({ data: [] })),
      api.get('/trips?status=open').catch(() => ({ data: [] })),
      api.get('/matches').catch(() => ({ data: [] })),
    ]).then(([myT, recent, matches]) => {
      setMyTrips(myT.data.slice(0, 3))
      setRecentTrips(recent.data.slice(0, 4))
      setMatchCount(matches.data.filter(m => m.status === 'pending').length)
    })
  }, [])

  const verifyCount = [user?.phone?.verified, user?.facebook?.verified, user?.line?.verified].filter(Boolean).length

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">

      {/* ── HERO BANNER ── */}
      <motion.div initial={{ opacity: 0, y: -15 }} animate={{ opacity: 1, y: 0 }}
        className="relative rounded-3xl p-8 mb-8 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.4), rgba(236,72,153,0.3))', border: '1px solid rgba(139,92,246,0.3)' }}>
        <div className="bg-orb w-64 h-64 -top-10 -right-10 opacity-30" style={{ background: 'radial-gradient(circle, #7C3AED, transparent)' }} />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <p className="text-white/50 text-sm mb-1">สวัสดี 👋</p>
            <h1 className="text-2xl md:text-3xl font-black text-white mb-2">
              {user?.name?.split(' ')[0]} <span className="gradient-text">พร้อมเที่ยวแล้วหรือยัง?</span>
            </h1>
            {matchCount > 0 && (
              <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold mt-1"
                style={{ background: 'rgba(234,179,8,0.2)', border: '1px solid rgba(234,179,8,0.4)', color: '#FDE047' }}>
                💌 มีคำขอร่วมทริปใหม่ {matchCount} รายการ
              </motion.div>
            )}
          </div>
          <div className="flex gap-3 flex-wrap">
            <Link to="/create-trip" className="btn-primary px-6 py-3">✈️ สร้างทริป</Link>
            <Link to="/discover" className="btn-secondary px-6 py-3">🔍 หาเพื่อนเที่ยว</Link>
          </div>
        </div>
      </motion.div>

      {/* ── QUICK STATS ── */}
      <motion.div initial="hidden" animate="show" variants={stagger} className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'ทริปของฉัน', value: myTrips.length, emoji: '✈️', link: '/create-trip', color: '#8B5CF6' },
          { label: 'คำขอรอตอบ', value: matchCount, emoji: '💌', link: '/matches', color: '#EC4899' },
          { label: 'ยืนยันตัวตน', value: `${verifyCount}/3`, emoji: '✅', link: '/profile', color: '#06B6D4' },
          { label: 'ทริปเปิดอยู่', value: recentTrips.length, emoji: '🌍', link: '/discover', color: '#F97316' },
        ].map((stat, i) => (
          <motion.div key={i} variants={fadeUp}>
            <Link to={stat.link}>
              <div className="card p-5 flex items-center gap-4 group cursor-pointer hover:-translate-y-1 transition-transform">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                  style={{ background: `${stat.color}22`, border: `1px solid ${stat.color}33` }}>
                  {stat.emoji}
                </div>
                <div>
                  <div className="text-2xl font-black text-white">{stat.value}</div>
                  <div className="text-xs text-white/40 font-medium">{stat.label}</div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* ── MY TRIPS ── */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-title">✈️ ทริปของฉัน</h2>
            <Link to="/create-trip" className="text-violet-400 text-sm font-semibold hover:text-violet-300">+ สร้างใหม่</Link>
          </div>
          {myTrips.length === 0 ? (
            <div className="card p-10 text-center">
              <div className="text-5xl mb-3">✈️</div>
              <p className="text-white/40 mb-4 text-sm">ยังไม่มีทริป สร้างทริปแรกได้เลย!</p>
              <Link to="/create-trip" className="btn-primary px-6 py-2.5 text-sm">สร้างทริป</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {myTrips.map(trip => {
                const ss = statusStyle(trip.status)
                return (
                  <Link key={trip._id} to={`/trips/${trip._id}`}>
                    <div className="card p-4 flex items-center gap-4 hover:-translate-y-0.5 transition-transform group">
                      <div className="text-3xl">{trip.destination?.flag || '🌍'}</div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-white truncate text-sm">{trip.title || trip.destination?.country || trip.destination?.province}</p>
                        <p className="text-xs text-white/40 mt-0.5">
                          {trip.dateRange && new Date(trip.dateRange.start).toLocaleDateString('th-TH', { day: 'numeric', month: 'short' })}
                          {' · '}{trip.duration} วัน · {trip.currentMembers?.length || 0} คน
                        </p>
                      </div>
                      <span className="text-xs px-2.5 py-1 rounded-full font-semibold flex-shrink-0"
                        style={{ background: ss.bg, color: ss.color, border: `1px solid ${ss.border}` }}>
                        {ss.label}
                      </span>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </motion.div>

        {/* ── RECENT TRIPS ── */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-title">🔥 ทริปล่าสุด</h2>
            <Link to="/discover" className="text-violet-400 text-sm font-semibold hover:text-violet-300">ดูทั้งหมด →</Link>
          </div>
          <div className="space-y-3">
            {recentTrips.map(trip => (
              <Link key={trip._id} to={`/trips/${trip._id}`}>
                <div className="card p-4 flex items-center gap-4 hover:-translate-y-0.5 transition-transform">
                  <div className="w-11 h-11 rounded-full flex items-center justify-center text-white font-black text-lg flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg,#7C3AED,#EC4899)' }}>
                    {trip.creator?.name?.[0] || '?'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-white text-sm truncate">
                      {trip.destination?.flag} {trip.destination?.country || trip.destination?.province}
                    </p>
                    <p className="text-xs text-white/40 mt-0.5">
                      {trip.creator?.name} · {trip.budget?.min?.toLocaleString()}–{trip.budget?.max?.toLocaleString()} ฿
                    </p>
                  </div>
                  <span className="text-violet-400 text-sm font-bold flex-shrink-0">จอย →</span>
                </div>
              </Link>
            ))}
            {recentTrips.length === 0 && (
              <div className="card p-10 text-center">
                <div className="text-4xl mb-3">🔍</div>
                <p className="text-white/40 text-sm">ยังไม่มีทริปเปิดรับสมาชิก</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* ── VERIFY BANNER ── */}
      {verifyCount < 3 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          className="mt-6 card p-5 flex items-center gap-4"
          style={{ borderLeft: '3px solid rgba(234,179,8,0.6)' }}>
          <span className="text-3xl flex-shrink-0">⚠️</span>
          <div className="flex-1">
            <p className="font-bold text-white text-sm">โปรไฟล์ยังไม่ครบ</p>
            <p className="text-white/40 text-xs mt-0.5">ยืนยัน Tel/FB/Line เพื่อเพิ่มความน่าเชื่อถือ</p>
          </div>
          <Link to="/profile" className="btn-primary px-4 py-2 text-sm flex-shrink-0">ยืนยันตัวตน</Link>
        </motion.div>
      )}
    </div>
  )
}
