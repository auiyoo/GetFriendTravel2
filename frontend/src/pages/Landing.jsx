import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const features = [
  { emoji: '🔍', title: 'ค้นหาเพื่อนร่วมทริป', desc: 'ระบบ Matching อัจฉริยะจับคู่คนที่ไปจุดเดียวกัน ช่วงเวลาเดียวกัน งบเดียวกัน' },
  { emoji: '🗺️', title: 'วางแผนทริปอัตโนมัติ', desc: 'เลือกปลายทาง ระบบจะแนะนำสถานที่น่าสนใจ และสร้างแผนการเดินทางให้ทันที' },
  { emoji: '🧳', title: 'บริษัททัวร์พาร์ทเนอร์', desc: 'เชื่อมต่อกับบริษัททัวร์ชั้นนำ จัดทริป Private Tour เฉพาะกลุ่มของคุณ' },
  { emoji: '✅', title: 'ยืนยันตัวตนได้', desc: 'Verify เบอร์โทร, Facebook, Line เพื่อความปลอดภัยและน่าเชื่อถือ' }
]

const stats = [
  { label: 'นักเดินทาง', value: '10,000+', emoji: '👥' },
  { label: 'ทริปสำเร็จ', value: '2,500+', emoji: '✈️' },
  { label: 'ประเทศ', value: '50+', emoji: '🌍' },
  { label: 'บ.ทัวร์พาร์ทเนอร์', value: '30+', emoji: '🏢' }
]

export default function Landing() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="gradient-bg min-h-[90vh] flex flex-col">
        {/* Top Nav */}
        <nav className="flex justify-between items-center px-6 md:px-16 py-5">
          <div className="flex items-center gap-2">
            <span className="text-3xl">✈️</span>
            <span className="text-white font-extrabold text-xl">GetFriendTravel</span>
          </div>
          <div className="flex gap-3">
            <Link to="/login" className="text-white/90 font-medium px-5 py-2 rounded-xl hover:bg-white/10 transition-all">
              เข้าสู่ระบบ
            </Link>
            <Link to="/register" className="bg-white text-primary-700 font-bold px-5 py-2 rounded-xl hover:shadow-lg transition-all">
              สมัครฟรี
            </Link>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="flex-1 flex flex-col items-center justify-center text-center px-6 py-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block bg-white/20 text-white px-4 py-1.5 rounded-full text-sm font-medium mb-6">
              🌟 ระบบหาเพื่อนเที่ยวอัจฉริยะ
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-6">
              หาเพื่อนร่วมทริป<br />
              <span className="text-yellow-300">ที่ใช่ สำหรับคุณ</span>
            </h1>
            <p className="text-white/85 text-lg md:text-xl max-w-2xl mx-auto mb-10">
              บอกความต้องการ ระบบจะจับคู่เพื่อนร่วมเดินทาง วางแผนทริป และเชื่อมต่อบริษัททัวร์ให้ครบในที่เดียว
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register" className="bg-white text-primary-700 font-bold px-8 py-4 rounded-2xl text-lg hover:shadow-xl transition-all">
                🚀 เริ่มหาเพื่อนเที่ยว
              </Link>
              <Link to="/login" className="border-2 border-white text-white font-bold px-8 py-4 rounded-2xl text-lg hover:bg-white/10 transition-all">
                🔑 เข้าสู่ระบบ
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Stats */}
        <div className="bg-white/10 backdrop-blur-sm py-8">
          <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 px-6">
            {stats.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl mb-1">{s.emoji}</div>
                <div className="text-white font-extrabold text-2xl">{s.value}</div>
                <div className="text-white/70 text-sm">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-extrabold text-center text-gray-900 mb-4">
            ทำไมต้อง GetFriendTravel?
          </h2>
          <p className="text-gray-500 text-center mb-16 text-lg">ครบในที่เดียว ตั้งแต่หาเพื่อน ถึงขึ้นเครื่อง</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="card p-6 text-center hover:border-primary-200 hover:-translate-y-1 transition-all"
              >
                <div className="text-5xl mb-4">{f.emoji}</div>
                <h3 className="font-bold text-lg text-gray-900 mb-3">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* How it works */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-extrabold text-center mb-16 text-gray-900">ใช้งานง่ายใน 4 ขั้นตอน</h2>
          <div className="space-y-8">
            {[
              { step: '1', emoji: '📝', title: 'สร้างโปรไฟล์ & ยืนยันตัวตน', desc: 'กรอกข้อมูลส่วนตัว ยืนยันเบอร์โทร Facebook หรือ Line เพื่อความน่าเชื่อถือ' },
              { step: '2', emoji: '🗺️', title: 'บอกปลายทางและความต้องการ', desc: 'เลือกประเทศหรือจังหวัด กรอกวันที่ งบประมาณ และสไตล์การท่องเที่ยว ระบบจะแนะนำสถานที่ให้เลย' },
              { step: '3', emoji: '👥', title: 'จับคู่และเลือกเพื่อนร่วมทริป', desc: 'ระบบ AI Matching หาคนที่เข้ากันได้ คลิกจอยทริป หรือรับ-ปฏิเสธคำขอ' },
              { step: '4', emoji: '🏖️', title: 'รับแผนทริปและจองทัวร์', desc: 'รับแผนการเดินทางอัตโนมัติ หรือเชื่อมต่อบริษัททัวร์ให้จัดเป็น Private Tour' }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex gap-6 items-start"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-2xl gradient-bg flex items-center justify-center text-white font-extrabold text-lg shadow-lg">
                  {item.step}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-xl text-gray-900 mb-2">{item.emoji} {item.title}</h3>
                  <p className="text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="gradient-bg py-20 text-center">
        <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-6">พร้อมเริ่มหาเพื่อนเที่ยวแล้วหรือยัง?</h2>
        <p className="text-white/80 text-lg mb-10">สมัครฟรี ไม่มีค่าใช้จ่าย เริ่มได้เลยวันนี้</p>
        <Link to="/register" className="bg-white text-primary-700 font-extrabold px-10 py-4 rounded-2xl text-xl hover:shadow-2xl transition-all inline-block">
          ✈️ สมัครสมาชิกฟรี
        </Link>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8 text-center">
        <p className="text-sm">© 2024 GetFriendTravel. สร้างด้วย ❤️ เพื่อนักเดินทางชาวไทย</p>
      </footer>
    </div>
  )
}
