import { useEffect, useState, useCallback, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Package, Search, MapPin, Phone, User as UserIcon } from "lucide-react";
import { toast } from "sonner";

type OrderStatus = "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";

const STATUSES: OrderStatus[] = ["pending", "confirmed", "shipped", "delivered", "cancelled"];

const statusStyles: Record<OrderStatus, string> = {
  pending: "bg-amber-100 text-amber-800 border-amber-200",
  confirmed: "bg-blue-100 text-blue-800 border-blue-200",
  shipped: "bg-indigo-100 text-indigo-800 border-indigo-200",
  delivered: "bg-emerald-100 text-emerald-800 border-emerald-200",
  cancelled: "bg-rose-100 text-rose-800 border-rose-200",
};

interface OrderItem {
  id: string;
  product_id: string;
  product_title: string;
  product_title_bn: string | null;
  product_image: string | null;
  unit: string | null;
  unit_price: number;
  quantity: number;
  line_total: number;
  farmer_name: string | null;
}

interface Order {
  id: string;
  customer_id: string;
  status: OrderStatus;
  subtotal: number;
  delivery_fee: number;
  total: number;
  item_count: number;
  payment_method: string;
  shipping_name: string;
  shipping_phone: string;
  shipping_address: string;
  shipping_city: string | null;
  shipping_district: string;
  shipping_postcode: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export function OrdersTab() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<OrderStatus | "all">("all");
  const [open, setOpen] = useState<Order | null>(null);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [itemsLoading, setItemsLoading] = useState(false);
  const [updating, setUpdating] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(500);
    if (error) { toast.error(error.message); setLoading(false); return; }
    setOrders((data ?? []) as Order[]);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const loadItems = useCallback(async (orderId: string) => {
    setItemsLoading(true);
    const { data, error } = await supabase
      .from("order_items").select("*").eq("order_id", orderId);
    if (error) toast.error(error.message);
    setItems((data ?? []) as OrderItem[]);
    setItemsLoading(false);
  }, []);

