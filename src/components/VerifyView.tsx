import { Activity, AlertCircle, CheckCircle2, Mail, RefreshCw } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { sendOtp, verifyOtp } from "@/lib/otpClient";

interface VerifyViewProps {
  email: string;
  verificationCode: string;
  onNavigate: (view: "landing" | "dashboard") => void;
  verificationType?: "signup" | "email";
}

const VerifyView = ({ email, verificationCode, onNavigate, verificationType = "signup" }: VerifyViewProps) => {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (idx: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    const next = [...code];
    next[idx] = val.slice(-1);
    setCode(next);
    setError("");
    if (val && idx < 5) inputsRef.current[idx + 1]?.focus();
  };

  const handleKeyDown = (idx: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[idx] && idx > 0) {
      inputsRef.current[idx - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      const digits = pasted.split("");
      setCode(digits);
      inputsRef.current[5]?.focus();
    }
  };

  const handleVerify = async () => {
    const enteredCode = code.join("");
    if (enteredCode.length < 6) {
      setError("Please enter all 6 digits");
      return;
    }

    setLoading(true);
    try {
      try {
        await verifyOtp(email, enteredCode);
        setVerified(true);
        toast.success("Email verified successfully!");
      } catch (verifyErr: any) {
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        setError(verifyErr.message || `Invalid code. ${3 - newAttempts} attempts remaining.`);
        setCode(["", "", "", "", "", ""]);
        inputsRef.current[0]?.focus();

        if (newAttempts >= 3) {
          toast.error("Too many failed attempts. Please try again.");
          onNavigate("landing");
        }
      }
    } catch (err: any) {
      setError(err.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      await sendOtp(email);
      toast.success(`New verification code sent to ${email}`, {
        description: "Check your Gmail inbox",
      });
    } catch (err: any) {
      toast.error("Failed to resend code");
    }
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
          <p className="text-muted-foreground mb-8">Welcome to EmergencyConnect. Your account has been verified.</p>
          <button onClick={() => onNavigate("dashboard")} className="btn-primary">
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
        <p className="text-sm text-muted-foreground mb-2">
          Verification code sent to <span className="text-primary font-medium">{email || "your email"}</span>
        </p>
        <p className="text-xs text-muted-foreground/60 mb-8">
          Enter the 6-digit code from your email to verify
        </p>
        <div className="flex justify-center gap-3 mb-4" onPaste={handlePaste}>
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
              className={`glass-input w-12 h-14 text-center text-xl font-bold ${error ? "!border-destructive/60" : ""}`}
            />
          ))}
        </div>
        {error && (
          <p className="text-xs text-destructive mb-4 flex items-center justify-center gap-1">
            <AlertCircle className="h-3 w-3" /> {error}
          </p>
        )}
        <button onClick={handleVerify} className="btn-primary mb-4"
          disabled={loading}
          style={{ opacity: code.every(c => c) && !loading ? 1 : 0.5 }}>
          {loading ? "Verifying..." : "Verify"}
        </button>
        <button
          onClick={handleResend}
          className="flex items-center justify-center gap-1.5 mx-auto text-xs text-muted-foreground hover:text-primary transition-colors"
        >
          <RefreshCw className="h-3 w-3" /> Resend Code
        </button>
      </div>
    </div>
  );
};

export default VerifyView;
