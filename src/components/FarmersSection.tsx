import { BadgeCheck, MapPin, Package, Star, TrendingUp } from "lucide-react";
import { farmers } from "@/data/mock";
import { useI18n } from "@/lib/i18n";

const MALE_LOGO = "https://cdn.shopify.com/s/files/1/0991/0717/6761/files/Gemini_Generated_Image_k0x5bek0x5bek0x5.png?v=1778673806";
const FEMALE_LOGO = "https://cdn.shopify.com/s/files/1/0991/0717/6761/files/Gemini_Generated_Image_ce5s9yce5s9yce5s.png?v=1779307577";

export function FarmersSection() {
  const { lang, tr } = useI18n();
  const verified = farmers.filter(f => f.verified).slice(0, 8);

  return (
    <section id="farmers" className="py-14 lg:py-20">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className={`text-2xl sm:text-3xl lg:text-4xl font-bold ${lang === "bn" ? "font-bn" : ""}`}>{tr("verifiedFarmers")}</h2>
            <p className="text-muted-foreground text-sm mt-1">{lang === "bn" ? "যারা আপনার টেবিলে টাটকা খাবার পৌঁছে দেন" : "The people behind your fresh food"}</p>
          </div>
          <button className="text-sm text-primary font-medium hover:underline">{tr("shopAll")}</button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {verified.map(f => (
            <article key={f.id} className="group relative bg-card rounded-2xl border border-border/60 p-5 hover:border-primary/40 hover:shadow-elegant transition">
              <div className="flex items-start gap-3">
                <div className="relative shrink-0">
                  <div className="h-16 w-16 rounded-2xl bg-leaf-gradient p-0.5">
                    <img src={f.gender === "male" ? MALE_LOGO : FEMALE_LOGO} alt="" className="h-full w-full rounded-[14px] object-cover bg-white" />
                  </div>
                  {f.verified && (
                    <span className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-primary text-white grid place-items-center border-2 border-card">
                      <BadgeCheck className="h-3.5 w-3.5" />
                    </span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className={`font-semibold leading-tight truncate ${lang === "bn" ? "font-bn" : ""}`}>{lang === "bn" ? f.nameBn : f.name}</h3>
                  <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                    <MapPin className="h-3 w-3" /> <span className={lang === "bn" ? "font-bn" : ""}>{lang === "bn" ? f.districtBn : f.district}</span>
                  </div>
                  <div className="flex items-center gap-1 mt-1 text-xs">
                    <Star className="h-3.5 w-3.5 fill-saffron text-saffron" />
                    <span className="font-semibold">{f.rating}</span>
                    <span className="text-muted-foreground">· {tr("verified")}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-lg bg-muted/60 px-3 py-2 flex items-center gap-1.5">
                  <Package className="h-3.5 w-3.5 text-primary" />
                  <span className="font-semibold">{f.products}</span>
                  <span className="text-muted-foreground">{tr("products")}</span>
                </div>
                <div className="rounded-lg bg-muted/60 px-3 py-2 flex items-center gap-1.5">
                  <TrendingUp className="h-3.5 w-3.5 text-saffron" />
                  <span className="font-semibold">{f.sales}</span>
                  <span className="text-muted-foreground">{tr("sales")}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
