import { Ambulance, Building2, MapPin, Navigation } from "lucide-react";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";

interface HospitalPin {
  name: string;
  short: string;
  x: number; // percentage
  y: number; // percentage
  beds: number;
  status: "Available" | "Limited" | "Critical";
}

interface AmbulancePin {
  id: string;
  x: number;
  y: number;
  status: "Available" | "En Route" | "On Scene";
  destX?: number;
  destY?: number;
}

const hospitals: HospitalPin[] = [
  { name: "Apollo Greams Road", short: "Apollo", x: 52, y: 38, beds: 12, status: "Available" },
  { name: "MGM Healthcare", short: "MGM", x: 35, y: 22, beds: 8, status: "Available" },
  { name: "SIMS Hospital", short: "SIMS", x: 28, y: 45, beds: 3, status: "Limited" },
  { name: "MIOT International", short: "MIOT", x: 18, y: 65, beds: 14, status: "Available" },
  { name: "Kauvery Hospital", short: "Kauvery", x: 58, y: 55, beds: 6, status: "Available" },
  { name: "Fortis Malar", short: "Fortis", x: 65, y: 70, beds: 2, status: "Critical" },
];

const initialAmbulances: AmbulancePin[] = [
  { id: "AMB-01", x: 50, y: 40, status: "Available" },
  { id: "AMB-02", x: 32, y: 42, status: "En Route", destX: 28, destY: 45 },
  { id: "AMB-03", x: 42, y: 50, status: "On Scene" },
  { id: "AMB-04", x: 51, y: 39, status: "Available" },
];

