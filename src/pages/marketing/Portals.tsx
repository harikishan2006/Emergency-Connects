import { Ambulance, Building2, LayoutDashboard, UserCircle } from "lucide-react";
import { Link } from "react-router-dom";
import PageShell from "./PageShell";

interface PortalCard {
  icon: typeof UserCircle;
  title: string;
  desc: string;
  cta: string;
  to: string;
}

const cards: Record<string, PortalCard> = {
  patient: { icon: UserCircle, title: "Patient Portal", desc: "Sign in or register as a patient to report emergencies and track your admission.", cta: "Open Patient Portal", to: "/" },
  hospital: { icon: Building2, title: "Hospital Portal", desc: "Hospital staff access for managing bed availability, doctors on duty, and incoming patients.", cta: "Open Hospital Portal", to: "/" },
  ambulance: { icon: Ambulance, title: "Ambulance Tracking", desc: "Live GPS-based tracking of ambulances dispatched through EmergencyConnect.", cta: "View Live Map", to: "/" },
  admin: { icon: LayoutDashboard, title: "Admin Dashboard", desc: "System-wide oversight of hospitals, doctors, patients, and admissions.", cta: "Open Dashboard", to: "/" },
};

interface PortalProps { kind: keyof typeof cards }

const Portal = ({ kind }: PortalProps) => {
  const c = cards[kind];
  return (
    <PageShell title={c.title} subtitle={c.desc}>
      <div className="glass-card p-10 max-w-xl flex flex-col items-start gap-6">
        <div className="h-14 w-14 rounded-lg flex items-center justify-center" style={{ background: "hsla(190, 80%, 50%, 0.12)" }}>
          <c.icon className="h-7 w-7 text-primary" />
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Click below to go to the main app and sign in. Once authenticated you'll see the relevant tools for your role.
        </p>
        <Link to={c.to} className="btn-primary inline-block">{c.cta}</Link>
      </div>
    </PageShell>
  );
};

export default Portal;