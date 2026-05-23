require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const mongoose = require('mongoose');
const User = require('../models/User');
const TripRequest = require('../models/TripRequest');
const TourCompany = require('../models/TourCompany');

const connectDB = async () => {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/getfriendtravel');
  console.log('Connected to MongoDB');
};

const tourCompanies = [
  {
    name: 'วันดีทัวร์ & ทราเวล',
    nameEn: 'WanDee Tour & Travel',
    logo: '🧳',
    description: 'ผู้เชี่ยวชาญทัวร์ญี่ปุ่น เกาหลี และเอเชีย ประสบการณ์กว่า 15 ปี',
    website: 'https://wandeetour.com',
    phone: '02-123-4567',
    email: 'info@wandeetour.com',
    lineId: '@wandeetour',
    destinations: ['ญี่ปุ่น', 'เกาหลีใต้', 'สิงคโปร์', 'เวียดนาม', 'ไต้หวัน'],
    tripTypes: ['international'],
    styles: ['culture', 'food', 'shopping'],
    minGroupSize: 4,
    maxGroupSize: 20,
    priceRange: { min: 25000, max: 65000, currency: 'THB' },
    rating: 4.8,
    reviewCount: 342,
    verified: true,
    highlights: ['Free Day มากกว่าคู่แข่ง', 'ไกด์พูดไทย', 'รวมตั๋วเครื่องบิน', 'โรงแรม 4 ดาว']
  },
  {
    name: 'สยามเอ็กซ์พลอเรอร์',
    nameEn: 'Siam Explorer',
    logo: '🌏',
    description: 'ทัวร์ยุโรป อเมริกา ออสเตรเลีย สำหรับกลุ่มเล็ก Private Group',
    website: 'https://siamexplorer.co.th',
    phone: '02-987-6543',
    email: 'trip@siamexplorer.co.th',
    lineId: '@siamexplorer',
    destinations: ['ฝรั่งเศส', 'อิตาลี', 'สวิตเซอร์แลนด์', 'สหรัฐอเมริกา', 'ออสเตรเลีย'],
    tripTypes: ['international'],
    styles: ['luxury', 'culture', 'adventure'],
    minGroupSize: 2,
    maxGroupSize: 12,
    priceRange: { min: 60000, max: 200000, currency: 'THB' },
    rating: 4.9,
    reviewCount: 178,
    verified: true,
    highlights: ['Private Tour เฉพาะกลุ่ม', 'Customize ได้ 100%', 'มัคคุเทศก์ส่วนตัว', 'Business Class Option']
  },
  {
    name: 'ไทยแลนด์ทริปส์',
    nameEn: 'Thailand Trips',
    logo: '🇹🇭',
    description: 'ผู้เชี่ยวชาญทริปในประเทศไทย ทุกจังหวัด ทุกสไตล์',
    website: 'https://thailandtrips.com',
    phone: '02-456-7890',
    email: 'hello@thailandtrips.com',
    lineId: '@thailandtrips',
    destinations: ['เชียงใหม่', 'ภูเก็ต', 'กระบี่', 'เกาะสมุย', 'ปาย', 'กรุงเทพมหานคร'],
    tripTypes: ['domestic'],
    styles: ['adventure', 'beach', 'culture', 'food'],
    minGroupSize: 2,
    maxGroupSize: 15,
    priceRange: { min: 3000, max: 25000, currency: 'THB' },
    rating: 4.7,
    reviewCount: 523,
    verified: true,
    highlights: ['รถรับ-ส่ง', 'Boutique Hotel', 'Local Experience', 'Community-based Tourism']
  },
  {
    name: 'ลักซ์ เดสติเนชั่น',
    nameEn: 'Luxe Destination',
    logo: '💎',
    description: 'Luxury Private Tour ระดับ 5 ดาว มัลดีฟส์ ดูไบ ยุโรป เฉพาะกลุ่ม VIP',
    website: 'https://luxedestination.com',
    phone: '02-111-9999',
    email: 'vip@luxedestination.com',
    lineId: '@luxevip',
    destinations: ['มัลดีฟส์', 'สหรัฐอาหรับเอมิเรตส์', 'ฝรั่งเศส', 'อิตาลี', 'สวิตเซอร์แลนด์'],
    tripTypes: ['international'],
    styles: ['luxury', 'romance', 'beach'],
    minGroupSize: 2,
    maxGroupSize: 6,
    priceRange: { min: 100000, max: 500000, currency: 'THB' },
    rating: 5.0,
    reviewCount: 89,
    verified: true,
    highlights: ['Private Jet Option', 'Butler Service', 'Michelin Star Dining', 'Secret Location']
  },
  {
    name: 'แบ็คแพ็ค ไทย',
    nameEn: 'Backpack Thai',
    logo: '🎒',
    description: 'ทริปแบ็คแพ็คเกอร์ งบน้อย ผจญภัยสูง ทั้งในและต่างประเทศ',
    website: 'https://backpackthai.com',
    phone: '081-234-5678',
    email: 'adventure@backpackthai.com',
    lineId: '@backpackthai',
    destinations: ['เวียดนาม', 'กัมพูชา', 'ลาว', 'เชียงใหม่', 'ปาย', 'กระบี่'],
    tripTypes: ['international', 'domestic'],
    styles: ['adventure', 'budget', 'culture'],
    minGroupSize: 3,
    maxGroupSize: 15,
    priceRange: { min: 2000, max: 15000, currency: 'THB' },
    rating: 4.6,
    reviewCount: 741,
    verified: true,
    highlights: ['ราคาถูกสุด', 'นัดรวมกลุ่มได้', 'Hostel Network', 'Flexible Schedule']
  }
];

