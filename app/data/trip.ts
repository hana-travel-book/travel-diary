export interface ChecklistItem {
  id: string;
  label: string;
  done: boolean;
}

export interface JourneyDay {
  day: number;
  dateLabel: string;
  city: string;
  title: string;
  image: string;
}

export interface TimelineItem {
  time: string;
  title: string;
  subtitle: string;
  emoji: string;
  address?: string;
}

export interface TaskItem {
  id: string;
  label: string;
  done: boolean;
}

export interface DayDetail {
  day: number;
  dateLabel: string;
  city: string;
  timeline: TimelineItem[];
  tasks: TaskItem[];
  expenseToday: number;
}

export interface MemoryPhoto {
  id: string;
  image: string;
}

export interface UserProfile {
  name: string;
  role: string;
  avatar: string;
}

export const user: UserProfile = {
  name: "Lucia",
  role: "媽媽 · 旅行規劃師",
  avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop",
};

const IMG = {
  beach: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop",
  temple: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=800&auto=format&fit=crop",
  city: "https://images.unsplash.com/photo-1563492065599-3520f775eeed?w=800&auto=format&fit=crop",
  elephant: "https://images.unsplash.com/photo-1581852017103-68ac65514cf7?w=800&auto=format&fit=crop",
  temple2: "https://images.unsplash.com/photo-1528181304800-259b08848526?w=800&auto=format&fit=crop",
  market: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=800&auto=format&fit=crop",
};

