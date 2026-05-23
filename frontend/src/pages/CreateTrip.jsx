import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import api from '../services/api'

const TRAVEL_STYLES = [
  { id: 'beach', label: 'ทะเล', emoji: '🏖️' }, { id: 'nature', label: 'ธรรมชาติ', emoji: '🌿' },
  { id: 'culture', label: 'วัฒนธรรม', emoji: '⛩️' }, { id: 'food', label: 'อาหาร', emoji: '🍜' },
  { id: 'adventure', label: 'ผจญภัย', emoji: '🧗' }, { id: 'shopping', label: 'ช้อปปิ้ง', emoji: '🛍️' },
  { id: 'nightlife', label: 'ไนท์ไลฟ์', emoji: '🎉' }, { id: 'luxury', label: 'Luxury', emoji: '💎' },
  { id: 'budget', label: 'แบ็คแพ็ค', emoji: '🎒' }, { id: 'wellness', label: 'Wellness', emoji: '♨️' }
]

export default function CreateTrip() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [tripType, setTripType] = useState('')
  const [destinations, setDestinations] = useState([])
  const [selectedDest, setSelectedDest] = useState(null)
  const [destDetails, setDestDetails] = useState(null)
  const [loadingDest, setLoadingDest] = useState(false)
  const [form, setForm] = useState({
    title: '', description: '',
    dateStart: '', dateEnd: '',
    budgetMin: '', budgetMax: '',
    groupSizeMin: 2, groupSizeMax: 8,
    travelStyles: [], selectedAttractions: []
  })
  const [submitting, setSubmitting] = useState(false)
  const [planPreview, setPlanPreview] = useState(null)

  useEffect(() => {
    if (tripType) {
      api.get(`/destinations/${tripType}`).then(r => setDestinations(r.data))
    }
  }, [tripType])

  const selectDestination = async (dest) => {
    setSelectedDest(dest)
    setLoadingDest(true)
    try {
      const key = tripType === 'international' ? dest.code : dest.province
      const r = await api.get(`/destinations/${tripType}/${key}`)
      setDestDetails(r.data)
    } catch { }
    setLoadingDest(false)
    setStep(3)
  }

  const toggleAttr = (name) => {
    setForm(f => ({
      ...f,
      selectedAttractions: f.selectedAttractions.includes(name)
        ? f.selectedAttractions.filter(a => a !== name)
        : [...f.selectedAttractions, name]
    }))
  }

  const toggleStyle = (id) => {
    setForm(f => ({
      ...f,
      travelStyles: f.travelStyles.includes(id)
        ? f.travelStyles.filter(s => s !== id)
        : [...f.travelStyles, id]
    }))
  }

  const previewPlan = async () => {
    if (!form.dateStart || !form.dateEnd) { toast.error('กรุณาเลือกวันเดินทาง'); return }
    try {
      const payload = {
        tripType,
        destination: tripType === 'international'
          ? { country: selectedDest.country || destDetails?.country, countryCode: selectedDest.code, flag: selectedDest.flag }
          : { country: selectedDest.province, province: selectedDest.province },
        dateRange: { start: form.dateStart, end: form.dateEnd },
        budget: { min: Number(form.budgetMin) || 0, max: Number(form.budgetMax) || 50000 },
        travelStyles: form.travelStyles,
        selectedAttractions: form.selectedAttractions
      }
      const r = await api.post('/plans/preview', payload)
      setPlanPreview(r.data)
      setStep(5)
    } catch { toast.error('ไม่สามารถสร้างแผนตัวอย่างได้') }
  }

  const handleSubmit = async () => {
    if (!form.dateStart || !form.dateEnd || !form.budgetMax) {
      toast.error('กรุณากรอกข้อมูลให้ครบ'); return
    }
    setSubmitting(true)
    try {
      const payload = {
        tripType,
        destination: tripType === 'international'
          ? { country: destDetails?.country || selectedDest.country, countryCode: selectedDest.code, flag: selectedDest.flag }
          : { country: selectedDest.province, province: selectedDest.province },
        title: form.title || `ทริป${tripType === 'international' ? destDetails?.country : selectedDest?.province}`,
        description: form.description,
        dateRange: { start: form.dateStart, end: form.dateEnd },
        budget: { min: Number(form.budgetMin) || 0, max: Number(form.budgetMax), currency: 'THB' },
        groupSize: { min: form.groupSizeMin, max: form.groupSizeMax },
        travelStyles: form.travelStyles,
        selectedAttractions: form.selectedAttractions
      }
      const r = await api.post('/trips', payload)
      toast.success('สร้างทริปสำเร็จ! 🎉')
      navigate(`/trips/${r.data._id}`)
    } catch (err) {
      toast.error(err.response?.data?.message || 'เกิดข้อผิดพลาด')
    }
    setSubmitting(false)
  }

  const StepIndicator = () => (
    <div className="flex items-center gap-2 mb-8">
      {['ประเภท', 'ปลายทาง', 'สถานที่', 'รายละเอียด', 'ตรวจสอบ'].map((label, i) => (
        <div key={i} className="flex items-center gap-1">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
            i + 1 < step ? 'gradient-bg text-white' : i + 1 === step ? 'bg-primary-100 text-primary-700 border-2 border-primary-500' : 'bg-gray-100 text-gray-400'
          }`}>{i + 1 < step ? '✓' : i + 1}</div>
          <span className={`text-xs hidden md:block ${i + 1 === step ? 'text-primary-600 font-semibold' : 'text-gray-400'}`}>{label}</span>
          {i < 4 && <div className={`flex-1 h-0.5 w-4 md:w-8 ${i + 1 < step ? 'bg-primary-400' : 'bg-gray-200'}`} />}
        </div>
      ))}
    </div>
  )

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-gray-900">✈️ สร้างทริปใหม่</h1>
        <p className="text-gray-500">บอกเราว่าอยากไปไหน แล้วเราจะช่วยหาเพื่อนร่วมทาง</p>
      </div>

      <StepIndicator />

      <AnimatePresence mode="wait">
        {/* Step 1: Trip Type */}
        {step === 1 && (
          <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <div className="card p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">🌏 เที่ยวแบบไหน?</h2>
              <div className="grid grid-cols-2 gap-6">
                {[
                  { id: 'international', label: 'ต่างประเทศ', emoji: '🌍', desc: 'ญี่ปุ่น เกาหลี ยุโรป...' },
                  { id: 'domestic', label: 'ในประเทศ', emoji: '🇹🇭', desc: 'เชียงใหม่ ภูเก็ต กรุงเทพฯ...' }
                ].map(t => (
                  <button key={t.id} onClick={() => { setTripType(t.id); setStep(2) }}
                    className="border-2 border-gray-200 rounded-2xl p-8 text-center hover:border-primary-400 hover:bg-primary-50 transition-all group">
                    <div className="text-6xl mb-4">{t.emoji}</div>
                    <div className="font-bold text-xl text-gray-900 group-hover:text-primary-700">{t.label}</div>
                    <div className="text-gray-500 text-sm mt-2">{t.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 2: Select Destination */}
        {step === 2 && (
          <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <div className="card p-6">
              <div className="flex items-center gap-3 mb-6">
                <button onClick={() => setStep(1)} className="btn-outline px-3 py-2">←</button>
                <h2 className="text-xl font-bold text-gray-900">
                  {tripType === 'international' ? '🌍 เลือกประเทศ' : '🇹🇭 เลือกจังหวัด'}
                </h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-96 overflow-y-auto pr-1">
                {destinations.map((dest, i) => (
                  <button key={i} onClick={() => selectDestination(dest)}
                    className="flex items-center gap-3 p-3 border-2 border-gray-200 rounded-xl hover:border-primary-400 hover:bg-primary-50 transition-all text-left">
                    <span className="text-2xl">{dest.flag || dest.emoji}</span>
                    <div>
                      <div className="font-medium text-gray-900 text-sm">{dest.country || dest.province}</div>
                      <div className="text-xs text-gray-400">{dest.continent || dest.region}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 3: Attractions */}
        {step === 3 && (
          <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <div className="card p-6">
              <div className="flex items-center gap-3 mb-4">
                <button onClick={() => setStep(2)} className="btn-outline px-3 py-2">←</button>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {selectedDest?.flag || selectedDest?.emoji} {destDetails?.country || destDetails?.province || selectedDest?.country || selectedDest?.province}
                  </h2>
                  <p className="text-gray-500 text-sm">เลือกสถานที่ที่อยากไป (เลือกได้หลายที่)</p>
                </div>
              </div>

              {loadingDest ? (
                <div className="text-center py-10 text-gray-400">⏳ กำลังโหลดข้อมูล...</div>
              ) : (
                <>
                  {destDetails?.tips && (
                    <div className="bg-blue-50 rounded-xl p-4 mb-4 text-sm text-blue-700">
                      💡 {destDetails.tips}
                    </div>
                  )}
                  <p className="text-sm font-semibold text-gray-700 mb-3">สถานที่น่าสนใจ:</p>
                  <div className="grid grid-cols-1 gap-2 max-h-72 overflow-y-auto pr-1">
                    {destDetails?.highlights?.map((h, i) => (
                      <button key={i} onClick={() => toggleAttr(h.name)}
                        className={`flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all ${
                          form.selectedAttractions.includes(h.name)
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}>
                        <span className="text-xl">{h.emoji}</span>
                        <div className="flex-1">
                          <div className="font-medium text-sm text-gray-900">{h.name}</div>
                          <div className="text-xs text-gray-400">{h.city} • {h.type}</div>
                        </div>
                        {form.selectedAttractions.includes(h.name) && <span className="text-primary-500 font-bold">✓</span>}
                      </button>
                    ))}
                  </div>
                  {form.selectedAttractions.length > 0 && (
                    <div className="mt-3 text-sm text-primary-600">
                      เลือก {form.selectedAttractions.length} สถานที่
                    </div>
                  )}
                  <button className="btn-primary w-full mt-4" onClick={() => setStep(4)}>
                    ถัดไป → กรอกรายละเอียด
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}

        {/* Step 4: Details */}
        {step === 4 && (
          <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <div className="card p-6 space-y-5">
              <div className="flex items-center gap-3 mb-2">
                <button onClick={() => setStep(3)} className="btn-outline px-3 py-2">←</button>
                <h2 className="text-xl font-bold text-gray-900">📝 รายละเอียดทริป</h2>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">ชื่อทริป</label>
                <input className="input" placeholder={`ทริป${selectedDest?.country || selectedDest?.province} สุดสนุก!`}
                  value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">วันออกเดินทาง *</label>
                  <input type="date" className="input" value={form.dateStart}
                    onChange={e => setForm({...form, dateStart: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">วันกลับ *</label>
                  <input type="date" className="input" value={form.dateEnd}
                    onChange={e => setForm({...form, dateEnd: e.target.value})} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">งบประมาณต่อคน (บาท) *</label>
                <div className="grid grid-cols-2 gap-4">
                  <input type="number" className="input" placeholder="ขั้นต่ำ เช่น 15000"
                    value={form.budgetMin} onChange={e => setForm({...form, budgetMin: e.target.value})} />
                  <input type="number" className="input" placeholder="สูงสุด เช่น 40000"
                    value={form.budgetMax} onChange={e => setForm({...form, budgetMax: e.target.value})} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  จำนวนสมาชิก: {form.groupSizeMin}-{form.groupSizeMax} คน
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-xs text-gray-500 mb-1 block">ขั้นต่ำ</span>
                    <input type="range" min={2} max={10} value={form.groupSizeMin} className="w-full accent-primary-500"
                      onChange={e => setForm({...form, groupSizeMin: Number(e.target.value)})} />
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 mb-1 block">สูงสุด</span>
                    <input type="range" min={2} max={20} value={form.groupSizeMax} className="w-full accent-primary-500"
                      onChange={e => setForm({...form, groupSizeMax: Number(e.target.value)})} />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">สไตล์การเที่ยว</label>
                <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                  {TRAVEL_STYLES.map(s => (
                    <button key={s.id} onClick={() => toggleStyle(s.id)}
                      className={`flex flex-col items-center gap-1 p-2 rounded-xl border-2 text-xs transition-all ${
                        form.travelStyles.includes(s.id)
                          ? 'border-primary-500 bg-primary-50 text-primary-700'
                          : 'border-gray-200 hover:border-gray-300 text-gray-600'
                      }`}>
                      <span className="text-xl">{s.emoji}</span>
                      <span>{s.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">บอกเพิ่มเติม</label>
                <textarea className="input resize-none" rows={3}
                  placeholder="อยากเที่ยวแบบไหน มีข้อกำหนดอะไรไหม ต้องการเพื่อนแบบไหน..."
                  value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
              </div>

              <div className="flex gap-3">
                <button className="btn-secondary flex-1" onClick={previewPlan}>🗺️ ดูแผนตัวอย่าง</button>
                <button className="btn-primary flex-1" disabled={submitting} onClick={handleSubmit}>
                  {submitting ? '⏳ กำลังสร้าง...' : '✈️ สร้างทริป'}
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 5: Plan Preview */}
        {step === 5 && planPreview && (
          <motion.div key="step5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <div className="card p-6">
              <div className="flex items-center gap-3 mb-4">
                <button onClick={() => setStep(4)} className="btn-outline px-3 py-2">←</button>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">🗺️ {planPreview.title}</h2>
                  <p className="text-gray-500 text-sm">{planPreview.duration} วัน • ~{planPreview.estimatedBudget?.total?.toLocaleString()} บาท/คน</p>
                </div>
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                {planPreview.days?.map(day => (
                  <div key={day.day} className="border border-gray-200 rounded-xl p-4">
                    <h3 className="font-bold text-gray-900 mb-2">{day.title}</h3>
                    <div className="space-y-1.5 text-sm">
                      {day.morning.map((a, i) => (
                        <div key={i} className="flex gap-2 text-gray-700">
                          <span className="text-amber-500">🌅 เช้า</span>
                          <span>{a.emoji} {a.activity}</span>
                        </div>
                      ))}
                      {day.afternoon.map((a, i) => (
                        <div key={i} className="flex gap-2 text-gray-700">
                          <span className="text-blue-500">☀️ บ่าย</span>
                          <span>{a.emoji} {a.activity}</span>
                        </div>
                      ))}
                      <div className="flex gap-2 text-gray-700">
                        <span className="text-purple-500">🌙 เย็น</span>
                        <span>{day.evening[0]?.emoji} {day.evening[0]?.activity}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 p-4 bg-green-50 rounded-xl text-sm text-green-700">
                ✅ แผนนี้เป็นแนวทาง คุณสามารถปรับได้หลังจากสร้างทริป
              </div>

              <button className="btn-primary w-full mt-4" disabled={submitting} onClick={handleSubmit}>
                {submitting ? '⏳ กำลังสร้าง...' : '✈️ สร้างทริปนี้เลย!'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
