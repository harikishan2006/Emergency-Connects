import { Activity, AlertCircle, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import LoadingOverlay from "./LoadingOverlay";
import BrandLogo from "./BrandLogo";


interface PatientRegisterViewProps {
  onNavigate: (view: "landing" | "login" | "chooseRegister" | "dashboard") => void;
}

interface FormErrors {
  [key: string]: string;
}

const validateForm = (form: Record<string, string>): FormErrors => {
  const errors: FormErrors = {};
  if (form.name.trim().length < 2) errors.name = "Name must be at least 2 characters";

  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailPattern.test(form.email.trim())) errors.email = "Enter a valid Gmail address";

  const phonePattern = /^[6-9]\d{9}$/;
  if (!phonePattern.test(form.phone.replace(/\s/g, ""))) errors.phone = "Enter a valid 10-digit mobile number";

  if (form.password.length < 8) errors.password = "Password must be at least 8 characters";
  else if (!/[A-Z]/.test(form.password)) errors.password = "Must contain at least one uppercase letter";
  else if (!/[0-9]/.test(form.password)) errors.password = "Must contain at least one number";

  return errors;
};

const PatientRegisterView = ({ onNavigate }: PatientRegisterViewProps) => {
  const [form, setForm] = useState<Record<string, string>>({
    name: "", email: "", phone: "", password: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const update = (key: string, val: string) => {
    setForm(f => ({ ...f, [key]: val }));
    if (errors[key]) setErrors(e => { const n = { ...e }; delete n[key]; return n; });
  };

  const handleBlur = (key: string) => {
    setTouched(t => ({ ...t, [key]: true }));
    const fieldErrors = validateForm(form);
    if (fieldErrors[key]) setErrors(e => ({ ...e, [key]: fieldErrors[key] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateForm(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      const allTouched: Record<string, boolean> = {};
      Object.keys(form).forEach(k => { allTouched[k] = true; });
      setTouched(allTouched);
      toast.error("Please fix the errors below");
      return;
    }

    setLoading(true);
    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: form.email.trim(),
        password: form.password,
        options: {
          data: {
            user_type: "patient",
            name: form.name,
            phone: form.phone,
          },
        },
      });

      if (signUpError) throw signUpError;

      if (data?.user) {
        // Automatically sync to profiles table for the User Directory
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error: profileError } = await (supabase as any)
          .from("profiles")
          .insert([
            {
              id: data.user.id,
              name: form.name,
              email: form.email.trim(),
              phone: form.phone,
              user_type: "patient",
            },
          ]);

        if (profileError) {
          console.error("Profile sync error:", profileError);
        }

        if (data.session) {
          toast.success("Registration successful! Syncing session...");
        } else {
          toast.success("Registration initiated! Please check your email to verify your account.");
          onNavigate("login");
        }
      }
    } catch (err: any) {
      toast.error(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const renderInput = (key: string, label: string, placeholder: string, type = "text", hint?: string) => (
    <div key={key}>
      <label className="text-xs font-medium text-muted-foreground mb-1.5 block">{label}</label>
      <div className="relative">
        <input
          type={type === "password" ? (showPassword ? "text" : "password") : type}
          className={`glass-input ${type === "password" ? "pr-10" : ""} ${errors[key] && touched[key] ? "!border-destructive/60" : ""}`}
          placeholder={placeholder}
          value={form[key]}
          onChange={e => update(key, e.target.value)}
          onBlur={() => handleBlur(key)}
        />
        {type === "password" && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        )}
      </div>
      {errors[key] && touched[key] ? (
        <p className="text-[11px] text-destructive mt-1 flex items-center gap-1"><AlertCircle className="h-3 w-3 flex-shrink-0" /> {errors[key]}</p>
      ) : hint && <p className="text-[10px] text-muted-foreground/60 mt-1">{hint}</p>}
    </div>
  );

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
          <h2 className="text-2xl font-bold text-foreground mb-2">Patient Registration</h2>
          <p className="text-sm text-muted-foreground mb-8">Join the network securely</p>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {renderInput("name", "Full Name", "Rajesh Kumar")}
            {renderInput("email", "Email Address", "rajesh@gmail.com", "email", "Verification will be sent to this email")}
            {renderInput("phone", "Mobile Number", "9876543210", "tel")}
            {renderInput("password", "Create Password", "••••••••", "password", "Min 8 characters")}

            <button type="submit" className="btn-primary mt-2" disabled={loading}>
              {loading ? "Registering..." : "Register Account"}
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

export default PatientRegisterView;
