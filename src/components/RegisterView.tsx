import { Activity, ArrowLeft } from "lucide-react";
import { useState } from "react";

interface RegisterViewProps {
  onNavigate: (view: "landing" | "login" | "verify") => void;
  onSetEmail: (email: string) => void;
}

const RegisterView = ({ onNavigate, onSetEmail }: RegisterViewProps) => {
  const [form, setForm] = useState({
    hospitalName: "", address: "", leadDoctor: "", dutyDoctor: "",
    beds: "", staff: "", email: "", password: "",
  });

  const update = (key: string, val: string) => setForm(f => ({ ...f, [key]: val }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSetEmail(form.email);
    onNavigate("verify");
  };

  const fields: { key: string; label: string; type?: string; placeholder: string }[] = [
    { key: "hospitalName", label: "Hospital Name", placeholder: "City General Hospital" },
    { key: "address", label: "Full Physical Address", placeholder: "123 Medical Drive, Suite 100" },
    { key: "leadDoctor", label: "Lead Doctor Name", placeholder: "Dr. Jane Smith" },
    { key: "dutyDoctor", label: "Current Doctor on Duty", placeholder: "Dr. John Doe" },
    { key: "beds", label: "Available Emergency Beds", type: "number", placeholder: "24" },
    { key: "staff", label: "Current Staff Count", type: "number", placeholder: "50" },
    { key: "email", label: "Official Hospital Email", type: "email", placeholder: "admin@hospital.com" },
    { key: "password", label: "Password", type: "password", placeholder: "••••••••" },
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
        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map(f => (
            <div key={f.key}>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">{f.label}</label>
              <input
                type={f.type || "text"}
                className="glass-input"
                placeholder={f.placeholder}
                value={(form as any)[f.key]}
                onChange={e => update(f.key, e.target.value)}
                required
              />
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
