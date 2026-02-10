import { Outlet, Link, useLocation } from "react-router-dom";
import { useState } from "react";
import {
  House,
  Plug,
  Question,
  UserCircle,
  Brain,
  FileText,
  Database,
  CaretRight,
  ArrowSquareOut,
  X,
} from "phosphor-react";
import Topnav from "../topnav/topnav.jsx";

const Layout = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const location = useLocation();

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { path: "/dashboard", icon: House, label: "Dashboard" },
    { path: "/home", icon: FileText, label: "Reports" },
    { path: "/analyze", icon: Brain, label: "Analyze Report" },
    { path: "/connections", icon: Plug, label: "Connections" },
    { path: "/talktodb", icon: Database, label: "Talk to Database" },
    { path: "/filechat", icon: FileText, label: "Talk to Files" },
  ];

  const bottomItems = [
    { path: "/help", icon: Question, label: "Help", external: true },
    { path: "/profile", icon: UserCircle, label: "Profile" },
  ];

  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      <Topnav />

      <div className="flex-1 items-start md:grid md:grid-cols-[240px_minmax(0,1fr)] lg:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 overflow-y-auto border-r bg-background/50 md:sticky md:block">
          <div className="relative overflow-hidden h-full py-6 pr-4 pl-6">
            <div className="flex flex-col justify-between h-full">
              <div className="flex flex-col space-y-6">
                <div>
                  <h4 className="mb-2 px-3 text-[11px] font-bold uppercase tracking-widest text-muted-foreground/60">
                    Main
                  </h4>
                  <div className="flex flex-col space-y-1">
                    {navItems.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={`group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-all duration-200 ${isActive(item.path)
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-accent hover:text-foreground"
                          }`}
                      >
                        <item.icon size={16} className={`mr-2 shrink-0 transition-colors ${isActive(item.path) ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                          }`} />
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-col space-y-1 pb-4">
                <h4 className="mb-2 px-3 text-[11px] font-bold uppercase tracking-widest text-muted-foreground/60">
                  Settings
                </h4>
                {bottomItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-all duration-200 ${isActive(item.path)
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                      }`}
                  >
                    <item.icon size={16} className={`mr-2 shrink-0 transition-colors ${isActive(item.path) ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                      }`} />
                    {item.label}
                    {item.external && <ArrowSquareOut size={16} className="ml-auto opacity-50 group-hover:opacity-100 transition-opacity shrink-0" />}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </aside>

        <main className="relative py-6 lg:gap-10 lg:py-8 px-6 md:px-10">
          <div className="mx-auto w-full max-w-5xl">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile Nav Toggle */}
      <button
        className="fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-xl md:hidden transition-transform active:scale-95"
        onClick={toggleNav}
      >
        {isNavOpen ? <X size={24} /> : <CaretRight size={24} />}
      </button>

      {/* Mobile Nav Overlay */}
      {isNavOpen && (
        <div className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden animate-in fade-in duration-200" onClick={toggleNav}>
          <div className="fixed inset-y-0 left-0 z-50 w-[280px] border-r bg-background p-6 shadow-2xl sm:max-w-sm animate-in slide-in-from-left duration-300">
            <div className="flex flex-col space-y-8 mt-10">
              <div>
                <h4 className="mb-4 px-3 text-[11px] font-bold uppercase tracking-widest text-muted-foreground/60">
                  Main
                </h4>
                <div className="flex flex-col space-y-2">
                  {navItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={toggleNav}
                      className={`flex items-center rounded-lg px-4 py-3 text-base font-medium transition-colors ${isActive(item.path)
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-accent hover:text-foreground"
                        }`}
                    >
                      <item.icon size={20} className="mr-4 shrink-0" />
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="mb-4 px-3 text-[11px] font-bold uppercase tracking-widest text-muted-foreground/60">
                  Settings
                </h4>
                <div className="flex flex-col space-y-2">
                  {bottomItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={toggleNav}
                      className={`flex items-center rounded-lg px-4 py-3 text-base font-medium transition-colors ${isActive(item.path)
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-accent hover:text-foreground"
                        }`}
                    >
                      <item.icon size={20} className="mr-4 shrink-0" />
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Layout;
