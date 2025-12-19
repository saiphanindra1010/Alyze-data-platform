import { useGoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import Logo from "../components/logo/logo";
import googleSvg from "../assets/google.svg";
import { googleAuth } from "./api";
import { useEffect } from "react";

const Login = () => {
  const navigate = useNavigate();

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

  const responseGoogle = async (authResult) => {
    try {
      if (authResult.code) {
        const result = await googleAuth(authResult.code);
        const { token } = result.data;

        localStorage.setItem("token", token);
        navigate("/analyze");
      }
    } catch (error) {
      console.error("Google Auth Error:", error);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: responseGoogle,
    onError: responseGoogle,
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

        <div className="grid gap-6">
          <button
            onClick={googleLogin}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-11 px-8 w-full"
          >
            <img src={googleSvg} alt="Google" className="mr-2 h-4 w-4" />
            Continue with Google
          </button>
        </div>

        <p className="px-8 text-center text-sm text-muted-foreground">
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
      </div>
    </div>
  );
};

export default Login;
