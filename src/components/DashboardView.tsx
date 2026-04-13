import { Activity, Ambulance, Bed, Clock, Heart, LogOut, MapPin, Navigation, Phone, Route, Shield, Stethoscope, User, Users, Wifi } from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import CriticalAlerts from "@/components/CriticalAlerts";
import LiveMapView from "@/components/LiveMapView";

interface DashboardViewProps {
  onNavigate: (view: "landing") => void;
}

const nearbyHospitals = [
  { name: "MGM Healthcare", location: "Nelson Manickam Road", doctor: "Dr. S. Ananth", specialty: "Critical Care & ECMO", beds: 8, status: "Available" },
  { name: "SIMS Hospital", location: "Vadapalani", doctor: "Dr. Raju Sivasamy", specialty: "Senior Orthopaedic Surgeon", beds: 3, status: "Limited" },
  { name: "MIOT International", location: "Manapakkam", doctor: "Dr. Prithvi Mohandas", specialty: "Hip & Joint Replacement", beds: 14, status: "Available" },
  { name: "Kauvery Hospital", location: "Alwarpet", doctor: "Dr. Aravindan Selvaraj", specialty: "Multi-Organ Transplant", beds: 6, status: "Available" },
  { name: "Fortis Malar", location: "Adyar", doctor: "Dr. Nandakumar Sundaram", specialty: "Traumatology & Spine", beds: 2, status: "Critical" },
];

const ambulanceUnits = [
  { id: "AMB-01", type: "ALS", status: "Available", location: "Apollo Base", crew: "Paramedic Team A" },
  { id: "AMB-02", type: "BLS", status: "En Route", location: "Near Vadapalani", crew: "Paramedic Team B" },
  { id: "AMB-03", type: "ALS", status: "On Scene", location: "T. Nagar Junction", crew: "Paramedic Team C" },
  { id: "AMB-04", type: "MICU", status: "Available", location: "Apollo Base", crew: "Critical Care Unit" },
];

const routeEstimations = [
  { from: "Apollo Greams Road", to: "MGM Healthcare", distance: "6.2 km", eta: "14 min", traffic: "Moderate" },
  { from: "Apollo Greams Road", to: "SIMS Hospital", distance: "8.7 km", eta: "22 min", traffic: "Heavy" },
  { from: "Apollo Greams Road", to: "MIOT International", distance: "12.4 km", eta: "28 min", traffic: "Light" },
  { from: "Apollo Greams Road", to: "Kauvery Hospital", distance: "3.1 km", eta: "8 min", traffic: "Light" },
  { from: "Apollo Greams Road", to: "Fortis Malar", distance: "9.5 km", eta: "20 min", traffic: "Moderate" },
];

