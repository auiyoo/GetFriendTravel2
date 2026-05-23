import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const features = [
  { emoji: '🤖', title: 'AI Matching', desc: 'จับคู่อัตโนมัติจากปลายทาง วันที่ และสไตล์', color: 'from-violet-500 to-purple-600' },
  { emoji: '🗺️', title: 'Trip Planner', desc: 'สร้างแผนทริป Day-by-Day อัตโนมัติใน 1 คลิก', color: 'from-pink-500 to-rose-600' },
  { emoji: '✅', title: 'Verified Users', desc: 'ยืนยันตัวตนผ่าน Tel / Facebook / Line', color: 'from-cyan-500 to-blue-600' },
  { emoji: '🧳', title: 'Private Tours', desc: 'จองทัวร์ส่วนตัวกับบริษัทชั้นนำได้เลย', color: 'from-orange-500 to-amber-600' },
]

const destinations = [
  { flag: '🇯🇵', name: 'ญี่ปุ่น', trips: 124 },
  { flag: '🇰🇷', name: 'เกาหลี', trips: 98 },
  { flag: '🇫🇷', name: 'ฝรั่งเศส', trips: 67 },
  { flag: '🏖️', name: 'ภูเก็ต', trips: 215 },
  { flag: '🌿', name: 'เชียงใหม่', trips: 189 },
  { flag: '🇮🇹', name: 'อิตาลี', trips: 54 },
]

const testimonials = [
  { name: 'มิ้น', age: 23, text: 'หาเพื่อนไปญี่ปุ่นได้ใน 2 วัน แมทช์ได้เลย ไม่ต้องโพสต์หาในกลุ่ม 🔥', avatar: '👩' },
  { name: 'เจมส์', age: 27, text: 'แผนทริปที่ระบบสร้างให้ดีมาก ประหยัดเวลาวางแผนได้เยอะมาก ✈️', avatar: '👨' },
  { name: 'นิ้ง', age: 25, text: 'ชอบที่มี verify ตัวตน รู้สึกปลอดภัยกว่าโพสต์ FB ทั่วไปมาก 💜', avatar: '👱‍♀️' },
]

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } }
}

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } }
}

