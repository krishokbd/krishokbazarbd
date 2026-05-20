import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "bn" | "en";

type Dict = Record<string, { bn: string; en: string }>;

export const t: Dict = {
  brand: { bn: "কৃষক বাজার", en: "Krishok Bazar" },
  tagline: { bn: "দালাল ছাড়া বাজার — সরাসরি কৃষকের কাছ থেকে", en: "Markets without middlemen — straight from the farmer" },
  search: { bn: "পণ্য, কৃষক বা ক্যাটাগরি খুঁজুন...", en: "Search products, farmers or categories..." },
  cart: { bn: "কার্ট", en: "Cart" },
  customerLogin: { bn: "কাস্টমার লগইন", en: "Customer Login" },
  farmerLogin: { bn: "কৃষক লগইন", en: "Farmer Login" },
  allProducts: { bn: "সব পণ্য দেখুন", en: "Browse all products" },
  readyToCook: { bn: "রেডি-টু-কুক", en: "Ready to Cook" },
  seeFarmers: { bn: "কৃষকদের দেখুন", en: "Meet the farmers" },
  buyNow: { bn: "এখনই কিনুন", en: "Buy now" },
  categories: { bn: "ক্যাটাগরি", en: "Categories" },
  featured: { bn: "ফিচার্ড পণ্য", en: "Featured products" },
  trending: { bn: "ট্রেন্ডিং পণ্য", en: "Trending now" },
  verifiedFarmers: { bn: "ভেরিফায়েড কৃষক", en: "Verified farmers" },
  reviews: { bn: "কাস্টমার রিভিউ", en: "Customer reviews" },
  ourStory: { bn: "আমাদের গল্প", en: "Our story" },
  storyTitle: { bn: "মাটি থেকে টেবিল পর্যন্ত — সরাসরি", en: "From soil to table — directly" },
  storyBody: {
    bn: "বাংলাদেশের কৃষক দিনরাত পরিশ্রম করেন, কিন্তু ন্যায্য দাম পান না। মাঝে দাঁড়ায় দালাল। কৃষক বাজার সেই দেয়াল ভাঙছে — কৃষক সরাসরি বিক্রি করেন, আপনি পান টাটকা, ভেজালমুক্ত খাবার, ন্যায্য দামে। প্রতিটি পণ্যের পেছনে আছে একটি পরিবার, একটি গল্প।",
    en: "Bangladesh's farmers work hard but rarely earn fairly — middlemen take the margin. Krishok Bazar removes that wall. Farmers sell directly, you get fresh, chemical-free food at a fair price. Behind every product is a family and a story.",
  },
  verified: { bn: "ভেরিফায়েড", en: "Verified" },
  rating: { bn: "রেটিং", en: "Rating" },
  products: { bn: "পণ্য", en: "Products" },
  sales: { bn: "বিক্রি", en: "Sales" },
  addToCart: { bn: "কার্টে যোগ করুন", en: "Add to cart" },
  perKg: { bn: "/কেজি", en: "/kg" },
  shopAll: { bn: "সব দেখুন →", en: "See all →" },
  footerAbout: { bn: "বাংলাদেশের প্রথম ভেজালমুক্ত কৃষক-টু-কাস্টমার মার্কেটপ্লেস।", en: "Bangladesh's first chemical-free farmer-to-customer marketplace." },
  quickLinks: { bn: "কুইক লিংক", en: "Quick links" },
  contact: { bn: "যোগাযোগ", en: "Contact" },
  followUs: { bn: "ফলো করুন", en: "Follow us" },
  rights: { bn: "© ২০২৫ কৃষক বাজার। সর্বস্বত্ব সংরক্ষিত।", en: "© 2025 Krishok Bazar. All rights reserved." },
  loading: { bn: "লোড হচ্ছে...", en: "Loading..." },
  off: { bn: "ছাড়", en: "OFF" },
  freeDelivery: { bn: "ফ্রি ডেলিভারি", en: "Free delivery" },
};

interface I18nCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  tr: (key: keyof typeof t) => string;
}

const Ctx = createContext<I18nCtx | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("bn");

  useEffect(() => {
    const saved = typeof window !== "undefined" ? (localStorage.getItem("kb-lang") as Lang | null) : null;
    if (saved === "bn" || saved === "en") setLangState(saved);
  }, []);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = lang;
    }
  }, [lang]);

  const setLang = (l: Lang) => {
    setLangState(l);
    if (typeof window !== "undefined") localStorage.setItem("kb-lang", l);
  };

  const tr = (key: keyof typeof t) => t[key]?.[lang] ?? key;

  return <Ctx.Provider value={{ lang, setLang, tr }}>{children}</Ctx.Provider>;
}

export function useI18n() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
