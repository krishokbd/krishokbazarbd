import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { useCart } from "@/lib/cart";

const shippingSchema = z.object({
  shipping_name: z.string().trim().min(2, "Name required").max(120),
  shipping_phone: z.string().trim().regex(/^(\+?88)?01[3-9]\d{8}$/, "Use a valid BD phone (01XXXXXXXXX)"),
  shipping_address: z.string().trim().min(5, "Address required").max(500),
  shipping_city: z.string().trim().max(80).optional().or(z.literal("")),
  shipping_district: z.string().trim().min(2, "District required").max(80),
  shipping_postcode: z.string().trim().max(20).optional().or(z.literal("")),
  notes: z.string().trim().max(500).optional().or(z.literal("")),
});

export function CheckoutDialog({ onClose, deliveryFee }: { onClose: () => void; deliveryFee: number }) {
  const { user } = useAuth();
  const { items, subtotal, clear } = useCart();
  const [busy, setBusy] = useState(false);
  const [saveDefault, setSaveDefault] = useState(true);
  const [confirmed, setConfirmed] = useState<{ id: string; total: number } | null>(null);

  const [form, setForm] = useState({
    shipping_name: "", shipping_phone: "", shipping_address: "",
    shipping_city: "", shipping_district: "", shipping_postcode: "", notes: "",
  });
  const set = <K extends keyof typeof form>(k: K, v: string) => setForm(p => ({ ...p, [k]: v }));

  // Prefill from profile
  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase
        .from("profiles")
        .select("full_name, shipping_address, shipping_city, shipping_district, shipping_postcode, shipping_phone")
        .eq("id", user.id)
        .maybeSingle();
      setForm(p => ({
        ...p,
        shipping_name: p.shipping_name || data?.full_name || user.user_metadata?.full_name || "",
        shipping_phone: p.shipping_phone || data?.shipping_phone || user.user_metadata?.phone || "",
        shipping_address: p.shipping_address || data?.shipping_address || "",
        shipping_city: p.shipping_city || data?.shipping_city || "",
        shipping_district: p.shipping_district || data?.shipping_district || "",
        shipping_postcode: p.shipping_postcode || data?.shipping_postcode || "",
      }));
    })();
  }, [user]);

  const total = subtotal + deliveryFee;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { toast.error("Sign in required"); return; }
    if (items.length === 0) { toast.error("Cart is empty"); return; }

    const parsed = shippingSchema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Check the form");
      return;
    }

    setBusy(true);

    // 1. Create order
    const { data: order, error: orderErr } = await supabase
      .from("orders")
      .insert({
        customer_id: user.id,
        subtotal,
        delivery_fee: deliveryFee,
        total,
        item_count: items.reduce((n, i) => n + i.quantity, 0),
        shipping_name: parsed.data.shipping_name,
        shipping_phone: parsed.data.shipping_phone,
        shipping_address: parsed.data.shipping_address,
        shipping_city: parsed.data.shipping_city || null,
        shipping_district: parsed.data.shipping_district,
        shipping_postcode: parsed.data.shipping_postcode || null,
        notes: parsed.data.notes || null,
      })
      .select("id")
      .single();

    if (orderErr || !order) { setBusy(false); toast.error(orderErr?.message ?? "Order failed"); return; }

    // 2. Insert items
    const { error: itemsErr } = await supabase.from("order_items").insert(
      items.map(i => ({
        order_id: order.id,
        product_id: i.product_id,
        product_title: i.title,
        product_title_bn: i.titleBn,
        product_image: i.image,
        unit: i.unit,
        unit_price: i.price,
        quantity: i.quantity,
        line_total: i.price * i.quantity,
        farmer_id: i.farmer_id,
        farmer_name: i.farmer_name,
      })),
    );
    if (itemsErr) { setBusy(false); toast.error(itemsErr.message); return; }

    // 3. Save shipping defaults on profile
    if (saveDefault) {
      await supabase.from("profiles").update({
        full_name: parsed.data.shipping_name,
        phone: parsed.data.shipping_phone,
        shipping_address: parsed.data.shipping_address,
        shipping_city: parsed.data.shipping_city || null,
        shipping_district: parsed.data.shipping_district,
        shipping_postcode: parsed.data.shipping_postcode || null,
        shipping_phone: parsed.data.shipping_phone,
      }).eq("id", user.id);
    }

    clear();
    setBusy(false);
    setConfirmed({ id: order.id, total });
  };

  if (confirmed) {
    return (
      <Dialog open onOpenChange={(o) => !o && onClose()}>
        <DialogContent className="max-w-md text-center">
          <div className="py-6 space-y-3">
            <div className="h-16 w-16 rounded-full bg-success/10 grid place-items-center mx-auto">
              <CheckCircle2 className="h-9 w-9 text-success" />
            </div>
            <DialogTitle className="text-center">Order placed!</DialogTitle>
            <p className="text-sm text-muted-foreground">
              Order <code className="text-xs">#{confirmed.id.slice(0, 8)}</code> confirmed for <strong className="text-primary">৳{confirmed.total.toFixed(0)}</strong>.
              We'll contact you to confirm delivery.
            </p>
            <Button className="bg-leaf-gradient" onClick={onClose}>Continue shopping</Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open onOpenChange={(o) => !o && !busy && onClose()}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Checkout · ৳{total.toFixed(0)}</DialogTitle>
          <p className="text-xs text-muted-foreground">
            {items.length} item{items.length === 1 ? "" : "s"} · Cash on delivery
          </p>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-3">
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <Label htmlFor="co-name">Full name</Label>
              <Input id="co-name" required value={form.shipping_name} onChange={e => set("shipping_name", e.target.value)} />
            </div>
            <div>
              <Label htmlFor="co-phone">Phone</Label>
              <Input id="co-phone" required placeholder="01XXXXXXXXX" value={form.shipping_phone} onChange={e => set("shipping_phone", e.target.value)} />
            </div>
          </div>
          <div>
            <Label htmlFor="co-addr">Address</Label>
            <Textarea id="co-addr" required rows={2} value={form.shipping_address} onChange={e => set("shipping_address", e.target.value)} />
          </div>
          <div className="grid sm:grid-cols-3 gap-3">
            <div>
              <Label htmlFor="co-city">City / Thana</Label>
              <Input id="co-city" value={form.shipping_city} onChange={e => set("shipping_city", e.target.value)} />
            </div>
            <div>
              <Label htmlFor="co-dist">District</Label>
              <Input id="co-dist" required value={form.shipping_district} onChange={e => set("shipping_district", e.target.value)} />
            </div>
            <div>
              <Label htmlFor="co-post">Postcode</Label>
              <Input id="co-post" value={form.shipping_postcode} onChange={e => set("shipping_postcode", e.target.value)} />
            </div>
          </div>
          <div>
            <Label htmlFor="co-notes">Delivery notes (optional)</Label>
            <Textarea id="co-notes" rows={2} value={form.notes} onChange={e => set("notes", e.target.value)} />
          </div>
          <div className="flex items-center gap-2 pt-1">
            <Switch id="save-def" checked={saveDefault} onCheckedChange={setSaveDefault} />
            <Label htmlFor="save-def" className="text-xs text-muted-foreground cursor-pointer">
              Save as my default shipping address
            </Label>
          </div>
          <DialogFooter className="pt-2">
            <Button type="button" variant="ghost" onClick={onClose} disabled={busy}>Cancel</Button>
            <Button type="submit" disabled={busy} className="bg-leaf-gradient">
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Place order · ৳{total.toFixed(0)}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
