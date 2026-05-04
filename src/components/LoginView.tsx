import { Activity, ArrowLeft, Building2, UserCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface LoginViewProps {
  onNavigate: (view: "landing" | "chooseRegister" | "dashboard" | "intake") => void;
}

const LoginView = ({ onNavigate }: LoginViewProps) => {
  const [tab, setTab] = useState<"patient" | "hospital">("patient");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter both email and password");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast.success("Login successful");
      onNavigate("intake");
    } catch (err: any) {
      toast.error(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 animate-fade-in">
      <div className="glass-card p-8 md:p-10 w-full max-w-md animate-fade-slide-up animate-pulse-glow">
        <button onClick={() => onNavigate("landing")} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors duration-300 mb-6">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <div className="flex items-center gap-2 mb-8">
          <Activity className="h-6 w-6 text-primary" />
          <span className="text-lg font-bold text-foreground">EmergencyConnect</span>
        </div>

        {/* Login Tabs */}
        <div className="flex rounded-lg overflow-hidden mb-8 border border-border">
          <button
            onClick={() => setTab("patient")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-all duration-300 ${
              tab === "patient" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <UserCircle className="h-4 w-4" /> Patient
          </button>
          <button
            onClick={() => setTab("hospital")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-all duration-300 ${
              tab === "hospital" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Building2 className="h-4 w-4" /> Hospital
          </button>
        </div>

        <h2 className="text-2xl font-bold text-foreground mb-2">Welcome back</h2>
        <p className="text-sm text-muted-foreground mb-8">
          Sign in to {tab === "patient" ? "your patient account" : "the hospital portal"}
        </p>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Email</label>
            <input
              type="email"
              className="glass-input"
              placeholder={tab === "patient" ? "rajesh@gmail.com" : "admin@apollohospitals.com"}
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Password</label>
            <input type="password" className="glass-input" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="btn-primary mt-2" disabled={loading}>
            {loading ? "Signing in..." : `Login as ${tab === "patient" ? "Patient" : "Hospital"}`}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <button onClick={() => onNavigate("chooseRegister")} className="text-primary font-medium hover:underline">Register here</button>
        </p>
      </div>
    </div>
  );
};

export default LoginView;
