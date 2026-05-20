import { categories } from "@/data/mock";
import { useI18n } from "@/lib/i18n";

export function Categories() {
  const { lang, tr } = useI18n();
  return (
    <section id="categories" className="py-14 lg:py-20">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className={`text-2xl sm:text-3xl lg:text-4xl font-bold ${lang === "bn" ? "font-bn" : ""}`}>{tr("categories")}</h2>
            <p className="text-muted-foreground mt-1 text-sm">{lang === "bn" ? "আপনার দরকারি সব এক জায়গায়" : "Everything you need, in one place"}</p>
          </div>
          <button className="text-sm text-primary font-medium hover:underline hidden sm:inline-block">{tr("shopAll")}</button>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-10 gap-3">
          {categories.map((c) => (
            <a
              key={c.slug}
              href={`#cat-${c.slug}`}
              className={`group relative aspect-square rounded-2xl bg-gradient-to-br ${c.tint} bg-card border border-border/60 hover:border-primary/40 hover:shadow-soft transition flex flex-col items-center justify-center text-center p-3`}
            >
              <span className="text-3xl sm:text-4xl group-hover:scale-110 transition-transform">{c.emoji}</span>
              <div className={`mt-1.5 text-xs sm:text-sm font-semibold leading-tight ${lang === "bn" ? "font-bn" : ""}`}>{lang === "bn" ? c.bn : c.en}</div>
              <div className="text-[10px] text-muted-foreground">{c.count}+ {lang === "bn" ? "পণ্য" : "items"}</div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
