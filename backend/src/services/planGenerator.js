const destinations = require('../data/destinations');

/**
 * Generate a Trip Plan based on trip request details
 */
const generateTripPlan = (tripRequest) => {
  const { destination, dateRange, travelStyles, selectedAttractions, budget } = tripRequest;
  const duration = Math.ceil((new Date(dateRange.end) - new Date(dateRange.start)) / (1000 * 60 * 60 * 24));

  // Find destination data
  let destData = null;
  if (tripRequest.tripType === 'domestic') {
    destData = destinations.domestic.find(d => d.province === destination.province || d.province === destination.country);
  } else {
    destData = destinations.international.find(d => d.country === destination.country);
  }

  const attractions = destData?.highlights || [];
  const days = [];
  const isLuxury = budget.max > 50000;
  const isBudget = budget.max < 15000;

  // Day-by-day plan
  for (let day = 1; day <= Math.min(duration, 7); day++) {
    const date = new Date(dateRange.start);
    date.setDate(date.getDate() + day - 1);

    const dayPlan = {
      day,
      date: date.toISOString().split('T')[0],
      title: getDayTitle(day, duration),
      morning: [],
      afternoon: [],
      evening: [],
      accommodation: getAccommodation(day, travelStyles, isLuxury, isBudget, destination),
      meals: getMeals(day, destination, tripRequest.tripType),
      tips: []
    };

    // Distribute attractions across days
    const dayAttractions = attractions.slice((day - 1) * 2, day * 2);
    dayAttractions.forEach((attr, idx) => {
      if (idx === 0) dayPlan.morning.push({ activity: attr.name, duration: '2-3 ชั่วโมง', type: attr.type, emoji: attr.emoji });
      else dayPlan.afternoon.push({ activity: attr.name, duration: '2-3 ชั่วโมง', type: attr.type, emoji: attr.emoji });
    });

    // Add selected attractions if any
    if (selectedAttractions?.length > 0) {
      const selectedIdx = (day - 1) * 1;
      if (selectedAttractions[selectedIdx]) {
        dayPlan.afternoon.push({ activity: selectedAttractions[selectedIdx], duration: '2 ชั่วโมง', type: 'selected', emoji: '⭐' });
      }
    }

    // Evening activity based on style
    dayPlan.evening.push(getEveningActivity(travelStyles, isLuxury, destination));

    // Day tips
    dayPlan.tips = getDayTips(day, duration, tripRequest.tripType, destination);

    days.push(dayPlan);
  }

  return {
    title: `แผนเที่ยว ${destination.country || destination.province} ${duration} วัน`,
    destination: destination.country || destination.province,
    duration,
    dateRange,
    totalDays: days.length,
    estimatedBudget: estimateBudget(duration, budget, isLuxury, isBudget),
    travelStyles,
    days,
    generalTips: destData?.tips || '',
    packing: getPackingList(travelStyles, tripRequest.tripType),
    emergency: getEmergencyInfo(tripRequest.tripType, destination)
  };
};

const getDayTitle = (day, total) => {
  if (day === 1) return '🛬 วันแรก - เดินทางถึง';
  if (day === total) return '🛫 วันสุดท้าย - เดินทางกลับ';
  return `🌟 วันที่ ${day} - สำรวจและเที่ยว`;
};

const getAccommodation = (day, styles, isLuxury, isBudget, destination) => {
  if (isLuxury) return { type: 'โรงแรม 5 ดาว / Resort', priceRange: '5,000-15,000 บาท/คืน', emoji: '🏨' };
  if (isBudget) return { type: 'Hostel / Guesthouse', priceRange: '300-800 บาท/คืน', emoji: '🏠' };
  if (styles?.includes('adventure')) return { type: 'Boutique Hotel / Glamping', priceRange: '1,500-3,000 บาท/คืน', emoji: '⛺' };
  return { type: 'โรงแรม 3-4 ดาว', priceRange: '1,200-3,500 บาท/คืน', emoji: '🏩' };
};

const getMeals = (day, destination, tripType) => {
  const isThailand = tripType === 'domestic';
  return {
    breakfast: isThailand ? '🍳 อาหารเช้า หรือ กาแฟ คาเฟ่ท้องถิ่น' : '🥐 อาหารเช้าท้องถิ่น',
    lunch: isThailand ? '🍛 ร้านอาหารท้องถิ่น' : `🍽️ ลองอาหารประจำท้องถิ่น ${destination.country}`,
    dinner: isThailand ? '🌮 ตลาดอาหารยามค่ำ / ร้านอาหาร' : `🍷 ร้านอาหารแนะนำย่านนักท่องเที่ยว`
  };
};

const getEveningActivity = (styles, isLuxury, destination) => {
  if (styles?.includes('nightlife')) return { activity: 'สำรวจย่านไนท์ไลฟ์', duration: '3-4 ชั่วโมง', emoji: '🎉' };
  if (styles?.includes('food')) return { activity: 'ทัวร์ Street Food ยามค่ำคืน', duration: '2-3 ชั่วโมง', emoji: '🍢' };
  if (isLuxury) return { activity: 'Rooftop Bar / Fine Dining', duration: '2 ชั่วโมง', emoji: '🍸' };
  return { activity: 'เดินเล่น ชมเมืองยามค่ำ ชิมของอร่อย', duration: '2 ชั่วโมง', emoji: '🌃' };
};

const getDayTips = (day, total, tripType, destination) => {
  const tips = [];
  if (day === 1) tips.push('💡 ซื้อซิมการ์ดท้องถิ่นที่สนามบิน', '💡 แลกเงินสกุลท้องถิ่นในอัตราดี');
  if (day === total) tips.push('💡 เช็คเอาต์โรงแรมก่อน 12.00 น.', '💡 เก็บใบเสร็จ Duty Free สำหรับ VAT Refund');
  if (tripType === 'international') tips.push('💡 เซฟเบอร์โรงแรมและสถานฑูตไว้กรณีฉุกเฉิน');
  return tips;
};

const estimateBudget = (duration, budget, isLuxury, isBudget) => {
  const accommodation = isLuxury ? 8000 : isBudget ? 500 : 2000;
  const food = isLuxury ? 2000 : isBudget ? 400 : 800;
  const activities = isLuxury ? 3000 : isBudget ? 300 : 1000;
  const transport = 500;
  const perDay = accommodation + food + activities + transport;
  return {
    perDay,
    total: perDay * duration,
    breakdown: { accommodation, food, activities, transport }
  };
};

const getPackingList = (styles, tripType) => {
  const base = ['🎒 กระเป๋าเดินทาง', '📋 พาสปอร์ต/บัตรประชาชน', '💊 ยาส่วนตัว', '📱 Power Bank', '🔌 Adapter'];
  if (styles?.includes('adventure')) base.push('👟 รองเท้าเดินป่า', '🧴 กันแดด SPF50+', '🧢 หมวก');
  if (styles?.includes('beach')) base.push('👙 ชุดว่ายน้ำ', '🥽 ชุดดำน้ำ', '🌂 ร่มกันแดด');
  if (tripType === 'international') base.push('🌍 ประกันการเดินทาง', '💳 บัตรเครดิตสำรอง');
  return base;
};

const getEmergencyInfo = (tripType, destination) => {
  const info = { hotline: '1155 (สายด่วนนักท่องเที่ยว)', ambulance: '1669' };
  if (tripType === 'international') {
    info.embassy = `สถานทูตไทยใน ${destination.country}`;
    info.insurance = 'บริษัทประกันการเดินทาง';
  }
  return info;
};

module.exports = { generateTripPlan };
