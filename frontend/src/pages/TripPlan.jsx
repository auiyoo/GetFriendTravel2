import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import api from '../services/api'

export default function TripPlan() {
  const { tripId } = useParams()
  const [plan, setPlan] = useState(null)
  const [trip, setTrip] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeDay, setActiveDay] = useState(1)

  useEffect(() => {
    loadPlan()
  }, [tripId])

  const loadPlan = async () => {
    try {
      const [tripRes] = await Promise.all([
        api.get(`/trips/${tripId}`)
      ])
      setTrip(tripRes.data)
      const planRes = await api.post('/plans/generate', { tripId })
      setPlan(planRes.data)
    } catch (err) {
      toast.error('ไม่สามารถโหลดแผนได้')
    }
    setLoading(false)
  }

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-64 py-20">
      <div className="text-5xl mb-4 animate-spin">✈️</div>
      <p className="text-gray-500">กำลังสร้างแผนการเดินทาง...</p>
    </div>
  )

  if (!plan) return (
    <div className="text-center py-20">
      <p className="text-gray-500">ไม่สามารถโหลดแผนได้</p>
      <Link to={`/trips/${tripId}`} className="btn-primary mt-4 inline-block">กลับ</Link>
    </div>
  )

  const currentDay = plan.days?.find(d => d.day === activeDay)

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="gradient-bg rounded-3xl p-8 mb-6 text-white">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div>
            <p className="text-white/70 text-sm mb-1">🗺️ แผนการเดินทาง</p>
            <h1 className="text-2xl md:text-3xl font-extrabold">{plan.title}</h1>
            <p className="text-white/80 mt-1">{plan.duration} วัน • {plan.destination}</p>
          </div>
          <div className="flex flex-col gap-2">
            <div className="bg-white/20 rounded-2xl p-4 text-center">
              <div className="text-2xl font-extrabold">~{plan.estimatedBudget?.total?.toLocaleString()}</div>
              <div className="text-white/70 text-sm">บาท/คน (ประมาณ)</div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Day Selector */}
        <div className="lg:col-span-1">
          <div className="card p-4">
            <h3 className="font-bold text-gray-900 mb-3 text-sm">📅 เลือกวัน</h3>
            <div className="space-y-2">
              {plan.days?.map(day => (
                <button key={day.day} onClick={() => setActiveDay(day.day)}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-all ${
                    activeDay === day.day
                      ? 'gradient-bg text-white font-bold shadow-md'
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}>
                  <div className="font-semibold">วันที่ {day.day}</div>
                  <div className={`text-xs mt-0.5 ${activeDay === day.day ? 'text-white/70' : 'text-gray-400'}`}>
                    {new Date(day.date).toLocaleDateString('th-TH', { weekday: 'short', day: 'numeric', month: 'short' })}
                  </div>
                </button>
              ))}
            </div>

            {/* Budget breakdown */}
            <div className="mt-4 pt-4 border-t border-gray-100">
              <h3 className="font-bold text-gray-900 mb-3 text-sm">💰 ประมาณค่าใช้จ่าย/วัน</h3>
              <div className="space-y-2 text-xs">
                {[
                  { label: '🏨 ที่พัก', value: plan.estimatedBudget?.breakdown?.accommodation },
                  { label: '🍽️ อาหาร', value: plan.estimatedBudget?.breakdown?.food },
                  { label: '🎡 กิจกรรม', value: plan.estimatedBudget?.breakdown?.activities },
                  { label: '🚗 เดินทาง', value: plan.estimatedBudget?.breakdown?.transport }
                ].map((item, i) => (
                  <div key={i} className="flex justify-between text-gray-600">
                    <span>{item.label}</span>
                    <span className="font-semibold">{item.value?.toLocaleString()} ฿</span>
                  </div>
                ))}
                <div className="flex justify-between font-bold text-gray-900 pt-2 border-t border-gray-100">
                  <span>รวม/วัน</span>
                  <span>{plan.estimatedBudget?.perDay?.toLocaleString()} ฿</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Day Plan */}
        <div className="lg:col-span-3 space-y-5">
          {currentDay && (
            <motion.div key={activeDay} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <div className="card p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">{currentDay.title}</h2>

                {/* Timeline */}
                <div className="space-y-6">
                  {/* Morning */}
                  {currentDay.morning?.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 font-bold text-sm">🌅</span>
                        <h3 className="font-bold text-amber-700">ช่วงเช้า</h3>
                      </div>
                      <div className="ml-10 space-y-3">
                        {currentDay.morning.map((a, i) => (
                          <div key={i} className="bg-amber-50 rounded-xl p-4 flex items-start gap-3">
                            <span className="text-2xl">{a.emoji}</span>
                            <div>
                              <p className="font-semibold text-gray-900">{a.activity}</p>
                              <p className="text-sm text-gray-500">{a.duration}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Lunch */}
                  <div className="ml-10 bg-orange-50 rounded-xl p-3 flex items-center gap-3">
                    <span className="text-2xl">🍽️</span>
                    <p className="text-sm text-orange-700">{currentDay.meals?.lunch}</p>
                  </div>

                  {/* Afternoon */}
                  {currentDay.afternoon?.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">☀️</span>
                        <h3 className="font-bold text-blue-700">ช่วงบ่าย</h3>
                      </div>
                      <div className="ml-10 space-y-3">
                        {currentDay.afternoon.map((a, i) => (
                          <div key={i} className="bg-blue-50 rounded-xl p-4 flex items-start gap-3">
                            <span className="text-2xl">{a.emoji}</span>
                            <div>
                              <p className="font-semibold text-gray-900">{a.activity}</p>
                              <p className="text-sm text-gray-500">{a.duration}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Evening */}
                  {currentDay.evening?.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-sm">🌙</span>
                        <h3 className="font-bold text-purple-700">ช่วงเย็น/ค่ำ</h3>
                      </div>
                      <div className="ml-10 space-y-3">
                        {currentDay.evening.map((a, i) => (
                          <div key={i} className="bg-purple-50 rounded-xl p-4 flex items-start gap-3">
                            <span className="text-2xl">{a.emoji}</span>
                            <div>
                              <p className="font-semibold text-gray-900">{a.activity}</p>
                              <p className="text-sm text-gray-500">{a.duration}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Accommodation */}
                  <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-3">
                    <span className="text-2xl">{currentDay.accommodation?.emoji}</span>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{currentDay.accommodation?.type}</p>
                      <p className="text-xs text-gray-500">{currentDay.accommodation?.priceRange}</p>
                    </div>
                  </div>

                  {/* Day Tips */}
                  {currentDay.tips?.length > 0 && (
                    <div className="bg-yellow-50 rounded-xl p-4">
                      <h4 className="font-bold text-yellow-700 text-sm mb-2">💡 Tips วันนี้</h4>
                      <ul className="space-y-1">
                        {currentDay.tips.map((tip, i) => (
                          <li key={i} className="text-sm text-yellow-700">{tip}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Packing List */}
          {plan.packing && (
            <div className="card p-6">
              <h3 className="font-bold text-gray-900 mb-4">🎒 สิ่งที่ต้องพก</h3>
              <div className="grid grid-cols-2 gap-2">
                {plan.packing.map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-gray-700">
                    <span className="text-green-500">✓</span> {item}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Emergency */}
          <div className="card p-5 border-l-4 border-red-400">
            <h3 className="font-bold text-gray-900 mb-3">🆘 ข้อมูลฉุกเฉิน</h3>
            <div className="text-sm text-gray-700 space-y-1">
              {plan.emergency && Object.entries(plan.emergency).map(([k, v]) => (
                <div key={k} className="flex gap-2">
                  <span className="font-semibold capitalize">{k}:</span>
                  <span>{v}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Link to={`/trips/${tripId}`} className="btn-outline flex-1 text-center">← กลับหน้าทริป</Link>
            <Link to="/tours" className="btn-primary flex-1 text-center">🧳 จอง Private Tour</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
