import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Product } from "@/data/mock";
import { farmers as mockFarmers } from "@/data/mock";

export interface CartItem {
  product_id: string;
  title: string;
  titleBn: string;
  image: string;
  unit: string;
  price: number;
  quantity: number;
  farmer_id: string;
  farmer_name: string;
}

interface CartCtx {
  items: CartItem[];
  count: number;
  subtotal: number;
  add: (p: Product, qty?: number) => void;
  setQty: (productId: string, qty: number) => void;
  remove: (productId: string) => void;
  clear: () => void;
  open: boolean;
  setOpen: (o: boolean) => void;
}

const STORAGE_KEY = "kb_cart_v1";
const Ctx = createContext<CartCtx | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); } catch { /* ignore */ }
  }, [items]);

  const add: CartCtx["add"] = (p, qty = 1) => {
    const farmer = mockFarmers.find(f => f.id === p.farmerId);
    setItems(prev => {
      const existing = prev.find(i => i.product_id === p.id);
      if (existing) {
        return prev.map(i => i.product_id === p.id ? { ...i, quantity: i.quantity + qty } : i);
      }
      return [...prev, {
        product_id: p.id,
        title: p.title,
        titleBn: p.titleBn,
        image: p.image,
        unit: p.unit ?? "/কেজি",
        price: p.price,
        quantity: qty,
        farmer_id: p.farmerId,
        farmer_name: farmer?.name ?? "",
      }];
    });
  };

  const setQty: CartCtx["setQty"] = (productId, qty) => {
    if (qty <= 0) return remove(productId);
    setItems(prev => prev.map(i => i.product_id === productId ? { ...i, quantity: qty } : i));
  };

  const remove: CartCtx["remove"] = (productId) =>
    setItems(prev => prev.filter(i => i.product_id !== productId));

  const clear = () => setItems([]);

  const { count, subtotal } = useMemo(() => ({
    count: items.reduce((n, i) => n + i.quantity, 0),
    subtotal: items.reduce((n, i) => n + i.price * i.quantity, 0),
  }), [items]);

  return (
    <Ctx.Provider value={{ items, count, subtotal, add, setQty, remove, clear, open, setOpen }}>
      {children}
    </Ctx.Provider>
  );
}

export function useCart() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart must be used within CartProvider");
  return c;
}