const mockUsers = [
  {
    name: 'นายสมชาย ใจดี',
    email: 'somchai@demo.com',
    password: 'password123',
    age: 28,
    gender: 'male',
    bio: 'ชอบเที่ยวธรรมชาติ ถ่ายรูป และลองอาหารท้องถิ่น',
    travelStyles: ['nature', 'food', 'culture'],
    phone: { number: '081-234-5678', verified: true },
    line: { id: 'somchai_line', verified: true }
  },
  {
    name: 'น.ส. มาลี สวยงาม',
    email: 'malee@demo.com',
    password: 'password123',
    age: 25,
    gender: 'female',
    bio: 'ชอบเที่ยวทะเล ดำน้ำ และ luxury travel',
    travelStyles: ['beach', 'luxury', 'shopping'],
    phone: { number: '089-876-5432', verified: true },
    facebook: { url: 'facebook.com/malee', verified: true }
  },
  {
    name: 'นายกีรติ นักเดินทาง',
    email: 'keerati@demo.com',
    password: 'password123',
    age: 32,
    gender: 'male',
    bio: 'นักผจญภัยตัวยง ชอบปีนเขา เดินป่า และ backpacking',
    travelStyles: ['adventure', 'budget', 'nature'],
    phone: { number: '085-555-1234', verified: false },
    line: { id: 'keerati_bp', verified: true }
  }
];

const seed = async () => {
  try {
    await connectDB();

    // Clear existing data
    await TourCompany.deleteMany({});
    await TripRequest.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Seed tour companies
    await TourCompany.insertMany(tourCompanies);
    console.log('✅ Seeded tour companies');

    // Seed demo users (only if not exist)
    for (const userData of mockUsers) {
      const exists = await User.findOne({ email: userData.email });
      if (!exists) {
        await User.create(userData);
        console.log(`✅ Created user: ${userData.name}`);
      }
    }

    // Seed demo trips
    const users = await User.find({ email: { $in: mockUsers.map(u => u.email) } });
    if (users.length >= 2) {
      await TripRequest.create([
        {
          creator: users[0]._id,
          tripType: 'international',
          destination: { country: 'ญี่ปุ่น', countryCode: 'JP', city: 'โตเกียว', flag: '🇯🇵' },
          dateRange: { start: new Date('2024-12-20'), end: new Date('2024-12-27') },
          budget: { min: 35000, max: 60000, currency: 'THB' },
          travelStyles: ['culture', 'food', 'shopping'],
          groupSize: { min: 2, max: 5 },
          selectedAttractions: ['วัดเซ็นโซจิ อาซาคุสะ', 'ชิบุย่า ครอสซิ่ง'],
          description: 'อยากไปเที่ยวญี่ปุ่นช่วงคริสต์มาส หาเพื่อนร่วมทริปสักคน',
          title: 'ญี่ปุ่น Christmas Trip 🎄'
        },
        {
          creator: users[1]._id,
          tripType: 'domestic',
          destination: { country: 'ภูเก็ต', province: 'ภูเก็ต' },
          dateRange: { start: new Date('2024-11-15'), end: new Date('2024-11-18') },
          budget: { min: 8000, max: 20000, currency: 'THB' },
          travelStyles: ['beach', 'nightlife', 'food'],
          groupSize: { min: 3, max: 8 },
          selectedAttractions: ['หาดป่าตอง', 'เกาะพีพี'],
          description: 'ทริปทะเล 3 คืน หาเพื่อนมาซิ่งด้วยกัน',
          title: 'ภูเก็ต ทะเล ปาร์ตี้ 🏖️'
        }
      ]);
      console.log('✅ Seeded demo trips');
    }

    console.log('\n🎉 Seed completed! Demo accounts:');
    console.log('  somchai@demo.com / password123');
    console.log('  malee@demo.com / password123');
    console.log('  keerati@demo.com / password123');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err);
    process.exit(1);
  }
};

seed();