const DashboardView = ({ onNavigate }: DashboardViewProps) => {
  const [beds, setBeds] = useState(12);
  const totalBeds = 50;

  return (
    <div className="min-h-screen animate-fade-in">
      {/* Top Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 py-3"
        style={{ background: "hsla(207, 100%, 8%, 0.7)", backdropFilter: "blur(16px)" }}>
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          <span className="text-base font-bold text-foreground">EmergencyConnect</span>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-accent/20 text-accent border-accent/30 text-xs gap-1">
            <Wifi className="h-3 w-3" /> Live Sync
          </Badge>
          <button onClick={() => onNavigate("landing")}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-destructive transition-colors">
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>
      </nav>

      <div className="pt-20 px-4 md:px-10 pb-12 max-w-7xl mx-auto space-y-6">
        {/* Hospital Identity Header */}
        <div className="glass-card p-6 md:p-8 animate-fade-slide-up">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <Avatar className="h-16 w-16 border-2 border-primary/30">
              <AvatarFallback className="bg-primary/15 text-primary text-xl font-bold">VK</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-xl md:text-2xl font-bold text-foreground">Apollo Hospitals, Greams Road</h1>
                <Badge className="bg-accent/20 text-accent border-accent/30 text-xs">NABH Accredited</Badge>
              </div>
              <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" /> 21, Greams Lane, Thousand Lights, Chennai – 600006
              </p>
              <div className="flex flex-wrap gap-x-6 gap-y-1 mt-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Stethoscope className="h-3.5 w-3.5 text-primary" /> Current Shift Lead: <strong className="text-foreground">Dr. Vijay Kishore</strong> (Cardiology)</span>
                <span className="flex items-center gap-1"><Heart className="h-3.5 w-3.5 text-destructive" /> ER Supervisor: <strong className="text-foreground">Dr. Meera Raghavan</strong> (Trauma Care)</span>
                <span className="flex items-center gap-1"><Shield className="h-3.5 w-3.5 text-accent" /> MCI Registered</span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
              <Badge className="bg-accent/20 text-accent border-accent/30 gap-1 text-xs">
                <div className="h-2 w-2 rounded-full bg-accent animate-pulse" /> Active – Level 1
              </Badge>
              <span className="text-xs text-muted-foreground">Emergency Sync ON</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Live Facility Info */}
          <div className="glass-card p-6 animate-fade-slide-up-delay-1">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Live Facility Info</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg flex items-center justify-center" style={{ background: "hsla(190, 80%, 50%, 0.12)" }}>
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Dr. Vijay Kishore</p>
                  <p className="text-xs text-muted-foreground">Senior Interventional Cardiologist</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg flex items-center justify-center" style={{ background: "hsla(170, 70%, 45%, 0.12)" }}>
                  <Users className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Staff on Duty</p>
                  <p className="text-xs text-muted-foreground">42 Active Personnel</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg flex items-center justify-center" style={{ background: "hsla(0, 84%, 60%, 0.12)" }}>
                  <Phone className="h-5 w-5 text-destructive" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Emergency Hotline</p>
                  <p className="text-xs text-muted-foreground">+91 44 2829 3333</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bed Management */}
          <div className="glass-card p-6 animate-fade-slide-up-delay-2">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Bed Management</h3>
            <div className="text-center mb-4">
              <span className="text-5xl font-extrabold text-primary">{beds}</span>
              <span className="text-2xl text-muted-foreground font-light">/{totalBeds}</span>
              <p className="text-xs text-muted-foreground mt-1">Emergency Beds Available</p>
            </div>
            <Progress value={(beds / totalBeds) * 100} className="h-3 mb-4" />
            <div className="flex gap-2 justify-center">
              <button onClick={() => setBeds(b => Math.max(0, b - 1))}
                className="btn-outline text-xs px-4 py-2">
                – Admit
              </button>
              <button onClick={() => setBeds(b => Math.min(totalBeds, b + 1))}
                className="btn-outline text-xs px-4 py-2">
                + Discharge
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="glass-card p-6 animate-fade-slide-up-delay-3">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Today's Overview</h3>
            <div className="space-y-4">
              {[
                { label: "Patients Routed", value: "34", color: "text-primary" },
                { label: "Avg Response Time", value: "4.2 min", color: "text-accent" },
                { label: "Critical Alerts", value: "2", color: "text-destructive" },
                { label: "Network Uptime", value: "99.8%", color: "text-primary" },
              ].map(s => (
                <div key={s.label} className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">{s.label}</span>
                  <span className={`text-lg font-bold ${s.color}`}>{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Emergency Routing Feed */}
        <div className="glass-card p-6 animate-fade-slide-up-delay-2">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Emergency Routing Feed – Chennai Network</h3>
          <div className="overflow-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border/50">
                  <TableHead className="text-muted-foreground">Hospital</TableHead>
                  <TableHead className="text-muted-foreground">Location</TableHead>
                  <TableHead className="text-muted-foreground">Doctor on Duty</TableHead>
                  <TableHead className="text-muted-foreground">Specialist</TableHead>
                  <TableHead className="text-muted-foreground text-center">Beds</TableHead>
                  <TableHead className="text-muted-foreground text-center">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {nearbyHospitals.map(h => (
                  <TableRow key={h.name} className="border-border/30 hover:bg-transparent">
                    <TableCell className="font-medium text-foreground">{h.name}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">{h.location}</TableCell>
                    <TableCell className="text-foreground text-sm">{h.doctor}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">{h.specialty}</TableCell>
                    <TableCell className="text-center font-bold text-primary">{h.beds}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant={h.status === "Critical" ? "destructive" : "outline"}
                        className={
                          h.status === "Available" ? "bg-accent/15 text-accent border-accent/30" :
                          h.status === "Limited" ? "bg-yellow-500/15 text-yellow-400 border-yellow-500/30" :
                          ""
                        }>
                        {h.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Ambulance Dispatch Panel */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Active Ambulance Units */}
          <div className="glass-card p-6 animate-fade-slide-up-delay-3">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                <Ambulance className="h-4 w-4 text-primary" /> Ambulance Dispatch
              </h3>
              <Badge className="bg-primary/20 text-primary border-primary/30 text-xs gap-1">
                {ambulanceUnits.filter(a => a.status === "Available").length} Units Ready
              </Badge>
            </div>
            <div className="space-y-3">
              {ambulanceUnits.map(unit => (
                <div key={unit.id} className="flex items-center justify-between p-3 rounded-lg border border-border/30 hover:border-border/60 transition-colors"
                  style={{ background: "hsla(210, 50%, 95%, 0.04)" }}>
                  <div className="flex items-center gap-3">
                    <div className={`h-9 w-9 rounded-lg flex items-center justify-center ${
                      unit.status === "Available" ? "bg-accent/15" : unit.status === "En Route" ? "bg-yellow-500/15" : "bg-destructive/15"
                    }`}>
                      <Ambulance className={`h-4 w-4 ${
                        unit.status === "Available" ? "text-accent" : unit.status === "En Route" ? "text-yellow-400" : "text-destructive"
                      }`} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{unit.id} <span className="text-xs text-muted-foreground ml-1">({unit.type})</span></p>
                      <p className="text-xs text-muted-foreground">{unit.crew} · {unit.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={unit.status === "Available" ? "outline" : unit.status === "En Route" ? "outline" : "destructive"}
                      className={
                        unit.status === "Available" ? "bg-accent/15 text-accent border-accent/30 text-xs" :
                        unit.status === "En Route" ? "bg-yellow-500/15 text-yellow-400 border-yellow-500/30 text-xs" :
                        "text-xs"
                      }>
                      {unit.status}
                    </Badge>
                    {unit.status === "Available" && (
                      <button className="btn-outline text-xs px-3 py-1.5 flex items-center gap-1">
                        <Navigation className="h-3 w-3" /> Dispatch
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Route Estimations */}
          <div className="glass-card p-6 animate-fade-slide-up-delay-3">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2 mb-4">
              <Route className="h-4 w-4 text-accent" /> Route Estimations from Apollo
            </h3>
            <div className="overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border/50">
                    <TableHead className="text-muted-foreground">Destination</TableHead>
                    <TableHead className="text-muted-foreground text-center">Distance</TableHead>
                    <TableHead className="text-muted-foreground text-center">ETA</TableHead>
                    <TableHead className="text-muted-foreground text-center">Traffic</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {routeEstimations.map(r => (
                    <TableRow key={r.to} className="border-border/30 hover:bg-transparent">
                      <TableCell className="font-medium text-foreground text-sm">{r.to}</TableCell>
                      <TableCell className="text-center text-muted-foreground text-sm">{r.distance}</TableCell>
                      <TableCell className="text-center">
                        <span className="flex items-center justify-center gap-1 text-sm font-bold text-primary">
                          <Clock className="h-3 w-3" /> {r.eta}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline" className={
                          r.traffic === "Light" ? "bg-accent/15 text-accent border-accent/30 text-xs" :
                          r.traffic === "Moderate" ? "bg-yellow-500/15 text-yellow-400 border-yellow-500/30 text-xs" :
                          "bg-destructive/15 text-destructive border-destructive/30 text-xs"
                        }>
                          {r.traffic}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
        {/* Critical Alerts */}
        <CriticalAlerts />

        {/* Live Map View */}
        <LiveMapView />
      </div>
    </div>
      </div>
    </div>
  );
};

export default DashboardView;
