import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import api from '../services/api'

export default function MyMatches() {
  const [incoming, setIncoming] = useState([])
  const [sent, setSent] = useState([])
  const [tab, setTab] = useState('incoming')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get('/matches').catch(() => ({ data: [] })),
      api.get('/matches/sent').catch(() => ({ data: [] }))
    ]).then(([inc, s]) => {
      setIncoming(inc.data)
      setSent(s.data)
      setLoading(false)
    })
  }, [])

  const statusBadge = (status) => ({
    pending: <span className="badge bg-yellow-100 text-yellow-700">⏳ รอการตอบ</span>,
    accepted: <span className="badge bg-green-100 text-green-700">✅ ได้รับการยอมรับ</span>,
    declined: <span className="badge bg-red-100 text-red-600">❌ ถูกปฏิเสธ</span>
  }[status])

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-extrabold text-gray-900 mb-2">💌 คำขอร่วมทริป</h1>
      <p className="text-gray-500 mb-6">จัดการคำขอเข้าร่วมทริป</p>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200 pb-0">
        {[
          { id: 'incoming', label: '📥 ขอเข้าร่วมทริปฉัน', count: incoming.filter(m => m.status === 'pending').length },
          { id: 'sent', label: '📤 ที่ฉันส่งออก', count: sent.filter(m => m.status === 'pending').length }
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`px-5 py-3 font-semibold text-sm border-b-2 transition-all ${
              tab === t.id ? 'border-primary-600 text-primary-700' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}>
            {t.label}
            {t.count > 0 && <span className="ml-2 bg-primary-100 text-primary-700 text-xs px-2 py-0.5 rounded-full">{t.count}</span>}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-16 text-gray-400">
          <div className="text-5xl mb-3 animate-bounce">💌</div>
          <p>กำลังโหลด...</p>
        </div>
      ) : tab === 'incoming' ? (
        incoming.length === 0 ? (
          <div className="text-center py-16 card p-10">
            <div className="text-5xl mb-3">📭</div>
            <p className="text-gray-500">ยังไม่มีคำขอเข้าร่วมทริปของคุณ</p>
            <p className="text-gray-400 text-sm mt-2">สร้างทริปและรอให้เพื่อนนักเดินทางขอเข้าร่วม!</p>
            <Link to="/create-trip" className="btn-primary mt-4 inline-block">สร้างทริป</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {incoming.map((match, i) => (
              <motion.div key={match._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="card p-5"
              >
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary-400 to-secondary-400 flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                    {match.fromUser?.name?.[0] || '?'}
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <p className="font-bold text-gray-900">{match.fromUser?.name}</p>
                      {match.fromUser?.phone?.verified && <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">📱 ยืนยันแล้ว</span>}
                      {match.fromUser?.line?.verified && <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">💬 Line</span>}
                    </div>
                    <p className="text-sm text-gray-500 mb-2">
                      ขอร่วมทริป: {match.tripRequest?.destination?.country || match.tripRequest?.destination?.province} •{' '}
                      {new Date(match.createdAt).toLocaleDateString('th-TH')}
                    </p>
                    {match.message && (
                      <div className="bg-gray-50 rounded-xl p-3 text-sm text-gray-700 mb-3">
                        💬 "{match.message}"
                      </div>
                    )}
                    {match.fromUser?.travelStyles?.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {match.fromUser.travelStyles.slice(0, 4).map(s => (
                          <span key={s} className="text-xs bg-primary-50 text-primary-600 px-2 py-0.5 rounded-full">{s}</span>
                        ))}
                      </div>
                    )}
                    <div className="flex items-center gap-3">
                      {statusBadge(match.status)}
                      {match.tripRequest?._id && (
                        <Link to={`/trips/${match.tripRequest._id}`}
                          className="text-sm text-primary-600 hover:underline font-medium">
                          ดูทริป →
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )
      ) : (
        sent.length === 0 ? (
          <div className="text-center py-16 card p-10">
            <div className="text-5xl mb-3">📤</div>
            <p className="text-gray-500">ยังไม่ได้ขอร่วมทริปไหน</p>
            <Link to="/discover" className="btn-primary mt-4 inline-block">ค้นหาทริป</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {sent.map((match, i) => (
              <motion.div key={match._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="card p-5"
              >
                <div className="flex items-center gap-4">
                  <div className="text-3xl">{match.tripRequest?.destination?.flag || '🌍'}</div>
                  <div className="flex-1">
                    <p className="font-bold text-gray-900">
                      {match.tripRequest?.destination?.country || match.tripRequest?.destination?.province}
                    </p>
                    <p className="text-sm text-gray-500">
                      ส่งถึง: {match.toUser?.name} • {new Date(match.createdAt).toLocaleDateString('th-TH')}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {statusBadge(match.status)}
                    {match.tripRequest?._id && (
                      <Link to={`/trips/${match.tripRequest._id}`} className="text-sm text-primary-600 hover:underline">ดูทริป</Link>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )
      )}
    </div>
  )
}
