import { Activity, CheckCircle2, Mail } from "lucide-react";
import { useRef, useState } from "react";

interface VerifyViewProps {
  email: string;
  onNavigate: (view: "landing") => void;
}

const VerifyView = ({ email, onNavigate }: VerifyViewProps) => {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [verified, setVerified] = useState(false);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (idx: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    const next = [...code];
    next[idx] = val.slice(-1);
    setCode(next);
    if (val && idx < 5) inputsRef.current[idx + 1]?.focus();
  };

  const handleKeyDown = (idx: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[idx] && idx > 0) {
      inputsRef.current[idx - 1]?.focus();
    }
  };

  const handleVerify = () => {
    if (code.every(c => c)) setVerified(true);
  };

  if (verified) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 animate-fade-in">
        <div className="glass-card p-10 w-full max-w-md text-center animate-fade-slide-up animate-pulse-glow">
          <div className="mx-auto h-16 w-16 rounded-full flex items-center justify-center mb-6"
            style={{ background: "hsla(170, 70%, 45%, 0.15)" }}>
            <CheckCircle2 className="h-8 w-8 text-accent" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Success!</h2>
          <p className="text-muted-foreground mb-8">Welcome to EmergencyConnect. Your hospital is now part of the network.</p>
          <button onClick={() => onNavigate("landing")} className="btn-primary">
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 animate-fade-in">
      <div className="glass-card p-10 w-full max-w-md text-center animate-fade-slide-up">
        <div className="mx-auto h-16 w-16 rounded-full flex items-center justify-center mb-6"
          style={{ background: "hsla(190, 80%, 50%, 0.12)" }}>
          <Mail className="h-8 w-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Check Your Gmail</h2>
        <p className="text-sm text-muted-foreground mb-8">
          Verification code sent to <span className="text-primary font-medium">{email || "your email"}</span>
        </p>
        <div className="flex justify-center gap-3 mb-8">
          {code.map((digit, i) => (
            <input
              key={i}
              ref={el => { inputsRef.current[i] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={e => handleChange(i, e.target.value)}
              onKeyDown={e => handleKeyDown(i, e)}
              className="glass-input w-12 h-14 text-center text-xl font-bold"
            />
          ))}
        </div>
        <button onClick={handleVerify} className="btn-primary"
          style={{ opacity: code.every(c => c) ? 1 : 0.5 }}>
          Verify
        </button>
      </div>
    </div>
  );
};

export default VerifyView;
