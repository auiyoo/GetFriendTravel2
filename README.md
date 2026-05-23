# ✈️ GetFriendTravel - ระบบหาเพื่อนเที่ยว

> แพลตฟอร์ม Full-Stack สำหรับหาเพื่อนร่วมเดินทาง ระบบ Matching อัจฉริยะ วางแผนทริปอัตโนมัติ และเชื่อมต่อบริษัททัวร์

## 🚀 Features

| Feature | รายละเอียด |
|---------|-----------|
| 🔐 ยืนยันตัวตน | ยืนยันเบอร์โทร, Facebook, Line ID |
| 🌍 ค้นหาปลายทาง | 12 ประเทศ + 11 จังหวัดไทย พร้อมข้อมูลสถานที่ |
| 🤖 Smart Suggestions | เลือกประเทศ/จังหวัด → แนะนำสถานที่น่าสนใจทันที |
| 💡 AI Matching | จับคู่คนที่ไปจุดเดียวกัน ช่วงเวลาเดียวกัน งบใกล้เคียง |
| 👥 Group System | ขอเข้าร่วม รับ/ปฏิเสธ จัดกลุ่ม |
| 🗺️ Trip Plan | สร้างแผนการเดินทาง Day-by-Day อัตโนมัติ |
| 🧳 Tour Company | เชื่อมต่อ 5 บริษัททัวร์พาร์ทเนอร์ จอง Private Tour |
| 📱 Responsive | รองรับมือถือและเดสก์ท็อป |

## 🛠️ Tech Stack

```
Frontend:  React 18 + Vite + TailwindCSS + Framer Motion
Backend:   Node.js + Express + Socket.io
Database:  MongoDB + Mongoose
Auth:      JWT Token
State:     Zustand
```

## 📁 Project Structure

```
GetFriendTravel/
├── backend/
│   ├── server.js
│   ├── src/
│   │   ├── config/db.js
│   │   ├── models/            # User, TripRequest, Match, TourCompany
│   │   ├── routes/            # auth, users, trips, matches, destinations, plans, tours
│   │   ├── services/          # matchingService, planGenerator
│   │   └── data/              # destinations.js, seed.js
│   └── package.json
└── frontend/
    ├── src/
    │   ├── pages/             # Landing, Login, Register, Dashboard, CreateTrip, Discover...
    │   ├── components/        # Navbar
    │   ├── store/             # authStore (Zustand)
    │   └── services/          # api.js (Axios)
    └── package.json
```

## ⚡ Quick Start

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
# แก้ MONGODB_URI ใน .env
npm run dev
```

### 2. Seed Data

```bash
npm run seed
```

Demo: `somchai@demo.com` / `malee@demo.com` / `keerati@demo.com` (รหัส: password123)

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

เปิด http://localhost:5173

## 📊 Matching Algorithm

คะแนน Compatibility (100 คะแนน): ปลายทาง 40 + วันที่ทับซ้อน 30 + งบประมาณ 20 + สไตล์ 10

## 🌍 ปลายทางที่รองรับ

**ต่างประเทศ:** 🇯🇵🇰🇷🇫🇷🇮🇹🇸🇬🇻🇳🇲🇻🇨🇭🇦🇺🇺🇸🇹🇷🇦🇪 (12 ประเทศ)

**ในประเทศ:** กรุงเทพฯ เชียงใหม่ ภูเก็ต กระบี่ เกาะสมุย ปาย เชียงราย กาญจนบุรี พัทยา หัวหิน อยุธยา

---
Made with ❤️ for Thai Travelers

---

## โครงสร้างโปรเจกต์

```
it-dashboard/
├── server.js                   ← Node.js backend (Express + Socket.io)
├── config.js                   ← Configuration loader
├── serve.ps1                   ← PowerShell static server (ไม่ต้องติดตั้งอะไร)
├── .env.example                ← Template สำหรับตั้งค่า
├── services/
│   ├── mock-data.js            ← Mock data generator
│   └── splunk.js               ← Splunk REST API client + SPL queries
├── routes/
│   └── api.js                  ← REST API endpoints
└── public/
    ├── index.html
    ├── css/style.css
    ├── js/dashboard.js
    └── vendor/                 ← Local JS bundles (offline)
