import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import api from '../services/api'

export default function TourCompanies() {
  const [companies, setCompanies] = useState([])
  const [loading, setLoading] = useState(true)
  const [requesting, setRequesting] = useState(null)
  const [searchParams] = useSearchParams()
  const tripId = searchParams.get('request')
  const [filter, setFilter] = useState({ type: 'all', search: '' })

  useEffect(() => { loadCompanies() }, [])

  const loadCompanies = async () => {
    try {
      const r = await api.get('/tours')
      setCompanies(r.data)
    } catch { }
    setLoading(false)
  }

  const requestPrivateTour = async (companyId, companyName) => {
    setRequesting(companyId)
    try {
      const r = await api.post(`/tours/${companyId}/request-private`, { tripId })
      toast.success(`ส่งคำขอถึง ${companyName} แล้ว! 🎉\n${r.data.nextStep}`, { duration: 6000 })
    } catch { toast.error('เกิดข้อผิดพลาด') }
    setRequesting(null)
  }

  const filtered = companies.filter(c => {
    if (filter.type !== 'all' && !c.tripTypes?.includes(filter.type)) return false
    if (filter.search) {
      const q = filter.search.toLowerCase()
      return c.name.toLowerCase().includes(q) || c.destinations?.some(d => d.toLowerCase().includes(q))
    }
    return true
  })

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">🧳 บริษัททัวร์พาร์ทเนอร์</h1>
          <p className="text-gray-500">
            {tripId ? '✈️ เลือกบริษัททัวร์เพื่อจัด Private Tour สำหรับกลุ่มของคุณ' : 'บริษัททัวร์ชั้นนำที่ร่วมมือกับเรา'}
          </p>
        </div>
      </div>

      {tripId && (
        <div className="card p-4 mb-6 border-l-4 border-primary-400 bg-primary-50">
          <p className="text-primary-700 font-semibold">
            💡 คุณกำลังจะจอง Private Tour สำหรับทริปของคุณ เลือกบริษัทที่ต้องการแล้วกด "ขอ Private Tour"
          </p>
        </div>
      )}

      {/* Filters */}
      <div className="card p-4 mb-6 flex flex-wrap gap-3">
        <input className="input flex-1 min-w-48" placeholder="🔍 ค้นหาบริษัท หรือปลายทาง..."
          value={filter.search} onChange={e => setFilter({...filter, search: e.target.value})} />
        <select className="input w-48" value={filter.type} onChange={e => setFilter({...filter, type: e.target.value})}>
          <option value="all">ทุกประเภท</option>
          <option value="international">ต่างประเทศ 🌍</option>
          <option value="domestic">ในประเทศ 🇹🇭</option>
        </select>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-400">
          <div className="text-5xl mb-3 animate-bounce">🧳</div>
          <p>กำลังโหลด...</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((company, i) => (
            <motion.div key={company._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="card overflow-hidden hover:border-primary-200 hover:-translate-y-1 transition-all"
            >
              {/* Header */}
              <div className="p-5 border-b border-gray-100">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-2xl bg-primary-50 flex items-center justify-center text-4xl">
                      {company.logo}
                    </div>
                    <div>
                      <h3 className="font-extrabold text-gray-900 leading-tight">{company.name}</h3>
                      {company.verified && (
                        <span className="text-xs text-green-600 font-semibold">✅ ยืนยันแล้ว</span>
                      )}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="font-bold text-yellow-500 text-lg">{'⭐'.repeat(Math.round(company.rating))}</div>
                    <div className="text-xs text-gray-400">{company.rating} ({company.reviewCount} รีวิว)</div>
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="p-5">
                <p className="text-sm text-gray-600 mb-4 leading-relaxed">{company.description}</p>

                {/* Destinations */}
                <div className="mb-3">
                  <p className="text-xs font-semibold text-gray-500 mb-2">📍 ปลายทาง</p>
                  <div className="flex flex-wrap gap-1.5">
                    {company.destinations?.slice(0, 4).map(d => (
                      <span key={d} className="badge bg-gray-100 text-gray-600 text-xs">{d}</span>
                    ))}
                    {company.destinations?.length > 4 && (
                      <span className="badge bg-gray-100 text-gray-400 text-xs">+{company.destinations.length - 4}</span>
                    )}
                  </div>
                </div>

                {/* Highlights */}
                <div className="mb-4">
                  <p className="text-xs font-semibold text-gray-500 mb-2">⭐ จุดเด่น</p>
                  <div className="space-y-1">
                    {company.highlights?.slice(0, 3).map((h, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-gray-600">
                        <span className="text-green-500">✓</span> {h}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Price & Group */}
                <div className="flex justify-between text-sm mb-4">
                  <div>
                    <span className="text-gray-400 text-xs">กลุ่ม</span>
                    <p className="font-semibold text-gray-900">{company.minGroupSize}-{company.maxGroupSize} คน</p>
                  </div>
                  <div className="text-right">
                    <span className="text-gray-400 text-xs">ราคาเริ่มต้น</span>
                    <p className="font-semibold text-primary-600">{company.priceRange?.min?.toLocaleString()} ฿</p>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="bg-gray-50 rounded-xl p-3 text-xs text-gray-600 space-y-1 mb-4">
                  <div>📞 {company.phone}</div>
                  <div>📧 {company.email}</div>
                  <div>💬 Line: {company.lineId}</div>
                </div>

                {/* CTA */}
                <button
                  onClick={() => requestPrivateTour(company._id, company.name)}
                  disabled={requesting === company._id}
                  className="btn-primary w-full flex items-center justify-center gap-2"
                >
                  {requesting === company._id
                    ? <><span className="animate-spin">⏳</span> กำลังส่ง...</>
                    : <><span>🧳</span> {tripId ? 'ขอ Private Tour' : 'ติดต่อสอบถาม'}</>
                  }
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <div className="text-center py-20">
          <div className="text-5xl mb-3">🔍</div>
          <p className="text-gray-500">ไม่พบบริษัททัวร์ที่ตรงกับเงื่อนไข</p>
        </div>
      )}
    </div>
  )
}
