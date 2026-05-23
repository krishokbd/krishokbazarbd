import { Star, ShoppingCart, BadgeCheck } from "lucide-react";
import { type Product, farmers } from "@/data/mock";
import { useI18n } from "@/lib/i18n";
import { useCart } from "@/lib/cart";
import { toast } from "sonner";

export function ProductCard({ p }: { p: Product }) {
  const { lang } = useI18n();
  const { add, setOpen } = useCart();
  const farmer = farmers.find(f => f.id === p.farmerId);
  const discount = p.oldPrice ? Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100) : 0;

  const handleAdd = () => {
    add(p, 1);
    toast.success(`${lang === "bn" ? p.titleBn : p.title} added`, {
      action: { label: "View cart", onClick: () => setOpen(true) },
    });
  };

  return (
    <article className="group relative bg-card rounded-2xl border border-border/60 overflow-hidden hover:shadow-elegant hover:border-primary/30 transition-all">
      <div className="relative aspect-square overflow-hidden bg-muted">
        <img src={p.image} alt={lang === "bn" ? p.titleBn : p.title} loading="lazy"
          className="absolute inset-0 h-full w-full object-cover group-hover:scale-110 transition-transform duration-700" />
        {discount > 0 && (
          <span className="absolute top-2 left-2 rounded-full bg-saffron text-white text-[10px] font-bold px-2 py-0.5">
            -{discount}% {lang === "bn" ? "ছাড়" : "OFF"}
          </span>
        )}
        {p.badge === "organic" && (
          <span className="absolute top-2 right-2 rounded-full bg-success text-white text-[10px] font-bold px-2 py-0.5">
            {lang === "bn" ? "অর্গানিক" : "ORGANIC"}
          </span>
        )}
        {p.badge === "ready" && (
          <span className="absolute top-2 right-2 rounded-full bg-primary text-white text-[10px] font-bold px-2 py-0.5">
            {lang === "bn" ? "রেডি" : "READY"}
          </span>
        )}
        {p.badge === "trending" && (
          <span className="absolute top-2 right-2 rounded-full bg-accent text-accent-foreground text-[10px] font-bold px-2 py-0.5">
            🔥 {lang === "bn" ? "ট্রেন্ডিং" : "HOT"}
          </span>
        )}
      </div>

      <div className="p-3 sm:p-4 space-y-2">
        <h3 className={`font-semibold text-sm sm:text-base leading-tight line-clamp-1 ${lang === "bn" ? "font-bn" : ""}`}>
          {lang === "bn" ? p.titleBn : p.title}
        </h3>

        {farmer && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <span className="truncate">{lang === "bn" ? farmer.nameBn : farmer.name}</span>
            {farmer.verified && <BadgeCheck className="h-3.5 w-3.5 text-primary shrink-0" />}
          </div>
        )}

        <div className="flex items-center gap-1 text-xs">
          <Star className="h-3.5 w-3.5 fill-saffron text-saffron" />
          <span className="font-medium">{p.rating}</span>
          <span className="text-muted-foreground">({p.reviews})</span>
        </div>

        <div className="flex items-end justify-between pt-1">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base sm:text-lg font-bold text-primary">৳{p.price}</span>
              {p.oldPrice && <span className="text-xs text-muted-foreground line-through">৳{p.oldPrice}</span>}
            </div>
            <div className="text-[10px] text-muted-foreground">{p.unit}</div>
          </div>
          <button onClick={handleAdd} className="h-9 w-9 rounded-full bg-primary text-primary-foreground grid place-items-center hover:bg-primary-glow transition shadow-soft" aria-label={lang === "bn" ? "কার্টে যোগ" : "Add to cart"}>
            <ShoppingCart className="h-4 w-4" />
          </button>
        </div>
      </div>
    </article>
  );
}
