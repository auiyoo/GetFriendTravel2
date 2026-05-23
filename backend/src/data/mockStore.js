/**
 * In-Memory Mock Store
 * ใช้เมื่อ MongoDB ไม่พร้อมใช้งาน (demo / Railway without MONGODB_URI)
 * ข้อมูลจะอยู่ใน RAM ตลอด process — reset เมื่อ restart
 */
const bcrypt = require('bcryptjs');

let _initialized = false;

// ─── ID generator ───────────────────────────────────────────────
let _seq = 1;
const genId = () => `mock_${Date.now()}_${_seq++}`;

// ─── Helpers ────────────────────────────────────────────────────
const toPublicUser = (u) => {
  const { password, ...pub } = u;
  return pub;
};

// ─── Stores ─────────────────────────────────────────────────────
const store = {
  users: [],
  trips: [],
  matches: [],
  tourCompanies: [],
};

// ─── Seed Data ──────────────────────────────────────────────────
const init = async () => {
  if (_initialized) return;
  _initialized = true;

  const hash = await bcrypt.hash('password123', 10);

  // ── Users ──────────────────────────────────────────────────────
  store.users = [
    {
      _id: 'mock_user_1',
      name: 'นายสมชาย ใจดี',
      email: 'somchai@demo.com',
      password: hash,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=somchai',
      age: 28,
      gender: 'male',
      bio: 'ชอบเที่ยวธรรมชาติ ถ่ายรูป และลองอาหารท้องถิ่น',
      travelStyles: ['nature', 'food', 'culture'],
      phone: { number: '081-234-5678', verified: true },
      facebook: { url: '', verified: false },
      line: { id: 'somchai_line', verified: true },
      preferredBudget: { min: 5000, max: 50000 },
      tripsCompleted: 5,
      rating: 4.8,
      reviewCount: 12,
      isPublic: true,
      isActive: true,
      createdAt: new Date('2024-01-15'),
    },
    {
      _id: 'mock_user_2',
      name: 'น.ส. มาลี สวยงาม',
      email: 'malee@demo.com',
      password: hash,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=malee',
      age: 25,
      gender: 'female',
      bio: 'ชอบเที่ยวทะเล ดำน้ำ และ luxury travel',
      travelStyles: ['beach', 'luxury', 'shopping'],
      phone: { number: '089-876-5432', verified: true },
      facebook: { url: 'facebook.com/malee', verified: true },
      line: { id: '', verified: false },
      preferredBudget: { min: 10000, max: 80000 },
      tripsCompleted: 8,
      rating: 4.9,
      reviewCount: 21,
      isPublic: true,
      isActive: true,
      createdAt: new Date('2024-02-10'),
    },
    {
      _id: 'mock_user_3',
      name: 'นายกีรติ นักเดินทาง',
      email: 'keerati@demo.com',
      password: hash,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=keerati',
      age: 32,
      gender: 'male',
      bio: 'นักผจญภัยตัวยง ชอบปีนเขา เดินป่า และ backpacking',
      travelStyles: ['adventure', 'budget', 'nature'],
      phone: { number: '085-555-1234', verified: false },
      facebook: { url: '', verified: false },
      line: { id: 'keerati_bp', verified: true },
      preferredBudget: { min: 2000, max: 20000 },
      tripsCompleted: 14,
      rating: 4.7,
      reviewCount: 33,
      isPublic: true,
      isActive: true,
      createdAt: new Date('2023-11-05'),
    },
    {
      _id: 'mock_user_4',
      name: 'น.ส. นภา ท่องโลก',
      email: 'napa@demo.com',
      password: hash,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=napa',
      age: 23,
      gender: 'female',
      bio: 'Gen Z นักเดินทาง ชอบถ่าย Reels ลอง Street Food',
      travelStyles: ['food', 'culture', 'shopping', 'nightlife'],
      phone: { number: '090-111-2222', verified: true },
      facebook: { url: 'facebook.com/napa', verified: false },
      line: { id: 'napa_travel', verified: true },
      preferredBudget: { min: 5000, max: 30000 },
      tripsCompleted: 3,
      rating: 4.5,
      reviewCount: 7,
      isPublic: true,
      isActive: true,
      createdAt: new Date('2024-03-20'),
    },
    {
      _id: 'mock_user_5',
      name: 'นายพงศ์ แบ็คแพ็ค',
      email: 'pong@demo.com',
      password: hash,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=pong',
      age: 30,
      gender: 'male',
      bio: 'ชอบเดินทาง Solo แต่บางทีอยากมีเพื่อนร่วมทาง',
      travelStyles: ['adventure', 'culture', 'budget'],
      phone: { number: '091-333-4444', verified: true },
      facebook: { url: '', verified: false },
      line: { id: 'pong_backpack', verified: true },
      preferredBudget: { min: 3000, max: 25000 },
      tripsCompleted: 10,
      rating: 4.6,
      reviewCount: 18,
      isPublic: true,
      isActive: true,
      createdAt: new Date('2024-01-01'),
    },
  ];

  // ── Tour Companies ─────────────────────────────────────────────
  store.tourCompanies = [
    {
      _id: 'mock_tour_1',
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
      isActive: true,
      highlights: ['Free Day มากกว่าคู่แข่ง', 'ไกด์พูดไทย', 'รวมตั๋วเครื่องบิน', 'โรงแรม 4 ดาว'],
    },
    {
      _id: 'mock_tour_2',
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
      isActive: true,
      highlights: ['Private Tour เฉพาะกลุ่ม', 'Customize ได้ 100%', 'มัคคุเทศก์ส่วนตัว', 'Business Class Option'],
    },
    {
      _id: 'mock_tour_3',
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
      isActive: true,
      highlights: ['รถรับ-ส่ง', 'Boutique Hotel', 'Local Experience', 'Community-based Tourism'],
    },
    {
      _id: 'mock_tour_4',
      name: 'ลักซ์ เดสติเนชั่น',
      nameEn: 'Luxe Destination',
      logo: '💎',
      description: 'Luxury Private Tour ระดับ 5 ดาว มัลดีฟส์ ดูไบ ยุโรป เฉพาะกลุ่ม VIP',
      website: 'https://luxedestination.com',
      phone: '02-111-9999',
      email: 'vip@luxedestination.com',
      lineId: '@luxevip',
      destinations: ['มัลดีฟส์', 'สหรัฐอาหรับเอมิเรตส์', 'ฝรั่งเศส', 'อิตาลี'],
      tripTypes: ['international'],
      styles: ['luxury', 'romance', 'beach'],
      minGroupSize: 2,
      maxGroupSize: 6,
      priceRange: { min: 100000, max: 500000, currency: 'THB' },
      rating: 5.0,
      reviewCount: 89,
      verified: true,
      isActive: true,
      highlights: ['Private Jet Option', 'Butler Service', 'Michelin Star Dining', 'Secret Location'],
    },
    {
      _id: 'mock_tour_5',
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
      isActive: true,
      highlights: ['ราคาถูกสุด', 'นัดรวมกลุ่มได้', 'Hostel Network', 'Flexible Schedule'],
    },
  ];

  // ── Demo Trips ─────────────────────────────────────────────────
  store.trips = [
    {
      _id: 'mock_trip_1',
      creator: 'mock_user_1',
      title: 'ญี่ปุ่น Christmas Trip 🎄',
      tripType: 'international',
      destination: { country: 'ญี่ปุ่น', countryCode: 'JP', city: 'โตเกียว', flag: '🇯🇵' },
      dateRange: { start: new Date('2025-12-20'), end: new Date('2025-12-27') },
      budget: { min: 35000, max: 60000, currency: 'THB' },
      travelStyles: ['culture', 'food', 'shopping'],
      groupSize: { min: 2, max: 5 },
      selectedAttractions: ['วัดเซ็นโซจิ อาซาคุสะ', 'ชิบุย่า ครอสซิ่ง', 'ฮาราจูกุ'],
      description: 'อยากไปเที่ยวญี่ปุ่นช่วงคริสต์มาส หาเพื่อนร่วมทริปสัก 1-2 คน ชอบกินของอร่อย ถ่ายรูป และช้อปปิ้ง',
      status: 'open',
      currentMembers: [],
      pendingRequests: [],
      views: 42,
      isPrivateTour: false,
      tourCompany: null,
      createdAt: new Date('2025-09-01'),
    },
    {
      _id: 'mock_trip_2',
      creator: 'mock_user_2',
      title: 'ภูเก็ต ทะเล ปาร์ตี้ 🏖️',
      tripType: 'domestic',
      destination: { country: 'ไทย', province: 'ภูเก็ต', flag: '🇹🇭' },
      dateRange: { start: new Date('2025-11-15'), end: new Date('2025-11-18') },
      budget: { min: 8000, max: 20000, currency: 'THB' },
      travelStyles: ['beach', 'nightlife', 'food'],
      groupSize: { min: 3, max: 8 },
      selectedAttractions: ['หาดป่าตอง', 'เกาะพีพี', 'Big Buddha'],
      description: 'ทริปทะเล 3 คืน หาเพื่อนมาซิ่งด้วยกัน ว่ายน้ำ ดำน้ำ กินซีฟู้ด',
      status: 'open',
      currentMembers: ['mock_user_4'],
      pendingRequests: [],
      views: 67,
      isPrivateTour: false,
      tourCompany: null,
      createdAt: new Date('2025-09-05'),
    },
    {
      _id: 'mock_trip_3',
      creator: 'mock_user_3',
      title: 'เชียงใหม่ เดินป่า ดอยอินทนนท์ 🏔️',
      tripType: 'domestic',
      destination: { country: 'ไทย', province: 'เชียงใหม่', flag: '🇹🇭' },
      dateRange: { start: new Date('2025-12-01'), end: new Date('2025-12-04') },
      budget: { min: 3000, max: 8000, currency: 'THB' },
      travelStyles: ['adventure', 'nature', 'culture'],
      groupSize: { min: 2, max: 6 },
      selectedAttractions: ['ดอยอินทนนท์', 'ถนนคนเดินนิมมาน', 'วัดพระธาตุดอยสุเทพ'],
      description: 'เดินป่าดอยอินทนนท์ ดูทะเลหมอกตอนเช้า สัมผัสอากาศหนาว ช่วงต้นธันวาคม',
      status: 'open',
      currentMembers: [],
      pendingRequests: [],
      views: 28,
      isPrivateTour: false,
      tourCompany: null,
      createdAt: new Date('2025-09-10'),
    },
    {
      _id: 'mock_trip_4',
      creator: 'mock_user_4',
      title: 'เกาหลีใต้ K-Pop ซีรีส์ ☁️',
      tripType: 'international',
      destination: { country: 'เกาหลีใต้', countryCode: 'KR', city: 'โซล', flag: '🇰🇷' },
      dateRange: { start: new Date('2026-01-10'), end: new Date('2026-01-16') },
      budget: { min: 30000, max: 55000, currency: 'THB' },
      travelStyles: ['culture', 'food', 'shopping', 'nightlife'],
      groupSize: { min: 2, max: 4 },
      selectedAttractions: ['พระราชวังเคียงบกกุง', 'น้ำตกบงอึนซา', 'ย่านฮงแด'],
      description: 'ไปตามรอย K-Drama กิน Korean BBQ ช้อปปิ้ง Dongdaemun ถ่าย Hanbok',
      status: 'open',
      currentMembers: [],
      pendingRequests: [],
      views: 55,
      isPrivateTour: false,
      tourCompany: null,
      createdAt: new Date('2025-09-15'),
    },
    {
      _id: 'mock_trip_5',
      creator: 'mock_user_5',
      title: 'เวียดนาม Backpacking ฮานอย-ฮาลอง 🛵',
      tripType: 'international',
      destination: { country: 'เวียดนาม', countryCode: 'VN', city: 'ฮานอย', flag: '🇻🇳' },
      dateRange: { start: new Date('2025-10-25'), end: new Date('2025-11-01') },
      budget: { min: 10000, max: 20000, currency: 'THB' },
      travelStyles: ['adventure', 'culture', 'food', 'budget'],
      groupSize: { min: 2, max: 4 },
      selectedAttractions: ['อ่าวฮาลอง', 'โฮจิมินห์ซิตี้', 'ถนน Pho'],
      description: 'แบ็คแพ็คเวียดนาม 7 วัน งบไม่เกินหมื่นห้า กินข้าวอร่อย ขี่มอเตอร์ไซค์',
      status: 'open',
      currentMembers: [],
      pendingRequests: [],
      views: 39,
      isPrivateTour: false,
      tourCompany: null,
      createdAt: new Date('2025-09-18'),
    },
  ];

  // ── Demo Matches ───────────────────────────────────────────────
  store.matches = [];

  console.log('✅ Mock store initialized with demo data (no-DB mode)');
};

