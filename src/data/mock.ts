// Seeded mock data for the marketplace. Replace with Lovable Cloud queries in Phase 2.

export interface Category {
  slug: string;
  bn: string;
  en: string;
  emoji: string;
  count: number;
  tint: string; // tailwind bg class hint
}

export interface Farmer {
  id: string;
  name: string;
  nameBn: string;
  gender: "male" | "female";
  district: string;
  districtBn: string;
  verified: boolean;
  rating: number;
  products: number;
  sales: number;
  category: string;
}

export interface Product {
  id: string;
  title: string;
  titleBn: string;
  category: string;
  price: number;
  oldPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  farmerId: string;
  unit?: string;
  badge?: "new" | "trending" | "organic" | "ready";
}

export interface Review {
  id: string;
  name: string;
  nameBn: string;
  district: string;
  rating: number;
  bn: string;
  en: string;
  avatar: string;
}

export const categories: Category[] = [
  { slug: "vegetables", bn: "সবজি", en: "Vegetables", emoji: "🥬", count: 42, tint: "from-emerald-500/15 to-emerald-500/0" },
  { slug: "fruits", bn: "ফল", en: "Fruits", emoji: "🥭", count: 28, tint: "from-orange-500/15 to-orange-500/0" },
  { slug: "fish", bn: "মাছ", en: "Fish", emoji: "🐟", count: 22, tint: "from-sky-500/15 to-sky-500/0" },
  { slug: "meat", bn: "মাংস", en: "Meat", emoji: "🥩", count: 16, tint: "from-rose-500/15 to-rose-500/0" },
  { slug: "honey", bn: "মধু", en: "Honey", emoji: "🍯", count: 9, tint: "from-amber-500/15 to-amber-500/0" },
  { slug: "spices", bn: "মসলা", en: "Spices", emoji: "🌶️", count: 24, tint: "from-red-500/15 to-red-500/0" },
  { slug: "organic", bn: "অর্গানিক", en: "Organic", emoji: "🌿", count: 31, tint: "from-lime-500/15 to-lime-500/0" },
  { slug: "rice", bn: "চাল", en: "Rice", emoji: "🌾", count: 18, tint: "from-yellow-600/15 to-yellow-600/0" },
  { slug: "dairy", bn: "দুগ্ধ", en: "Dairy", emoji: "🥛", count: 14, tint: "from-blue-300/20 to-blue-300/0" },
  { slug: "ready", bn: "রেডি-টু-কুক", en: "Ready to Cook", emoji: "🍲", count: 19, tint: "from-fuchsia-500/15 to-fuchsia-500/0" },
];

const districts = [
  ["Rangpur", "রংপুর"], ["Bogura", "বগুড়া"], ["Jessore", "যশোর"], ["Comilla", "কুমিল্লা"],
  ["Mymensingh", "ময়মনসিংহ"], ["Sylhet", "সিলেট"], ["Khulna", "খুলনা"], ["Rajshahi", "রাজশাহী"],
  ["Faridpur", "ফরিদপুর"], ["Tangail", "টাঙ্গাইল"],
];

const maleNames = [
  ["Karim Mia", "করিম মিয়া"], ["Rahim Uddin", "রহিম উদ্দিন"], ["Jamal Hossain", "জামাল হোসেন"],
  ["Sohel Rana", "সোহেল রানা"], ["Abdul Kuddus", "আব্দুল কুদ্দুস"], ["Liton Sarker", "লিটন সরকার"],
  ["Nasir Ahmed", "নাসির আহমেদ"], ["Mizanur Rahman", "মিজানুর রহমান"], ["Belal Hossain", "বেলাল হোসেন"],
  ["Shahin Alam", "শাহিন আলম"], ["Hafiz Mia", "হাফিজ মিয়া"], ["Selim Reza", "সেলিম রেজা"],
  ["Forhad Ali", "ফরহাদ আলী"], ["Akkas Mondol", "আক্কাস মন্ডল"], ["Mostafa Kamal", "মোস্তফা কামাল"],
  ["Jahangir Alam", "জাহাঙ্গীর আলম"], ["Babul Mia", "বাবুল মিয়া"], ["Rafiq Sheikh", "রফিক শেখ"],
  ["Anwar Hossain", "আনোয়ার হোসেন"], ["Kabir Khan", "কবির খান"],
];

