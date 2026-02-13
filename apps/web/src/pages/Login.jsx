import { useGoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import Logo from "../components/logo/logo";
import googleSvg from "../assets/google.svg";
import { AuthService } from "../lib/authService";
import { useAuth, useAuthStore } from "../stores/authStore";
import { useEffect, useState, useRef } from "react";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const verifyRef = useRef(false);

  useEffect(() => {
    // Force light mode for login page
    const root = window.document.documentElement;
    const originalClasses = root.className;
    root.classList.remove("dark");
    root.classList.add("light");

    return () => {
      // Restore original theme when leaving login
      root.className = originalClasses;
    };
  }, []);

  useEffect(() => {
    // Verify existing session once when component mounts
    if (verifyRef.current) return;
    verifyRef.current = true;
    
    const state = useAuthStore.getState();
    if (!state._initialized) {
      state.verifySession();
    }
  }, []);

  const responseGoogle = async (authResult) => {
    setIsLoading(true);
    setError(null);

    try {
      if (authResult.code) {
        const result = await AuthService.googleLogin(authResult.code);

        if (result.success) {
          localStorage.setItem("user", JSON.stringify(result.user));
          login(result.user);
          navigate("/analyze");
        } else {
          setError("Authentication failed. Please try again.");
        }
      }
    } catch (error) {
      console.error("Google Auth Error:", error);
      setError(
        error.response?.data?.error ||
        "Authentication failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: responseGoogle,
    onError: (error) => {
      console.error("Google OAuth Error:", error);
      setError("Google authentication failed. Please try again.");
    },
    flow: "auth-code",
  });

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
      <div className="w-full max-w-[400px] space-y-8 px-4">
        <div className="flex flex-col items-center space-y-2 text-center">
          <Logo />
          <h1 className="text-2xl font-semibold tracking-tight">
            Welcome back
          </h1>
          <p className="text-sm text-muted-foreground">
            Sign in to continue to your dashboard
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
            {error}
          </div>
        )}

        <div className="grid gap-6">
          <button
            onClick={googleLogin}
            disabled={isLoading}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-11 px-8 w-full"
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Signing in...
              </span>
            ) : (
              <>
                <img src={googleSvg} alt="Google" className="mr-2 h-4 w-4" />
                Continue with Google
              </>
            )}
          </button>
        </div>

        <div className="space-y-4 text-center">
          <p className="px-8 text-sm text-muted-foreground">
            By continuing, you agree to our{" "}
            <a href="#" className="underline underline-offset-4 hover:text-primary">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="underline underline-offset-4 hover:text-primary">
              Privacy Policy
            </a>
            .
          </p>

          <div className="flex items-center justify-center space-x-2 text-xs text-muted-foreground">
            <svg
              className="h-4 w-4 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
            <span>Secured with industry-standard encryption</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
