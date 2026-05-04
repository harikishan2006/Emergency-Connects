import { Activity, HeartPulse, ArrowRight } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface Props {
  onNavigate: (view: "dashboard") => void;
}

const COMMON = [
  "Chest Pain", "Breathing Difficulty", "Stroke Symptoms", "Trauma / Injury",
  "High Fever", "Severe Bleeding", "Unconscious", "Pregnancy Emergency",
];

import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const DiseaseIntakeView = ({ onNavigate }: Props) => {
  const [disease, setDisease] = useState("");
  const [severity, setSeverity] = useState<"mild" | "moderate" | "critical">("moderate");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    const checkRole = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.user_metadata?.user_type === "hospital") {
        onNavigate("dashboard");
      }
    };
    checkRole();
  }, [onNavigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!disease.trim()) {
      toast.error("Please describe your condition");
      return;
    }
    localStorage.setItem("ec_intake", JSON.stringify({ disease, severity, notes, at: Date.now() }));
    localStorage.setItem("ec_redirect_search", "true");
    toast.success("Condition recorded — routing you to the dashboard");
    onNavigate("dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 animate-fade-in">
      <div className="glass-card p-8 md:p-10 w-full max-w-lg animate-fade-slide-up">
        <div className="flex items-center gap-2 mb-6">
          <Activity className="h-6 w-6 text-primary" />
          <span className="text-lg font-bold text-foreground">EmergencyConnect</span>
        </div>

        <div className="flex items-center gap-2 mb-2">
          <HeartPulse className="h-5 w-5 text-destructive" />
          <h2 className="text-2xl font-bold text-foreground">What's the emergency?</h2>
        </div>
        <p className="text-sm text-muted-foreground mb-6">
          Tell us your condition so we can match you with the right hospital and specialist.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Condition / Disease</label>
            <input
              className="glass-input"
              placeholder="e.g. Chest pain, Asthma attack…"
              value={disease}
              onChange={(e) => setDisease(e.target.value)}
              maxLength={120}
              required
            />
            <div className="flex flex-wrap gap-2 mt-3">
              {COMMON.map((c) => (
                <button
                  type="button"
                  key={c}
                  onClick={() => setDisease(c)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                    disease === c
                      ? "bg-primary text-primary-foreground border-primary"
                      : "border-border text-muted-foreground hover:text-foreground hover:border-primary/50"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Severity</label>
            <div className="grid grid-cols-3 gap-2">
              {(["mild", "moderate", "critical"] as const).map((s) => (
                <button
                  type="button"
                  key={s}
                  onClick={() => setSeverity(s)}
                  className={`py-2 rounded-md text-sm font-medium capitalize border transition-all ${
                    severity === s
                      ? s === "critical"
                        ? "bg-destructive text-destructive-foreground border-destructive"
                        : s === "moderate"
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-accent text-accent-foreground border-accent"
                      : "border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Additional notes (optional)</label>
            <textarea
              className="glass-input min-h-[88px] resize-none"
              placeholder="Symptoms, duration, allergies, current medication…"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              maxLength={500}
            />
          </div>

          <button type="submit" className="btn-primary mt-2 flex items-center justify-center gap-2">
            Continue to Dashboard <ArrowRight className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default DiseaseIntakeView;
