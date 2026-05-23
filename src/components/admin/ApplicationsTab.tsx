import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CheckCircle2, XCircle, Loader2, MapPin, Sprout, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

type AppStatus = "pending" | "approved" | "rejected";
type Application = {
  id: string;
  user_id: string;
  farm_name: string;
  farm_name_bn: string | null;
  district: string;
  upazila: string | null;
  about: string | null;
  about_bn: string | null;
  photo_url: string | null;
  status: AppStatus;
  created_at: string;
  reviewed_at: string | null;
  reviewed_by: string | null;
  profile?: { full_name: string | null; phone: string | null; avatar_url: string | null } | null;
};

export function ApplicationsTab({ onPendingChange }: { onPendingChange?: (n: number) => void }) {
  const { user } = useAuth();
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<AppStatus>("pending");
  const [open, setOpen] = useState<Application | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("farmer_applications")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) { toast.error(error.message); setLoading(false); return; }

    // Fetch profile data per applicant (admin can read profiles)
    const ids = Array.from(new Set((data ?? []).map(a => a.user_id)));
    let profiles: Record<string, Application["profile"]> = {};
    if (ids.length) {
      const { data: profs } = await supabase
        .from("profiles").select("id, full_name, phone, avatar_url").in("id", ids);
      profiles = Object.fromEntries((profs ?? []).map(p => [p.id, p]));
    }
    const merged = (data ?? []).map(a => ({ ...a, profile: profiles[a.user_id] ?? null })) as Application[];
    setApps(merged);
    setLoading(false);
    onPendingChange?.(merged.filter(a => a.status === "pending").length);
  }, [onPendingChange]);

  useEffect(() => { load(); }, [load]);

  // Realtime updates so new signups appear instantly
  useEffect(() => {
    const channel = supabase
      .channel("farmer_apps_admin")
      .on("postgres_changes", { event: "*", schema: "public", table: "farmer_applications" }, () => load())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [load]);

  const approve = async (app: Application) => {
    if (!user) return;
    setBusy(true);
    // 1. Grant the farmer role (RLS: admins only via has_role)
    const { error: roleErr } = await supabase
      .from("user_roles")
      .insert({ user_id: app.user_id, role: "farmer" });
    // Ignore unique-violation if role already exists
    if (roleErr && !roleErr.message.toLowerCase().includes("duplicate")) {
      setBusy(false); toast.error(roleErr.message); return;
    }
    // 2. Mark application approved
    const { error: updErr } = await supabase
      .from("farmer_applications")
      .update({ status: "approved", reviewed_at: new Date().toISOString(), reviewed_by: user.id })
      .eq("id", app.id);
    setBusy(false);
    if (updErr) { toast.error(updErr.message); return; }
    toast.success(`Approved ${app.farm_name} — verified farmer badge issued`);
    setOpen(null);
    load();
  };

  const reject = async (app: Application) => {
    if (!user) return;
    setBusy(true);
    const { error } = await supabase
      .from("farmer_applications")
      .update({ status: "rejected", reviewed_at: new Date().toISOString(), reviewed_by: user.id })
      .eq("id", app.id);
    setBusy(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Application rejected");
    setOpen(null);
    load();
  };

  const counts = {
    pending: apps.filter(a => a.status === "pending").length,
    approved: apps.filter(a => a.status === "approved").length,
    rejected: apps.filter(a => a.status === "rejected").length,
  };
  const filtered = apps.filter(a => a.status === tab);

  return (
    <Card className="mt-4">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Sprout className="h-5 w-5 text-primary" /> Farmer Applications
          </CardTitle>
          <p className="text-xs text-muted-foreground mt-1">
            Review and verify farmer signups. Approving grants the farmer role and the verified badge.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={load} disabled={loading}>
          {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />} Refresh
        </Button>
      </CardHeader>
      <CardContent>
        <Tabs value={tab} onValueChange={(v) => setTab(v as AppStatus)}>
          <TabsList>
            <TabsTrigger value="pending">
              Pending {counts.pending > 0 && <Badge className="ml-2 bg-saffron text-saffron-foreground">{counts.pending}</Badge>}
            </TabsTrigger>
            <TabsTrigger value="approved">Approved <span className="ml-1.5 text-xs text-muted-foreground">({counts.approved})</span></TabsTrigger>
            <TabsTrigger value="rejected">Rejected <span className="ml-1.5 text-xs text-muted-foreground">({counts.rejected})</span></TabsTrigger>
          </TabsList>

          <TabsContent value={tab} className="pt-4">
            {loading ? (
              <div className="py-12 text-center text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin mx-auto" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="py-12 text-center text-muted-foreground text-sm">
                {tab === "pending" ? "🌾 No applications waiting for review." : `No ${tab} applications.`}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Applicant</TableHead>
                      <TableHead>Farm</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map(a => (
                      <TableRow key={a.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              {a.profile?.avatar_url && <AvatarImage src={a.profile.avatar_url} />}
                              <AvatarFallback className="text-xs bg-leaf-gradient text-white">
                                {(a.profile?.full_name ?? "?").slice(0, 1).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium text-sm">{a.profile?.full_name ?? "—"}</div>
                              <div className="text-xs text-muted-foreground">{a.profile?.phone ?? ""}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium text-sm">{a.farm_name}</div>
                          {a.farm_name_bn && <div className="text-xs text-muted-foreground font-bn">{a.farm_name_bn}</div>}
                        </TableCell>
                        <TableCell className="text-sm">
                          <div className="flex items-center gap-1"><MapPin className="h-3 w-3 text-muted-foreground" />{a.district}</div>
                          {a.upazila && <div className="text-xs text-muted-foreground pl-4">{a.upazila}</div>}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {new Date(a.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button size="sm" variant="outline" onClick={() => setOpen(a)}>Review</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>

      {open && (
        <Dialog open onOpenChange={(o) => !o && setOpen(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-primary" /> Review application
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3 p-3 bg-muted/40 rounded-lg">
                <Avatar className="h-12 w-12">
                  {open.profile?.avatar_url && <AvatarImage src={open.profile.avatar_url} />}
                  <AvatarFallback className="bg-leaf-gradient text-white">
                    {(open.profile?.full_name ?? "?").slice(0, 1).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <div className="font-semibold truncate">{open.profile?.full_name ?? "—"}</div>
                  <div className="text-xs text-muted-foreground truncate">{open.profile?.phone ?? "No phone"}</div>
                </div>
              </div>
              <Field label="Farm name" value={open.farm_name} valueBn={open.farm_name_bn} />
              <Field label="District" value={open.district} />
              {open.upazila && <Field label="Upazila" value={open.upazila} />}
              {(open.about || open.about_bn) && (
                <div>
                  <div className="text-xs font-medium text-muted-foreground mb-1">About</div>
                  {open.about && <p className="text-sm">{open.about}</p>}
                  {open.about_bn && <p className="text-sm font-bn mt-1">{open.about_bn}</p>}
                </div>
              )}
              {open.photo_url && (
                <img src={open.photo_url} alt="Farm" className="w-full h-40 object-cover rounded-lg" />
              )}
              {open.status !== "pending" && (
                <div className="text-xs text-muted-foreground">
                  Already <span className="font-medium">{open.status}</span>
                  {open.reviewed_at && ` on ${new Date(open.reviewed_at).toLocaleDateString()}`}
                </div>
              )}
            </div>
            <DialogFooter className="gap-2">
              {open.status === "pending" ? (
                <>
                  <Button variant="outline" onClick={() => reject(open)} disabled={busy}>
                    <XCircle className="h-4 w-4" /> Reject
                  </Button>
                  <Button onClick={() => approve(open)} disabled={busy} className="bg-leaf-gradient">
                    {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                    Approve & verify
                  </Button>
                </>
              ) : (
                <Button variant="outline" onClick={() => setOpen(null)}>Close</Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </Card>
  );
}

function Field({ label, value, valueBn }: { label: string; value: string; valueBn?: string | null }) {
  return (
    <div>
      <div className="text-xs font-medium text-muted-foreground">{label}</div>
      <div className="text-sm">{value}</div>
      {valueBn && <div className="text-sm font-bn text-muted-foreground">{valueBn}</div>}
    </div>
  );
}
