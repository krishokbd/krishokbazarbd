import { Search, ShoppingCart, Sprout, Menu, X, Globe } from "lucide-react";
import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { UserMenu } from "@/components/UserMenu";
import { Link } from "@tanstack/react-router";
import { useCart } from "@/lib/cart";

const LOGO = "https://cdn.shopify.com/s/files/1/0991/0717/6761/files/Gemini_Generated_Image_k0x5bek0x5bek0x5.png?v=1778673806";

export function Header() {
  const { lang, setLang, tr } = useI18n();
  const [open, setOpen] = useState(false);
  const { count, setOpen: setCartOpen } = useCart();


  return (
    <header className="sticky top-0 z-50 bg-background/85 backdrop-blur-xl border-b border-border/60">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="flex items-center justify-between gap-4 h-16 md:h-20">
          {/* Logo */}
          <a href="#top" className="flex items-center gap-2 shrink-0">
            <img src={LOGO} alt="" className="h-10 w-10 md:h-12 md:w-12 rounded-xl bg-white shadow-soft" />
            <div className="leading-tight">
              <div className="font-bn font-bold text-base md:text-lg text-primary">কৃষক বাজার</div>
              <div className="text-[10px] md:text-xs text-muted-foreground -mt-0.5">Krishok Bazar</div>
            </div>
          </a>

          {/* Search */}
          <div className="hidden md:flex flex-1 max-w-xl relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              placeholder={tr("search")}
              className="w-full rounded-full bg-muted/70 border border-transparent focus:border-primary/40 focus:bg-background focus:outline-none focus:ring-4 focus:ring-primary/10 pl-11 pr-4 py-2.5 text-sm transition"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 md:gap-2">
            <button
              onClick={() => setLang(lang === "bn" ? "en" : "bn")}
              className="hidden sm:inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium bg-muted hover:bg-muted/60 transition"
              aria-label="Language"
            >
              <Globe className="h-3.5 w-3.5" />
              {lang === "bn" ? "EN" : "বাং"}
            </button>

            <button onClick={() => setCartOpen(true)} className="relative inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-muted transition" aria-label={tr("cart")}>
              <ShoppingCart className="h-5 w-5" />
              {count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-4 min-w-4 px-1 rounded-full bg-saffron text-[10px] font-bold text-white grid place-items-center">{count}</span>
              )}
            </button>

            <div className="hidden md:flex items-center gap-2">
              <Button asChild variant="ghost" size="sm" className="gap-1.5">
                <Link to="/auth"><Sprout className="h-4 w-4" />{tr("farmerLogin")}</Link>
              </Button>
              <UserMenu />
            </div>

            <button className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-muted" onClick={() => setOpen(!open)} aria-label="Menu">
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile search */}
        <div className="md:hidden pb-3 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            placeholder={tr("search")}
            className="w-full rounded-full bg-muted/70 border-transparent focus:border-primary/40 focus:bg-background focus:outline-none pl-11 pr-4 py-2.5 text-sm"
          />
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden border-t border-border/60 py-3 space-y-2">
            <Button asChild size="sm" className="w-full justify-start gap-2 bg-leaf-gradient">
              <Link to="/auth"><Sprout className="h-4 w-4" />Sign in / Sign up</Link>
            </Button>
            <button
              onClick={() => setLang(lang === "bn" ? "en" : "bn")}
              className="w-full text-left rounded-md px-3 py-2 text-sm bg-muted/60 flex items-center gap-2"
            >
              <Globe className="h-4 w-4" /> {lang === "bn" ? "Switch to English" : "বাংলায় দেখুন"}
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
