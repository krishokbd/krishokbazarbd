import { Link, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LogOut, Shield, Sprout, User as UserIcon } from "lucide-react";
import { toast } from "sonner";

export function UserMenu() {
  const { user, roles, isAdmin, isFarmer, signOut, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) return null;

  if (!user) {
    return (
      <Button asChild size="sm" className="bg-leaf-gradient shadow-soft gap-1.5">
        <Link to="/auth"><UserIcon className="h-4 w-4" />Sign in</Link>
      </Button>
    );
  }

  const initials = (user.user_metadata?.full_name ?? user.email ?? "U")
    .split(" ").map((s: string) => s[0]).slice(0, 2).join("").toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="h-10 w-10 rounded-full bg-muted hover:bg-muted/70 grid place-items-center transition">
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-leaf-gradient text-white text-sm font-semibold">{initials}</AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="font-medium truncate">{user.user_metadata?.full_name ?? user.email}</div>
          <div className="text-xs text-muted-foreground truncate">{user.email}</div>
          <div className="flex gap-1 mt-1.5 flex-wrap">
            {roles.map(r => (
              <span key={r} className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary font-medium uppercase">{r}</span>
            ))}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {isAdmin && (
          <DropdownMenuItem asChild><Link to="/admin"><Shield className="h-4 w-4" />Admin panel</Link></DropdownMenuItem>
        )}
        {isFarmer && (
          <DropdownMenuItem><Sprout className="h-4 w-4" />My products</DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={async () => { await signOut(); toast.success("Signed out"); navigate({ to: "/" }); }}>
          <LogOut className="h-4 w-4" />Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
