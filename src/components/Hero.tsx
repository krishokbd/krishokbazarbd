import { motion } from "framer-motion";
import { Leaf, ShieldCheck, Truck, ShoppingBag, Salad, MessageCircle, Users, Package, Sparkles } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";

const HERO_IMG = "https://images.unsplash.com/photo-1542838132-92c53300491e?w=1400&q=85&auto=format&fit=crop";
const HERO_IMG_2 = "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800&q=85&auto=format&fit=crop";

export function Hero() {
  const { lang } = useI18n();

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background">
      {/* organic blobs */}
      <div className="absolute top-10 right-0 h-72 w-72 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-accent/30 blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 lg:px-6 pt-10 lg:pt-14 pb-8 lg:pb-12">
        <div className="grid lg:grid-cols-[1.05fr_1fr] gap-8 lg:gap-12 items-center">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative z-10 order-2 lg:order-1 max-w-xl"
          >
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-medium">
              <Leaf className="h-3.5 w-3.5" /> {lang === "bn" ? "🌱 Farm Fresh Organic Market" : "🌱 Farm Fresh Organic Market"}
            </span>

            <h1 className={`mt-4 text-balance font-bold tracking-tight text-[1.85rem] sm:text-4xl lg:text-[2.6rem] xl:text-5xl leading-[1.15] ${lang === "bn" ? "font-bn" : ""}`}>
              {lang === "bn" ? (
                <>
                  মাঠের তাজা সবজি<br />
                  <span className="text-primary">দালাল ছাড়াই সরাসরি</span><br />
                  আপনার রান্নাঘরে!
                </>
              ) : (
                <>
                  Fresh from the field<br />
                  <span className="text-primary">straight to your kitchen</span><br />
                  no middlemen, ever.
                </>
              )}
            </h1>

            <p className={`mt-4 text-[15px] sm:text-base text-muted-foreground leading-relaxed max-w-lg ${lang === "bn" ? "font-bn" : ""}`}>
              {lang === "bn"
                ? "মাঝারি আড়তদারদের শোষণমুক্ত কৃষি অর্থনীতি। বগুড়া, যশোর ও শেরপুরের প্রকৃত উৎপাদনকারী কৃষকদের থেকে সরাসরি খাবার পৌঁছে দিচ্ছে কৃষক বাজার।"
                : "An exploitation-free agricultural economy. Krishok Bazar delivers food directly from real producer farmers in Bogura, Jessore, and Sherpur."}
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Button size="lg" className="h-12 rounded-full px-6 bg-leaf-gradient shadow-elegant gap-2 text-[15px]">
                <ShoppingBag className="h-[18px] w-[18px]" />
                <span className={lang === "bn" ? "font-bn" : ""}>{lang === "bn" ? "পণ্য কিনুন" : "Shop now"}</span>
              </Button>
              <Button size="lg" variant="secondary" className="h-12 rounded-full px-6 gap-2 text-[15px] shadow-soft">
                <Salad className="h-[18px] w-[18px]" />
                <span className={lang === "bn" ? "font-bn" : ""}>{lang === "bn" ? "সাপ্তাহিক বাস্কেট" : "Weekly basket"}</span>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-12 rounded-full px-6 gap-2 text-[15px] border-primary/30 hover:bg-primary/5">
                <a href="https://wa.me/8801931355398" target="_blank" rel="noreferrer">
                  <MessageCircle className="h-[18px] w-[18px]" />
                  <span className={lang === "bn" ? "font-bn" : ""}>{lang === "bn" ? "হোয়াটসঅ্যাপ অর্ডার" : "WhatsApp order"}</span>
                </a>
              </Button>
            </div>

            {/* Trust strip */}
            <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
              {[
                { icon: ShieldCheck, bn: "ভেরিফায়েড কৃষক", en: "Verified farmers" },
                { icon: Truck, bn: "২৪ ঘণ্টায় ডেলিভারি", en: "24h delivery" },
                { icon: Leaf, bn: "১০০% ভেজালমুক্ত", en: "100% chemical-free" },
              ].map((it, k) => (
                <div key={k} className="inline-flex items-center gap-1.5">
                  <span className="h-6 w-6 rounded-md bg-primary/10 grid place-items-center text-primary">
                    <it.icon className="h-3.5 w-3.5" />
                  </span>
                  <span className={`font-medium ${lang === "bn" ? "font-bn" : ""}`}>
                    {lang === "bn" ? it.bn : it.en}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right image collage */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="relative order-1 lg:order-2"
          >
            <div className="relative aspect-[4/4.2] sm:aspect-[5/4] lg:aspect-[1/1.05] rounded-[2rem] overflow-hidden shadow-elegant">
              <img src={HERO_IMG} alt="Fresh vegetables from Bangladeshi farmers" className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/25 via-transparent to-transparent" />
            </div>

            {/* small corner image */}
            <div className="hidden sm:block absolute -bottom-4 -right-4 h-32 w-32 lg:h-40 lg:w-40 rounded-2xl overflow-hidden ring-4 ring-background shadow-elegant">
              <img src={HERO_IMG_2} alt="Farmer harvesting" className="h-full w-full object-cover" />
            </div>

            {/* floating mini cards */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute -left-3 sm:-left-5 top-8 flex items-center gap-2.5 rounded-2xl bg-card/95 backdrop-blur border border-border/60 px-3.5 py-2.5 shadow-soft"
            >
              <div className="h-9 w-9 rounded-full bg-primary/15 grid place-items-center text-primary">
                <Truck className="h-4 w-4" />
              </div>
              <div className="leading-tight">
                <div className="text-[10px] text-muted-foreground">✔ Fresh</div>
                <div className="text-xs font-semibold">Same-day delivery</div>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 5, repeat: Infinity }}
              className="absolute right-2 top-1/3 flex items-center gap-2.5 rounded-2xl bg-card/95 backdrop-blur border border-border/60 px-3.5 py-2.5 shadow-soft"
            >
              <div className="h-9 w-9 rounded-full bg-success/15 grid place-items-center text-success">
                <Leaf className="h-4 w-4" />
              </div>
              <div className="leading-tight">
                <div className="text-[10px] text-muted-foreground">✔ 100%</div>
                <div className="text-xs font-semibold">Organic produce</div>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 4.5, repeat: Infinity }}
              className="absolute left-6 bottom-6 flex items-center gap-2.5 rounded-2xl bg-card/95 backdrop-blur border border-border/60 px-3.5 py-2.5 shadow-soft"
            >
              <div className="h-9 w-9 rounded-full bg-saffron/15 grid place-items-center text-saffron">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <div className="leading-tight">
                <div className="text-[10px] text-muted-foreground">✔ Verified</div>
                <div className="text-xs font-semibold">Real farmers</div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Stats cards */}
        <div className="mt-10 lg:mt-14 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {[
            { icon: Users, value: "186+", bn: "ভেরিফায়েড কৃষক", en: "Verified farmers" },
            { icon: Package, value: "2,451+", bn: "সফল ডেলিভারি", en: "Successful deliveries" },
            { icon: Sparkles, value: "0%", bn: "মাঝে দালাল", en: "Middleman" },
            { icon: Leaf, value: "100%", bn: "ভেজালমুক্ত", en: "Chemical-free" },
          ].map((s, i) => (
            <div key={i} className="flex items-center gap-3 rounded-2xl bg-card border border-border/60 px-4 py-3.5 shadow-soft hover:shadow-elegant transition">
              <div className="h-10 w-10 rounded-xl bg-primary/10 grid place-items-center text-primary shrink-0">
                <s.icon className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <div className="text-lg sm:text-xl font-bold leading-none">{s.value}</div>
                <div className={`text-[11px] sm:text-xs text-muted-foreground mt-1 truncate ${lang === "bn" ? "font-bn" : ""}`}>
                  {lang === "bn" ? s.bn : s.en}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