  useEffect(() => { if (open) loadItems(open.id); else setItems([]); }, [open, loadItems]);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return orders.filter(o => {
      if (filter !== "all" && o.status !== filter) return false;
      if (!needle) return true;
      return (
        o.id.toLowerCase().includes(needle) ||
        o.shipping_name.toLowerCase().includes(needle) ||
        o.shipping_phone.toLowerCase().includes(needle) ||
        o.shipping_district.toLowerCase().includes(needle)
      );
    });
  }, [orders, q, filter]);

  const counts = useMemo(() => {
    const c: Record<OrderStatus | "all", number> = {
      all: orders.length, pending: 0, confirmed: 0, shipped: 0, delivered: 0, cancelled: 0,
    };
    for (const o of orders) c[o.status]++;
    return c;
  }, [orders]);

  const updateStatus = async (order: Order, next: OrderStatus) => {
    setUpdating(true);
    const { error } = await supabase.from("orders").update({ status: next }).eq("id", order.id);
    setUpdating(false);
    if (error) { toast.error(error.message); return; }
    toast.success(`Order ${order.id.slice(0, 8)} → ${next}`);
    setOrders(prev => prev.map(o => o.id === order.id ? { ...o, status: next } : o));
    if (open?.id === order.id) setOpen({ ...order, status: next });
  };

  return (
    <Card className="mt-4">
      <CardHeader className="flex flex-row items-center justify-between gap-3 flex-wrap">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" /> Orders
          </CardTitle>
          <p className="text-xs text-muted-foreground mt-1">
            Search by order ID, customer name, phone or district. Update status inline.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={load} disabled={loading}>
          {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />} Refresh
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <div className="relative flex-1 min-w-[220px] max-w-md">
            <Search className="h-4 w-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search orders…" value={q} onChange={e => setQ(e.target.value)} className="pl-8" />
          </div>
          <Select value={filter} onValueChange={(v) => setFilter(v as OrderStatus | "all")}>
            <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All ({counts.all})</SelectItem>
              {STATUSES.map(s => (
                <SelectItem key={s} value={s}>
                  {s.charAt(0).toUpperCase() + s.slice(1)} ({counts[s]})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <div className="py-12 text-center text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin mx-auto" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground text-sm">
            No orders match the current filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>District</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Placed</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(o => (
                  <TableRow key={o.id}>
                    <TableCell className="font-mono text-xs">#{o.id.slice(0, 8)}</TableCell>
                    <TableCell>
                      <div className="font-medium text-sm">{o.shipping_name}</div>
                      <div className="text-xs text-muted-foreground">{o.shipping_phone}</div>
                    </TableCell>
                    <TableCell className="text-sm">{o.shipping_district}</TableCell>
                    <TableCell className="text-sm">{o.item_count}</TableCell>
                    <TableCell className="font-semibold">৳{Number(o.total).toFixed(0)}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {new Date(o.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Select
                        value={o.status}
                        onValueChange={(v) => updateStatus(o, v as OrderStatus)}
                        disabled={updating}
                      >
                        <SelectTrigger className={`h-7 w-32 text-xs border ${statusStyles[o.status]}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" variant="outline" onClick={() => setOpen(o)}>View</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>

      {open && (
        <Dialog open onOpenChange={(o) => !o && setOpen(null)}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between gap-3 pr-6">
                <span className="font-mono text-sm">Order #{open.id.slice(0, 8)}</span>
                <Badge variant="outline" className={statusStyles[open.status]}>{open.status}</Badge>
              </DialogTitle>
            </DialogHeader>

            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2 p-3 rounded-lg bg-muted/40">
                <div className="text-xs font-semibold text-muted-foreground uppercase">Customer</div>
                <div className="flex items-center gap-2"><UserIcon className="h-3.5 w-3.5 text-muted-foreground" />{open.shipping_name}</div>
                <div className="flex items-center gap-2"><Phone className="h-3.5 w-3.5 text-muted-foreground" />{open.shipping_phone}</div>
                <div className="flex items-start gap-2">
                  <MapPin className="h-3.5 w-3.5 text-muted-foreground mt-0.5" />
                  <div>
                    {open.shipping_address}<br />
                    {[open.shipping_city, open.shipping_district, open.shipping_postcode].filter(Boolean).join(", ")}
                  </div>
                </div>
                {open.notes && <div className="text-xs text-muted-foreground italic">Note: {open.notes}</div>}
              </div>

              <div className="space-y-2 p-3 rounded-lg bg-muted/40">
                <div className="text-xs font-semibold text-muted-foreground uppercase">Summary</div>
                <Row label="Subtotal" value={`৳${Number(open.subtotal).toFixed(0)}`} />
                <Row label="Delivery" value={`৳${Number(open.delivery_fee).toFixed(0)}`} />
                <Row label="Total" value={`৳${Number(open.total).toFixed(0)}`} bold />
                <Row label="Payment" value={open.payment_method.toUpperCase()} />
                <Row label="Placed" value={new Date(open.created_at).toLocaleString()} />
                <div className="pt-2">
                  <div className="text-xs text-muted-foreground mb-1">Update status</div>
                  <Select value={open.status} onValueChange={(v) => updateStatus(open, v as OrderStatus)} disabled={updating}>
                    <SelectTrigger className="h-8"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <div className="text-xs font-semibold text-muted-foreground uppercase mb-2">Items</div>
              {itemsLoading ? (
                <div className="py-6 text-center"><Loader2 className="h-4 w-4 animate-spin mx-auto" /></div>
              ) : (
                <div className="border rounded-lg divide-y">
                  {items.map(it => (
                    <div key={it.id} className="flex items-center gap-3 p-2.5">
                      {it.product_image ? (
                        <img src={it.product_image} alt="" className="h-12 w-12 rounded object-cover" />
                      ) : (
                        <div className="h-12 w-12 rounded bg-muted" />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate">{it.product_title}</div>
                        {it.product_title_bn && <div className="text-xs text-muted-foreground truncate">{it.product_title_bn}</div>}
                        {it.farmer_name && <div className="text-[11px] text-muted-foreground">Farmer: {it.farmer_name}</div>}
                      </div>
                      <div className="text-right text-sm">
                        <div>৳{Number(it.unit_price).toFixed(0)} × {it.quantity}{it.unit ?? ""}</div>
                        <div className="font-semibold">৳{Number(it.line_total).toFixed(0)}</div>
                      </div>
                    </div>
                  ))}
                  {items.length === 0 && <div className="p-4 text-center text-xs text-muted-foreground">No items.</div>}
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </Card>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex justify-between gap-2">
      <span className="text-muted-foreground text-xs">{label}</span>
      <span className={bold ? "font-semibold" : ""}>{value}</span>
    </div>
  );
}