export default function Landing() {
  return (
    <div className="min-h-screen bg-dark-900 overflow-x-hidden">

      {/* ── NAV ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4" style={{ background: 'rgba(7,7,15,0.8)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">✈️</span>
            <span className="font-black text-xl gradient-text">GetFriendTravel</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="btn-ghost text-sm px-5 py-2">เข้าสู่ระบบ</Link>
            <Link to="/register" className="btn-primary px-5 py-2 text-sm">เริ่มต้นฟรี 🚀</Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-20">
        {/* BG Orbs */}
        <div className="bg-orb w-96 h-96 top-10 -left-20 opacity-30" style={{ background: 'radial-gradient(circle, #7C3AED, transparent)' }} />
        <div className="bg-orb w-80 h-80 top-40 -right-10 opacity-20" style={{ background: 'radial-gradient(circle, #EC4899, transparent)' }} />
        <div className="bg-orb w-64 h-64 bottom-20 left-1/2 opacity-15" style={{ background: 'radial-gradient(circle, #06B6D4, transparent)' }} />

        <motion.div
          initial="hidden" animate="show" variants={stagger}
          className="relative z-10 max-w-4xl mx-auto"
        >
          <motion.div variants={fadeUp}>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-8"
              style={{ background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.3)', color: '#C4B5FD' }}>
              ✨ ระบบหาเพื่อนเที่ยวอัจฉริยะ — Free Forever
            </span>
          </motion.div>

          <motion.h1 variants={fadeUp} className="text-5xl md:text-7xl font-black leading-tight mb-6">
            <span className="text-white">หาเพื่อนเที่ยว</span><br />
            <span className="gradient-text">ที่ใช่ สำหรับคุณ</span>
          </motion.h1>

          <motion.p variants={fadeUp} className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto mb-10 leading-relaxed">
            บอก destination งบ และสไตล์ของคุณ — ระบบ AI จะจับคู่เพื่อนร่วมทาง
            วางแผนทริป และเชื่อมต่อทัวร์ให้ครบในที่เดียว 🌍
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register"
              className="btn-primary px-8 py-4 text-lg rounded-2xl inline-flex items-center gap-2 justify-center">
              🚀 เริ่มหาเพื่อนเที่ยว
            </Link>
            <Link to="/login"
              className="btn-secondary px-8 py-4 text-lg rounded-2xl inline-flex items-center gap-2 justify-center">
              🔑 เข้าสู่ระบบ
            </Link>
          </motion.div>

          {/* Stats Row */}
          <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-8 mt-16 pt-8"
            style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            {[
              { v: '10K+', l: 'นักเดินทาง' },
              { v: '50+', l: 'ประเทศ' },
              { v: '2.5K+', l: 'ทริปสำเร็จ' },
              { v: '98%', l: 'ความพึงพอใจ' },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <div className="text-2xl font-black gradient-text">{s.v}</div>
                <div className="text-white/40 text-sm mt-0.5">{s.l}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/30 text-2xl">
          ↓
        </motion.div>
      </section>

      {/* ── DESTINATIONS ── */}
      <section className="py-24 px-6 relative">
        <div className="max-w-5xl mx-auto">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}>
            <motion.div variants={fadeUp} className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-black text-white mb-3">
                🔥 <span className="gradient-text">Hot Destinations</span>
              </h2>
              <p className="text-white/40">ปลายทางยอดนิยมในตอนนี้</p>
            </motion.div>
            <motion.div variants={stagger} className="grid grid-cols-3 md:grid-cols-6 gap-4">
              {destinations.map((d, i) => (
                <motion.div key={i} variants={fadeUp} whileHover={{ scale: 1.05, y: -4 }}
                  className="card p-4 text-center cursor-pointer group">
                  <div className="text-4xl mb-2">{d.flag}</div>
                  <div className="text-white font-bold text-sm">{d.name}</div>
                  <div className="text-white/40 text-xs mt-1">{d.trips} ทริป</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}>
            <motion.div variants={fadeUp} className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-black text-white mb-3">
                ทำไมต้อง <span className="gradient-text">GetFriendTravel?</span>
              </h2>
              <p className="text-white/40">ครบจบในแอปเดียว ตั้งแต่หาเพื่อน ถึงขึ้นเครื่อง</p>
            </motion.div>
            <motion.div variants={stagger} className="grid md:grid-cols-2 gap-5">
              {features.map((f, i) => (
                <motion.div key={i} variants={fadeUp} whileHover={{ scale: 1.02 }}
                  className="card p-6 flex items-start gap-5 group">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center text-2xl flex-shrink-0 shadow-lg`}>
                    {f.emoji}
                  </div>
                  <div>
                    <h3 className="font-black text-lg text-white mb-1.5">{f.title}</h3>
                    <p className="text-white/50 text-sm leading-relaxed">{f.desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}>
            <motion.div variants={fadeUp} className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-black text-white mb-3">
                เริ่มได้ใน <span className="gradient-text">4 ขั้นตอน</span>
              </h2>
            </motion.div>
            <div className="space-y-6">
              {[
                { n: '01', emoji: '📝', title: 'สร้างโปรไฟล์', desc: 'สมัครฟรี ยืนยันตัวตนผ่าน Tel/FB/Line', color: '#8B5CF6' },
                { n: '02', emoji: '🗺️', title: 'บอกความต้องการ', desc: 'เลือกปลายทาง วันที่ งบ สไตล์ — ระบบแนะนำสถานที่ให้เลย', color: '#EC4899' },
                { n: '03', emoji: '👥', title: 'แมทช์เพื่อนร่วมทริป', desc: 'AI จับคู่คนที่เข้ากัน กดจอยหรือรับคนเข้ากลุ่มได้เลย', color: '#06B6D4' },
                { n: '04', emoji: '🏖️', title: 'รับแผนและออกเดินทาง', desc: 'แผนทริปอัตโนมัติ + จอง Private Tour กับบ.ทัวร์พาร์ทเนอร์', color: '#F97316' },
              ].map((item, i) => (
                <motion.div key={i} variants={fadeUp}
                  className="card p-5 flex items-center gap-5 group hover:scale-[1.01] transition-transform">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg flex-shrink-0"
                    style={{ background: `${item.color}22`, color: item.color, border: `1px solid ${item.color}44` }}>
                    {item.n}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-black text-white">{item.emoji} {item.title}</h3>
                    <p className="text-white/40 text-sm mt-1">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}>
            <motion.div variants={fadeUp} className="text-center mb-12">
              <h2 className="text-3xl font-black text-white mb-2">💬 คนที่ใช้แล้วบอกว่า...</h2>
            </motion.div>
            <motion.div variants={stagger} className="grid md:grid-cols-3 gap-5">
              {testimonials.map((t, i) => (
                <motion.div key={i} variants={fadeUp} className="card-gradient p-6">
                  <p className="text-white/80 text-sm leading-relaxed mb-5">"{t.text}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
                      style={{ background: 'rgba(139,92,246,0.2)' }}>
                      {t.avatar}
                    </div>
                    <div>
                      <div className="text-white font-bold text-sm">{t.name}</div>
                      <div className="text-white/40 text-xs">อายุ {t.age} ปี</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}>
            <motion.div variants={fadeUp}
              className="rounded-3xl p-12 relative overflow-hidden"
              style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.3), rgba(236,72,153,0.3))', border: '1px solid rgba(139,92,246,0.3)' }}>
              <div className="bg-orb w-60 h-60 -top-10 -right-10 opacity-30" style={{ background: 'radial-gradient(circle, #7C3AED, transparent)' }} />
              <div className="relative z-10">
                <div className="text-6xl mb-4">🌍</div>
                <h2 className="text-3xl font-black text-white mb-3">พร้อมออกเดินทางแล้วหรือยัง?</h2>
                <p className="text-white/50 mb-8">สมัครฟรี ไม่มีค่าใช้จ่าย เริ่มได้เลยวันนี้</p>
                <Link to="/register" className="btn-primary px-10 py-4 text-lg inline-flex items-center gap-2">
                  ✈️ สมัครสมาชิกฟรี
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="py-8 text-center" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <p className="text-white/20 text-sm">© 2024 GetFriendTravel · Made with 💜 for Thai Travelers</p>
      </footer>
    </div>
  )
}
