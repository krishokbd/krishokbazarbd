import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { StoreProvider, useStore, type Banner } from "@/lib/store";
import type { Category, Farmer, Product, Review } from "@/data/mock";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pencil, Plus, Trash2, CheckCircle2, XCircle, ArrowLeft, RotateCcw } from "lucide-react";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin CMS — Krishok Bazar" }, { name: "robots", content: "noindex" }] }),
  component: AdminPage,
});

function AdminPage() {
  return (
    <StoreProvider>
      <AdminShell />
    </StoreProvider>
  );
}

function AdminShell() {
  const s = useStore();
  return (
    <div className="min-h-screen bg-muted/30">
      <header className="bg-background border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" /> Back to site
            </Link>
            <div className="h-5 w-px bg-border" />
            <h1 className="font-bold text-lg">Krishok Bazar — Admin CMS</h1>
          </div>
          <Button variant="outline" size="sm" onClick={() => { if (confirm("Reset all data to defaults?")) s.resetAll(); }}>
            <RotateCcw className="h-4 w-4" /> Reset data
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <DashboardStats />
        <Tabs defaultValue="products" className="mt-6">
          <TabsList className="flex flex-wrap h-auto">
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="farmers">Farmers</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="banners">Banners</TabsTrigger>
          </TabsList>
          <TabsContent value="products"><ProductsTab /></TabsContent>
          <TabsContent value="farmers"><FarmersTab /></TabsContent>
          <TabsContent value="categories"><CategoriesTab /></TabsContent>
          <TabsContent value="reviews"><ReviewsTab /></TabsContent>
          <TabsContent value="banners"><BannersTab /></TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

function DashboardStats() {
  const s = useStore();
  const verifiedCount = s.farmers.filter(f => f.verified).length;
  const stats = [
    { label: "Products", value: s.products.length },
    { label: "Farmers", value: s.farmers.length, sub: `${verifiedCount} verified` },
    { label: "Categories", value: s.categories.length },
    { label: "Reviews", value: s.reviews.length },
    { label: "Banners", value: s.banners.length, sub: `${s.banners.filter(b => b.active).length} active` },
  ];
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
      {stats.map(st => (
        <Card key={st.label}>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">{st.label}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{st.value}</div>
            {st.sub && <div className="text-xs text-muted-foreground">{st.sub}</div>}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

/* ---------- Generic helpers ---------- */

function Section({ title, action, children }: { title: string; action?: ReactNode; children: ReactNode }) {
  return (
    <Card className="mt-4">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{title}</CardTitle>
        {action}
      </CardHeader>
      <CardContent className="overflow-x-auto">{children}</CardContent>
    </Card>
  );
}

function ConfirmDelete({ onConfirm, label = "Delete" }: { onConfirm: () => void; label?: string }) {
  return (
    <Button variant="ghost" size="icon" onClick={() => { if (confirm(`${label}?`)) onConfirm(); }} aria-label={label}>
      <Trash2 className="h-4 w-4 text-destructive" />
    </Button>
  );
}

/* ---------- Products ---------- */

const emptyProduct: Omit<Product, "id"> = {
  title: "", titleBn: "", category: "vegetables", price: 0, rating: 4.5, reviews: 0,
  image: "", farmerId: "", unit: "/কেজি",
};

function ProductsTab() {
  const s = useStore();
  const [editing, setEditing] = useState<Product | null>(null);
  const [creating, setCreating] = useState(false);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("all");

  const filtered = s.products.filter(p =>
    (cat === "all" || p.category === cat) &&
    (q === "" || p.title.toLowerCase().includes(q.toLowerCase()) || p.titleBn.includes(q))
  );

  return (
    <Section
      title={`Products (${filtered.length}/${s.products.length})`}
      action={
        <Button size="sm" onClick={() => setCreating(true)}><Plus className="h-4 w-4" /> Add product</Button>
      }
    >
      <div className="flex flex-wrap gap-2 mb-4">
        <Input placeholder="Search products..." value={q} onChange={e => setQ(e.target.value)} className="max-w-xs" />
        <Select value={cat} onValueChange={setCat}>
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {s.categories.map(c => <SelectItem key={c.slug} value={c.slug}>{c.en}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Image</TableHead><TableHead>Title</TableHead><TableHead>Category</TableHead>
            <TableHead>Price</TableHead><TableHead>Farmer</TableHead><TableHead>Badge</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.slice(0, 100).map(p => {
            const farmer = s.farmers.find(f => f.id === p.farmerId);
            return (
              <TableRow key={p.id}>
                <TableCell><img src={p.image} alt="" className="h-10 w-10 rounded object-cover" /></TableCell>
                <TableCell>
                  <div className="font-medium">{p.title}</div>
                  <div className="text-xs text-muted-foreground">{p.titleBn}</div>
                </TableCell>
                <TableCell><Badge variant="secondary">{p.category}</Badge></TableCell>
                <TableCell>
                  ৳{p.price}
                  {p.oldPrice && <span className="ml-1 text-xs text-muted-foreground line-through">৳{p.oldPrice}</span>}
                </TableCell>
                <TableCell className="text-xs">{farmer?.name ?? "—"}</TableCell>
                <TableCell>{p.badge && <Badge>{p.badge}</Badge>}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => setEditing(p)}><Pencil className="h-4 w-4" /></Button>
                  <ConfirmDelete onConfirm={() => s.deleteProduct(p.id)} />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      {filtered.length > 100 && <p className="text-xs text-muted-foreground mt-2">Showing first 100 of {filtered.length}.</p>}

      {creating && <ProductDialog initial={emptyProduct} onClose={() => setCreating(false)} onSave={(data) => { s.addProduct(data); setCreating(false); }} />}
      {editing && <ProductDialog initial={editing} onClose={() => setEditing(null)} onSave={(data) => { s.updateProduct(editing.id, data); setEditing(null); }} />}
    </Section>
  );
}

function ProductDialog({ initial, onClose, onSave }: {
  initial: Omit<Product, "id"> | Product;
  onClose: () => void;
  onSave: (p: Omit<Product, "id">) => void;
}) {
  const s = useStore();
  const [f, setF] = useState<Omit<Product, "id">>({ ...initial });
  const set = <K extends keyof typeof f>(k: K, v: typeof f[K]) => setF(prev => ({ ...prev, [k]: v }));

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle>{"id" in initial ? "Edit product" : "New product"}</DialogTitle></DialogHeader>
        <div className="grid sm:grid-cols-2 gap-3">
          <div><Label>Title (EN)</Label><Input value={f.title} onChange={e => set("title", e.target.value)} /></div>
          <div><Label>Title (BN)</Label><Input value={f.titleBn} onChange={e => set("titleBn", e.target.value)} /></div>
          <div>
            <Label>Category</Label>
            <Select value={f.category} onValueChange={v => set("category", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{s.categories.map(c => <SelectItem key={c.slug} value={c.slug}>{c.en}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div>
            <Label>Farmer</Label>
            <Select value={f.farmerId} onValueChange={v => set("farmerId", v)}>
              <SelectTrigger><SelectValue placeholder="Select farmer" /></SelectTrigger>
              <SelectContent>{s.farmers.map(fa => <SelectItem key={fa.id} value={fa.id}>{fa.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div><Label>Price (৳)</Label><Input type="number" value={f.price} onChange={e => set("price", +e.target.value)} /></div>
          <div><Label>Old price (optional)</Label><Input type="number" value={f.oldPrice ?? ""} onChange={e => set("oldPrice", e.target.value ? +e.target.value : undefined)} /></div>
          <div><Label>Rating</Label><Input type="number" step="0.1" value={f.rating} onChange={e => set("rating", +e.target.value)} /></div>
          <div><Label>Reviews count</Label><Input type="number" value={f.reviews} onChange={e => set("reviews", +e.target.value)} /></div>
          <div className="sm:col-span-2"><Label>Image URL</Label><Input value={f.image} onChange={e => set("image", e.target.value)} /></div>
          <div><Label>Unit</Label><Input value={f.unit ?? ""} onChange={e => set("unit", e.target.value)} /></div>
          <div>
            <Label>Badge</Label>
            <Select value={f.badge ?? "none"} onValueChange={v => set("badge", v === "none" ? undefined : v as Product["badge"])}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="trending">Trending</SelectItem>
                <SelectItem value="organic">Organic</SelectItem>
                <SelectItem value="ready">Ready</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={() => onSave(f)}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ---------- Farmers ---------- */

const emptyFarmer: Omit<Farmer, "id"> = {
  name: "", nameBn: "", gender: "male", district: "Dhaka", districtBn: "ঢাকা",
  verified: false, rating: 4.5, products: 0, sales: 0, category: "vegetables",
};

function FarmersTab() {
  const s = useStore();
  const [editing, setEditing] = useState<Farmer | null>(null);
  const [creating, setCreating] = useState(false);

  return (
    <Section title={`Farmers (${s.farmers.length})`}
      action={<Button size="sm" onClick={() => setCreating(true)}><Plus className="h-4 w-4" /> Add farmer</Button>}>
      <Table>
        <TableHeader><TableRow>
          <TableHead>Name</TableHead><TableHead>District</TableHead><TableHead>Category</TableHead>
          <TableHead>Rating</TableHead><TableHead>Sales</TableHead><TableHead>Verified</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow></TableHeader>
        <TableBody>
          {s.farmers.map(f => (
            <TableRow key={f.id}>
              <TableCell><div className="font-medium">{f.name}</div><div className="text-xs text-muted-foreground">{f.nameBn}</div></TableCell>
              <TableCell>{f.district}</TableCell>
              <TableCell><Badge variant="secondary">{f.category}</Badge></TableCell>
              <TableCell>★ {f.rating}</TableCell>
              <TableCell>{f.sales}</TableCell>
              <TableCell>
                <Button variant="ghost" size="sm" onClick={() => s.toggleFarmerVerified(f.id)}>
                  {f.verified ? <CheckCircle2 className="h-4 w-4 text-emerald-600" /> : <XCircle className="h-4 w-4 text-muted-foreground" />}
                  <span className="ml-1 text-xs">{f.verified ? "Verified" : "Pending"}</span>
                </Button>
              </TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="icon" onClick={() => setEditing(f)}><Pencil className="h-4 w-4" /></Button>
                <ConfirmDelete onConfirm={() => s.deleteFarmer(f.id)} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {creating && <FarmerDialog initial={emptyFarmer} onClose={() => setCreating(false)} onSave={(d) => { s.addFarmer(d); setCreating(false); }} />}
      {editing && <FarmerDialog initial={editing} onClose={() => setEditing(null)} onSave={(d) => { s.updateFarmer(editing.id, d); setEditing(null); }} />}
    </Section>
  );
}

function FarmerDialog({ initial, onClose, onSave }: {
  initial: Omit<Farmer, "id"> | Farmer;
  onClose: () => void;
  onSave: (f: Omit<Farmer, "id">) => void;
}) {
  const s = useStore();
  const [f, setF] = useState<Omit<Farmer, "id">>({ ...initial });
  const set = <K extends keyof typeof f>(k: K, v: typeof f[K]) => setF(p => ({ ...p, [k]: v }));
  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle>{"id" in initial ? "Edit farmer" : "New farmer"}</DialogTitle></DialogHeader>
        <div className="grid sm:grid-cols-2 gap-3">
          <div><Label>Name (EN)</Label><Input value={f.name} onChange={e => set("name", e.target.value)} /></div>
          <div><Label>Name (BN)</Label><Input value={f.nameBn} onChange={e => set("nameBn", e.target.value)} /></div>
          <div><Label>District (EN)</Label><Input value={f.district} onChange={e => set("district", e.target.value)} /></div>
          <div><Label>District (BN)</Label><Input value={f.districtBn} onChange={e => set("districtBn", e.target.value)} /></div>
          <div>
            <Label>Gender</Label>
            <Select value={f.gender} onValueChange={v => set("gender", v as Farmer["gender"])}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="male">Male</SelectItem><SelectItem value="female">Female</SelectItem></SelectContent>
            </Select>
          </div>
          <div>
            <Label>Category</Label>
            <Select value={f.category} onValueChange={v => set("category", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{s.categories.map(c => <SelectItem key={c.slug} value={c.slug}>{c.en}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div><Label>Rating</Label><Input type="number" step="0.1" value={f.rating} onChange={e => set("rating", +e.target.value)} /></div>
          <div><Label>Products count</Label><Input type="number" value={f.products} onChange={e => set("products", +e.target.value)} /></div>
          <div><Label>Sales count</Label><Input type="number" value={f.sales} onChange={e => set("sales", +e.target.value)} /></div>
          <div className="flex items-center gap-3 pt-6">
            <Switch checked={f.verified} onCheckedChange={(v) => set("verified", v)} />
            <Label>Verified badge</Label>
          </div>
        </div>
        <DialogFooter><Button variant="ghost" onClick={onClose}>Cancel</Button><Button onClick={() => onSave(f)}>Save</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ---------- Categories ---------- */

const emptyCategory: Category = { slug: "", bn: "", en: "", emoji: "🌱", count: 0, tint: "from-emerald-500/15 to-emerald-500/0" };

function CategoriesTab() {
  const s = useStore();
  const [editing, setEditing] = useState<Category | null>(null);
  const [creating, setCreating] = useState(false);
  return (
    <Section title={`Categories (${s.categories.length})`}
      action={<Button size="sm" onClick={() => setCreating(true)}><Plus className="h-4 w-4" /> Add category</Button>}>
      <Table>
        <TableHeader><TableRow>
          <TableHead>Emoji</TableHead><TableHead>Slug</TableHead><TableHead>English</TableHead>
          <TableHead>Bangla</TableHead><TableHead>Count</TableHead><TableHead className="text-right">Actions</TableHead>
        </TableRow></TableHeader>
        <TableBody>
          {s.categories.map(c => (
            <TableRow key={c.slug}>
              <TableCell className="text-xl">{c.emoji}</TableCell>
              <TableCell><code className="text-xs">{c.slug}</code></TableCell>
              <TableCell>{c.en}</TableCell><TableCell>{c.bn}</TableCell><TableCell>{c.count}</TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="icon" onClick={() => setEditing(c)}><Pencil className="h-4 w-4" /></Button>
                <ConfirmDelete onConfirm={() => s.deleteCategory(c.slug)} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {creating && <CategoryDialog initial={emptyCategory} isNew onClose={() => setCreating(false)}
        onSave={(d) => { s.addCategory(d); setCreating(false); }} />}
      {editing && <CategoryDialog initial={editing} onClose={() => setEditing(null)}
        onSave={(d) => { s.updateCategory(editing.slug, d); setEditing(null); }} />}
    </Section>
  );
}

function CategoryDialog({ initial, isNew, onClose, onSave }: {
  initial: Category; isNew?: boolean; onClose: () => void; onSave: (c: Category) => void;
}) {
  const [f, setF] = useState<Category>({ ...initial });
  const set = <K extends keyof Category>(k: K, v: Category[K]) => setF(p => ({ ...p, [k]: v }));
  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader><DialogTitle>{isNew ? "New category" : "Edit category"}</DialogTitle></DialogHeader>
        <div className="grid sm:grid-cols-2 gap-3">
          <div><Label>Slug</Label><Input value={f.slug} disabled={!isNew} onChange={e => set("slug", e.target.value)} /></div>
          <div><Label>Emoji</Label><Input value={f.emoji} onChange={e => set("emoji", e.target.value)} /></div>
          <div><Label>English</Label><Input value={f.en} onChange={e => set("en", e.target.value)} /></div>
          <div><Label>Bangla</Label><Input value={f.bn} onChange={e => set("bn", e.target.value)} /></div>
          <div><Label>Count</Label><Input type="number" value={f.count} onChange={e => set("count", +e.target.value)} /></div>
          <div><Label>Tint (tailwind)</Label><Input value={f.tint} onChange={e => set("tint", e.target.value)} /></div>
        </div>
        <DialogFooter><Button variant="ghost" onClick={onClose}>Cancel</Button><Button onClick={() => onSave(f)}>Save</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ---------- Reviews ---------- */

const emptyReview: Omit<Review, "id"> = {
  name: "", nameBn: "", district: "Dhaka", rating: 5, bn: "", en: "",
  avatar: "https://i.pravatar.cc/150?img=1",
};

function ReviewsTab() {
  const s = useStore();
  const [editing, setEditing] = useState<Review | null>(null);
  const [creating, setCreating] = useState(false);
  return (
    <Section title={`Reviews (${s.reviews.length})`}
      action={<Button size="sm" onClick={() => setCreating(true)}><Plus className="h-4 w-4" /> Add review</Button>}>
      <Table>
        <TableHeader><TableRow>
          <TableHead>Customer</TableHead><TableHead>District</TableHead><TableHead>Rating</TableHead>
          <TableHead>Comment</TableHead><TableHead className="text-right">Actions</TableHead>
        </TableRow></TableHeader>
        <TableBody>
          {s.reviews.map(r => (
            <TableRow key={r.id}>
              <TableCell><div className="flex items-center gap-2">
                <img src={r.avatar} alt="" className="h-8 w-8 rounded-full object-cover" />
                <div><div className="font-medium text-sm">{r.name}</div><div className="text-xs text-muted-foreground">{r.nameBn}</div></div>
              </div></TableCell>
              <TableCell>{r.district}</TableCell>
              <TableCell>{"★".repeat(r.rating)}</TableCell>
              <TableCell className="max-w-md truncate text-xs">{r.en}</TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="icon" onClick={() => setEditing(r)}><Pencil className="h-4 w-4" /></Button>
                <ConfirmDelete onConfirm={() => s.deleteReview(r.id)} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {creating && <ReviewDialog initial={emptyReview} onClose={() => setCreating(false)} onSave={(d) => { s.addReview(d); setCreating(false); }} />}
      {editing && <ReviewDialog initial={editing} onClose={() => setEditing(null)} onSave={(d) => { s.updateReview(editing.id, d); setEditing(null); }} />}
    </Section>
  );
}

function ReviewDialog({ initial, onClose, onSave }: {
  initial: Omit<Review, "id"> | Review; onClose: () => void; onSave: (r: Omit<Review, "id">) => void;
}) {
  const [f, setF] = useState<Omit<Review, "id">>({ ...initial });
  const set = <K extends keyof typeof f>(k: K, v: typeof f[K]) => setF(p => ({ ...p, [k]: v }));
  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader><DialogTitle>{"id" in initial ? "Edit review" : "New review"}</DialogTitle></DialogHeader>
        <div className="grid sm:grid-cols-2 gap-3">
          <div><Label>Name (EN)</Label><Input value={f.name} onChange={e => set("name", e.target.value)} /></div>
          <div><Label>Name (BN)</Label><Input value={f.nameBn} onChange={e => set("nameBn", e.target.value)} /></div>
          <div><Label>District</Label><Input value={f.district} onChange={e => set("district", e.target.value)} /></div>
          <div><Label>Rating (1-5)</Label><Input type="number" min={1} max={5} value={f.rating} onChange={e => set("rating", +e.target.value)} /></div>
          <div className="sm:col-span-2"><Label>Avatar URL</Label><Input value={f.avatar} onChange={e => set("avatar", e.target.value)} /></div>
          <div className="sm:col-span-2"><Label>Comment (BN)</Label><Textarea value={f.bn} onChange={e => set("bn", e.target.value)} /></div>
          <div className="sm:col-span-2"><Label>Comment (EN)</Label><Textarea value={f.en} onChange={e => set("en", e.target.value)} /></div>
        </div>
        <DialogFooter><Button variant="ghost" onClick={onClose}>Cancel</Button><Button onClick={() => onSave(f)}>Save</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ---------- Banners ---------- */

const emptyBanner: Omit<Banner, "id"> = {
  titleBn: "", titleEn: "", subBn: "", subEn: "", image: "", active: true,
};

function BannersTab() {
  const s = useStore();
  const [editing, setEditing] = useState<Banner | null>(null);
  const [creating, setCreating] = useState(false);
  return (
    <Section title={`Hero Banners (${s.banners.length})`}
      action={<Button size="sm" onClick={() => setCreating(true)}><Plus className="h-4 w-4" /> Add banner</Button>}>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {s.banners.map(b => (
          <Card key={b.id} className="overflow-hidden">
            <div className="aspect-video bg-muted relative">
              {b.image && <img src={b.image} alt="" className="w-full h-full object-cover" />}
              <div className="absolute top-2 right-2">
                {b.active ? <Badge>Active</Badge> : <Badge variant="secondary">Hidden</Badge>}
              </div>
            </div>
            <CardContent className="pt-4">
              <div className="font-medium text-sm truncate">{b.titleEn}</div>
              <div className="text-xs text-muted-foreground truncate">{b.titleBn}</div>
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center gap-2 text-xs">
                  <Switch checked={b.active} onCheckedChange={(v) => s.updateBanner(b.id, { active: v })} />
                  <span>{b.active ? "Showing" : "Hidden"}</span>
                </div>
                <div>
                  <Button variant="ghost" size="icon" onClick={() => setEditing(b)}><Pencil className="h-4 w-4" /></Button>
                  <ConfirmDelete onConfirm={() => s.deleteBanner(b.id)} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {creating && <BannerDialog initial={emptyBanner} onClose={() => setCreating(false)} onSave={(d) => { s.addBanner(d); setCreating(false); }} />}
      {editing && <BannerDialog initial={editing} onClose={() => setEditing(null)} onSave={(d) => { s.updateBanner(editing.id, d); setEditing(null); }} />}
    </Section>
  );
}

function BannerDialog({ initial, onClose, onSave }: {
  initial: Omit<Banner, "id"> | Banner; onClose: () => void; onSave: (b: Omit<Banner, "id">) => void;
}) {
  const [f, setF] = useState<Omit<Banner, "id">>({ ...initial });
  const set = <K extends keyof typeof f>(k: K, v: typeof f[K]) => setF(p => ({ ...p, [k]: v }));
  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader><DialogTitle>{"id" in initial ? "Edit banner" : "New banner"}</DialogTitle></DialogHeader>
        <div className="grid sm:grid-cols-2 gap-3">
          <div className="sm:col-span-2"><Label>Image URL</Label><Input value={f.image} onChange={e => set("image", e.target.value)} /></div>
          {f.image && <div className="sm:col-span-2 aspect-video bg-muted rounded overflow-hidden"><img src={f.image} alt="" className="w-full h-full object-cover" /></div>}
          <div><Label>Title (EN)</Label><Input value={f.titleEn} onChange={e => set("titleEn", e.target.value)} /></div>
          <div><Label>Title (BN)</Label><Input value={f.titleBn} onChange={e => set("titleBn", e.target.value)} /></div>
          <div className="sm:col-span-2"><Label>Subtitle (EN)</Label><Textarea value={f.subEn} onChange={e => set("subEn", e.target.value)} /></div>
          <div className="sm:col-span-2"><Label>Subtitle (BN)</Label><Textarea value={f.subBn} onChange={e => set("subBn", e.target.value)} /></div>
          <div className="flex items-center gap-3"><Switch checked={f.active} onCheckedChange={(v) => set("active", v)} /><Label>Active on site</Label></div>
        </div>
        <DialogFooter><Button variant="ghost" onClick={onClose}>Cancel</Button><Button onClick={() => onSave(f)}>Save</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
