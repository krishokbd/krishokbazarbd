import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2, ShoppingBag, LogIn } from "lucide-react";
import { useCart } from "@/lib/cart";
import { useAuth } from "@/lib/auth";
import { CheckoutDialog } from "@/components/CheckoutDialog";

const DELIVERY_FEE = 60;

export function CartSheet() {
  const { items, open, setOpen, setQty, remove, subtotal, count, clear } = useCart();
  const { user } = useAuth();
  const [checkout, setCheckout] = useState(false);
  const total = subtotal > 0 ? subtotal + DELIVERY_FEE : 0;

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="w-full sm:max-w-md flex flex-col p-0">
          <SheetHeader className="px-5 py-4 border-b">
            <SheetTitle className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-primary" />
              Your cart {count > 0 && <span className="text-sm font-normal text-muted-foreground">({count})</span>}
            </SheetTitle>
          </SheetHeader>

          {items.length === 0 ? (
            <div className="flex-1 grid place-items-center px-6">
              <div className="text-center space-y-2">
                <div className="text-4xl">🧺</div>
                <p className="text-sm text-muted-foreground">Your cart is empty</p>
                <Button size="sm" variant="outline" onClick={() => setOpen(false)}>Continue shopping</Button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
                {items.map(item => (
                  <div key={item.product_id} className="flex gap-3 pb-3 border-b border-border/60 last:border-0">
                    <img src={item.image} alt="" className="h-16 w-16 rounded-lg object-cover shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">{item.title}</div>
                      <div className="text-xs text-muted-foreground truncate">{item.farmer_name}</div>
                      <div className="text-sm font-semibold text-primary mt-0.5">৳{item.price}<span className="text-xs text-muted-foreground font-normal">{item.unit}</span></div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center border rounded-full">
                          <button onClick={() => setQty(item.product_id, item.quantity - 1)} className="h-7 w-7 grid place-items-center hover:bg-muted rounded-l-full"><Minus className="h-3 w-3" /></button>
                          <span className="px-2.5 text-sm font-medium tabular-nums">{item.quantity}</span>
                          <button onClick={() => setQty(item.product_id, item.quantity + 1)} className="h-7 w-7 grid place-items-center hover:bg-muted rounded-r-full"><Plus className="h-3 w-3" /></button>
                        </div>
                        <button onClick={() => remove(item.product_id)} className="text-destructive p-1 hover:bg-destructive/10 rounded" aria-label="Remove">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                <button onClick={clear} className="text-xs text-muted-foreground hover:text-destructive">Clear cart</button>
              </div>

              <div className="border-t bg-muted/30 px-5 py-4 space-y-2">
                <Row label="Subtotal" value={`৳${subtotal.toFixed(0)}`} />
                <Row label="Delivery" value={`৳${DELIVERY_FEE}`} />
                <Row label="Total" value={`৳${total.toFixed(0)}`} bold />
                {user ? (
                  <Button className="w-full bg-leaf-gradient h-11" onClick={() => { setOpen(false); setCheckout(true); }}>
                    Checkout
                  </Button>
                ) : (
                  <Button asChild className="w-full bg-leaf-gradient h-11">
                    <Link to="/auth" onClick={() => setOpen(false)}>
                      <LogIn className="h-4 w-4" /> Sign in to checkout
                    </Link>
                  </Button>
                )}
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {checkout && <CheckoutDialog onClose={() => setCheckout(false)} deliveryFee={DELIVERY_FEE} />}
    </>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className={`flex items-center justify-between text-sm ${bold ? "font-bold text-base" : "text-muted-foreground"}`}>
      <span>{label}</span><span className={bold ? "text-primary" : "text-foreground"}>{value}</span>
    </div>
  );
}