const LiveMapView = () => {
  const [ambulances, setAmbulances] = useState(initialAmbulances);
  const [selectedHospital, setSelectedHospital] = useState<string | null>(null);
  const [pulse, setPulse] = useState(false);

  // Simulate ambulance movement
  useEffect(() => {
    const interval = setInterval(() => {
      setAmbulances(prev =>
        prev.map(amb => {
          if (amb.status !== "En Route" || !amb.destX || !amb.destY) return amb;
          const dx = amb.destX - amb.x;
          const dy = amb.destY - amb.y;
          const step = 0.5;
          return {
            ...amb,
            x: Math.abs(dx) > step ? amb.x + Math.sign(dx) * step : amb.destX,
            y: Math.abs(dy) > step ? amb.y + Math.sign(dy) * step : amb.destY,
          };
        })
      );
      setPulse(p => !p);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const statusColor = {
    Available: "bg-accent",
    "En Route": "bg-yellow-400",
    "On Scene": "bg-destructive",
    Limited: "bg-yellow-400",
    Critical: "bg-destructive",
  };

  return (
    <div className="glass-card p-6 animate-fade-slide-up-delay-2">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
          <Navigation className="h-4 w-4 text-primary" /> Live Network Map – Chennai
        </h3>
        <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
          <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-accent inline-block" /> Hospital</span>
          <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-primary inline-block" /> Ambulance</span>
          <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-destructive inline-block animate-pulse" /> Critical</span>
        </div>
      </div>

      {/* Map Container */}
      <div
        className="relative w-full rounded-xl border border-border/30 overflow-hidden"
        style={{
          height: "420px",
          background: "linear-gradient(135deg, hsla(210, 60%, 8%, 0.95), hsla(210, 50%, 12%, 0.95))",
        }}
      >
        {/* Grid lines for map feel */}
        <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
          {Array.from({ length: 20 }, (_, i) => (
            <line key={`h${i}`} x1="0" y1={`${(i + 1) * 5}%`} x2="100%" y2={`${(i + 1) * 5}%`} stroke="hsl(var(--primary))" strokeWidth="0.5" />
          ))}
          {Array.from({ length: 20 }, (_, i) => (
            <line key={`v${i}`} x1={`${(i + 1) * 5}%`} y1="0" x2={`${(i + 1) * 5}%`} y2="100%" stroke="hsl(var(--primary))" strokeWidth="0.5" />
          ))}
        </svg>

        {/* Road-like paths between hospitals */}
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          {hospitals.map((h, i) =>
            hospitals.slice(i + 1).map((h2, j) => {
              const dist = Math.sqrt((h.x - h2.x) ** 2 + (h.y - h2.y) ** 2);
              if (dist > 35) return null;
              return (
                <line
                  key={`${i}-${j}`}
                  x1={`${h.x}%`} y1={`${h.y}%`}
                  x2={`${h2.x}%`} y2={`${h2.y}%`}
                  stroke="hsl(var(--primary))"
                  strokeWidth="1"
                  opacity="0.15"
                  strokeDasharray="4 4"
                />
              );
            })
          )}
          {/* Ambulance route lines */}
          {ambulances
            .filter(a => a.status === "En Route" && a.destX && a.destY)
            .map(a => (
              <line
                key={a.id}
                x1={`${a.x}%`} y1={`${a.y}%`}
                x2={`${a.destX}%`} y2={`${a.destY}%`}
                stroke="hsl(var(--accent))"
                strokeWidth="2"
                opacity="0.6"
                strokeDasharray="6 3"
              />
            ))}
        </svg>

        {/* Hospital pins */}
        {hospitals.map(h => (
          <div
            key={h.name}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-10"
            style={{ left: `${h.x}%`, top: `${h.y}%` }}
            onClick={() => setSelectedHospital(selectedHospital === h.name ? null : h.name)}
          >
            {/* Pulse ring for critical */}
            {h.status === "Critical" && (
              <div className="absolute inset-0 -m-3 rounded-full bg-destructive/20 animate-ping" />
            )}
            <div className={`relative h-8 w-8 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
              h.status === "Critical" ? "border-destructive bg-destructive/20" :
              h.status === "Limited" ? "border-yellow-500 bg-yellow-500/20" :
              "border-accent bg-accent/20"
            } ${selectedHospital === h.name ? "scale-125 ring-2 ring-primary/50" : "hover:scale-110"}`}>
              <Building2 className={`h-4 w-4 ${
                h.status === "Critical" ? "text-destructive" :
                h.status === "Limited" ? "text-yellow-400" :
                "text-accent"
              }`} />
            </div>
            {/* Label */}
            <div className={`absolute top-full mt-1 left-1/2 -translate-x-1/2 whitespace-nowrap transition-all duration-200 ${
              selectedHospital === h.name ? "opacity-100" : "opacity-70 group-hover:opacity-100"
            }`}>
              <span className="text-[10px] font-medium text-foreground bg-background/80 px-1.5 py-0.5 rounded">
                {h.short}
              </span>
            </div>
            {/* Tooltip */}
            {selectedHospital === h.name && (
              <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 glass-card p-3 min-w-[160px] animate-fade-in z-20">
                <p className="text-xs font-semibold text-foreground">{h.name}</p>
                <div className="flex items-center justify-between mt-1.5">
                  <span className="text-[10px] text-muted-foreground">Beds: <strong className="text-primary">{h.beds}</strong></span>
                  <Badge variant="outline" className={`text-[9px] px-1.5 py-0 ${
                    h.status === "Available" ? "bg-accent/15 text-accent border-accent/30" :
                    h.status === "Limited" ? "bg-yellow-500/15 text-yellow-400 border-yellow-500/30" :
                    "bg-destructive/15 text-destructive border-destructive/30"
                  }`}>
                    {h.status}
                  </Badge>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Ambulance pins */}
        {ambulances.map(amb => (
          <div
            key={amb.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10 transition-all duration-1000 ease-linear"
            style={{ left: `${amb.x}%`, top: `${amb.y}%` }}
          >
            <div className={`h-6 w-6 rounded-full border flex items-center justify-center ${
              amb.status === "Available" ? "border-primary/60 bg-primary/20" :
              amb.status === "En Route" ? "border-yellow-500/60 bg-yellow-500/20" :
              "border-destructive/60 bg-destructive/20"
            }`}>
              <Ambulance className={`h-3 w-3 ${
                amb.status === "Available" ? "text-primary" :
                amb.status === "En Route" ? "text-yellow-400" :
                "text-destructive"
              }`} />
            </div>
            <span className="absolute top-full mt-0.5 left-1/2 -translate-x-1/2 text-[8px] text-muted-foreground whitespace-nowrap">
              {amb.id}
            </span>
          </div>
        ))}

        {/* Map label */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-[10px] text-muted-foreground/50">
          <MapPin className="h-3 w-3" /> Chennai Metropolitan Area
        </div>
      </div>
    </div>
  );
};

export default LiveMapView;