const femaleNames = [
  ["Rahima Begum", "রহিমা বেগম"], ["Salma Khatun", "সালমা খাতুন"], ["Nargis Akter", "নার্গিস আক্তার"],
  ["Halima Begum", "হালিমা বেগম"], ["Fatema Khatun", "ফাতেমা খাতুন"], ["Roshni Akter", "রোশনি আক্তার"],
  ["Shahana Parvin", "শাহানা পারভীন"], ["Morjina Begum", "মর্জিনা বেগম"], ["Asma Khatun", "আসমা খাতুন"],
  ["Rina Akter", "রিনা আক্তার"],
];

const cats = ["vegetables", "fruits", "fish", "meat", "honey", "spices", "organic", "rice", "dairy", "ready"];

export const farmers: Farmer[] = [
  ...maleNames.map(([n, nb], i) => ({
    id: `fm-${i + 1}`,
    name: n, nameBn: nb, gender: "male" as const,
    district: districts[i % districts.length][0],
    districtBn: districts[i % districts.length][1],
    verified: i % 4 !== 0,
    rating: +(4.3 + ((i * 7) % 7) / 10).toFixed(1),
    products: 12 + (i * 5) % 60,
    sales: 200 + (i * 137) % 1800,
    category: cats[i % cats.length],
  })),
  ...femaleNames.map(([n, nb], i) => ({
    id: `ff-${i + 1}`,
    name: n, nameBn: nb, gender: "female" as const,
    district: districts[(i + 3) % districts.length][0],
    districtBn: districts[(i + 3) % districts.length][1],
    verified: i % 3 !== 0,
    rating: +(4.4 + ((i * 5) % 6) / 10).toFixed(1),
    products: 8 + (i * 6) % 40,
    sales: 150 + (i * 211) % 1500,
    category: cats[(i + 2) % cats.length],
  })),
];

// Image pool (Unsplash, free use). Multiple images per category for variety.
const imgs: Record<string, string[]> = {
  vegetables: [
    "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=800&q=80",
    "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&q=80",
    "https://images.unsplash.com/photo-1597362925123-77861d3fbac7?w=800&q=80",
    "https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?w=800&q=80",
  ],
  fruits: [
    "https://images.unsplash.com/photo-1553279768-865429fa0078?w=800&q=80",
    "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=800&q=80",
    "https://images.unsplash.com/photo-1605027990121-cbae9e0642db?w=800&q=80",
    "https://images.unsplash.com/photo-1528825871115-3581a5387919?w=800&q=80",
  ],
  fish: [
    "https://images.unsplash.com/photo-1535596139014-031a86d3a0d3?w=800&q=80",
    "https://images.unsplash.com/photo-1574781330855-d0db8cc6a79c?w=800&q=80",
    "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80",
  ],
  meat: [
    "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=800&q=80",
    "https://images.unsplash.com/photo-1603048297172-c92544798d5b?w=800&q=80",
  ],
  honey: [
    "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=800&q=80",
    "https://images.unsplash.com/photo-1471943311424-646960669fbc?w=800&q=80",
  ],
  spices: [
    "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&q=80",
    "https://images.unsplash.com/photo-1532336414038-cf19250c5757?w=800&q=80",
    "https://images.unsplash.com/photo-1599909533730-b51df5cf2c39?w=800&q=80",
  ],
  organic: [
    "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80",
    "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800&q=80",
  ],
  rice: [
    "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&q=80",
    "https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=800&q=80",
  ],
  dairy: [
    "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=800&q=80",
    "https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=800&q=80",
  ],
  ready: [
    "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80",
    "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=800&q=80",
    "https://images.unsplash.com/photo-1543353071-10c8ba85a904?w=800&q=80",
  ],
};

