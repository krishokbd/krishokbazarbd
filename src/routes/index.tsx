import { createFileRoute } from "@tanstack/react-router";
import { I18nProvider } from "@/lib/i18n";
import { SplashScreen } from "@/components/SplashScreen";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Categories } from "@/components/Categories";
import { ProductsSection, AllProductsByCategory } from "@/components/ProductsSection";
import { FarmersSection } from "@/components/FarmersSection";
import { ReviewsSection } from "@/components/ReviewsSection";
import { OurStory } from "@/components/OurStory";
import { Footer } from "@/components/Footer";
import { FloatingSocials } from "@/components/FloatingSocials";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "কৃষক বাজার — Krishok Bazar | দালাল ছাড়া বাজার, সরাসরি কৃষকের কাছ থেকে" },
      { name: "description", content: "Bangladesh's farmer-to-customer marketplace. Fresh, chemical-free vegetables, fruits, fish, meat & ready-to-cook items — straight from verified farmers." },
      { property: "og:title", content: "কৃষক বাজার — Krishok Bazar" },
      { property: "og:description", content: "দালাল ছাড়া বাজার — সরাসরি কৃষকের কাছ থেকে। টাটকা, ভেজালমুক্ত খাবার।" },
      { property: "og:image", content: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1600&q=80" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <I18nProvider>
      <SplashScreen />
      <div id="top" className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <Hero />
          <Categories />
          <ProductsSection id="ready" titleKey="readyToCook" filter={p => p.category === "ready"} limit={5} />
          <ProductsSection id="featured" titleKey="featured" filter={p => !!p.badge || !!p.oldPrice} limit={10} />
          <FarmersSection />
          <AllProductsByCategory />
          <ReviewsSection />
          <OurStory />
        </main>
        <Footer />
        <FloatingSocials />
      </div>
    </I18nProvider>
  );
}