// ─── User Operations ─────────────────────────────────────────────
const UserMock = {
  findByEmail: (email) => store.users.find(u => u.email === email.toLowerCase()),
  findById: (id) => store.users.find(u => u._id === id),
  findAll: (excludeId) => store.users.filter(u => u.isPublic && u.isActive && u._id !== excludeId),
  create: async (data) => {
    const hash = await bcrypt.hash(data.password, 10);
    const user = {
      _id: genId(),
      name: data.name,
      email: data.email.toLowerCase(),
      password: hash,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.name}`,
      age: data.age || null,
      gender: data.gender || '',
      bio: '',
      travelStyles: [],
      phone: { number: '', verified: false },
      facebook: { url: '', verified: false },
      line: { id: '', verified: false },
      preferredBudget: { min: 0, max: 100000 },
      tripsCompleted: 0,
      rating: 0,
      reviewCount: 0,
      isPublic: true,
      isActive: true,
      createdAt: new Date(),
    };
    store.users.push(user);
    return user;
  },
  update: (id, data) => {
    const idx = store.users.findIndex(u => u._id === id);
    if (idx === -1) return null;
    Object.assign(store.users[idx], data);
    return store.users[idx];
  },
  checkPassword: async (user, password) => {
    return bcrypt.compare(password, user.password);
  },
  toPublic: toPublicUser,
};

// ─── Trip Operations ──────────────────────────────────────────────
const TripMock = {
  findAll: (filter = {}) => {
    let result = [...store.trips];
    if (filter.status) result = result.filter(t => t.status === filter.status);
    if (filter.country) result = result.filter(t => t.destination.country?.includes(filter.country));
    if (filter.province) result = result.filter(t => t.destination.province?.includes(filter.province));
    if (filter.style) result = result.filter(t => t.travelStyles.includes(filter.style));
    if (filter.budgetMax) result = result.filter(t => t.budget.max <= parseInt(filter.budgetMax));
    return result
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .map(t => _populateTrip(t));
  },
  findByCreator: (userId) => {
    return store.trips
      .filter(t => t.creator === userId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .map(t => _populateTrip(t));
  },
  findById: (id) => {
    const t = store.trips.find(t => t._id === id);
    return t ? _populateTrip(t) : null;
  },
  create: (data) => {
    const trip = {
      _id: genId(),
      status: 'open',
      currentMembers: [],
      pendingRequests: [],
      views: 0,
      isPrivateTour: false,
      tourCompany: null,
      createdAt: new Date(),
      ...data,
    };
    store.trips.push(trip);
    return _populateTrip(trip);
  },
  update: (id, data) => {
    const idx = store.trips.findIndex(t => t._id === id);
    if (idx === -1) return null;
    Object.assign(store.trips[idx], data);
    return _populateTrip(store.trips[idx]);
  },
  getRaw: (id) => store.trips.find(t => t._id === id),
};

// ─── Match Operations ─────────────────────────────────────────────
const MatchMock = {
  findByToUser: (userId) =>
    store.matches
      .filter(m => m.toUser === userId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .map(m => _populateMatch(m)),

  findByFromUser: (userId) =>
    store.matches
      .filter(m => m.fromUser === userId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .map(m => _populateMatch(m)),

  create: (data) => {
    const match = {
      _id: genId(),
      status: 'pending',
      message: '',
      createdAt: new Date(),
      respondedAt: null,
      ...data,
    };
    store.matches.push(match);
    return match;
  },
  update: (tripId, fromUserId, data) => {
    const m = store.matches.find(m => m.tripRequest === tripId && m.fromUser === fromUserId);
    if (m) Object.assign(m, data);
    return m;
  },
};

// ─── Tour Operations ──────────────────────────────────────────────
const TourMock = {
  findAll: (filter = {}) => {
    let result = store.tourCompanies.filter(c => c.isActive);
    if (filter.destination) result = result.filter(c => c.destinations.some(d => d.includes(filter.destination)));
    if (filter.style) result = result.filter(c => c.styles.includes(filter.style));
    return result.sort((a, b) => b.rating - a.rating);
  },
  findById: (id) => store.tourCompanies.find(c => c._id === id),
};

// ─── Private helpers ──────────────────────────────────────────────
const _populateTrip = (trip) => {
  const creator = UserMock.findById(trip.creator);
  return {
    ...trip,
    creator: creator ? toPublicUser(creator) : { _id: trip.creator, name: 'Unknown' },
    currentMembers: (trip.currentMembers || [])
      .map(id => {
        const u = UserMock.findById(id);
        return u ? { _id: u._id, name: u.name, avatar: u.avatar, age: u.age, gender: u.gender } : null;
      })
      .filter(Boolean),
  };
};

const _populateMatch = (match) => {
  const fromUser = UserMock.findById(match.fromUser);
  const toUser = UserMock.findById(match.toUser);
  const trip = TripMock.findById(match.tripRequest);
  return {
    ...match,
    fromUser: fromUser ? toPublicUser(fromUser) : null,
    toUser: toUser ? { _id: toUser._id, name: toUser.name, avatar: toUser.avatar } : null,
    tripRequest: trip || null,
  };
};

module.exports = { init, UserMock, TripMock, MatchMock, TourMock, toPublicUser };