const productTitles: Record<string, [string, string][]> = {
  vegetables: [["Fresh Tomato", "টাটকা টমেটো"], ["Green Chili", "কাঁচা মরিচ"], ["Cauliflower", "ফুলকপি"], ["Brinjal", "বেগুন"], ["Pumpkin", "মিষ্টি কুমড়া"], ["Bottle Gourd", "লাউ"], ["Spinach", "পালং শাক"], ["Okra", "ঢেঁড়স"]],
  fruits: [["Langra Mango", "ল্যাংড়া আম"], ["Himsagar Mango", "হিমসাগর আম"], ["Sweet Banana", "মিষ্টি কলা"], ["Papaya", "পেঁপে"], ["Guava", "পেয়ারা"], ["Litchi", "লিচু"], ["Jackfruit", "কাঁঠাল"]],
  fish: [["Hilsa Fish", "ইলিশ মাছ"], ["Rui Fish", "রুই মাছ"], ["Pabda Fish", "পাবদা মাছ"], ["Koi Fish", "কই মাছ"], ["Shrimp", "চিংড়ি"]],
  meat: [["Country Chicken", "দেশি মুরগি"], ["Beef", "গরুর মাংস"], ["Mutton", "খাসির মাংস"], ["Duck", "দেশি হাঁস"]],
  honey: [["Sundarban Honey", "সুন্দরবনের মধু"], ["Mustard Honey", "সরিষা ফুলের মধু"], ["Litchi Honey", "লিচু ফুলের মধু"]],
  spices: [["Turmeric Powder", "হলুদ গুঁড়া"], ["Red Chili Powder", "মরিচ গুঁড়া"], ["Cumin", "জিরা"], ["Coriander", "ধনিয়া"], ["Mustard Oil", "সরিষার তেল"]],
  organic: [["Organic Vegetable Pack", "অর্গানিক সবজি প্যাক"], ["Organic Eggs", "অর্গানিক ডিম"], ["Organic Pulses", "অর্গানিক ডাল"]],
  rice: [["Kataribhog Rice", "কাটারিভোগ চাল"], ["Chinigura Rice", "চিনিগুঁড়া চাল"], ["Najirshail Rice", "নাজিরশাইল চাল"], ["Miniket Rice", "মিনিকেট চাল"]],
  dairy: [["Pure Cow Milk", "খাঁটি গরুর দুধ"], ["Fresh Yogurt", "টাটকা দই"], ["Mishti Doi", "মিষ্টি দই"], ["Ghee", "ঘি"]],
  ready: [["Cut Mixed Veggies", "কাটা মিক্স সবজি"], ["Washed Spinach", "ধোয়া পালং"], ["Cleaned Hilsa Pcs", "পরিষ্কার ইলিশ"], ["Marinated Chicken", "ম্যারিনেটেড মুরগি"], ["Ready Beef Curry Pack", "রেডি বিফ প্যাক"]],
};

function pseudo(n: number, mod: number) { return Math.abs(Math.sin(n * 12.9898) * 43758.5453) % 1 * mod; }

export const products: Product[] = (() => {
  const out: Product[] = [];
  let id = 1;
  for (const cat of cats) {
    const titles = productTitles[cat];
    const catImgs = imgs[cat];
    const catFarmers = farmers.filter(f => f.category === cat);
    const pool = catFarmers.length ? catFarmers : farmers;
    for (let i = 0; i < 15; i++) {
      const [t, tb] = titles[i % titles.length];
      const variant = i >= titles.length ? ` #${Math.floor(i / titles.length) + 1}` : "";
      const basePrice = 60 + Math.floor(pseudo(id, 400));
      const discount = id % 3 === 0;
      out.push({
        id: `p-${id}`,
        title: t + variant,
        titleBn: tb + (variant ? ` #${Math.floor(i / titles.length) + 1}` : ""),
        category: cat,
        price: discount ? Math.round(basePrice * 0.82) : basePrice,
        oldPrice: discount ? basePrice : undefined,
        rating: +(4.2 + pseudo(id + 1, 0.7)).toFixed(1),
        reviews: 10 + Math.floor(pseudo(id + 2, 380)),
        image: catImgs[i % catImgs.length],
        farmerId: pool[i % pool.length].id,
        unit: cat === "ready" ? "/প্যাক" : cat === "dairy" ? "/লিটার" : "/কেজি",
        badge: cat === "ready" ? "ready" : cat === "organic" ? "organic" : id % 5 === 0 ? "trending" : id % 7 === 0 ? "new" : undefined,
      });
      id++;
    }
  }
  return out;
})();

