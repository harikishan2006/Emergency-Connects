import { ArrowLeft, UserCircle } from "lucide-react";
import BrandLogo from "./BrandLogo";

interface RegistrationChooserProps {
  onNavigate: (view: "landing" | "register" | "patientRegister") => void;
}

const RegistrationChooser = ({ onNavigate }: RegistrationChooserProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 animate-fade-in">
      <div className="glass-card p-8 md:p-10 w-full max-w-lg animate-fade-slide-up">
        <button onClick={() => onNavigate("landing")} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors duration-300 mb-6">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <BrandLogo className="flex items-center gap-2 mb-6" />
        <h2 className="text-2xl font-bold text-foreground mb-2">Choose Registration Type</h2>
        <p className="text-sm text-muted-foreground mb-8">Select how you'd like to join the network</p>

        <div className="grid gap-4">
          <button
            onClick={() => onNavigate("patientRegister")}
            className="glass-card p-6 text-left hover:border-primary/40 transition-all duration-300 group cursor-pointer"
          >
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: "hsla(190, 80%, 50%, 0.12)" }}>
                <UserCircle className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">👤 Patient Registration</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Register as an individual to access emergency routing, locate nearby hospitals, and share medical info with first responders.
                </p>
              </div>
            </div>
          </button>

        </div>
      </div>
    </div>
  );
};

export default RegistrationChooser;
