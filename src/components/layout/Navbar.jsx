import { Search, Bell, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

import { useAuthStore } from "@/store/authStore";
import { useNavigate } from "react-router-dom";

export function Navbar() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6">
      {/* Search Bar */}
      <div className="flex items-center flex-1 max-w-xl">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search IoCs, threats, or reports..."
            className="pl-10 bg-background border-border focus:border-primary"
          />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4">
        {/* Notification Button */}
        <Button variant="ghost" size="icon" className="relative hover:bg-accent">
          <Bell className="w-5 h-5" />
          <Badge
            variant="destructive"
            className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs"
          >
            3
          </Badge>
        </Button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="hover:bg-accent">
              <User className="w-5 h-5" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div>
                <p className="font-semibold">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={() => navigate("/settings")}>
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem>Billing</DropdownMenuItem>
            <DropdownMenuItem>Team</DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              className="text-destructive cursor-pointer"
              onClick={handleLogout}
            >
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
