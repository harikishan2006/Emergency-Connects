import PageShell from "./PageShell";

const Privacy = () => (
  <PageShell title="Privacy Policy" subtitle="How we collect, use, and protect your information.">
    <div className="glass-card p-8 space-y-6 text-sm text-muted-foreground leading-relaxed">
      <section>
        <h3 className="font-semibold text-foreground mb-2">Information We Collect</h3>
        <p>Name, email, phone number, location during emergencies, and medical details you choose to share for routing decisions.</p>
      </section>
      <section>
        <h3 className="font-semibold text-foreground mb-2">How We Use It</h3>
        <p>To match you to the closest available hospital, dispatch ambulances, and notify receiving hospital staff. We never sell your data.</p>
      </section>
      <section>
        <h3 className="font-semibold text-foreground mb-2">Your Rights</h3>
        <p>You can request access, correction, or deletion of your data at any time by contacting support@emergencyconnect.in.</p>
      </section>
      <p className="text-xs text-muted-foreground/70">Last updated: May 2026.</p>
    </div>
  </PageShell>
);

export default Privacy;