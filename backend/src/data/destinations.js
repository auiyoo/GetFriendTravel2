const destinations = {
  international: [
    {
      country: "ญี่ปุ่น",
      countryEn: "Japan",
      code: "JP",
      flag: "🇯🇵",
      continent: "Asia",
      currency: "JPY",
      language: "ภาษาญี่ปุ่น",
      bestSeason: ["มีนาคม-พฤษภาคม", "ตุลาคม-พฤศจิกายน"],
      highlights: [
        { name: "วัดเซ็นโซจิ อาซาคุสะ", type: "culture", city: "โตเกียว", emoji: "⛩️" },
        { name: "ภูเขาไฟฟูจิ", type: "nature", city: "ชิซูโอกะ", emoji: "🗻" },
        { name: "อาราชิยามะ ป่าไผ่", type: "nature", city: "เกียวโต", emoji: "🎋" },
        { name: "ชิบุย่า ครอสซิ่ง", type: "urban", city: "โตเกียว", emoji: "🌆" },
        { name: "วัดคินคาคุจิ (ปราสาททอง)", type: "culture", city: "เกียวโต", emoji: "🏯" },
        { name: "ย่านโดทงบอรี", type: "food", city: "โอซาก้า", emoji: "🍜" },
        { name: "ฮอกไกโด สกีรีสอร์ท", type: "adventure", city: "ซัปโปโร", emoji: "⛷️" },
        { name: "โอกินาว่า ชายหาด", type: "beach", city: "โอกินาว่า", emoji: "🏖️" },
        { name: "Universal Studios Japan", type: "entertainment", city: "โอซาก้า", emoji: "🎡" },
        { name: "ย่านอากิฮาบาระ (อาณาจักรอนิเมะ)", type: "shopping", city: "โตเกียว", emoji: "🎮" },
        { name: "เทศกาลซากุระฮานามิ", type: "culture", city: "ทั่วประเทศ", emoji: "🌸" },
        { name: "ออนเซ็น นิกโก้", type: "wellness", city: "นิกโก้", emoji: "♨️" }
      ],
      tips: "ญี่ปุ่นเหมาะสำหรับทุกสไตล์การท่องเที่ยว ทั้งวัฒนธรรม อาหาร ธรรมชาติ และเทคโนโลยี"
    },
    {
      country: "เกาหลีใต้",
      countryEn: "South Korea",
      code: "KR",
      flag: "🇰🇷",
      continent: "Asia",
      currency: "KRW",
      language: "ภาษาเกาหลี",
      bestSeason: ["มีนาคม-พฤษภาคม", "กันยายน-พฤศจิกายน"],
      highlights: [
        { name: "พระราชวังเคียงบกกุง", type: "culture", city: "โซล", emoji: "🏯" },
        { name: "เกาะเชจู ทะเลสาบลาวา", type: "nature", city: "เชจู", emoji: "🌋" },
        { name: "ย่านมยองดง (ช้อปปิ้ง K-Beauty)", type: "shopping", city: "โซล", emoji: "💄" },
        { name: "Lotte World Adventure", type: "entertainment", city: "โซล", emoji: "🎢" },
        { name: "ย่านอิงซาดง (ศิลปะ วัฒนธรรม)", type: "culture", city: "โซล", emoji: "🎨" },
        { name: "DMZ ชายแดนเกาหลีเหนือ-ใต้", type: "history", city: "พาจู", emoji: "🪖" },
        { name: "ย่าน Hongdae (ไนท์ไลฟ์)", type: "nightlife", city: "โซล", emoji: "🎵" },
        { name: "ปูซาน ชายหาดแฮอุนแด", type: "beach", city: "ปูซาน", emoji: "🏄" },
        { name: "เทศกาลดอกซากุระ", type: "nature", city: "ทั่วประเทศ", emoji: "🌸" },
        { name: "K-Pop แฟนมีต & SM Town", type: "entertainment", city: "โซล", emoji: "🎤" }
      ],
      tips: "เกาหลีโดดเด่นเรื่อง K-Pop ความงาม อาหาร และสถานที่ท่องเที่ยวทางประวัติศาสตร์"
    },
    {
      country: "ฝรั่งเศส",
      countryEn: "France",
      code: "FR",
      flag: "🇫🇷",
      continent: "Europe",
      currency: "EUR",
      language: "ภาษาฝรั่งเศส",
      bestSeason: ["เมษายน-มิถุนายน", "กันยายน-ตุลาคม"],
      highlights: [
        { name: "หอไอเฟล", type: "landmark", city: "ปารีส", emoji: "🗼" },
        { name: "พิพิธภัณฑ์ลูฟร์", type: "culture", city: "ปารีส", emoji: "🎨" },
        { name: "แวร์ซาย พระราชวังและสวน", type: "history", city: "แวร์ซาย", emoji: "🌹" },
        { name: "ชายหาดนีซ ริวิเอร่า", type: "beach", city: "นีซ", emoji: "🏖️" },
        { name: "โพรวองซ์ ทุ่งลาเวนเดอร์", type: "nature", city: "โพรวองซ์", emoji: "💜" },
        { name: "มงต์-แซ็ง-มิเชล", type: "landmark", city: "นอร์มังดี", emoji: "🏰" },
        { name: "ล่องแม่น้ำแซน", type: "urban", city: "ปารีส", emoji: "🚢" },
        { name: "ย่าน Montmartre ศิลปิน", type: "culture", city: "ปารีส", emoji: "🎭" },
        { name: "ไร่องุ่นบอร์กโดซ์", type: "food", city: "บอร์กโดซ์", emoji: "🍷" }
      ],
      tips: "ฝรั่งเศสเหมาะกับคู่รัก ผู้รักศิลปะ อาหารชั้นเลิศ และแฟชั่น"
    },
    {
      country: "อิตาลี",
      countryEn: "Italy",
      code: "IT",
      flag: "🇮🇹",
      continent: "Europe",
      currency: "EUR",
      language: "ภาษาอิตาลี",
      bestSeason: ["เมษายน-มิถุนายน", "กันยายน-ตุลาคม"],
      highlights: [
        { name: "โคลอสเซียม", type: "history", city: "โรม", emoji: "🏟️" },
        { name: "เมืองเวนิส คลองโกลนดาลา", type: "landmark", city: "เวนิส", emoji: "🚣" },
        { name: "หอเอนเมืองปิซา", type: "landmark", city: "ปิซา", emoji: "🗼" },
        { name: "Uffizi Gallery ฟลอเรนซ์", type: "culture", city: "ฟลอเรนซ์", emoji: "🎨" },
        { name: "หมู่บ้าน Cinque Terre", type: "nature", city: "ลิกูเรีย", emoji: "🏘️" },
        { name: "อะมาลฟี โคสต์", type: "beach", city: "อะมาลฟี", emoji: "🌊" },
        { name: "เนเปิลส์ พิซซ่าต้นตำรับ", type: "food", city: "เนเปิลส์", emoji: "🍕" },
        { name: "มิลาน แฟชั่นวีค", type: "shopping", city: "มิลาน", emoji: "👗" }
      ],
      tips: "อิตาลีเหมาะสำหรับผู้รักประวัติศาสตร์ ศิลปะ อาหาร และธรรมชาติที่งดงาม"
    },
    {
      country: "สิงคโปร์",
      countryEn: "Singapore",
      code: "SG",
      flag: "🇸🇬",
      continent: "Asia",
      currency: "SGD",
      language: "ภาษาอังกฤษ, ภาษาจีน",
      bestSeason: ["กุมภาพันธ์-เมษายน", "กรกฎาคม-สิงหาคม"],
      highlights: [
        { name: "Gardens by the Bay", type: "nature", city: "สิงคโปร์", emoji: "🌿" },
        { name: "Marina Bay Sands", type: "landmark", city: "สิงคโปร์", emoji: "🏙️" },
        { name: "Universal Studios Singapore", type: "entertainment", city: "เซนโตซ่า", emoji: "🎢" },
        { name: "ย่านไชนาทาวน์ & ลิตเติลอินเดีย", type: "culture", city: "สิงคโปร์", emoji: "🏮" },
        { name: "Orchard Road ช้อปปิ้ง", type: "shopping", city: "สิงคโปร์", emoji: "🛍️" },
        { name: "Hawker Centre อาหารข้างทาง", type: "food", city: "สิงคโปร์", emoji: "🦀" },
        { name: "Night Safari", type: "nature", city: "สิงคโปร์", emoji: "🦁" },
        { name: "ชายหาดเซนโตซ่า", type: "beach", city: "สิงคโปร์", emoji: "🏖️" }
      ],
      tips: "สิงคโปร์เหมาะกับครอบครัว ช้อปปิ้ง และเดินทางสั้นๆ 3-5 วัน"
    },
    {
      country: "เวียดนาม",
      countryEn: "Vietnam",
      code: "VN",
      flag: "🇻🇳",
      continent: "Asia",
      currency: "VND",
      language: "ภาษาเวียดนาม",
      bestSeason: ["กุมภาพันธ์-เมษายน", "พฤศจิกายน-มกราคม"],
      highlights: [
        { name: "อ่าวฮาลอง", type: "nature", city: "กวางนิญ", emoji: "🌊" },
        { name: "เมืองเก่าฮอยอัน", type: "culture", city: "ฮอยอัน", emoji: "🏮" },
        { name: "ฮานอย โฮฮวน ทะเลสาบ", type: "culture", city: "ฮานอย", emoji: "🐢" },
        { name: "ดานัง บาน่าฮิลล์", type: "entertainment", city: "ดานัง", emoji: "🎡" },
        { name: "โฮจิมินห์ วอร์มิวเซียม", type: "history", city: "โฮจิมินห์", emoji: "🏛️" },
        { name: "ฟูก๊วก ชายหาด", type: "beach", city: "ฟูก๊วก", emoji: "🏖️" },
        { name: "ซาปา ขี่ม้าชมทุ่งนาขั้นบันได", type: "nature", city: "ซาปา", emoji: "🌾" },
        { name: "ร้านกาแฟฮานอย เอ้กกาแฟ", type: "food", city: "ฮานอย", emoji: "☕" }
      ],
      tips: "เวียดนามคุ้มค่าสุดๆ อาหารอร่อย ธรรมชาติสวยงาม เหมาะกับทุกงบ"
    },
    {
      country: "มัลดีฟส์",
      countryEn: "Maldives",
      code: "MV",
      flag: "🇲🇻",
      continent: "Asia",
      currency: "USD",
      language: "ภาษาดิเวฮี, ภาษาอังกฤษ",
      bestSeason: ["พฤศจิกายน-เมษายน"],
      highlights: [
        { name: "วิลล่าบนน้ำ Overwater Bungalow", type: "luxury", city: "South Malé Atoll", emoji: "🛖" },
        { name: "ดำน้ำ Snorkeling ปะการัง", type: "adventure", city: "ทั่วประเทศ", emoji: "🐠" },
        { name: "ดูฉลามวาฬ Whale Shark", type: "nature", city: "South Ari Atoll", emoji: "🦈" },
        { name: "ชายหาดทรายขาว Biyadhoo", type: "beach", city: "South Malé Atoll", emoji: "🏖️" },
        { name: "Sunset Cruise", type: "romance", city: "ทั่วประเทศ", emoji: "🌅" },
        { name: "Local Island Maafushi", type: "budget", city: "Maafushi", emoji: "🏝️" }
      ],
      tips: "มัลดีฟส์คือสวรรค์ของคู่รัก หรูหรา แต่มี Local Island ที่งบน้อยก็ไปได้"
    },
    {
      country: "สวิตเซอร์แลนด์",
      countryEn: "Switzerland",
      code: "CH",
      flag: "🇨🇭",
      continent: "Europe",
      currency: "CHF",
      language: "ภาษาเยอรมัน, ฝรั่งเศส, อิตาลี",
      bestSeason: ["มิถุนายน-กันยายน", "ธันวาคม-มีนาคม"],
      highlights: [
        { name: "อินเทอร์ลาเคน ยอดเขา Jungfrau", type: "adventure", city: "อินเทอร์ลาเคน", emoji: "🏔️" },
        { name: "ซูริก ทะเลสาบ", type: "urban", city: "ซูริก", emoji: "🏙️" },
        { name: "เมืองลูเซิร์น สะพานไม้", type: "landmark", city: "ลูเซิร์น", emoji: "🌉" },
        { name: "นั่งรถไฟ Glacier Express", type: "adventure", city: "ทั่วประเทศ", emoji: "🚂" },
        { name: "เจนีวา ทะเลสาบ น้ำพุ", type: "urban", city: "เจนีวา", emoji: "⛲" },
        { name: "เซอร์แมทท์ เล่นสกี Matterhorn", type: "adventure", city: "เซอร์แมทท์", emoji: "⛷️" },
        { name: "ชิมช็อกโกแลตสวิส", type: "food", city: "ทั่วประเทศ", emoji: "🍫" }
      ],
      tips: "สวิตเซอร์แลนด์สวยงามทุกฤดูกาล แต่ค่าใช้จ่ายสูง เหมาะกับงบ Luxury"
    },
    {
      country: "ออสเตรเลีย",
      countryEn: "Australia",
      code: "AU",
      flag: "🇦🇺",
      continent: "Oceania",
      currency: "AUD",
      language: "ภาษาอังกฤษ",
      bestSeason: ["กันยายน-พฤศจิกายน", "มีนาคม-พฤษภาคม"],
      highlights: [
        { name: "Sydney Opera House & Harbour Bridge", type: "landmark", city: "ซิดนีย์", emoji: "🎭" },
        { name: "Great Barrier Reef ดำน้ำ", type: "nature", city: "ควีนส์แลนด์", emoji: "🐠" },
        { name: "Uluru (Ayers Rock)", type: "nature", city: "นอร์เทิร์นเทร์ริทอรี", emoji: "🪨" },
        { name: "Bondi Beach", type: "beach", city: "ซิดนีย์", emoji: "🏄" },
        { name: "Melbourne ย่านกาแฟ ศิลปะ", type: "urban", city: "เมลเบิร์น", emoji: "☕" },
        { name: "Philip Island เพนกวิน", type: "nature", city: "วิกตอเรีย", emoji: "🐧" },
        { name: "Byron Bay Lighthouse", type: "nature", city: "นิวเซาท์เวลส์", emoji: "🌊" }
      ],
      tips: "ออสเตรเลียเหมาะกับนักเดินทางชอบธรรมชาติ สัตว์ป่า และชีวิต outdoor"
    },
    {
      country: "สหรัฐอเมริกา",
      countryEn: "United States",
      code: "US",
      flag: "🇺🇸",
      continent: "America",
      currency: "USD",
      language: "ภาษาอังกฤษ",
      bestSeason: ["เมษายน-มิถุนายน", "กันยายน-พฤศจิกายน"],
      highlights: [
        { name: "New York City Times Square", type: "urban", city: "นิวยอร์ก", emoji: "🗽" },
        { name: "Grand Canyon", type: "nature", city: "แอริโซนา", emoji: "🏜️" },
        { name: "Las Vegas Strip", type: "entertainment", city: "ลาสเวกัส", emoji: "🎰" },
        { name: "Disney World / Disneyland", type: "entertainment", city: "ออร์แลนโด/ลอสแองเจลิส", emoji: "🏰" },
        { name: "Yellowstone National Park", type: "nature", city: "ไวโอมิง", emoji: "🦌" },
        { name: "Hollywood Walk of Fame", type: "culture", city: "ลอสแองเจลิส", emoji: "⭐" },
        { name: "Miami South Beach", type: "beach", city: "ไมอามี", emoji: "🏖️" },
        { name: "Niagara Falls", type: "nature", city: "นิวยอร์ก", emoji: "💧" }
      ],
      tips: "สหรัฐฯ ใหญ่มาก ควรเลือก 1-2 เมืองต่อทริป เดินทางโดยเครื่องบินภายในประเทศ"
    },
    {
      country: "ตุรกี",
      countryEn: "Turkey",
      code: "TR",
      flag: "🇹🇷",
      continent: "Europe/Asia",
      currency: "TRY",
      language: "ภาษาตุรกี",
      bestSeason: ["เมษายน-มิถุนายน", "กันยายน-พฤศจิกายน"],
      highlights: [
        { name: "คัปปาโดเซีย บอลลูน", type: "adventure", city: "คัปปาโดเซีย", emoji: "🎈" },
        { name: "ฮาเกีย โซเฟีย", type: "history", city: "อิสตันบูล", emoji: "🕌" },
        { name: "ปาลมุกคาเล Pamukkale ลานหิน", type: "nature", city: "ปาลมุกคาเล", emoji: "🌊" },
        { name: "ล่องเรือช่องแคบบอสฟอรัส", type: "urban", city: "อิสตันบูล", emoji: "🚢" },
        { name: "แกรนด์ บาซาร์ ช้อปปิ้ง", type: "shopping", city: "อิสตันบูล", emoji: "🛒" },
        { name: "โบดรัม ชายหาด Aegean", type: "beach", city: "โบดรัม", emoji: "🏖️" }
      ],
      tips: "ตุรกีโดดเด่นเรื่องประวัติศาสตร์ อาหารอร่อย และคัปปาโดเซียที่เป็นเอกลักษณ์"
    },
    {
      country: "สหรัฐอาหรับเอมิเรตส์",
      countryEn: "UAE",
      code: "AE",
      flag: "🇦🇪",
      continent: "Middle East",
      currency: "AED",
      language: "ภาษาอาหรับ, ภาษาอังกฤษ",
      bestSeason: ["พฤศจิกายน-มีนาคม"],
      highlights: [
        { name: "Burj Khalifa ตึกสูงสุดโลก", type: "landmark", city: "ดูไบ", emoji: "🏙️" },
        { name: "Dubai Mall ช้อปปิ้ง", type: "shopping", city: "ดูไบ", emoji: "🛍️" },
        { name: "Desert Safari ซาฟารี ทะเลทราย", type: "adventure", city: "ดูไบ", emoji: "🐪" },
        { name: "Palm Jumeirah", type: "luxury", city: "ดูไบ", emoji: "🌴" },
        { name: "Abu Dhabi Sheikh Zayed Mosque", type: "culture", city: "อาบูดาบี", emoji: "🕌" },
        { name: "Ferrari World Abu Dhabi", type: "entertainment", city: "อาบูดาบี", emoji: "🏎️" }
      ],
      tips: "UAE เหมาะกับ Luxury travel ช้อปปิ้ง และผจญภัยทะเลทราย"
    }
  ],

  domestic: [
    {
      province: "กรุงเทพมหานคร",
      provinceEn: "Bangkok",
      region: "ภาคกลาง",
      emoji: "🏙️",
      highlights: [
        { name: "วัดพระแก้ว & พระบรมมหาราชวัง", type: "culture", emoji: "⛩️" },
        { name: "วัดอรุณราชวราราม", type: "culture", emoji: "🌅" },
        { name: "ตลาดนัดจตุจักร", type: "shopping", emoji: "🛍️" },
        { name: "ย่านเยาวราช ไชนาทาวน์", type: "food", emoji: "🍜" },
        { name: "ถนนข้าวสาร", type: "nightlife", emoji: "🍻" },
        { name: "ไอคอนสยาม", type: "shopping", emoji: "🏬" },
        { name: "ตลาดน้ำดำเนินสะดวก", type: "culture", emoji: "🚣" },
        { name: "ย่าน Asok Sukhumvit ไนท์ไลฟ์", type: "nightlife", emoji: "🎉" },
        { name: "อุทยานประวัติศาสตร์บางกอก", type: "history", emoji: "🏛️" },
        { name: "สวนลุมพินี", type: "nature", emoji: "🌳" }
      ],
      tips: "กรุงเทพฯ เมืองที่ไม่เคยหลับ อาหารอร่อย ช้อปปิ้งคุ้ม ทำอะไรก็สนุก"
    },
    {
      province: "เชียงใหม่",
      provinceEn: "Chiang Mai",
      region: "ภาคเหนือ",
      emoji: "🌿",
      highlights: [
        { name: "วัดพระธาตุดอยสุเทพ", type: "culture", emoji: "⛩️" },
        { name: "ดอยอินทนนท์ ยอดดอยสูงสุด", type: "nature", emoji: "🏔️" },
        { name: "ถนนคนเดินนิมมาน", type: "shopping", emoji: "☕" },
        { name: "บ้านช้างแม่แตง", type: "nature", emoji: "🐘" },
        { name: "ถนนคนเดิน Saturday Market", type: "food", emoji: "🥘" },
        { name: "ดอยปุย Hmong Village", type: "culture", emoji: "🌺" },
        { name: "ตลาดวโรรส (กาดหลวง)", type: "food", emoji: "🛒" },
        { name: "สวนสัตว์เชียงใหม่", type: "entertainment", emoji: "🐼" },
        { name: "อุโมงค์ดอกซากุระ (ดอยอ่างขาง)", type: "nature", emoji: "🌸" },
        { name: "เที่ยวชาเขียว Doi Mae Salong", type: "nature", emoji: "🍵" }
      ],
      tips: "เชียงใหม่เหมาะทุกฤดู มีทั้งวัด ธรรมชาติ คาเฟ่สวยๆ และวัฒนธรรมล้านนา"
    },
    {
      province: "ภูเก็ต",
      provinceEn: "Phuket",
      region: "ภาคใต้",
      emoji: "🏖️",
      highlights: [
        { name: "หาดป่าตอง", type: "beach", emoji: "🏄" },
        { name: "เกาะพีพี", type: "nature", emoji: "🏝️" },
        { name: "แหลมพรหมเทพ ชมพระอาทิตย์ตก", type: "nature", emoji: "🌅" },
        { name: "ย่านเมืองเก่าภูเก็ต", type: "culture", emoji: "🏘️" },
        { name: "ดำน้ำ Scuba Diving", type: "adventure", emoji: "🤿" },
        { name: "Bangla Road ไนท์ไลฟ์", type: "nightlife", emoji: "🎶" },
        { name: "Big Buddha ภูเก็ต", type: "culture", emoji: "🙏" },
        { name: "ตลาดอาหารทะเล", type: "food", emoji: "🦞" },
        { name: "Simon Cabaret Show", type: "entertainment", emoji: "🎭" }
      ],
      tips: "ภูเก็ตเหมาะกับทะเล ไนท์ไลฟ์ และ Diving คึกคักช่วง High Season"
    },
    {
      province: "กระบี่",
      provinceEn: "Krabi",
      region: "ภาคใต้",
      emoji: "🌊",
      highlights: [
        { name: "หาดไร่เลย์ (เข้าได้ทางเรือ)", type: "beach", emoji: "🏖️" },
        { name: "อ่าวมาหยา เกาะพีพีเล", type: "nature", emoji: "🏝️" },
        { name: "ล่องแก่ง Rock Climbing", type: "adventure", emoji: "🧗" },
        { name: "ล่องเรือ 4 เกาะ", type: "nature", emoji: "⛵" },
        { name: "ถ้ำเสือ Tiger Cave Temple", type: "culture", emoji: "⛩️" },
        { name: "ล่องคยัค Mangrove", type: "nature", emoji: "🚣" },
        { name: "หาดอ่าวนาง", type: "beach", emoji: "🌴" }
      ],
      tips: "กระบี่เงียบกว่าภูเก็ต เหมาะสำหรับนักผจญภัยและคนชอบธรรมชาติ"
    },
    {
      province: "เกาะสมุย",
      provinceEn: "Koh Samui",
      region: "ภาคใต้",
      emoji: "🌴",
      highlights: [
        { name: "หาดเฉวง (Chaweng Beach)", type: "beach", emoji: "🏖️" },
        { name: "น้ำตกนาเมือง", type: "nature", emoji: "💧" },
        { name: "Big Buddha Koh Samui", type: "culture", emoji: "🙏" },
        { name: "Full Moon Party เกาะพะงัน", type: "nightlife", emoji: "🌕" },
        { name: "ฟาร์มมะพร้าว", type: "culture", emoji: "🥥" },
        { name: "ดำน้ำตื้น Ang Thong National Park", type: "nature", emoji: "🤿" }
      ],
      tips: "เกาะสมุยเหมาะกับพักผ่อน Luxury resort และชีวิตกลางคืน"
    },
    {
      province: "ปาย",
      provinceEn: "Pai",
      region: "ภาคเหนือ",
      emoji: "🌄",
      highlights: [
        { name: "ปาย แคนยอน", type: "nature", emoji: "🏜️" },
        { name: "น้ำพุร้อนท่าปาย", type: "wellness", emoji: "♨️" },
        { name: "ทุ่งดอกไม้ งานปีใหม่ม้ง", type: "culture", emoji: "🌸" },
        { name: "วัดน้ำฮู", type: "culture", emoji: "⛩️" },
        { name: "คาเฟ่วิวภูเขา", type: "food", emoji: "☕" },
        { name: "ขี่มอเตอร์ไซค์ชมวิว", type: "adventure", emoji: "🏍️" }
      ],
      tips: "ปายเหมาะกับ Backpacker ชอบธรรมชาติ บรรยากาศชิลล์ เดินทางช่วงหน้าหนาว"
    },
    {
      province: "เชียงราย",
      provinceEn: "Chiang Rai",
      region: "ภาคเหนือ",
      emoji: "🏯",
      highlights: [
        { name: "วัดร่องขุ่น (วัดขาว)", type: "culture", emoji: "⛩️" },
        { name: "วัดร่องเสือเต้น (วัดฟ้า)", type: "culture", emoji: "💙" },
        { name: "สามเหลี่ยมทองคำ", type: "history", emoji: "🏅" },
        { name: "ดอยแม่สลอง ชาอู่หลง", type: "nature", emoji: "🍵" },
        { name: "ตลาดไนท์บาซาร์เชียงราย", type: "food", emoji: "🛒" },
        { name: "อุทยานศิลปะวัฒนธรรมแม่ฟ้าหลวง", type: "culture", emoji: "🎨" }
      ],
      tips: "เชียงรายเงียบสงบ มีวัดศิลปะที่สวยงาม เหมาะกับคนชอบธรรมชาติและวัฒนธรรม"
    },
    {
      province: "กาญจนบุรี",
      provinceEn: "Kanchanaburi",
      region: "ภาคกลาง",
      emoji: "🌉",
      highlights: [
        { name: "สะพานข้ามแม่น้ำแคว", type: "history", emoji: "🌉" },
        { name: "ล่องแพแม่น้ำแคว", type: "adventure", emoji: "🚣" },
        { name: "น้ำตกเอราวัณ", type: "nature", emoji: "💧" },
        { name: "ถ้ำกระแซ รถไฟสายมรณะ", type: "history", emoji: "🚂" },
        { name: "เขื่อนศรีนครินทร์", type: "nature", emoji: "🌊" },
        { name: "บ้านต้นไม้ Treehouse", type: "adventure", emoji: "🌲" }
      ],
      tips: "กาญจนบุรีเหมาะกับประวัติศาสตร์สงคราม ธรรมชาติ และกิจกรรม outdoor"
    },
    {
      province: "พัทยา",
      provinceEn: "Pattaya",
      region: "ภาคตะวันออก",
      emoji: "🎡",
      highlights: [
        { name: "เกาะล้าน ดำน้ำตื้น", type: "beach", emoji: "🏝️" },
        { name: "Walking Street ไนท์ไลฟ์", type: "nightlife", emoji: "🎶" },
        { name: "Sanctuary of Truth", type: "culture", emoji: "🏯" },
        { name: "Nong Nooch Garden", type: "nature", emoji: "🌺" },
        { name: "Art in Paradise", type: "entertainment", emoji: "🎨" },
        { name: "สวนสัตว์โคราช ขี่ช้าง", type: "entertainment", emoji: "🐘" }
      ],
      tips: "พัทยาเหมาะกับนักท่องเที่ยวที่ชอบไนท์ไลฟ์ เกาะ และความสนุก"
    },
    {
      province: "หัวหิน",
      provinceEn: "Hua Hin",
      region: "ภาคกลาง",
      emoji: "🎪",
      highlights: [
        { name: "หาดหัวหิน", type: "beach", emoji: "🏖️" },
        { name: "ตลาดกลางคืนหัวหิน", type: "food", emoji: "🦐" },
        { name: "อุทยานประวัติศาสตร์บ้านสมเด็จ", type: "culture", emoji: "🏛️" },
        { name: "Santorini Park", type: "entertainment", emoji: "🎡" },
        { name: "Black Mountain Water Park", type: "entertainment", emoji: "💦" },
        { name: "ถ้ำเขาหลวง", type: "nature", emoji: "⛰️" }
      ],
      tips: "หัวหินเหมาะกับครอบครัว คู่รัก บรรยากาศสงบกว่าพัทยา"
    },
    {
      province: "อยุธยา",
      provinceEn: "Ayutthaya",
      region: "ภาคกลาง",
      emoji: "🏛️",
      highlights: [
        { name: "วัดพระศรีสรรเพชญ์", type: "history", emoji: "🏛️" },
        { name: "วัดมหาธาตุ พระพุทธรูปในต้นโพธิ์", type: "culture", emoji: "☸️" },
        { name: "ล่องเรือชมโบราณสถาน", type: "culture", emoji: "🚣" },
        { name: "ตลาดน้ำอโยธยา", type: "food", emoji: "🍡" },
        { name: "พระนครศรีอยุธยา UNESCO", type: "history", emoji: "🏺" }
      ],
      tips: "อยุธยาเที่ยวได้ 1-2 วันจากกรุงเทพฯ เหมาะกับคนรักประวัติศาสตร์"
    }
  ]
};

module.exports = destinations;
