import PageShell from "./PageShell";

const ApiDocs = () => (
  <PageShell title="API Docs" subtitle="Integrate hospital systems with EmergencyConnect using our REST API.">
    <div className="glass-card p-8 space-y-6">
      <div>
        <h3 className="font-semibold text-foreground mb-2">Base URL</h3>
        <code className="text-xs text-primary bg-black/30 px-3 py-2 rounded block">https://api.emergencyconnect.in/v1</code>
      </div>
      <div>
        <h3 className="font-semibold text-foreground mb-2">Authentication</h3>
        <p className="text-sm text-muted-foreground">All requests require an <code className="text-primary">Authorization: Bearer &lt;token&gt;</code> header issued from the Hospital Portal.</p>
      </div>
      <div>
        <h3 className="font-semibold text-foreground mb-2">Endpoints</h3>
        <ul className="text-sm text-muted-foreground space-y-2">
          <li><code className="text-primary">GET /hospitals/availability</code> — list real-time bed/ICU availability</li>
          <li><code className="text-primary">POST /admissions</code> — register a new patient admission</li>
          <li><code className="text-primary">GET /doctors</code> — list on-duty doctors</li>
        </ul>
      </div>
      <p className="text-xs text-muted-foreground/70">Full reference and SDKs coming soon. Contact us for early access.</p>
    </div>
  </PageShell>
);

export default ApiDocs;