import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import api from '../services/api'

const StatusBadge = ({ status }) => {
  const styles = {
    pending:  { bg: 'rgba(234,179,8,0.15)',   color: '#FDE047', border: 'rgba(234,179,8,0.35)',   label: '⏳ รอการตอบ' },
    accepted: { bg: 'rgba(34,197,94,0.15)',   color: '#86EFAC', border: 'rgba(34,197,94,0.35)',   label: '✅ ยอมรับแล้ว' },
    declined: { bg: 'rgba(239,68,68,0.15)',   color: '#FCA5A5', border: 'rgba(239,68,68,0.35)',   label: '❌ ถูกปฏิเสธ' },
  }
  const s = styles[status] || styles.pending
  return (
    <span className="text-xs font-bold px-3 py-1 rounded-full"
      style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}` }}>
      {s.label}
    </span>
  )
}

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

  const pendingIn  = incoming.filter(m => m.status === 'pending').length
  const pendingOut = sent.filter(m => m.status === 'pending').length

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-black text-white mb-1">💌 คำขอร่วมทริป</h1>
        <p className="text-white/40 text-sm mb-6">จัดการคำขอเข้าร่วมทริป</p>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 p-1 rounded-2xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
        {[
          { id: 'incoming', label: '📥 ขอเข้าร่วมทริปฉัน', count: pendingIn },
          { id: 'sent',     label: '📤 ที่ฉันส่งออก',       count: pendingOut },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all"
            style={tab === t.id
              ? { background: 'linear-gradient(135deg,#7C3AED,#EC4899)', color: 'white' }
              : { color: 'rgba(255,255,255,0.4)' }}>
            {t.label}
            {t.count > 0 && (
              <span className="text-xs font-black px-2 py-0.5 rounded-full"
                style={{ background: tab === t.id ? 'rgba(255,255,255,0.25)' : 'rgba(139,92,246,0.3)', color: 'white' }}>
                {t.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-16 text-white/40">
          <div className="text-5xl mb-3 animate-bounce">💌</div>
          <p>กำลังโหลด...</p>
        </div>
      ) : tab === 'incoming' ? (
        incoming.length === 0 ? (
          <div className="card p-12 text-center">
            <div className="text-5xl mb-3">📭</div>
            <p className="text-white/50 font-semibold">ยังไม่มีคำขอเข้าร่วมทริปของคุณ</p>
            <p className="text-white/30 text-sm mt-2 mb-6">สร้างทริปและรอให้เพื่อนนักเดินทางขอเข้าร่วม!</p>
            <Link to="/create-trip" className="btn-primary px-6 py-2.5">✈️ สร้างทริป</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {incoming.map((match, i) => (
              <motion.div key={match._id}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="card p-5">
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div className="w-14 h-14 rounded-full flex items-center justify-center text-white font-black text-xl flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg,#7C3AED,#EC4899)' }}>
                    {match.fromUser?.name?.[0] || '?'}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <p className="font-bold text-white">{match.fromUser?.name}</p>
                      {match.fromUser?.phone?.verified && (
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
                          style={{ background: 'rgba(34,197,94,0.12)', color: '#86EFAC', border: '1px solid rgba(34,197,94,0.25)' }}>
                          📱 ยืนยันแล้ว
                        </span>
                      )}
                      {match.fromUser?.line?.verified && (
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
                          style={{ background: 'rgba(34,197,94,0.12)', color: '#86EFAC', border: '1px solid rgba(34,197,94,0.25)' }}>
                          💬 Line
                        </span>
                      )}
                    </div>

                    <p className="text-sm text-white/45 mb-3">
                      ขอร่วมทริป: <span className="text-white/70 font-semibold">
                        {match.tripRequest?.destination?.country || match.tripRequest?.destination?.province}
                      </span> · {new Date(match.createdAt).toLocaleDateString('th-TH')}
                    </p>

                    {match.message && (
                      <div className="rounded-xl p-3 text-sm text-white/70 mb-3"
                        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                        💬 "{match.message}"
                      </div>
                    )}

                    {match.fromUser?.travelStyles?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {match.fromUser.travelStyles.slice(0, 4).map(s => (
                          <span key={s} className="text-xs px-2.5 py-0.5 rounded-full font-semibold"
                            style={{ background: 'rgba(139,92,246,0.15)', color: '#C4B5FD', border: '1px solid rgba(139,92,246,0.25)' }}>
                            {s}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center gap-3 flex-wrap">
                      <StatusBadge status={match.status} />
                      {match.tripRequest?._id && (
                        <Link to={`/trips/${match.tripRequest._id}`}
                          className="text-sm text-violet-400 hover:text-violet-300 font-semibold transition-colors">
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
          <div className="card p-12 text-center">
            <div className="text-5xl mb-3">📤</div>
            <p className="text-white/50 font-semibold">ยังไม่ได้ขอร่วมทริปไหน</p>
            <Link to="/discover" className="btn-primary mt-6 px-6 py-2.5 inline-block">🔍 ค้นหาทริป</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {sent.map((match, i) => (
              <motion.div key={match._id}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="card p-5">
                <div className="flex items-center gap-4">
                  <div className="text-3xl flex-shrink-0">{match.tripRequest?.destination?.flag || '🌍'}</div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-white">
                      {match.tripRequest?.destination?.country || match.tripRequest?.destination?.province}
                    </p>
                    <p className="text-sm text-white/40 mt-0.5">
                      ส่งถึง: <span className="text-white/60">{match.toUser?.name}</span> · {new Date(match.createdAt).toLocaleDateString('th-TH')}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <StatusBadge status={match.status} />
                    {match.tripRequest?._id && (
                      <Link to={`/trips/${match.tripRequest._id}`}
                        className="text-sm text-violet-400 hover:text-violet-300 font-semibold transition-colors">
                        ดูทริป
                      </Link>
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
