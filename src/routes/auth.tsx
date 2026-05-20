import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Sprout, User as UserIcon, Loader2 } from "lucide-react";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Sign In — কৃষক বাজার" }] }),
  component: AuthPage,
});

function AuthPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) navigate({ to: "/" });
  }, [user, loading, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-saffron/5 grid place-items-center px-4 py-12">
      <div className="w-full max-w-md">
        <Link to="/" className="block text-center mb-6">
          <div className="font-bn font-bold text-2xl text-primary">কৃষক বাজার</div>
          <div className="text-xs text-muted-foreground">Krishok Bazar</div>
        </Link>
        <Card className="shadow-xl border-border/60">
          <CardHeader className="text-center pb-4">
            <CardTitle>Welcome</CardTitle>
            <CardDescription>Sign in or create an account</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login">
              <TabsList className="grid grid-cols-2 w-full">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign up</TabsTrigger>
              </TabsList>
              <TabsContent value="login" className="pt-4"><LoginForm /></TabsContent>
              <TabsContent value="signup" className="pt-4"><SignupForm /></TabsContent>
            </Tabs>
            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">or</span>
              </div>
            </div>
            <GoogleButton />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Welcome back!");
    navigate({ to: "/" });
  };

  return (
    <form onSubmit={submit} className="space-y-3">
      <div className="space-y-1.5">
        <Label htmlFor="li-email">Email</Label>
        <Input id="li-email" type="email" required value={email} onChange={e => setEmail(e.target.value)} />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="li-pw">Password</Label>
        <Input id="li-pw" type="password" required value={password} onChange={e => setPassword(e.target.value)} />
      </div>
      <Button type="submit" disabled={busy} className="w-full bg-leaf-gradient">
        {busy && <Loader2 className="h-4 w-4 animate-spin" />} Login
      </Button>
    </form>
  );
}

function SignupForm() {
  const [accountType, setAccountType] = useState<"customer" | "farmer">("customer");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [farmName, setFarmName] = useState("");
  const [district, setDistrict] = useState("");
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: { full_name: fullName, phone },
      },
    });
    if (error) { setBusy(false); toast.error(error.message); return; }

    if (accountType === "farmer" && data.user) {
      const { error: appErr } = await supabase.from("farmer_applications").insert({
        user_id: data.user.id,
        farm_name: farmName,
        district,
      });
      if (appErr) { setBusy(false); toast.error("Account created, but farmer application failed: " + appErr.message); return; }
    }

    setBusy(false);
    toast.success(
      accountType === "farmer"
        ? "Account created! Your farmer application is pending admin approval."
        : "Account created! Please check your email to verify.",
    );
    navigate({ to: "/" });
  };

  return (
    <form onSubmit={submit} className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        <button type="button" onClick={() => setAccountType("customer")}
          className={`rounded-lg border-2 p-3 text-sm font-medium flex flex-col items-center gap-1 transition ${accountType === "customer" ? "border-primary bg-primary/5" : "border-border"}`}>
          <UserIcon className="h-5 w-5" /> Customer
        </button>
        <button type="button" onClick={() => setAccountType("farmer")}
          className={`rounded-lg border-2 p-3 text-sm font-medium flex flex-col items-center gap-1 transition ${accountType === "farmer" ? "border-primary bg-primary/5" : "border-border"}`}>
          <Sprout className="h-5 w-5" /> Farmer
        </button>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="su-name">Full name</Label>
        <Input id="su-name" required value={fullName} onChange={e => setFullName(e.target.value)} />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="su-email">Email</Label>
        <Input id="su-email" type="email" required value={email} onChange={e => setEmail(e.target.value)} />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="su-phone">Phone</Label>
        <Input id="su-phone" type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="01XXXXXXXXX" />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="su-pw">Password</Label>
        <Input id="su-pw" type="password" required minLength={6} value={password} onChange={e => setPassword(e.target.value)} />
      </div>

      {accountType === "farmer" && (
        <>
          <div className="space-y-1.5">
            <Label htmlFor="su-farm">Farm name</Label>
            <Input id="su-farm" required value={farmName} onChange={e => setFarmName(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="su-district">District</Label>
            <Input id="su-district" required value={district} onChange={e => setDistrict(e.target.value)} placeholder="e.g. Rangpur" />
          </div>
          <p className="text-xs text-muted-foreground">Farmer accounts require admin approval before you can list products.</p>
        </>
      )}

      <Button type="submit" disabled={busy} className="w-full bg-leaf-gradient">
        {busy && <Loader2 className="h-4 w-4 animate-spin" />} Create account
      </Button>
    </form>
  );
}

function GoogleButton() {
  const [busy, setBusy] = useState(false);
  const onClick = async () => {
    setBusy(true);
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    if (result.error) { setBusy(false); toast.error(result.error.message ?? "Google sign-in failed"); return; }
    if (result.redirected) return;
    window.location.href = "/";
  };
  return (
    <Button variant="outline" type="button" onClick={onClick} disabled={busy} className="w-full">
      {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : (
        <svg className="h-4 w-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.83z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.83C6.71 7.31 9.14 5.38 12 5.38z"/></svg>
      )} Continue with Google
    </Button>
  );
}
