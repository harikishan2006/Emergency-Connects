import { Activity, AlertCircle, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface RegisterViewProps {
  onNavigate: (view: "landing" | "login" | "verify") => void;
  onSetEmail: (email: string) => void;
  onSetVerificationCode: (code: string) => void;
}

interface FormErrors {
  [key: string]: string;
}

const validateForm = (form: Record<string, string>): FormErrors => {
  const errors: FormErrors = {};

  // Hospital Name: at least 3 chars, only letters/spaces/hyphens/periods
  if (form.hospitalName.trim().length < 3) {
    errors.hospitalName = "Hospital name must be at least 3 characters";
  } else if (!/^[A-Za-z\s.\-()&,]+$/.test(form.hospitalName.trim())) {
    errors.hospitalName = "Hospital name can only contain letters, spaces, and basic punctuation";
  }

  // Address: at least 10 chars
  if (form.address.trim().length < 10) {
    errors.address = "Please enter a complete physical address (at least 10 characters)";
  }

  // Lead Doctor: must start with "Dr." and have a name after
  const doctorPattern = /^Dr\.\s+[A-Za-z\s.]+$/;
  if (!doctorPattern.test(form.leadDoctor.trim())) {
    errors.leadDoctor = "Must follow format: Dr. [Full Name] (e.g., Dr. Vijay Kishore)";
  }

  // Duty Doctor: same validation
  if (!doctorPattern.test(form.dutyDoctor.trim())) {
    errors.dutyDoctor = "Must follow format: Dr. [Full Name] (e.g., Dr. Meera Raghavan)";
  }

  // Beds: must be a number between 1-999
  const bedsNum = parseInt(form.beds);
  if (isNaN(bedsNum) || bedsNum < 1 || bedsNum > 999) {
    errors.beds = "Enter a valid number between 1 and 999";
  }

  // Staff: must be a number between 1-9999
  const staffNum = parseInt(form.staff);
  if (isNaN(staffNum) || staffNum < 1 || staffNum > 9999) {
    errors.staff = "Enter a valid number between 1 and 9999";
  }

  // Email: must be a valid email with proper domain
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailPattern.test(form.email.trim())) {
    errors.email = "Enter a valid email address (e.g., admin@hospital.com)";
  } else {
    const domain = form.email.split("@")[1].toLowerCase();
    const blockedDomains = ["test.com", "fake.com", "example.com", "abc.com", "xyz.com"];
    if (blockedDomains.includes(domain)) {
      errors.email = "Please use a real hospital email address, not a test domain";
    }
  }

  // Password: minimum 8 chars, at least 1 uppercase, 1 lowercase, 1 number
  if (form.password.length < 8) {
    errors.password = "Password must be at least 8 characters";
  } else if (!/[A-Z]/.test(form.password)) {
    errors.password = "Password must contain at least one uppercase letter";
  } else if (!/[a-z]/.test(form.password)) {
    errors.password = "Password must contain at least one lowercase letter";
  } else if (!/[0-9]/.test(form.password)) {
    errors.password = "Password must contain at least one number";
  }

  return errors;
};

const RegisterView = ({ onNavigate, onSetEmail, onSetVerificationCode }: RegisterViewProps) => {
  const [form, setForm] = useState({
    hospitalName: "", address: "", leadDoctor: "", dutyDoctor: "",
    beds: "", staff: "", email: "", password: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const update = (key: string, val: string) => {
    setForm(f => ({ ...f, [key]: val }));
    // Clear error when user starts typing
    if (errors[key]) {
      setErrors(e => {
        const next = { ...e };
        delete next[key];
        return next;
      });
    }
  };

  const handleBlur = (key: string) => {
    setTouched(t => ({ ...t, [key]: true }));
    // Validate single field on blur
    const fieldErrors = validateForm(form);
    if (fieldErrors[key]) {
      setErrors(e => ({ ...e, [key]: fieldErrors[key] }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateForm(form);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      // Mark all fields as touched
      const allTouched: Record<string, boolean> = {};
      Object.keys(form).forEach(k => { allTouched[k] = true; });
      setTouched(allTouched);
      toast.error("Please fix the errors below before submitting");
      return;
    }

    // Generate a 6-digit verification code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    onSetVerificationCode(code);
    onSetEmail(form.email);

    // Show the code in a toast (simulating email delivery for demo)
    toast.success(`Verification code sent to ${form.email}`, {
      description: `Demo code: ${code}`,
      duration: 15000,
    });

    onNavigate("verify");
  };

  const fields: { key: string; label: string; type?: string; placeholder: string; hint?: string }[] = [
    { key: "hospitalName", label: "Hospital Name", placeholder: "Apollo Hospitals", hint: "Official registered hospital name" },
    { key: "address", label: "Full Physical Address", placeholder: "21, Greams Lane, Thousand Lights, Chennai", hint: "Complete address with city and pincode" },
    { key: "leadDoctor", label: "Lead Doctor Name", placeholder: "Dr. Vijay Kishore", hint: "Format: Dr. [Full Name]" },
    { key: "dutyDoctor", label: "Current Doctor on Duty", placeholder: "Dr. Meera Raghavan", hint: "Format: Dr. [Full Name]" },
    { key: "beds", label: "Available Emergency Beds", type: "number", placeholder: "24", hint: "Number between 1–999" },
    { key: "staff", label: "Current Staff Count", type: "number", placeholder: "50", hint: "Number between 1–9999" },
    { key: "email", label: "Official Hospital Email", type: "email", placeholder: "admin@apollohospitals.com", hint: "Must be a valid hospital email" },
    { key: "password", label: "Password", type: "password", placeholder: "••••••••", hint: "Min 8 chars, 1 uppercase, 1 lowercase, 1 number" },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-20 animate-fade-in">
      <div className="glass-card p-8 md:p-10 w-full max-w-lg animate-fade-slide-up">
        <button onClick={() => onNavigate("landing")} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors duration-300 mb-6">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <div className="flex items-center gap-2 mb-6">
          <Activity className="h-6 w-6 text-primary" />
          <span className="text-lg font-bold text-foreground">EmergencyConnect</span>
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Hospital Registration</h2>
        <p className="text-sm text-muted-foreground mb-8">Register your facility to join the network</p>
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {fields.map(f => (
            <div key={f.key}>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">{f.label}</label>
              <input
                type={f.type || "text"}
                className={`glass-input ${errors[f.key] && touched[f.key] ? "!border-destructive/60" : ""}`}
                placeholder={f.placeholder}
                value={(form as any)[f.key]}
                onChange={e => update(f.key, e.target.value)}
                onBlur={() => handleBlur(f.key)}
              />
              {errors[f.key] && touched[f.key] ? (
                <p className="text-[11px] text-destructive mt-1 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3 flex-shrink-0" /> {errors[f.key]}
                </p>
              ) : (
                f.hint && <p className="text-[10px] text-muted-foreground/60 mt-1">{f.hint}</p>
              )}
            </div>
          ))}
          <button type="submit" className="btn-primary mt-2">Register</button>
        </form>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already registered?{" "}
          <button onClick={() => onNavigate("login")} className="text-primary font-medium hover:underline">
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
};

export default RegisterView;
