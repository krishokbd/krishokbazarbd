import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const LOGO = "https://cdn.shopify.com/s/files/1/0991/0717/6761/files/Gemini_Generated_Image_k0x5bek0x5bek0x5.png?v=1778673806";

export function SplashScreen() {
  const [show, setShow] = useState(true);
  useEffect(() => {
    const seen = sessionStorage.getItem("kb-splash");
    if (seen) { setShow(false); return; }
    const t = setTimeout(() => {
      setShow(false);
      sessionStorage.setItem("kb-splash", "1");
    }, 2600);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-hero-gradient overflow-hidden"
        >
          {/* decorative leaves */}
          <motion.div
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-primary-glow/30 blur-3xl"
          />
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.4, delay: 0.2 }}
            className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-accent/20 blur-3xl"
          />

          <motion.div
            initial={{ scale: 0.6, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 120, damping: 14 }}
            className="relative"
          >
            <div className="absolute inset-0 rounded-full bg-white/30 blur-2xl scale-125" />
            <img
              src={LOGO}
              alt="Krishok Bazar"
              className="relative h-32 w-32 sm:h-40 sm:w-40 rounded-3xl bg-white/90 p-3 shadow-elegant"
            />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="mt-8 font-bn text-4xl sm:text-5xl font-bold text-white tracking-tight"
          >
            কৃষক বাজার
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            className="mt-3 font-bn text-base sm:text-lg text-white/90 px-6 text-center max-w-md"
          >
            দালাল ছাড়া বাজার — সরাসরি কৃষকের কাছ থেকে
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
            className="absolute bottom-10 flex gap-1.5"
          >
            {[0, 1, 2].map(i => (
              <motion.span
                key={i}
                className="h-2 w-2 rounded-full bg-white/80"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
              />
            ))}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
