import { useState } from "react";
import { products, categories } from "@/data/mock";
import { useI18n } from "@/lib/i18n";
import { ProductCard } from "./ProductCard";

export function ProductsSection({ id, titleKey, filter, limit = 10 }: {
  id: string; titleKey: "featured" | "trending" | "readyToCook"; filter?: (p: typeof products[number]) => boolean; limit?: number;
}) {
  const { lang, tr } = useI18n();
  const list = (filter ? products.filter(filter) : products).slice(0, limit);

  return (
    <section id={id} className="py-12 lg:py-16">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className={`text-2xl sm:text-3xl lg:text-4xl font-bold ${lang === "bn" ? "font-bn" : ""}`}>{tr(titleKey)}</h2>
            <p className="text-muted-foreground text-sm mt-1">{lang === "bn" ? "ভেরিফায়েড কৃষকের সেরা নির্বাচন" : "Best picks from verified farmers"}</p>
          </div>
          <button className="text-sm text-primary font-medium hover:underline">{tr("shopAll")}</button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {list.map(p => <ProductCard key={p.id} p={p} />)}
        </div>
      </div>
    </section>
  );
}

export function AllProductsByCategory() {
  const { lang, tr } = useI18n();
  const [active, setActive] = useState<string>("vegetables");
  const list = products.filter(p => p.category === active).slice(0, 10);

  return (
    <section id="shop" className="py-12 lg:py-16 bg-muted/40">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="flex items-end justify-between mb-6">
          <h2 className={`text-2xl sm:text-3xl lg:text-4xl font-bold ${lang === "bn" ? "font-bn" : ""}`}>{tr("trending")}</h2>
          <button className="text-sm text-primary font-medium hover:underline">{tr("shopAll")}</button>
        </div>

        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-3 mb-6 -mx-4 px-4">
          {categories.map(c => (
            <button
              key={c.slug}
              onClick={() => setActive(c.slug)}
              className={`shrink-0 inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition ${
                active === c.slug ? "bg-primary text-primary-foreground shadow-soft" : "bg-card border border-border/60 hover:border-primary/30"
              } ${lang === "bn" ? "font-bn" : ""}`}
            >
              <span>{c.emoji}</span> {lang === "bn" ? c.bn : c.en}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {list.map(p => <ProductCard key={p.id} p={p} />)}
        </div>
      </div>
    </section>
  );
}
