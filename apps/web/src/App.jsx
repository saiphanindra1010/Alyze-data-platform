import './App.css'
import AppRouter from "./Router.jsx";
import { ThemeProvider } from "./components/theme-provider";
import { useAuth } from "./stores/authStore";
import { useEffect } from "react";

function App() {
  const { verifySession, isLoading, _initialized } = useAuth();

  useEffect(() => {
    verifySession();
  }, [verifySession]);

  if (isLoading || !_initialized) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm font-medium text-muted-foreground animate-pulse">Initializing...</p>
        </div>
      </div>
    );
  }

  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <AppRouter />
    </ThemeProvider>
  )
}

export default App
