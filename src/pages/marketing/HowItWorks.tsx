import { ClipboardList, Hospital, Send, Siren } from "lucide-react";
import PageShell from "./PageShell";

const steps = [
  { icon: Siren, title: "1. Patient Reports Emergency", desc: "Patient signs in, shares symptoms and current location through the app in seconds." },
  { icon: ClipboardList, title: "2. System Matches Hospital", desc: "Our routing engine checks live bed availability, ICU capacity, and travel time across nearby hospitals." },
  { icon: Send, title: "3. Ambulance Dispatched", desc: "Closest available ambulance is notified with patient details and the matched hospital's address." },
  { icon: Hospital, title: "4. Hospital Prepares", desc: "Receiving hospital gets a critical alert and prepares the right team and equipment before arrival." },
];

const HowItWorks = () => (
  <PageShell title="How It Works" subtitle="From the moment a patient calls for help to the moment they reach care — every step coordinated in real time.">
    <div className="space-y-6">
      {steps.map((s) => (
        <div key={s.title} className="glass-card p-6 flex items-start gap-5">
          <div className="h-12 w-12 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: "hsla(190, 80%, 50%, 0.12)" }}>
            <s.icon className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-1">{s.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
          </div>
        </div>
      ))}
    </div>
  </PageShell>
);

export default HowItWorks;