export const trip = {
  title: "Thailand 2026",
  traveler: "Lucia ❤️ Hannah",
  start: "2026-07-30",
  end: "2026-08-26",
  dateRangeLabel: "30 Jul – 26 Aug",
  totalDays: 28,

  heroImage: IMG.beach,

  checklist: [
    { id: "c1", label: "機票", done: true },
    { id: "c2", label: "飯店", done: true },
    { id: "c3", label: "網卡", done: false },
    { id: "c4", label: "保險", done: false },
    { id: "c5", label: "換匯", done: false },
    { id: "c6", label: "行李準備", done: false },
  ] as ChecklistItem[],

  journeyDays: [
    { day: 1, dateLabel: "30 Jul (Thu)", city: "Bangkok", title: "抵達曼谷", image: IMG.city },
    { day: 2, dateLabel: "31 Jul (Fri)", city: "Ayutthaya", title: "大城一日遊", image: IMG.elephant },
    { day: 3, dateLabel: "1 Aug (Sat)", city: "Bangkok", title: "市中心美食購物", image: IMG.city },
    { day: 4, dateLabel: "2 Aug (Sun)", city: "Bangkok", title: "恰圖恰市集 + 象神廟", image: IMG.market },
    { day: 5, dateLabel: "3 Aug (Mon)", city: "Bangkok", title: "ICONSIAM 暹羅天地", image: IMG.city },
    { day: 6, dateLabel: "4 Aug (Tue)", city: "Bangkok", title: "泰服拍照日", image: IMG.temple },
    { day: 7, dateLabel: "5 Aug (Wed)", city: "Hua Hin", title: "包車前往華欣", image: IMG.market },
    { day: 8, dateLabel: "6 Aug (Thu)", city: "Hua Hin", title: "聖托里尼樂園", image: IMG.beach },
    { day: 9, dateLabel: "7 Aug (Fri)", city: "Chiang Mai", title: "飛往清邁", image: IMG.beach },
    { day: 10, dateLabel: "8 Aug (Sat)", city: "Chiang Mai", title: "抵達清邁", image: IMG.temple2 },
    { day: 11, dateLabel: "9 Aug (Sun)", city: "Chiang Mai", title: "大象咖啡+小熊貓+藍廟", image: IMG.elephant },
    { day: 12, dateLabel: "10 Aug (Mon)", city: "Chiang Mai", title: "藝術營 Day1", image: IMG.temple2 },
    { day: 13, dateLabel: "11 Aug (Tue)", city: "Chiang Mai", title: "藝術營 Day2", image: IMG.temple2 },
    { day: 14, dateLabel: "12 Aug (Wed)", city: "Chiang Mai", title: "藝術營 Day3 + 夜間動物園", image: IMG.elephant },
    { day: 15, dateLabel: "13 Aug (Thu)", city: "Chiang Mai", title: "藝術營 Day4 放鬆日", image: IMG.temple2 },
    { day: 16, dateLabel: "14 Aug (Fri)", city: "Chiang Mai", title: "飛索 + 大象日", image: IMG.elephant },
    { day: 17, dateLabel: "15 Aug (Sat)", city: "Chiang Mai", title: "大象早餐 + 泰服古城", image: IMG.elephant },
    { day: 18, dateLabel: "16 Aug (Sun)", city: "Chiang Mai", title: "Jing Jai Market", image: IMG.market },
    { day: 19, dateLabel: "17 Aug (Mon)", city: "Chiang Mai", title: "烹飪營 Day1", image: IMG.city },
    { day: 20, dateLabel: "18 Aug (Tue)", city: "Chiang Mai", title: "烹飪營 Day2", image: IMG.city },
    { day: 21, dateLabel: "19 Aug (Wed)", city: "Chiang Mai", title: "烹飪營 Day3", image: IMG.city },
    { day: 22, dateLabel: "20 Aug (Thu)", city: "Chiang Mai", title: "烹飪營 Day4 放鬆日", image: IMG.beach },
    { day: 23, dateLabel: "21 Aug (Fri)", city: "Chiang Mai", title: "烹飪營 Day5 + 文化體驗", image: IMG.city },
    { day: 24, dateLabel: "22 Aug (Sat)", city: "Chiang Mai", title: "Princess Sirindhorn AstroPark", image: IMG.temple2 },
    { day: 25, dateLabel: "23 Aug (Sun)", city: "Chiang Mai", title: "退房 + 親子料理課", image: IMG.city },
    { day: 26, dateLabel: "24 Aug (Mon)", city: "Chiang Rai", title: "清萊一日遊", image: IMG.temple },
    { day: 27, dateLabel: "25 Aug (Tue)", city: "Chiang Mai", title: "Fahlanna Art Museum", image: IMG.temple2 },
    { day: 28, dateLabel: "26 Aug (Wed)", city: "Chiang Mai", title: "回台灣", image: IMG.beach },
  ] as JourneyDay[],

  dayDetails: {
    1: {
      day: 1, dateLabel: "30 Jul (Thu)", city: "Bangkok",
      timeline: [
        { time: "08:20", title: "桃園機場起飛", subtitle: "", emoji: "✈️" },
        { time: "11:10", title: "抵達素萬那普機場", subtitle: "飯店 Check-in", emoji: "🛬" },
        { time: "19:00", title: "晚餐", subtitle: "Mr. Jo Crispy Pory 或 Somsak Claypot Crab", emoji: "🍽️" },
      ],
      tasks: [], expenseToday: 0,
    },
    2: {
      day: 2, dateLabel: "31 Jul (Fri)", city: "Ayutthaya",
      timeline: [
        { time: "07:00", title: "包車出發前往大城", subtitle: "", emoji: "🚗" },
        { time: "09:00", title: "Sriayuthaya Lion Park", subtitle: "長頸鹿拍照、獅子互動", emoji: "🦒" },
        { time: "10:30", title: "小熊貓餵食體驗", subtitle: "已預約", emoji: "🐼" },
        { time: "13:00", title: "Roti Sai Mai", subtitle: "糖絲卷餅", emoji: "🍬" },
        { time: "14:00", title: "瑪哈泰寺", subtitle: "樹中佛頭", emoji: "🛕" },
        { time: "15:30", title: "Mayura's House", subtitle: "古城咖啡廳", emoji: "☕" },
        { time: "18:00", title: "Grand Chaopraya 晚餐", subtitle: "彈性，時間夠再去", emoji: "🍤" },
      ],
      tasks: [], expenseToday: 0,
    },
    3: {
      day: 3, dateLabel: "1 Aug (Sat)", city: "Bangkok",
      timeline: [
        { time: "10:00", title: "嘟嘟車前往 Central World", subtitle: "記得殺價", emoji: "🛺" },
        { time: "11:00", title: "Central World 逛街", subtitle: "Karun 金箔泰奶、Thong Smith 船麵", emoji: "🛍️" },
        { time: "17:00", title: "MahaNakhon SkyWalk", subtitle: "觀景台看夕陽", emoji: "🌇" },
        { time: "19:00", title: "朱拉隆功夜市", subtitle: "Bake a Wish 鹽可頌、Nom Nua 吐司、HAAB.BKK 奶油蛋糕", emoji: "🥐" },
      ],
      tasks: [], expenseToday: 0,
    },
    4: {
      day: 4, dateLabel: "2 Aug (Sun)", city: "Bangkok",
      timeline: [
        { time: "09:00", title: "恰圖恰週末市集", subtitle: "僅六日開放", emoji: "🛍️" },
        { time: "17:00", title: "泰天神殿", subtitle: "MRT Huai Khwang，象神許願", emoji: "🐘" },
      ],
      tasks: [], expenseToday: 0,
    },
    5: {
      day: 5, dateLabel: "3 Aug (Mon)", city: "Bangkok",
      timeline: [
        { time: "10:00", title: "前往 ICONSIAM", subtitle: "BTS + 免費接駁船", emoji: "🚤" },
        { time: "11:00", title: "Mega Harborland", subtitle: "6樓室內親子樂園", emoji: "🎠" },
        { time: "13:00", title: "SookSiam 午餐", subtitle: "船麵、芒果糯米飯", emoji: "🍜" },
        { time: "15:00", title: "逛街採買", subtitle: "POP MART、Apple Store", emoji: "🛍️" },
        { time: "18:30", title: "河濱水舞秀", subtitle: "18:30/20:00/21:00 三場", emoji: "💦" },
      ],
      tasks: [], expenseToday: 0,
    },
    6: {
      day: 6, dateLabel: "4 Aug (Tue)", city: "Bangkok",
      timeline: [
        { time: "09:00", title: "泰服換裝", subtitle: "Vision Thai Studio", emoji: "👘" },
        { time: "11:30", title: "鄭王廟拍照", subtitle: "", emoji: "🛕" },
        { time: "13:00", title: "Savoey Tha Maharaj 午餐", subtitle: "咖哩蟹肉、烤河蝦", emoji: "🦀" },
        { time: "15:00", title: "Space & Time Cube+", subtitle: "Seacon Bangkae 沉浸式藝術館", emoji: "🌌" },
        { time: "18:00", title: "打包", subtitle: "準備前往華欣", emoji: "🧳" },
      ],
      tasks: [], expenseToday: 0,
    },
    7: {
      day: 7, dateLabel: "5 Aug (Wed)", city: "Bangkok → Hua Hin",
      timeline: [
        { time: "07:00", title: "包車出發", subtitle: "曼谷 → 華欣", emoji: "🚗" },
        { time: "09:00", title: "丹嫩莎朵水上市場", subtitle: "", emoji: "🛶" },
        { time: "11:10", title: "美功鐵道市場", subtitle: "看火車進站", emoji: "🚂" },
        { time: "13:00", title: "午餐", subtitle: "", emoji: "🍽️" },
        { time: "15:30", title: "抵達華欣", subtitle: "飯店 Check-in", emoji: "🏖️" },
      ],
      tasks: [], expenseToday: 0,
    },
    8: {
      day: 8, dateLabel: "6 Aug (Thu)", city: "Hua Hin",
      timeline: [
        { time: "10:00", title: "Santorini Park", subtitle: "聖托里尼樂園", emoji: "🏛️" },
        { time: "13:00", title: "Swiss Sheep Farm", subtitle: "小瑞士農場", emoji: "🐑" },
      ],
      tasks: [], expenseToday: 0,
    },
    9: {
      day: 9, dateLabel: "7 Aug (Fri)", city: "Hua Hin → Chiang Mai",
      timeline: [
        { time: "10:00", title: "海灘 / 飯店泳池", subtitle: "退房前放鬆", emoji: "🏖️" },
        { time: "17:20", title: "華欣機場起飛", subtitle: "FD3901", emoji: "✈️" },
        { time: "18:35", title: "抵達清邁", subtitle: "Check-in 依思迪設計飯店", emoji: "🛬" },
      ],
      tasks: [], expenseToday: 0,
    },
    10: {
      day: 10, dateLabel: "8 Aug (Sat)", city: "Chiang Mai",
      timeline: [
        { time: "10:25", title: "抵達清邁", subtitle: "", emoji: "🛬" },
        { time: "14:00", title: "包包拖鞋 DIY", subtitle: "Tangerine6391 / Fah Thai", emoji: "👜" },
        { time: "16:00", title: "One Nimman 逛街", subtitle: "", emoji: "🛍️" },
        { time: "19:00", title: "週六夜市", subtitle: "", emoji: "🌃" },
      ],
      tasks: [], expenseToday: 0,
    },
    11: {
      day: 11, dateLabel: "9 Aug (Sun)", city: "Chiang Mai",
      timeline: [
        { time: "08:00", title: "大象咖啡館", subtitle: "CAFÉ Elephant", emoji: "🐘" },
        { time: "09:30", title: "大象便便紙 DIY", subtitle: "護照套", emoji: "📝" },
        { time: "11:00", title: "清邁藍廟", subtitle: "Wat Ban Den", emoji: "🛕" },
        { time: "14:00", title: "黏黏瀑布", subtitle: "Bua Thong Sticky Waterfall", emoji: "💦" },
        { time: "18:30", title: "週日夜市", subtitle: "", emoji: "🌃" },
      ],
      tasks: [], expenseToday: 0,
    },
    12: {
      day: 12, dateLabel: "10 Aug (Mon)", city: "Chiang Mai",
      timeline: [
        { time: "09:30", title: "藝術營：Cookie/Dessert Notebook", subtitle: "", emoji: "🎨" },
        { time: "13:30", title: "藝術營：Clay Cupcake", subtitle: "", emoji: "🧁" },
        { time: "16:00", title: "Central Chiangmai", subtitle: "超市、晚餐、游泳", emoji: "🏊" },
      ],
      tasks: [], expenseToday: 0,
    },
    13: {
      day: 13, dateLabel: "11 Aug (Tue)", city: "Chiang Mai",
      timeline: [
        { time: "09:30", title: "藝術營：Cake Slice Paper Craft", subtitle: "", emoji: "✂️" },
        { time: "13:30", title: "藝術營：Cake Box", subtitle: "", emoji: "📦" },
        { time: "18:00", title: "黑森林餐廳", subtitle: "", emoji: "🌲" },
      ],
      tasks: [], expenseToday: 0,
    },
    14: {
      day: 14, dateLabel: "12 Aug (Wed)", city: "Chiang Mai",
      timeline: [
        { time: "09:30", title: "藝術營：Fluffy Donut Felt Keychain", subtitle: "", emoji: "🍩" },
        { time: "13:30", title: "藝術營：Tic Tac Toe Waffle", subtitle: "", emoji: "🧇" },
        { time: "18:00", title: "清邁夜間動物園", subtitle: "餵長頸鹿、音樂噴泉", emoji: "🦒" },
      ],
      tasks: [], expenseToday: 0,
    },
    15: {
      day: 15, dateLabel: "13 Aug (Thu)", city: "Chiang Mai",
      timeline: [
        { time: "09:30", title: "藝術營：Moji Squishy", subtitle: "", emoji: "🍊" },
        { time: "13:30", title: "藝術營：Pancake Flip Game", subtitle: "", emoji: "🥞" },
        { time: "16:00", title: "飯店游泳、清邁夜市", subtitle: "保留體力給大象日", emoji: "🏊" },
      ],
      tasks: [], expenseToday: 0,
    },
    16: {
      day: 16, dateLabel: "14 Aug (Fri)", city: "Chiang Mai",
      timeline: [
        { time: "07:00", title: "出發", subtitle: "可能需包車", emoji: "🚗" },
        { time: "08:00", title: "Pong Yang Jungle Coaster", subtitle: "親子飛索", emoji: "🌲" },
        { time: "11:00", title: "Jungle De Cafe", subtitle: "森林咖啡廳午餐", emoji: "☕" },
        { time: "13:30", title: "Chai Lai Orchid Eco Lodge", subtitle: "大象互動，住一晚", emoji: "🐘" },
      ],
      tasks: [], expenseToday: 0,
    },
    17: {
      day: 17, dateLabel: "15 Aug (Sat)", city: "Chiang Mai",
      timeline: [
        { time: "08:00", title: "大象早餐", subtitle: "山景、慢慢玩", emoji: "🐘" },
        { time: "12:00", title: "回清邁", subtitle: "", emoji: "🚗" },
        { time: "14:00", title: "柴迪隆寺 + 塔佩門", subtitle: "穿泰服、跟鴿子拍照", emoji: "👘" },
        { time: "19:00", title: "陪爸爸買伴手禮", subtitle: "", emoji: "🎁" },
      ],
      tasks: [], expenseToday: 0,
    },
    18: {
      day: 18, dateLabel: "16 Aug (Sun)", city: "Chiang Mai",
      timeline: [
        { time: "09:00", title: "Jing Jai Market", subtitle: "全家", emoji: "🛍️" },
        { time: "12:00", title: "Neng Earthen Jar Roast Pork", subtitle: "午餐", emoji: "🍖" },
        { time: "14:00", title: "按摩 + 睡午覺", subtitle: "Aroma Health Massage", emoji: "💆" },
      ],
      tasks: [], expenseToday: 0,
    },
    19: {
      day: 19, dateLabel: "17 Aug (Mon)", city: "Chiang Mai",
      timeline: [
        { time: "09:00", title: "烹飪營 Day1", subtitle: "Kids Cooking & English Camp", emoji: "👩‍🍳" },
        { time: "11:20", title: "爸爸飛機起飛", subtitle: "CI852 → 桃園", emoji: "✈️" },
        { time: "14:00", title: "母女時光", subtitle: "按摩 + 睡午覺", emoji: "💆" },
      ],
      tasks: [], expenseToday: 0,
    },
    20: {
      day: 20, dateLabel: "18 Aug (Tue)", city: "Chiang Mai",
      timeline: [
        { time: "09:00", title: "烹飪營 Day2", subtitle: "", emoji: "👩‍🍳" },
        { time: "14:00", title: "雞龍藥浴 + 按摩", subtitle: "睡午覺", emoji: "🛁" },
        { time: "17:00", title: "飯店游泳", subtitle: "", emoji: "🏊" },
      ],
      tasks: [], expenseToday: 0,
    },
    21: {
      day: 21, dateLabel: "19 Aug (Wed)", city: "Chiang Mai",
      timeline: [
        { time: "09:00", title: "烹飪營 Day3", subtitle: "", emoji: "👩‍🍳" },
        { time: "14:00", title: "URi Herbs Workshop", subtitle: "泰式草藥吸入器、按摩球", emoji: "🌿" },
        { time: "17:00", title: "飯店游泳", subtitle: "", emoji: "🏊" },
      ],
      tasks: [], expenseToday: 0,
    },
    22: {
      day: 22, dateLabel: "20 Aug (Thu)", city: "Chiang Mai",
      timeline: [
        { time: "09:00", title: "烹飪營 Day4", subtitle: "", emoji: "👩‍🍳" },
        { time: "14:00", title: "自由放鬆日", subtitle: "飯店游泳、咖啡廳、按摩", emoji: "☕" },
      ],
      tasks: [], expenseToday: 0,
    },
    23: {
      day: 23, dateLabel: "21 Aug (Fri)", city: "Chiang Mai",
      timeline: [
        { time: "09:00", title: "烹飪營 Day5", subtitle: "最後一天", emoji: "👩‍🍳" },
        { time: "14:00", title: "在地文化體驗", subtitle: "手作體驗、小廚房烘焙課", emoji: "🎨" },
        { time: "19:00", title: "晚上夜市", subtitle: "", emoji: "🌃" },
      ],
      tasks: [], expenseToday: 0,
    },
    24: {
      day: 24, dateLabel: "22 Aug (Sat)", city: "Chiang Mai",
      timeline: [
        { time: "10:00", title: "Princess Sirindhorn AstroPark", subtitle: "", emoji: "🔭" },
      ],
      tasks: [], expenseToday: 0,
    },
    25: {
      day: 25, dateLabel: "23 Aug (Sun)", city: "Chiang Mai",
      timeline: [
        { time: "11:00", title: "BOOK 設計飯店退房", subtitle: "住宿尚未安排，需確認", emoji: "🧳" },
        { time: "14:00", title: "親子泰式家庭料理課", subtitle: "", emoji: "👩‍🍳" },
      ],
      tasks: [], expenseToday: 0,
    },
    26: {
      day: 26, dateLabel: "24 Aug (Mon)", city: "Chiang Rai",
      timeline: [
        { time: "07:00", title: "出發前往清萊", subtitle: "車程約 3 小時", emoji: "🚗" },
        { time: "10:00", title: "長頸族部落", subtitle: "", emoji: "👘" },
        { time: "13:00", title: "黑白藍廟", subtitle: "", emoji: "🛕" },
      ],
      tasks: [], expenseToday: 0,
    },
    27: {
      day: 27, dateLabel: "25 Aug (Tue)", city: "Chiang Mai",
      timeline: [
        { time: "10:00", title: "Fahlanna Art Museum", subtitle: "", emoji: "🎨" },
      ],
      tasks: [], expenseToday: 0,
    },
    28: {
      day: 28, dateLabel: "26 Aug (Wed)", city: "Chiang Mai",
      timeline: [
        { time: "10:00", title: "退房前往機場", subtitle: "", emoji: "🧳" },
        { time: "--:--", title: "飛回台灣", subtitle: "機票尚未訂", emoji: "✈️" },
      ],
      tasks: [], expenseToday: 0,
    },
  } as Record<number, DayDetail>,

  memories: {
    photos: [
      { id: "p1", image: IMG.elephant },
      { id: "p2", image: IMG.city },
      { id: "p3", image: IMG.market },
    ] as MemoryPhoto[],
    quote: "哈囉今天第一次觸摸大象，牠的鼻子軟軟濕濕的！",
  },
};

export function getDaysLeft(startDateISO: string): number {
  const start = new Date(`${startDateISO}T00:00:00`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diffMs = start.getTime() - today.getTime();
  return Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
}

export function mapLink(query: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}