export const reviews: Review[] = [
  { id: "r1", name: "Tahmid Hasan", nameBn: "তাহমিদ হাসান", district: "Dhaka", rating: 5,
    bn: "ইলিশ মাছটা একদম টাটকা ছিল, পরিবার সবাই খুশি। দাম বাজারের চেয়ে কম!",
    en: "The hilsa was super fresh — the whole family loved it. Cheaper than the local market!",
    avatar: "https://i.pravatar.cc/150?img=12" },
  { id: "r2", name: "Sumaiya Akter", nameBn: "সুমাইয়া আক্তার", district: "Chittagong", rating: 5,
    bn: "অর্গানিক সবজি বাচ্চার জন্য নিচ্ছি প্রতি সপ্তাহে। কেমিক্যাল ছাড়া খাবারের ভরসা কৃষক বাজার।",
    en: "I order organic veggies weekly for my child. Krishok Bazar is my trusted source for clean food.",
    avatar: "https://i.pravatar.cc/150?img=47" },
  { id: "r3", name: "Imran Khan", nameBn: "ইমরান খান", district: "Sylhet", rating: 4,
    bn: "ডেলিভারি সময়মতো এসেছে। মধুটা সত্যিই খাঁটি মনে হলো।",
    en: "Delivery was on time and the honey tastes genuinely pure.",
    avatar: "https://i.pravatar.cc/150?img=33" },
  { id: "r4", name: "Nusrat Jahan", nameBn: "নুসরাত জাহান", district: "Rajshahi", rating: 5,
    bn: "রেডি-টু-কুক প্যাকেজ অফিস থেকে এসে রান্না করতে সময় বাঁচায়। দারুণ আইডিয়া!",
    en: "The ready-to-cook packs save me so much time after work. Brilliant idea!",
    avatar: "https://i.pravatar.cc/150?img=44" },
  { id: "r5", name: "Rezaul Karim", nameBn: "রেজাউল করিম", district: "Khulna", rating: 5,
    bn: "চিনিগুঁড়া চালের সুবাস এখনো মনে পড়ছে। কৃষকের সাথে সরাসরি কথা বলাও যায়।",
    en: "The fragrance of the Chinigura rice was unforgettable. Loved that I could chat with the farmer.",
    avatar: "https://i.pravatar.cc/150?img=15" },
  { id: "r6", name: "Farzana Hossain", nameBn: "ফারজানা হোসেন", district: "Mymensingh", rating: 4,
    bn: "প্যাকিং খুব সুন্দর। আম একদম গাছ পাকা।",
    en: "Beautiful packaging. The mangoes were tree-ripened, not chemically forced.",
    avatar: "https://i.pravatar.cc/150?img=49" },
  { id: "r7", name: "Mahbubur Rahman", nameBn: "মাহবুবুর রহমান", district: "Rangpur", rating: 5,
    bn: "দেশি মুরগি অর্ডার করেছিলাম, একদম খাঁটি। কৃষকের পরিচয়ও জানানো হয়েছে।",
    en: "Ordered country chicken — totally authentic, and they told me about the farmer.",
    avatar: "https://i.pravatar.cc/150?img=68" },
  { id: "r8", name: "Tania Sultana", nameBn: "তানিয়া সুলতানা", district: "Comilla", rating: 5,
    bn: "প্রথম অর্ডারেই মন জয় করে নিয়েছে। ধন্যবাদ কৃষক বাজার!",
    en: "Won me over on the first order. Thank you, Krishok Bazar!",
    avatar: "https://i.pravatar.cc/150?img=25" },
];

export const heroSlides = [
  {
    titleBn: "দালাল ছাড়া বাজার — সরাসরি কৃষকের কাছ থেকে",
    titleEn: "Markets without middlemen — straight from the farmer",
    subBn: "টাটকা সবজি, ফল, মাছ — কৃষক বাঁচুক, আপনি ভালো থাকুন",
    subEn: "Fresh vegetables, fruits, fish — better for farmers, better for you",
    cta: "allProducts" as const,
    img: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1600&q=80",
  },
  {
    titleBn: "আজকের টাটকা সবজি ও ফল",
    titleEn: "Today's freshest harvest",
    subBn: "মাঠ থেকে আপনার ঘর — মাত্র ২৪ ঘণ্টায়",
    subEn: "From the field to your kitchen — within 24 hours",
    cta: "seeFarmers" as const,
    img: "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=1600&q=80",
  },
  {
    titleBn: "রেডি-টু-কুক — ব্যস্ত দিনের সঙ্গী",
    titleEn: "Ready-to-cook — for the busy day",
    subBn: "কাটা, ধোয়া, ম্যারিনেট করা — শুধু চুলায় বসান",
    subEn: "Cut, washed, marinated — just put it on the stove",
    cta: "readyToCook" as const,
    img: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1600&q=80",
  },
];
