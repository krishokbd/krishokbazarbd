import { Heart, Leaf, Users } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export function OurStory() {
  const { lang, tr } = useI18n();
  return (
    <section id="story" className="py-16 lg:py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/20 pointer-events-none" />
      <div className="container mx-auto px-4 lg:px-6 relative">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="relative">
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-elegant">
              <img src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1200&q=80" alt="" className="absolute inset-0 h-full w-full object-cover" />
            </div>
            <div className="absolute -bottom-6 -right-6 hidden sm:block bg-card border border-border/60 rounded-2xl shadow-elegant p-5 max-w-[240px]">
              <div className="text-3xl font-bold text-primary">৪৫০+</div>
              <div className={`text-sm text-muted-foreground ${lang === "bn" ? "font-bn" : ""}`}>{lang === "bn" ? "কৃষক পরিবার আমাদের সাথে" : "Farmer families with us"}</div>
            </div>
          </div>

          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-medium">
              <Heart className="h-3.5 w-3.5" /> {tr("ourStory")}
            </span>
            <h2 className={`mt-4 text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-balance ${lang === "bn" ? "font-bn" : ""}`}>
              {tr("storyTitle")}
            </h2>
            <p className={`mt-5 text-base sm:text-lg text-muted-foreground leading-relaxed ${lang === "bn" ? "font-bn" : ""}`}>
              {tr("storyBody")}
            </p>

            <div className="mt-8 grid sm:grid-cols-2 gap-4">
              {[
                { icon: Users, n: "৪৫০+", bn: "ভেরিফায়েড কৃষক", en: "Verified farmers" },
                { icon: Leaf, n: "১২,০০০+", bn: "সন্তুষ্ট পরিবার", en: "Happy families" },
              ].map((s, i) => (
                <div key={i} className="rounded-2xl bg-card border border-border/60 p-5">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 grid place-items-center text-primary mb-3">
                    <s.icon className="h-5 w-5" />
                  </div>
                  <div className="text-2xl font-bold">{s.n}</div>
                  <div className={`text-sm text-muted-foreground ${lang === "bn" ? "font-bn" : ""}`}>{lang === "bn" ? s.bn : s.en}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