```

---

## วิธีใช้งาน

### Option 1 — Static Mode (ไม่ต้องติดตั้งอะไร)

เปิด PowerShell แล้วรัน:

```powershell
cd C:\Users\tirawut.w\Desktop\Cluade\it-dashboard
powershell -ExecutionPolicy Bypass -File serve.ps1
```

เปิด browser ไปที่ → **http://localhost:5500**

Dashboard จะแสดง Mock Data ที่ simulate real-time update ทุก 60 วินาที

---

### Option 2 — Node.js Backend (Full Feature)

1. ติดตั้ง [Node.js](https://nodejs.org/) (LTS version)

2. ติดตั้ง dependencies:
```bash
cd it-dashboard
npm install
```

3. คัดลอก environment file:
```bash
copy .env.example .env
```

4. รัน server:
```bash
npm start
# หรือ dev mode (auto-restart)
npm run dev
```

เปิด browser ไปที่ → **http://localhost:3000**

---

### Option 3 — Node.js + Splunk Integration

1. ทำตาม Option 2 ข้างบนก่อน

2. แก้ไขไฟล์ `.env`:

```env
# Splunk Connection
SPLUNK_HOST=your-splunk.company.com
SPLUNK_PORT=8089
SPLUNK_USERNAME=admin
SPLUNK_PASSWORD=your-password

# หรือใช้ Bearer Token แทน
SPLUNK_TOKEN=your-splunk-token

# หากติดตั้ง Splunk ITSI
SPLUNK_ITSI=true
```

3. รัน server — Dashboard จะดึงข้อมูลจาก Splunk โดยอัตโนมัติ  
   หากเชื่อมต่อ Splunk ไม่ได้ จะ fallback เป็น Mock Data

---

## API Endpoints (Node.js backend)

| Endpoint                   | คำอธิบาย                        |
|---------------------------|----------------------------------|
| `GET /api/snapshot`        | ข้อมูลทุก panel ในครั้งเดียว    |
| `GET /api/health-score`    | Overall Health Score             |
| `GET /api/health-by-domain`| Health แยกตาม Domain            |
| `GET /api/alerts`          | Top Alerts                       |
| `GET /api/system-status`   | สถานะระบบรวม                    |
| `GET /api/health-trend`    | Health Trend (time series)       |
| `GET /api/applications`    | Application Health list          |
| `GET /api/infrastructure-health` | Infrastructure Health      |
| `GET /api/alert-distribution` | Alert Distribution (Critical/High/Medium) |
| `GET /api/alerts-over-time`| Alerts time series               |
| `GET /api/top-problems`    | Top Problem Areas                |
| `GET /api/status`          | Server health check              |

---

## Splunk SPL Queries (ตัวอย่าง)

หากต้องการปรับ Query ให้ตรงกับ index ของ Splunk คุณ แก้ที่ `services/splunk.js`

**Standard Splunk (ไม่มี ITSI):**
```spl
index=main sourcetype=app_health earliest=-5m
| stats avg(score) as score by app
| eval status=case(score>=90,"Good",score>=70,"Warning",true(),"Critical")
```

**Splunk ITSI:**
```spl
index=itsi_summary earliest=-5m
| stats avg(health_score) as score by domain
```

**Alerts:**
```spl
index=notable earliest=-15m
| head 10
| table _time, urgency, rule_title, orig_host
```

---

## Real-time Updates

- **Static mode**: Client-side mock data refresh ทุก 60 วินาที
- **Node.js mode**: WebSocket (Socket.io) push จาก server ทุก 60 วินาที
- **Splunk mode**: Server query Splunk ทุก 60 วินาที แล้ว push ผ่าน WebSocket

---

## Dashboard Panels

| Panel                | ข้อมูล                                              |
|---------------------|------------------------------------------------------|
| Overall Health Score | คะแนนรวมขององค์กร 0-100                            |
| Health by Domain    | Applications, Infrastructure, Network, Security, DB  |
| Top Alerts          | Critical / High / Medium alerts ล่าสุด              |
| System Status       | จำนวน Healthy / Warning / Critical ระบบ            |
| Infrastructure Map  | Flow diagram: Users → Firewall → Services → DB      |
| Health Trend        | กราฟ Health Score ย้อนหลัง 1 ชั่วโมง               |
| Applications Health | Health Score แต่ละ Application                      |
| Infrastructure Health| Health Score แต่ละ Component                       |
| Alert Distribution  | สัดส่วน Critical / High / Medium                   |
| Alerts Over Time    | จำนวน Alert เป็น stacked area chart                 |
| Top Problem Areas   | ระบบที่มีปัญหามากสุด พร้อม metric                   |
