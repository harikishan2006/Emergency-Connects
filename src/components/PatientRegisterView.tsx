import { Activity, AlertCircle, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

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
      const { error: signUpError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: {
            user_type: "patient",
            name: form.name,
            phone: form.phone,
          },
        },
      });

      if (signUpError && !signUpError.message.includes("already registered")) {
        toast.error(signUpError.message);
        setLoading(false);
        return;
      }

      toast.success("Registration successful");
      onNavigate("dashboard");
    } catch (err: any) {
      toast.error(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const renderInput = (key: string, label: string, placeholder: string, type = "text", hint?: string) => (
    <div key={key}>
      <label className="text-xs font-medium text-muted-foreground mb-1.5 block">{label}</label>
      <input
        type={type}
        className={`glass-input ${errors[key] && touched[key] ? "!border-destructive/60" : ""}`}
        placeholder={placeholder}
        value={form[key]}
        onChange={e => update(key, e.target.value)}
        onBlur={() => handleBlur(key)}
      />
      {errors[key] && touched[key] ? (
        <p className="text-[11px] text-destructive mt-1 flex items-center gap-1"><AlertCircle className="h-3 w-3 flex-shrink-0" /> {errors[key]}</p>
      ) : hint && <p className="text-[10px] text-muted-foreground/60 mt-1">{hint}</p>}
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-20 animate-fade-in">
      <div className="glass-card p-8 md:p-10 w-full max-w-md animate-fade-slide-up">
        <button onClick={() => onNavigate("chooseRegister")} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors duration-300 mb-6">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <div className="flex items-center gap-2 mb-6">
          <Activity className="h-6 w-6 text-primary" />
          <span className="text-lg font-bold text-foreground">EmergencyConnect</span>
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Patient Registration</h2>
        <p className="text-sm text-muted-foreground mb-8">Quick signup with email and password</p>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {renderInput("name", "Full Name", "Rajesh Kumar")}
          {renderInput("email", "Email Address", "rajesh@gmail.com", "email", "Use this email to sign in")}
          {renderInput("phone", "Mobile Number", "9876543210", "tel", "10-digit Indian mobile number")}
          {renderInput("password", "Password", "••••••••", "password", "Min 8 chars, 1 uppercase, 1 number")}

          <button type="submit" className="btn-primary mt-2" disabled={loading}>
            {loading ? "Registering..." : "Register Patient"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already registered?{" "}
          <button onClick={() => onNavigate("login")} className="text-primary font-medium hover:underline">Sign in</button>
        </p>
      </div>
    </div>
  );
};

export default PatientRegisterView;
