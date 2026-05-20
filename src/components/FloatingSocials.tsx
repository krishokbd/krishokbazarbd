import { MessageCircle, Phone, Facebook, Youtube } from "lucide-react";
import { useState } from "react";

const links = [
  { Icon: MessageCircle, label: "WhatsApp", href: "https://wa.me/8801931355398", color: "bg-[#25D366]" },
  { Icon: Phone, label: "Call", href: "tel:01931355398", color: "bg-primary" },
  { Icon: Facebook, label: "Facebook", href: "https://www.facebook.com/people/%E0%A6%95%E0%A7%83%E0%A6%B7%E0%A6%95-%E0%A6%AC%E0%A6%BE%E0%A6%9C%E0%A6%BE%E0%A6%B0-Krishok-Bazar/61578459151972/", color: "bg-[#1877F2]" },
  { Icon: Youtube, label: "YouTube", href: "https://www.youtube.com/@KrishokBazarBD", color: "bg-[#FF0000]" },
];

export function FloatingSocials() {
  const [open, setOpen] = useState(false);
  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3">
      <div className={`flex flex-col gap-2 transition-all duration-300 ${open ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3 pointer-events-none"}`}>
        {links.map((l, i) => (
          <a key={i} href={l.href} target="_blank" rel="noreferrer" aria-label={l.label}
            className={`h-11 w-11 grid place-items-center rounded-full ${l.color} text-white shadow-elegant hover:scale-110 transition`}>
            <l.Icon className="h-5 w-5" />
          </a>
        ))}
      </div>
      <button
        onClick={() => setOpen(!open)}
        aria-label="Contact"
        className="h-14 w-14 grid place-items-center rounded-full bg-leaf-gradient text-white shadow-elegant hover:scale-110 transition"
      >
        <MessageCircle className={`h-6 w-6 transition-transform ${open ? "rotate-45" : ""}`} />
      </button>
    </div>
  );
}
