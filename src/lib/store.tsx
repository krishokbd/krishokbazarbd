// Client-side data store with localStorage persistence.
// Wraps seeded mock data and exposes reactive CRUD for the admin CMS.
// Will be swapped for Lovable Cloud queries when backend is wired.

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  categories as seedCategories,
  farmers as seedFarmers,
  products as seedProducts,
  reviews as seedReviews,
  heroSlides as seedSlides,
  type Category,
  type Farmer,
  type Product,
  type Review,
} from "@/data/mock";

export interface Banner {
  id: string;
  titleBn: string;
  titleEn: string;
  subBn: string;
  subEn: string;
  image: string;
  active: boolean;
}

interface StoreState {
  categories: Category[];
  farmers: Farmer[];
  products: Product[];
  reviews: Review[];
  banners: Banner[];
}

const KEY = "kb-store-v1";

const initialBanners: Banner[] = seedSlides.map((s, i) => ({
  id: `b-${i + 1}`,
  titleBn: s.titleBn,
  titleEn: s.titleEn,
  subBn: s.subBn,
  subEn: s.subEn,
  image: s.img,
  active: true,
}));

const initialState: StoreState = {
  categories: seedCategories,
  farmers: seedFarmers,
  products: seedProducts,
  reviews: seedReviews,
  banners: initialBanners,
};

function load(): StoreState {
  if (typeof window === "undefined") return initialState;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return initialState;
    const parsed = JSON.parse(raw) as Partial<StoreState>;
    return { ...initialState, ...parsed };
  } catch {
    return initialState;
  }
}

function save(state: StoreState) {
  if (typeof window === "undefined") return;
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch {}
}

function uid(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

interface StoreCtx extends StoreState {
  // products
  addProduct: (p: Omit<Product, "id">) => void;
  updateProduct: (id: string, p: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  // farmers
  addFarmer: (f: Omit<Farmer, "id">) => void;
  updateFarmer: (id: string, f: Partial<Farmer>) => void;
  deleteFarmer: (id: string) => void;
  toggleFarmerVerified: (id: string) => void;
  // categories
  addCategory: (c: Category) => void;
  updateCategory: (slug: string, c: Partial<Category>) => void;
  deleteCategory: (slug: string) => void;
  // reviews
  addReview: (r: Omit<Review, "id">) => void;
  updateReview: (id: string, r: Partial<Review>) => void;
  deleteReview: (id: string) => void;
  // banners
  addBanner: (b: Omit<Banner, "id">) => void;
  updateBanner: (id: string, b: Partial<Banner>) => void;
  deleteBanner: (id: string) => void;
  resetAll: () => void;
}

const Ctx = createContext<StoreCtx | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<StoreState>(initialState);
  const [ready, setReady] = useState(false);

  useEffect(() => { setState(load()); setReady(true); }, []);
  useEffect(() => { if (ready) save(state); }, [state, ready]);

  const api = useMemo<StoreCtx>(() => ({
    ...state,
    addProduct: (p) => setState(s => ({ ...s, products: [{ ...p, id: uid("p") }, ...s.products] })),
    updateProduct: (id, p) => setState(s => ({ ...s, products: s.products.map(x => x.id === id ? { ...x, ...p } : x) })),
    deleteProduct: (id) => setState(s => ({ ...s, products: s.products.filter(x => x.id !== id) })),

    addFarmer: (f) => setState(s => ({ ...s, farmers: [{ ...f, id: uid("fm") }, ...s.farmers] })),
    updateFarmer: (id, f) => setState(s => ({ ...s, farmers: s.farmers.map(x => x.id === id ? { ...x, ...f } : x) })),
    deleteFarmer: (id) => setState(s => ({ ...s, farmers: s.farmers.filter(x => x.id !== id) })),
    toggleFarmerVerified: (id) => setState(s => ({ ...s, farmers: s.farmers.map(x => x.id === id ? { ...x, verified: !x.verified } : x) })),

    addCategory: (c) => setState(s => ({ ...s, categories: [...s.categories, c] })),
    updateCategory: (slug, c) => setState(s => ({ ...s, categories: s.categories.map(x => x.slug === slug ? { ...x, ...c } : x) })),
    deleteCategory: (slug) => setState(s => ({ ...s, categories: s.categories.filter(x => x.slug !== slug) })),

    addReview: (r) => setState(s => ({ ...s, reviews: [{ ...r, id: uid("r") }, ...s.reviews] })),
    updateReview: (id, r) => setState(s => ({ ...s, reviews: s.reviews.map(x => x.id === id ? { ...x, ...r } : x) })),
    deleteReview: (id) => setState(s => ({ ...s, reviews: s.reviews.filter(x => x.id !== id) })),

    addBanner: (b) => setState(s => ({ ...s, banners: [...s.banners, { ...b, id: uid("b") }] })),
    updateBanner: (id, b) => setState(s => ({ ...s, banners: s.banners.map(x => x.id === id ? { ...x, ...b } : x) })),
    deleteBanner: (id) => setState(s => ({ ...s, banners: s.banners.filter(x => x.id !== id) })),

    resetAll: () => { localStorage.removeItem(KEY); setState(initialState); },
  }), [state]);

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}

export function useStore() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}

export function useStoreOptional() {
  return useContext(Ctx);
}
