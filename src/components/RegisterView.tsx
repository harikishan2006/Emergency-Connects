import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import LoadingOverlay from "./LoadingOverlay";
import BrandLogo from "./BrandLogo";

interface RegisterViewProps {
  onNavigate: (view: "landing" | "login" | "chooseRegister" | "dashboard") => void;
}

const RegisterView = ({ onNavigate }: RegisterViewProps) => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    hospitalName: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email.includes("@")) {
      toast.error("Please enter a valid email");
      return;
    }
    if (form.password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: form.email.trim(),
        password: form.password,
        options: {
          data: {
            user_type: "hospital",
            hospital_name: form.hospitalName,
          },
        },
      });

      if (error) throw error;

      if (data.user) {
        const { error: profileError } = await supabase
          .from("profiles")
          .insert([
            {
              id: data.user.id,
              name: form.hospitalName,
              email: form.email.trim(),
              user_type: "hospital",
            },
          ]);

        if (profileError) {
          console.error("Profile sync error:", profileError);
        }

        toast.success("Registration successful! Please check your email to verify.");
        onNavigate("login");
      }
    } catch (err: any) {
      toast.error(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <LoadingOverlay />}
      <div className="min-h-screen flex items-center justify-center px-6 py-20 animate-fade-in">
        <div className="glass-card p-8 md:p-10 w-full max-w-md animate-fade-slide-up">
          <button onClick={() => onNavigate("chooseRegister")} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors duration-300 mb-6">
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
          
          <div className="flex items-center gap-2 mb-6">
            <BrandLogo iconClassName="h-6 w-6" />
            <span className="text-lg font-bold text-foreground">EmergencyConnect</span>
          </div>

          <h2 className="text-2xl font-bold text-foreground mb-2">Hospital Onboarding</h2>
          <p className="text-sm text-muted-foreground mb-8">Join the Tamil Nadu emergency network</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Official Hospital Name</label>
              <input
                type="text"
                className="glass-input"
                placeholder="e.g., Pudukkottai Govt Hospital"
                value={form.hospitalName}
                onChange={(e) => setForm({ ...form, hospitalName: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Official Email</label>
              <input
                type="email"
                className="glass-input"
                placeholder="admin@hospital.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Create Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="glass-input pr-10"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn-primary mt-2" disabled={loading}>
              {loading ? "Registering..." : "Initialize Facility"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already registered?{" "}
            <button onClick={() => onNavigate("login")} className="text-primary font-medium hover:underline">Sign in</button>
          </p>
        </div>
      </div>
    </>
  );
};

export default RegisterView;
