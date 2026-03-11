import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Home, Scale, Briefcase, Gavel, Settings, Headset } from "lucide-react";
import { useSettings } from "@/hooks/useSettings";

const navItems = [
  { title: "الصفحة الرئيسية", path: "/", icon: Home },
  { title: "القوانين", path: "/rules", icon: Scale },
  { title: "الوظائف", path: "/jobs", icon: Briefcase },
  { title: "العقوبات", path: "/sanctions", icon: Gavel },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="container flex h-16 items-center justify-between px-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-primary hover:text-primary/80 transition-colors"
            aria-label="فتح القائمة"
          >
            <Menu className="h-7 w-7" />
          </button>

          <Link to="/" className="font-heading text-2xl font-bold text-primary tracking-wide">
            Gnsader
          </Link>

          <Link
            to="/admin"
            className="text-muted-foreground hover:text-primary transition-colors"
            aria-label="لوحة التحكم"
          >
            <Settings className="h-5 w-5" />
          </Link>
        </div>
      </header>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 right-0 z-50 h-full w-72 bg-card border-l border-border transform transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-6 border-b border-border">
          <span className="font-heading text-xl font-bold text-primary">Gnsader</span>
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="p-4 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? "bg-primary text-primary-foreground font-semibold"
                    : "text-foreground hover:bg-secondary"
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span className="text-base">{item.title}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="container px-4 py-8">{children}</main>
    </div>
  );
}
