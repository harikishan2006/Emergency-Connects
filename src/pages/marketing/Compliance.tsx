import { FileCheck, Lock, ShieldCheck } from "lucide-react";
import PageShell from "./PageShell";

const items = [
  { icon: ShieldCheck, title: "HIPAA-aligned Practices", desc: "Patient data is handled following healthcare privacy best practices end-to-end." },
  { icon: Lock, title: "Encryption", desc: "All data is encrypted in transit (TLS 1.3) and at rest (AES-256)." },
  { icon: FileCheck, title: "Audit Trails", desc: "Every access to patient or hospital records is logged and reviewable." },
];

const Compliance = () => (
  <PageShell title="Compliance" subtitle="Built to meet healthcare data regulations and the trust standards hospitals require.">
    <div className="grid md:grid-cols-3 gap-6">
      {items.map((i) => (
        <div key={i.title} className="glass-card p-6">
          <div className="h-12 w-12 rounded-lg flex items-center justify-center mb-4" style={{ background: "hsla(190, 80%, 50%, 0.12)" }}>
            <i.icon className="h-6 w-6 text-primary" />
          </div>
          <h3 className="font-semibold text-foreground mb-2">{i.title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{i.desc}</p>
        </div>
      ))}
    </div>
  </PageShell>
);

export default Compliance;