import { Activity, BarChart3, Bell, MapPin, ShieldCheck, Users } from "lucide-react";
import PageShell from "./PageShell";

const features = [
  { icon: Activity, title: "Real-time Updates", desc: "Live hospital capacity feed updated every few seconds during emergencies." },
  { icon: Users, title: "User Integration", desc: "Patient-friendly interfaces to share symptoms and location instantly." },
  { icon: BarChart3, title: "Data Analytics", desc: "Routing decisions powered by hospital performance metrics." },
  { icon: ShieldCheck, title: "Regulatory Compliance", desc: "Automated tracking that meets healthcare data regulations." },
  { icon: MapPin, title: "Live Map View", desc: "GPS-based ambulance and hospital tracking on an interactive map." },
  { icon: Bell, title: "Critical Alerts", desc: "Push notifications to staff the moment a critical patient is dispatched." },
];

const Features = () => (
  <PageShell title="Features" subtitle="Everything you need to coordinate emergency response across hospitals, ambulances, and patients.">
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {features.map((f) => (
        <div key={f.title} className="glass-card p-6">
          <div className="h-12 w-12 rounded-lg flex items-center justify-center mb-4"
            style={{ background: "hsla(190, 80%, 50%, 0.12)" }}>
            <f.icon className="h-6 w-6 text-primary" />
          </div>
          <h3 className="font-semibold text-foreground mb-2">{f.title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
        </div>
      ))}
    </div>
  </PageShell>
);

export default Features;