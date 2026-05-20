import { Star, Quote } from "lucide-react";
import { reviews } from "@/data/mock";
import { useI18n } from "@/lib/i18n";

export function ReviewsSection() {
  const { lang, tr } = useI18n();
  return (
    <section id="reviews" className="py-14 lg:py-20 bg-muted/40">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="text-center mb-10 max-w-2xl mx-auto">
          <h2 className={`text-2xl sm:text-3xl lg:text-4xl font-bold ${lang === "bn" ? "font-bn" : ""}`}>{tr("reviews")}</h2>
          <p className="text-muted-foreground text-sm mt-2">{lang === "bn" ? "হাজারো পরিবার যাদের ভরসা কৃষক বাজার" : "Trusted by thousands of families"}</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {reviews.map(r => (
            <figure key={r.id} className="relative bg-card rounded-2xl border border-border/60 p-5 hover:shadow-soft transition">
              <Quote className="absolute top-4 right-4 h-7 w-7 text-primary/15" />
              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`h-4 w-4 ${i < r.rating ? "fill-saffron text-saffron" : "text-muted-foreground/30"}`} />
                ))}
              </div>
              <blockquote className={`text-sm leading-relaxed mb-4 ${lang === "bn" ? "font-bn" : ""}`}>
                {lang === "bn" ? r.bn : r.en}
              </blockquote>
              <figcaption className="flex items-center gap-3 pt-3 border-t border-border/60">
                <img src={r.avatar} alt="" className="h-10 w-10 rounded-full object-cover" />
                <div className="min-w-0">
                  <div className={`text-sm font-semibold truncate ${lang === "bn" ? "font-bn" : ""}`}>{lang === "bn" ? r.nameBn : r.name}</div>
                  <div className="text-xs text-muted-foreground">{r.district}</div>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
