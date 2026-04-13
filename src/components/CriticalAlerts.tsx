import { AlertTriangle, Bell, BellRing, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";

interface Alert {
  id: number;
  hospital: string;
  message: string;
  severity: "critical" | "warning" | "info";
  time: string;
  isNew: boolean;
}

const initialAlerts: Alert[] = [
  { id: 1, hospital: "Fortis Malar", message: "Only 2 emergency beds remaining – approaching capacity", severity: "critical", time: "2 min ago", isNew: true },
  { id: 2, hospital: "SIMS Hospital", message: "ICU beds at 90% occupancy – divert non-critical cases", severity: "warning", time: "8 min ago", isNew: true },
  { id: 3, hospital: "MGM Healthcare", message: "ECMO unit fully occupied – reroute cardiac emergencies", severity: "critical", time: "12 min ago", isNew: false },
  { id: 4, hospital: "Kauvery Hospital", message: "Transplant ward nearing capacity – 1 bed available", severity: "warning", time: "18 min ago", isNew: false },
  { id: 5, hospital: "Apollo Greams Road", message: "Trauma bay stabilized – 4 beds freed after discharge", severity: "info", time: "25 min ago", isNew: false },
];

const incomingAlerts: Omit<Alert, "id" | "isNew">[] = [
  { hospital: "MIOT International", message: "Emergency OR fully booked – redirect trauma cases", severity: "critical", time: "Just now" },
  { hospital: "Fortis Malar", message: "Bed count dropped to 1 – critical shortage", severity: "critical", time: "Just now" },
  { hospital: "SIMS Hospital", message: "Ventilator availability at 15% – alert respiratory teams", severity: "warning", time: "Just now" },
];

const CriticalAlerts = () => {
  const [alerts, setAlerts] = useState<Alert[]>(initialAlerts);
  const [expanded, setExpanded] = useState(true);
  const [nextAlertIdx, setNextAlertIdx] = useState(0);

  // Simulate incoming alerts
  useEffect(() => {
    if (nextAlertIdx >= incomingAlerts.length) return;
    const timer = setTimeout(() => {
      const incoming = incomingAlerts[nextAlertIdx];
      setAlerts(prev => [
        { ...incoming, id: Date.now(), isNew: true },
        ...prev,
      ]);
      setNextAlertIdx(i => i + 1);
    }, 8000 + nextAlertIdx * 6000);
    return () => clearTimeout(timer);
  }, [nextAlertIdx]);

  const dismiss = (id: number) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
  };

  const criticalCount = alerts.filter(a => a.severity === "critical").length;

  const severityStyles = {
    critical: "border-destructive/40 bg-destructive/10",
    warning: "border-yellow-500/40 bg-yellow-500/10",
    info: "border-accent/40 bg-accent/10",
  };

  const severityIcon = {
    critical: "text-destructive",
    warning: "text-yellow-400",
    info: "text-accent",
  };

  return (
    <div className="glass-card p-6 animate-fade-slide-up-delay-1">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
          {criticalCount > 0 ? (
            <BellRing className="h-4 w-4 text-destructive animate-pulse" />
          ) : (
            <Bell className="h-4 w-4 text-primary" />
          )}
          Critical Alerts
        </h3>
        <div className="flex items-center gap-2">
          {criticalCount > 0 && (
            <Badge className="bg-destructive/20 text-destructive border-destructive/30 text-xs gap-1 animate-pulse">
              {criticalCount} Critical
            </Badge>
          )}
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            {expanded ? "Collapse" : "Expand"}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`flex items-start gap-3 p-3 rounded-lg border transition-all duration-500 ${severityStyles[alert.severity]} ${alert.isNew ? "animate-fade-slide-up" : ""}`}
            >
              <AlertTriangle className={`h-4 w-4 mt-0.5 flex-shrink-0 ${severityIcon[alert.severity]}`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-foreground">{alert.hospital}</span>
                  {alert.isNew && (
                    <span className="text-[10px] font-bold uppercase tracking-wider text-destructive animate-pulse">NEW</span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{alert.message}</p>
                <span className="text-[10px] text-muted-foreground/60 mt-1 block">{alert.time}</span>
              </div>
              <button
                onClick={() => dismiss(alert.id)}
                className="text-muted-foreground/50 hover:text-foreground transition-colors flex-shrink-0"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CriticalAlerts;
