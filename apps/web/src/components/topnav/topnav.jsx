import Logo from "../logo/logo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SignOut, Moon, Sun, Monitor } from "phosphor-react";
import { useTheme } from "../theme-provider";
import { useAuth, useLicense } from "../../stores/authStore";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Topnav = () => {
  const { theme, setTheme } = useTheme();
  const { logout } = useAuth();
  const { licenseType, totalGenerations, generationsUsed } = useLicense();
  const total = Number(totalGenerations) || 0;
  const used = Number(generationsUsed) || 0;
  const left = Math.max(0, total - used);

  const Signout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
      window.location.reload();
    }
  };
  const env = import.meta.env;

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="flex h-14 items-center justify-between px-6">
        <div className="flex items-center space-x-4">
          <Logo />
          <div className="h-4 w-[1px] bg-border mx-2" />
          <Badge variant="secondary" className="font-mono text-[10px] tracking-tighter bg-secondary/50 text-secondary-foreground border-none">
            {env.VITE_VERSION}
          </Badge>
        </div>

        <div className="flex items-center space-x-4">
          <div className="hidden items-center space-x-3 md:flex">
            <div className="flex items-center space-x-2 rounded-full bg-secondary/50 px-3 py-1 border border-border/50">
              <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              <span className="text-[12px] font-medium text-muted-foreground">
                {licenseType}: <span className="text-foreground">{left}/{total}</span> left
              </span>
            </div>
          </div>

          <div className="h-4 w-[1px] bg-border hidden md:block" />

          <div className="flex items-center space-x-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-md hover:bg-accent transition-colors">
                  {theme === "light" && <Sun size={18} className="shrink-0" />}
                  {theme === "dark" && <Moon size={18} className="shrink-0" />}
                  {theme === "system" && <Monitor size={18} className="shrink-0" />}
                  <span className="sr-only">Toggle theme</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-36">
                <DropdownMenuItem onClick={() => setTheme("light")} className="text-xs">
                  <Sun size={14} className="mr-2 shrink-0" />
                  <span>Light</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")} className="text-xs">
                  <Moon size={14} className="mr-2 shrink-0" />
                  <span>Dark</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")} className="text-xs">
                  <Monitor size={14} className="mr-2 shrink-0" />
                  <span>System</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="ghost"
              size="sm"
              onClick={Signout}
              className="h-8 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            >
              <SignOut size={14} className="mr-2 shrink-0" />
              <span className="hidden sm:inline">Sign out</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Topnav;
