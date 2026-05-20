import { Facebook, Youtube, Phone, Mail, MapPin } from "lucide-react";
import { useI18n } from "@/lib/i18n";

const LOGO = "https://cdn.shopify.com/s/files/1/0991/0717/6761/files/Gemini_Generated_Image_k0x5bek0x5bek0x5.png?v=1778673806";

export function Footer() {
  const { lang, tr } = useI18n();
  return (
    <footer className="bg-foreground text-background mt-10">
      <div className="container mx-auto px-4 lg:px-6 py-14">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2">
              <img src={LOGO} alt="" className="h-11 w-11 rounded-xl bg-white p-1" />
              <div>
                <div className="font-bn font-bold text-lg">কৃষক বাজার</div>
                <div className="text-xs opacity-70">Krishok Bazar</div>
              </div>
            </div>
            <p className={`mt-4 text-sm opacity-80 leading-relaxed ${lang === "bn" ? "font-bn" : ""}`}>{tr("footerAbout")}</p>
          </div>

          <div>
            <h4 className={`font-semibold mb-4 ${lang === "bn" ? "font-bn" : ""}`}>{tr("quickLinks")}</h4>
            <ul className="space-y-2 text-sm opacity-80">
              <li><a href="#categories" className="hover:opacity-100 hover:text-primary-glow">{tr("categories")}</a></li>
              <li><a href="#shop" className="hover:opacity-100 hover:text-primary-glow">{tr("trending")}</a></li>
              <li><a href="#farmers" className="hover:opacity-100 hover:text-primary-glow">{tr("verifiedFarmers")}</a></li>
              <li><a href="#story" className="hover:opacity-100 hover:text-primary-glow">{tr("ourStory")}</a></li>
            </ul>
          </div>

          <div>
            <h4 className={`font-semibold mb-4 ${lang === "bn" ? "font-bn" : ""}`}>{tr("contact")}</h4>
            <ul className="space-y-2 text-sm opacity-80">
              <li className="flex items-center gap-2"><Phone className="h-4 w-4" /> 01931355398</li>
              <li className="flex items-center gap-2"><Mail className="h-4 w-4" /> hello@krishokbazar.com</li>
              <li className="flex items-center gap-2"><MapPin className="h-4 w-4" /> Dhaka, Bangladesh</li>
            </ul>
          </div>

          <div>
            <h4 className={`font-semibold mb-4 ${lang === "bn" ? "font-bn" : ""}`}>{tr("followUs")}</h4>
            <div className="flex gap-2">
              {[
                { Icon: Facebook, href: "https://www.facebook.com/people/%E0%A6%95%E0%A7%83%E0%A6%B7%E0%A6%95-%E0%A6%AC%E0%A6%BE%E0%A6%9C%E0%A6%BE%E0%A6%B0-Krishok-Bazar/61578459151972/", label: "Facebook" },
                { Icon: Youtube, href: "https://www.youtube.com/@KrishokBazarBD", label: "YouTube" },
              ].map((s, i) => (
                <a key={i} href={s.href} target="_blank" rel="noreferrer" aria-label={s.label}
                  className="h-10 w-10 grid place-items-center rounded-full bg-white/10 hover:bg-primary transition">
                  <s.Icon className="h-4 w-4" />
                </a>
              ))}
              <a href="https://www.tiktok.com/@krishokbazarbd" target="_blank" rel="noreferrer" aria-label="TikTok"
                className="h-10 w-10 grid place-items-center rounded-full bg-white/10 hover:bg-primary transition text-sm font-bold">TT</a>
            </div>
          </div>
        </div>

        <div className={`mt-12 pt-6 border-t border-white/10 text-xs opacity-70 text-center ${lang === "bn" ? "font-bn" : ""}`}>
          {tr("rights")}
        </div>
      </div>
    </footer>
  );
}
