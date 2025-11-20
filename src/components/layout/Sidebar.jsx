import {
  Shield,
  Search,
  Bell,
  FileText,
  Settings,
  LayoutDashboard,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "IoC Search", href: "/ioc-search", icon: Search },
  { name: "Alerts", href: "/alerts", icon: Bell },
  { name: "Reports", href: "/reports", icon: FileText },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  return (
    <aside className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
      {/* Logo Section */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Shield className="w-8 h-8 text-primary" />
            <div className="absolute inset-0 glow-effect rounded-full" />
          </div>

          <div>
            <h1 className="text-xl font-bold text-foreground">ThreatView</h1>
            <p className="text-xs text-muted-foreground">
              Intelligence Platform
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            end
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
              "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            )}
            activeClassName="bg-sidebar-accent text-primary border border-primary/30 glow-effect"
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* Threat Level Widget */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="px-4 py-3 rounded-lg bg-card border border-border">
          <p className="text-xs text-muted-foreground mb-1">Threat Level</p>

          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-warning animate-pulse" />
            <span className="text-sm font-semibold text-warning">
              Elevated
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
