import { Facebook, Youtube, Instagram, Phone, Mail, MapPin, MessageCircle, Send, Heart } from "lucide-react";
import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { toast } from "sonner";

const LOGO = "https://cdn.shopify.com/s/files/1/0991/0717/6761/files/Gemini_Generated_Image_k0x5bek0x5bek0x5.png?v=1778673806";

export function Footer() {
  const { lang } = useI18n();
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    toast.success(lang === "bn" ? "ধন্যবাদ! আপনি সাবস্ক্রাইব করেছেন।" : "Thanks! You're subscribed.");
    setEmail("");
  };

  return (
    <footer className="relative mt-12 text-background bg-[oklch(0.22_0.06_150)]">
      {/* Newsletter strip */}
      <div className="container mx-auto px-4 lg:px-6">
        <div className="relative -mt-12 rounded-3xl bg-gradient-to-br from-primary to-[oklch(0.42_0.14_155)] px-6 py-8 lg:px-10 lg:py-10 shadow-elegant overflow-hidden">
          <div className="absolute -top-12 -right-12 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
          <div className="relative grid md:grid-cols-2 gap-6 items-center">
            <div>
              <h3 className={`text-xl lg:text-2xl font-bold text-white ${lang === "bn" ? "font-bn" : ""}`}>
                {lang === "bn" ? "টাটকা অফার সবার আগে পান" : "Get fresh offers first"}
              </h3>
              <p className={`mt-1.5 text-sm text-white/85 ${lang === "bn" ? "font-bn" : ""}`}>
                {lang === "bn" ? "সাপ্তাহিক বাস্কেট, কৃষকের গল্প ও বিশেষ ছাড় — আপনার ইনবক্সে।" : "Weekly baskets, farmer stories and special discounts — in your inbox."}
              </p>
            </div>
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={lang === "bn" ? "আপনার ইমেইল ঠিকানা" : "Your email address"}
                className="flex-1 h-12 rounded-full bg-white/95 text-foreground placeholder:text-muted-foreground px-5 text-sm focus:outline-none focus:ring-4 focus:ring-white/30"
              />
              <button type="submit" className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-full bg-foreground text-background text-sm font-semibold hover:bg-foreground/90 transition shadow-soft">
                <Send className="h-4 w-4" />
                {lang === "bn" ? "সাবস্ক্রাইব" : "Subscribe"}
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-6 pt-14 pb-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10">
          {/* About */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5">
              <img src={LOGO} alt="" className="h-12 w-12 rounded-xl bg-white p-1" />
              <div>
                <div className="font-bn font-bold text-lg">কৃষক বাজার</div>
                <div className="font-bn text-[11px] opacity-75 -mt-0.5">দালাল মুক্ত কৃষি বাজার</div>
              </div>
            </div>
            <p className={`mt-4 text-sm opacity-80 leading-relaxed max-w-sm ${lang === "bn" ? "font-bn" : ""}`}>
              {lang === "bn"
                ? "বাংলাদেশের প্রথম দালাল-মুক্ত কৃষক-টু-কাস্টমার মার্কেটপ্লেস। আমাদের লক্ষ্য — কৃষকের ন্যায্য মূল্য এবং আপনার ভেজালমুক্ত খাবার।"
                : "Bangladesh's first middleman-free farmer-to-customer marketplace. Our mission — fair prices for farmers and chemical-free food for you."}
            </p>
            <div className="mt-5 flex gap-2">
              {[
                { Icon: Facebook, href: "https://www.facebook.com/people/%E0%A6%95%E0%A7%83%E0%A6%B7%E0%A6%95-%E0%A6%AC%E0%A6%BE%E0%A6%9C%E0%A6%BE%E0%A6%B0-Krishok-Bazar/61578459151972/", label: "Facebook" },
                { Icon: Youtube, href: "https://www.youtube.com/@KrishokBazarBD", label: "YouTube" },
                { Icon: Instagram, href: "https://www.instagram.com/krishokbazarbd", label: "Instagram" },
              ].map((s, i) => (
                <a key={i} href={s.href} target="_blank" rel="noreferrer" aria-label={s.label}
                  className="h-9 w-9 grid place-items-center rounded-full bg-white/10 hover:bg-primary-glow hover:text-foreground transition">
                  <s.Icon className="h-4 w-4" />
                </a>
              ))}
              <a href="https://www.tiktok.com/@krishokbazarbd" target="_blank" rel="noreferrer" aria-label="TikTok"
                className="h-9 w-9 grid place-items-center rounded-full bg-white/10 hover:bg-primary-glow hover:text-foreground transition text-xs font-bold">TT</a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className={`font-semibold mb-4 text-sm uppercase tracking-wider opacity-95 ${lang === "bn" ? "font-bn" : ""}`}>
              {lang === "bn" ? "কুইক লিংক" : "Quick links"}
            </h4>
            <ul className="space-y-2.5 text-sm opacity-80">
              <li><a href="#top" className="hover:opacity-100 hover:text-primary-glow transition">{lang === "bn" ? "হোম" : "Home"}</a></li>
              <li><a href="#shop" className="hover:opacity-100 hover:text-primary-glow transition">{lang === "bn" ? "পণ্য" : "Products"}</a></li>
              <li><a href="#farmers" className="hover:opacity-100 hover:text-primary-glow transition">{lang === "bn" ? "কৃষক" : "Farmers"}</a></li>
              <li><a href="#combo" className="hover:opacity-100 hover:text-primary-glow transition">{lang === "bn" ? "কম্বো বাস্কেট" : "Combo basket"}</a></li>
              <li><a href="#contact" className="hover:opacity-100 hover:text-primary-glow transition">{lang === "bn" ? "যোগাযোগ" : "Contact"}</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className={`font-semibold mb-4 text-sm uppercase tracking-wider opacity-95 ${lang === "bn" ? "font-bn" : ""}`}>
              {lang === "bn" ? "কাস্টমার সাপোর্ট" : "Customer support"}
            </h4>
            <ul className="space-y-2.5 text-sm opacity-80">
              <li><a href="https://wa.me/8801931355398" target="_blank" rel="noreferrer" className="hover:opacity-100 hover:text-primary-glow transition">WhatsApp</a></li>
              <li><a href="https://m.me/KrishokBazarBD" target="_blank" rel="noreferrer" className="hover:opacity-100 hover:text-primary-glow transition">Messenger</a></li>
              <li><a href="#delivery" className="hover:opacity-100 hover:text-primary-glow transition">{lang === "bn" ? "ডেলিভারি তথ্য" : "Delivery info"}</a></li>
              <li><a href="#refund" className="hover:opacity-100 hover:text-primary-glow transition">{lang === "bn" ? "রিফান্ড পলিসি" : "Refund policy"}</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className={`font-semibold mb-4 text-sm uppercase tracking-wider opacity-95 ${lang === "bn" ? "font-bn" : ""}`}>
              {lang === "bn" ? "যোগাযোগ" : "Contact"}
            </h4>
            <ul className="space-y-3 text-sm opacity-85">
              <li className="flex items-start gap-2.5">
                <Phone className="h-4 w-4 mt-0.5 text-primary-glow" />
                <a href="tel:01931355398" className="hover:text-primary-glow">01931355398</a>
              </li>
              <li className="flex items-start gap-2.5">
                <MessageCircle className="h-4 w-4 mt-0.5 text-primary-glow" />
                <a href="https://wa.me/8801939052257" target="_blank" rel="noreferrer" className="hover:text-primary-glow">01939052257</a>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail className="h-4 w-4 mt-0.5 text-primary-glow" />
                <a href="mailto:hello@krishokbazar.com" className="hover:text-primary-glow">hello@krishokbazar.com</a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 mt-0.5 text-primary-glow" />
                <span>{lang === "bn" ? "ঢাকা অফিস, বাংলাদেশ" : "Dhaka office, Bangladesh"}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-3 text-xs opacity-75">
          <div className={lang === "bn" ? "font-bn" : ""}>
            © 2026 {lang === "bn" ? "কৃষক বাজার" : "Krishok Bazar"}. {lang === "bn" ? "সর্বস্বত্ব সংরক্ষিত।" : "All rights reserved."}
          </div>
          <div className="flex items-center gap-4">
            <a href="#privacy" className="hover:opacity-100 hover:text-primary-glow">{lang === "bn" ? "প্রাইভেসি" : "Privacy"}</a>
            <a href="#terms" className="hover:opacity-100 hover:text-primary-glow">{lang === "bn" ? "শর্তাবলী" : "Terms"}</a>
            <span className="inline-flex items-center gap-1">{lang === "bn" ? "তৈরি" : "Made with"} <Heart className="h-3 w-3 fill-saffron text-saffron" /> {lang === "bn" ? "বাংলাদেশে" : "in Bangladesh"}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
