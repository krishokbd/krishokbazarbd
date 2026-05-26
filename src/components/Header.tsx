import { Search, ShoppingCart, Menu, X, Globe, MessageCircle, User } from "lucide-react";
import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { UserMenu } from "@/components/UserMenu";
import { Link } from "@tanstack/react-router";
import { useCart } from "@/lib/cart";

const LOGO = "https://cdn.shopify.com/s/files/1/0991/0717/6761/files/Gemini_Generated_Image_k0x5bek0x5bek0x5.png?v=1778673806";

const NAV_ITEMS: { bn: string; en: string; href: string }[] = [
  { bn: "হোম", en: "Home", href: "#top" },
  { bn: "সবজি", en: "Vegetables", href: "#vegetables" },
  { bn: "ফলমূল", en: "Fruits", href: "#fruits" },
  { bn: "কম্বো বাস্কেট", en: "Combo Basket", href: "#combo" },
  { bn: "রেডি টু কুক", en: "Ready to Cook", href: "#ready" },
  { bn: "কৃষক", en: "Farmers", href: "#farmers" },
  { bn: "আমাদের সম্পর্কে", en: "About", href: "#story" },
  { bn: "যোগাযোগ", en: "Contact", href: "#contact" },
];

export function Header() {
  const { lang, setLang, tr } = useI18n();
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { count, setOpen: setCartOpen } = useCart();

  return (
    <header className="sticky top-0 z-50 bg-background/90 backdrop-blur-xl border-b border-border/60">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="flex items-center justify-between gap-6 h-16 lg:h-[72px]">
          {/* Logo + slogan */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            <img src={LOGO} alt="Krishok Bazar" className="h-10 w-10 lg:h-11 lg:w-11 rounded-xl bg-white shadow-soft" />
            <div className="leading-tight">
              <div className="font-bn font-bold text-[15px] lg:text-base text-primary">কৃষক বাজার</div>
              <div className="font-bn text-[10px] lg:text-[11px] text-muted-foreground -mt-0.5">দালাল মুক্ত কৃষি বাজার</div>
            </div>
          </Link>

          {/* Center nav (desktop) */}
          <nav className="hidden lg:flex items-center gap-1 flex-1 justify-center">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={`px-3 py-1.5 rounded-full text-[13px] font-medium text-foreground/75 hover:text-primary hover:bg-primary/5 transition ${lang === "bn" ? "font-bn" : ""}`}
              >
                {lang === "bn" ? item.bn : item.en}
              </a>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-1 md:gap-1.5 shrink-0">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-muted transition"
              aria-label={tr("search")}
            >
              <Search className="h-[18px] w-[18px]" />
            </button>

            <button
              onClick={() => setCartOpen(true)}
              className="relative inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-muted transition"
              aria-label={tr("cart")}
            >
              <ShoppingCart className="h-[18px] w-[18px]" />
              {count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-4 min-w-4 px-1 rounded-full bg-saffron text-[10px] font-bold text-white grid place-items-center">{count}</span>
              )}
            </button>

            <a
              href="https://wa.me/8801931355398"
              target="_blank"
              rel="noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 h-9 px-3 rounded-full bg-[#25D366] hover:bg-[#1ebd5b] text-white text-xs font-semibold shadow-soft transition"
              aria-label="WhatsApp"
            >
              <MessageCircle className="h-4 w-4" />
              <span className="hidden md:inline">WhatsApp</span>
            </a>

            <button
              onClick={() => setLang(lang === "bn" ? "en" : "bn")}
              className="hidden sm:inline-flex items-center gap-1 h-9 px-2.5 rounded-full hover:bg-muted text-xs font-medium transition"
              aria-label="Language"
            >
              <Globe className="h-3.5 w-3.5" />
              {lang === "bn" ? "EN" : "বাং"}
            </button>

            <div className="hidden md:block">
              <UserMenu />
            </div>
            <Button asChild size="sm" className="hidden md:inline-flex h-9 rounded-full px-4 bg-leaf-gradient shadow-soft gap-1.5">
              <Link to="/auth"><User className="h-4 w-4" />{lang === "bn" ? "লগইন" : "Login"}</Link>
            </Button>

            <button
              className="lg:hidden inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-muted"
              onClick={() => setOpen(!open)}
              aria-label="Menu"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Inline search */}
        {searchOpen && (
          <div className="pb-3 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              autoFocus
              type="search"
              placeholder={tr("search")}
              className="w-full rounded-full bg-muted/70 border border-transparent focus:border-primary/40 focus:bg-background focus:outline-none focus:ring-4 focus:ring-primary/10 pl-11 pr-4 py-2.5 text-sm transition"
            />
          </div>
        )}

        {/* Mobile menu */}
        {open && (
          <div className="lg:hidden border-t border-border/60 py-3 space-y-1">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`block px-3 py-2 rounded-lg text-sm text-foreground/80 hover:bg-muted ${lang === "bn" ? "font-bn" : ""}`}
              >
                {lang === "bn" ? item.bn : item.en}
              </a>
            ))}
            <div className="pt-2 grid grid-cols-2 gap-2">
              <a
                href="https://wa.me/8801931355398"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-1.5 h-10 rounded-full bg-[#25D366] text-white text-sm font-semibold"
              >
                <MessageCircle className="h-4 w-4" /> WhatsApp
              </a>
              <Button asChild size="sm" className="h-10 rounded-full bg-leaf-gradient">
                <Link to="/auth">{lang === "bn" ? "লগইন / সাইনআপ" : "Login / Sign up"}</Link>
              </Button>
            </div>
            <button
              onClick={() => setLang(lang === "bn" ? "en" : "bn")}
              className="w-full mt-2 rounded-lg px-3 py-2 text-sm bg-muted/60 flex items-center justify-center gap-2"
            >
              <Globe className="h-4 w-4" /> {lang === "bn" ? "Switch to English" : "বাংলায় দেখুন"}
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
