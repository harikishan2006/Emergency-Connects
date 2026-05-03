import { useEffect, useState } from "react";
import { CheckCircle2, Mail, Server, XCircle } from "lucide-react";
import { toast } from "sonner";
import PageShell from "./marketing/PageShell";
import {
  checkHealth,
  getOtpApiUrl,
  sendOtp,
  setOtpApiUrl,
} from "@/lib/otpClient";

const OtpSettings = () => {
  const [url, setUrl] = useState(getOtpApiUrl());
  const [status, setStatus] = useState<"unknown" | "ok" | "error">("unknown");
  const [smtpFrom, setSmtpFrom] = useState<string | null>(null);
  const [statusMsg, setStatusMsg] = useState("");
  const [testEmail, setTestEmail] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setOtpApiUrl(url);
  }, [url]);

  const runHealthCheck = async () => {
    setBusy(true);
    setStatus("unknown");
    try {
      const data = await checkHealth();
      setStatus(data.smtp === "ready" ? "ok" : "error");
      setSmtpFrom(data.from);
      setStatusMsg(
        data.smtp === "ready"
          ? `Server reachable. Sending from ${data.from}.`
          : "Server reachable but SMTP is not configured."
      );
    } catch (err: any) {
      setStatus("error");
      setStatusMsg(err.message || "Unable to reach the server");
    } finally {
      setBusy(false);
    }
  };

  const sendTest = async () => {
    if (!testEmail) return toast.error("Enter an email to test");
    setBusy(true);
    try {
      await sendOtp(testEmail);
      toast.success(`Test code sent to ${testEmail}`, {
        description: "Check the inbox & spam folder",
      });
    } catch (err: any) {
      toast.error(err.message || "Send failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <PageShell
      title="OTP Settings"
      subtitle="Connect the React app to your local Node.js OTP server (Gmail SMTP)."
    >
      <div className="space-y-8 max-w-2xl">
        <section className="glass-card p-6 space-y-4">
          <h2 className="flex items-center gap-2 text-lg font-bold text-foreground">
            <Server className="h-5 w-5 text-primary" /> API base URL
          </h2>
          <p className="text-sm text-muted-foreground">
            The URL where your Node.js OTP server is running. Default is{" "}
            <code className="text-primary">http://localhost:3001</code>.
          </p>
          <input
            className="glass-input"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="http://localhost:3001"
          />
          <div className="flex flex-wrap gap-3 pt-2">
            <button onClick={runHealthCheck} className="btn-primary" disabled={busy}>
              {busy ? "Checking…" : "Test connection"}
            </button>
            <button
              onClick={() => {
                setOtpApiUrl(url);
                toast.success("Saved");
              }}
              className="btn-outline"
            >
              Save URL
            </button>
          </div>

          {status !== "unknown" && (
            <div
              className={`flex items-start gap-2 text-sm rounded-lg p-3 border ${
                status === "ok"
                  ? "border-accent/40 text-accent"
                  : "border-destructive/40 text-destructive"
              }`}
            >
              {status === "ok" ? (
                <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
              ) : (
                <XCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              )}
              <div>
                <p className="font-medium">{statusMsg}</p>
                {smtpFrom && status === "ok" && (
                  <p className="text-xs text-muted-foreground mt-1">
                    From address: {smtpFrom}
                  </p>
                )}
              </div>
            </div>
          )}
        </section>

        <section className="glass-card p-6 space-y-4">
          <h2 className="flex items-center gap-2 text-lg font-bold text-foreground">
            <Mail className="h-5 w-5 text-primary" /> Send a test code
          </h2>
          <p className="text-sm text-muted-foreground">
            Send a real 6-digit code to confirm Gmail SMTP works end-to-end.
          </p>
          <input
            className="glass-input"
            type="email"
            value={testEmail}
            onChange={(e) => setTestEmail(e.target.value)}
            placeholder="you@gmail.com"
          />
          <button onClick={sendTest} className="btn-primary" disabled={busy}>
            {busy ? "Sending…" : "Send test OTP"}
          </button>
        </section>

        <section className="glass-card p-6 space-y-3 text-sm text-muted-foreground">
          <h2 className="text-lg font-bold text-foreground">Setup checklist</h2>
          <ol className="list-decimal pl-5 space-y-2">
            <li>
              In a terminal: <code className="text-primary">cd otp-server && npm install</code>
            </li>
            <li>
              Copy <code className="text-primary">.env.example</code> to{" "}
              <code className="text-primary">.env</code> and add your Gmail address +
              16-character{" "}
              <a
                href="https://myaccount.google.com/apppasswords"
                target="_blank"
                rel="noreferrer"
                className="text-primary underline"
              >
                App Password
              </a>
              .
            </li>
            <li>
              Run <code className="text-primary">npm start</code> — server listens on port 3001.
            </li>
            <li>Click <strong>Test connection</strong> above. You should see “SMTP ready”.</li>
          </ol>
        </section>
      </div>
    </PageShell>
  );
};

export default OtpSettings;