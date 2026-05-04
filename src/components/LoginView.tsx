import { Activity, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import BrandLogo from "./BrandLogo";
import LoadingOverlay from "./LoadingOverlay";

interface LoginViewProps {
  onNavigate: (view: "landing" | "chooseRegister" | "dashboard" | "intake") => void;
}

const LoginView = ({ onNavigate }: LoginViewProps) => {
  const [tab, setTab] = useState<"patient" | "hospital">("patient");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isForgotPassword) {
      if (!email) {
        toast.error("Please enter your email");
        return;
      }
      setLoading(true);
      try {
        const trimmedEmail = email.trim();
        const { error } = await supabase.auth.resetPasswordForEmail(trimmedEmail, {
          redirectTo: window.location.origin,
        });
        if (error) throw error;
        toast.success("Password reset link sent to your email!");
        setIsForgotPassword(false);
      } catch (err: any) {
        console.error("Reset password error:", err);
        toast.error(err.message || "Failed to send reset link");
      } finally {
        setLoading(false);
      }
      return;
    }

    if (!email || !password) {
      toast.error("Please enter both email and password");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) throw error;

      toast.success("Login successful");
    } catch (err: any) {
      console.error("Login error:", err);
      const message = err.message === "Invalid login credentials" 
        ? "Invalid credentials. Please check your email and password." 
        : err.message || "Login failed";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <LoadingOverlay />}
      <div className="min-h-screen flex items-center justify-center px-6 animate-fade-in">
      <div className="glass-card p-8 md:p-10 w-full max-w-md animate-fade-slide-up animate-pulse-glow">
        <button onClick={() => onNavigate("landing")} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors duration-300 mb-6">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <BrandLogo className="flex items-center gap-2 mb-8" />


        <h2 className="text-2xl font-bold text-foreground mb-2">
          {isForgotPassword ? "Reset Password" : "Welcome back"}
        </h2>
        <p className="text-sm text-muted-foreground mb-8">
          {isForgotPassword
            ? "Enter your email to receive a password reset link"
            : "Sign in to your patient account"}
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Email Address</label>
            <input
              type="email"
              className="glass-input"
              placeholder="rajesh@gmail.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          {!isForgotPassword && (
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-medium text-muted-foreground block">Password</label>
                <button
                  type="button"
                  onClick={() => setIsForgotPassword(true)}
                  className="text-[10px] text-primary hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  className="glass-input pr-10" 
                  placeholder="••••••••" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  required 
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          )}
          
          <button type="submit" className="btn-primary mt-2" disabled={loading}>
            {loading ? (isForgotPassword ? "Sending..." : "Signing in...") : (isForgotPassword ? "Send Reset Link" : "Login")}
          </button>
        </form>
        
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <button onClick={() => onNavigate("chooseRegister")} className="text-primary font-medium hover:underline">Register here</button>
        </p>
      </div>
    </div>
  </>
  );
};

export default LoginView;
