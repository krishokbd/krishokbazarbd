import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight, Leaf, ShieldCheck, Truck } from "lucide-react";
import { heroSlides } from "@/data/mock";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";

export function Hero() {
  const { lang, tr } = useI18n();
  const [i, setI] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setI(v => (v + 1) % heroSlides.length), 6000);
    return () => clearInterval(t);
  }, []);

  const s = heroSlides[i];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background">
      {/* organic blobs */}
      <div className="absolute top-10 right-0 h-72 w-72 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-accent/30 blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 lg:px-6 py-10 lg:py-16">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left text */}
          <div className="relative z-10 order-2 lg:order-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.5 }}
              >
                <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-medium">
                  <Leaf className="h-3.5 w-3.5" /> {lang === "bn" ? "১০০% খাঁটি ও ভেজালমুক্ত" : "100% pure & chemical-free"}
                </span>
                <h1 className={`mt-4 text-balance font-bold text-3xl sm:text-4xl lg:text-5xl xl:text-6xl leading-[1.1] ${lang === "bn" ? "font-bn" : ""}`}>
                  {lang === "bn" ? s.titleBn : s.titleEn}
                </h1>
                <p className={`mt-4 text-base sm:text-lg text-muted-foreground max-w-xl ${lang === "bn" ? "font-bn" : ""}`}>
                  {lang === "bn" ? s.subBn : s.subEn}
                </p>
              </motion.div>
            </AnimatePresence>

            <div className="mt-7 flex flex-wrap gap-3">
              <Button size="lg" className="bg-leaf-gradient shadow-elegant gap-2 rounded-full px-6">
                {tr(s.cta)} <ArrowRight className="h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" className="rounded-full px-6 border-primary/30 hover:bg-primary/5">
                {tr("seeFarmers")}
              </Button>
            </div>

            {/* trust strip */}
            <div className="mt-8 grid grid-cols-3 gap-2 max-w-md">
              {[
                { icon: ShieldCheck, bn: "ভেরিফায়েড কৃষক", en: "Verified farmers" },
                { icon: Truck, bn: "২৪ ঘণ্টায় ডেলিভারি", en: "24h delivery" },
                { icon: Leaf, bn: "ভেজালমুক্ত", en: "Chemical-free" },
              ].map((it, k) => (
                <div key={k} className="flex flex-col items-start gap-1.5">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 grid place-items-center text-primary">
                    <it.icon className="h-4 w-4" />
                  </div>
                  <span className={`text-xs text-muted-foreground leading-tight ${lang === "bn" ? "font-bn" : ""}`}>
                    {lang === "bn" ? it.bn : it.en}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right image */}
          <div className="relative order-1 lg:order-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.6 }}
                className="relative aspect-[4/5] sm:aspect-[5/4] lg:aspect-square rounded-3xl overflow-hidden shadow-elegant"
              >
                <img src={s.img} alt="" className="absolute inset-0 h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 via-transparent to-transparent" />
              </motion.div>
            </AnimatePresence>

            {/* floating chips */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="hidden sm:flex absolute -left-4 top-10 items-center gap-3 rounded-2xl bg-card border border-border/60 px-4 py-3 shadow-soft"
            >
              <div className="h-10 w-10 rounded-full bg-saffron/15 grid place-items-center text-saffron text-lg">🥭</div>
              <div>
                <div className="text-xs text-muted-foreground">{lang === "bn" ? "আজকের সেরা" : "Today's best"}</div>
                <div className={`text-sm font-semibold ${lang === "bn" ? "font-bn" : ""}`}>{lang === "bn" ? "হিমসাগর আম" : "Himsagar Mango"}</div>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 5, repeat: Infinity }}
              className="hidden sm:flex absolute -right-2 bottom-10 items-center gap-3 rounded-2xl bg-card border border-border/60 px-4 py-3 shadow-soft"
            >
              <div className="h-10 w-10 rounded-full bg-primary/15 grid place-items-center text-primary">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground">{lang === "bn" ? "ভেরিফায়েড" : "Verified"}</div>
                <div className="text-sm font-semibold">450+ {lang === "bn" ? "কৃষক" : "farmers"}</div>
              </div>
            </motion.div>

            {/* slider controls */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 rounded-full bg-background/80 backdrop-blur px-2 py-1.5 shadow-soft">
              <button onClick={() => setI((i - 1 + heroSlides.length) % heroSlides.length)} className="h-7 w-7 grid place-items-center rounded-full hover:bg-muted" aria-label="prev">
                <ChevronLeft className="h-4 w-4" />
              </button>
              {heroSlides.map((_, k) => (
                <button key={k} onClick={() => setI(k)} aria-label={`slide ${k + 1}`}
                  className={`h-1.5 rounded-full transition-all ${k === i ? "w-6 bg-primary" : "w-1.5 bg-muted-foreground/40"}`} />
              ))}
              <button onClick={() => setI((i + 1) % heroSlides.length)} className="h-7 w-7 grid place-items-center rounded-full hover:bg-muted" aria-label="next">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
