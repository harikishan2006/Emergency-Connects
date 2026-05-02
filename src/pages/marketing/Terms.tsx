import PageShell from "./PageShell";

const Terms = () => (
  <PageShell title="Terms of Service" subtitle="The rules for using EmergencyConnect.">
    <div className="glass-card p-8 space-y-6 text-sm text-muted-foreground leading-relaxed">
      <section>
        <h3 className="font-semibold text-foreground mb-2">Use of Service</h3>
        <p>EmergencyConnect routes patients to hospitals based on real-time data. It does not replace dialing local emergency services in life-threatening situations.</p>
      </section>
      <section>
        <h3 className="font-semibold text-foreground mb-2">Account Responsibility</h3>
        <p>You are responsible for keeping your login credentials secure and for the accuracy of information provided during registration.</p>
      </section>
      <section>
        <h3 className="font-semibold text-foreground mb-2">Liability</h3>
        <p>While we strive for accuracy, EmergencyConnect is provided "as is" and final medical decisions rest with healthcare professionals.</p>
      </section>
      <p className="text-xs text-muted-foreground/70">Last updated: May 2026.</p>
    </div>
  </PageShell>
);

export default Terms;