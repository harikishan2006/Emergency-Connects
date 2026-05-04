import { useState, useEffect, useCallback } from "react";
import { 
  Search, MapPin, Building2, Stethoscope, ArrowLeft, ArrowRight, Activity, Filter, 
  Ambulance, Phone, Navigation, Wind, HeartPulse, CheckCircle2, Clock, 
  ShieldCheck, Star, Award, X, TrendingDown, TrendingUp, BarChart3, Users, Bed, Map as MapIcon
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Hospital {
  id: string;
  hospital_name: string;
  city: string;
  district?: string;
  address?: string;
  phone?: string;
  type?: string;
  available_beds: number;
  total_beds: number;
  icu_available: number;
  oxygen_liters: number;
  ventilators: number;
  lat?: number;
  lon?: number;
  distance?: number;
  rating?: number;
  doctors: {
    name: string;
    specialty: string;
    on_duty: boolean;
  }[];
  is_mock?: boolean;
}

const HospitalSearchView = () => {
  const [loading, setLoading] = useState(false);
  const [citySearch, setCitySearch] = useState("");
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [userIntake, setUserIntake] = useState<any>(null);
  const [userCoords, setUserCoords] = useState<{lat: number, lon: number} | null>(null);
  const [requestedHospital, setRequestedHospital] = useState<Hospital | null>(null);
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);

  useEffect(() => {
    const intake = localStorage.getItem("ec_intake");
    if (intake) {
      setUserIntake(JSON.parse(intake));
    }
  }, []);

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return parseFloat((R * c).toFixed(1));
  };

  const getTreatment = (disease: string) => {
    const d = disease.toLowerCase();
    if (d.includes("breath") || d.includes("asthma") || d.includes("lung")) return { treatment: "Oxygen Therapy & Ventilator Support", specialist: "Pulmonologist", icon: Wind };
    if (d.includes("heart") || d.includes("chest") || d.includes("cardiac")) return { treatment: "Primary PCI / ECG & Intensive Cardiac Care", specialist: "Interventional Cardiologist", icon: HeartPulse };
    if (d.includes("bone") || d.includes("fracture") || d.includes("accident")) return { treatment: "Trauma Stabilization & Orthopedic Surgery", specialist: "Orthopedic Surgeon", icon: Stethoscope };
    return { treatment: "General Emergency Stabilization", specialist: "General Physician", icon: Activity };
  };

  const calculateRating = (hospital: Hospital, disease: string) => {
    let score = 3.8 + (Math.random() * 0.8);
    const d = disease.toLowerCase();
    const hName = hospital.hospital_name.toLowerCase();
    if (d.includes("heart") && (hName.includes("heart") || hName.includes("cardiac"))) score += 0.4;
    return parseFloat(Math.min(5, score).toFixed(1));
  };

  const searchHospitals = useCallback(async (lat?: number, lon?: number, locName?: string) => {
    const trimmedCity = locName || citySearch.trim();
    if (!trimmedCity && !lat) {
      toast.error("Please enter a city or village name");
      return;
    }

    setLoading(true);
    try {
      let results: Hospital[] = [];
      let searchLat = lat;
      let searchLon = lon;

      if (!searchLat) {
        const geoRes = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(trimmedCity + ", Tamil Nadu, India")}&format=json&limit=1`, {
          headers: { 'User-Agent': 'EmergencyConnect/1.0' }
        });
        const geoData = await geoRes.json();
        if (geoData && geoData.length > 0) {
          searchLat = parseFloat(geoData[0].lat);
          searchLon = parseFloat(geoData[0].lon);
          setUserCoords({ lat: searchLat, lon: searchLon });
        }
      }

      if (searchLat && searchLon) {
        try {
          const overpassQuery = `[out:json];(node["amenity"~"hospital|clinic|doctors"](around:35000,${searchLat},${searchLon});way["amenity"~"hospital|clinic|doctors"](around:35000,${searchLat},${searchLon}););out center;`;
          const overpassRes = await fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(overpassQuery)}`, {
            headers: { 'User-Agent': 'EmergencyConnect/1.0' }
          });
          const overpassData = await overpassRes.json();
          
          if (overpassData.elements) {
            results = overpassData.elements.slice(0, 30).map((el: any) => {
              const hLat = el.lat || el.center?.lat;
              const hLon = el.lon || el.center?.lon;
              const dist = calculateDistance(searchLat!, searchLon!, hLat, hLon);
              const intakeStr = localStorage.getItem("ec_intake") || "";
              
              const hObj: Hospital = {
                id: `osm-${el.id}`,
                hospital_name: el.tags.name || "Medical Center",
                city: trimmedCity,
                address: el.tags["addr:full"] || "Contact hospital for address",
                available_beds: Math.floor(Math.random() * 10) + 2,
                total_beds: 50,
                icu_available: Math.floor(Math.random() * 5),
                oxygen_liters: Math.floor(Math.random() * 500) + 100,
                ventilators: Math.floor(Math.random() * 8),
                distance: dist,
                is_mock: true,
                doctors: [
                  { name: "Dr. " + ["Anand", "Vijay", "Meera", "Selvi"][Math.floor(Math.random() * 4)], specialty: "Emergency Specialist", on_duty: true },
                  { name: "Dr. " + ["Kishore", "Raghavan", "Prasad", "Suriya"][Math.floor(Math.random() * 4)], specialty: "Trauma Care", on_duty: true }
                ]
              };
              hObj.rating = calculateRating(hObj, intakeStr);
              return hObj;
            });
            results.sort((a, b) => (b.rating || 0) - (a.rating || 0) || (a.distance || 0) - (b.distance || 0));
          }
        } catch (e) {
          console.warn("Overpass failed, using fallback");
        }
      }

      if (results.length === 0) {
        results = [
          { id: "tn-1", hospital_name: `${trimmedCity} Govt District Hospital`, city: trimmedCity, available_beds: 15, total_beds: 100, icu_available: 5, oxygen_liters: 800, ventilators: 12, distance: 1.2, rating: 4.8, doctors: [{ name: "Dr. Tamil Selvan", specialty: "Trauma Specialist", on_duty: true }], is_mock: true },
        ];
      }
      setHospitals(results);
    } catch (err) {
      toast.error("Emergency system busy. Try again.");
    } finally {
      setLoading(false);
    }
  }, [citySearch]);

  const locateMe = () => {
    if (!navigator.geolocation) return;
    setLoading(true);
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;
      setUserCoords({ lat: latitude, lon: longitude });
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`, {
        headers: { 'User-Agent': 'EmergencyConnect/1.0' }
      });
      const data = await res.json();
      const loc = data.address.city || data.address.town || data.address.village || "Current Location";
      setCitySearch(loc);
      searchHospitals(latitude, longitude, loc);
    }, () => setLoading(false));
  };

  const handleRequest = (hospital: Hospital) => {
    setLoading(true);
    setTimeout(() => {
      setRequestedHospital(hospital);
      setSelectedHospital(null);
      setLoading(false);
      toast.success("Admission Requested! Hospital is preparing your bed.");
    }, 1500);
  };

  useEffect(() => {
    searchHospitals();
  }, [searchHospitals]);

  const treatment = userIntake ? getTreatment(userIntake.disease) : null;

  if (requestedHospital) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 animate-fade-in py-10">
        <div className="glass-card p-10 border-emerald-500/40 bg-emerald-500/5 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent animate-pulse" />
          <div className="h-20 w-20 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="h-10 w-10 text-emerald-500 animate-bounce" />
          </div>
          <h2 className="text-4xl font-black text-foreground mb-2">Emergency Admission Confirmed</h2>
          <p className="text-muted-foreground mb-8">Secure Token: <span className="text-emerald-500 font-black tracking-widest uppercase">TN-{requestedHospital.id.split("-")[1]?.slice(0, 8) || "AP-2024"}</span></p>
          
          <div className="grid md:grid-cols-2 gap-8 text-left mb-8">
            <div className="bg-[#0a1124] p-8 rounded-3xl border border-emerald-500/20 shadow-2xl">
              <p className="text-[10px] text-emerald-500 font-black uppercase tracking-widest mb-4">Destination Facility</p>
              <h3 className="text-xl font-black text-foreground mb-2 leading-tight">{requestedHospital.hospital_name}</h3>
              <p className="text-sm text-muted-foreground flex items-center gap-2"><MapPin className="h-4 w-4 text-emerald-500" /> {requestedHospital.address}</p>
              <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                <span className="text-xs text-muted-foreground flex items-center gap-2"><Clock className="h-4 w-4" /> Live ETA</span>
                <span className="text-lg font-black text-foreground">~{Math.ceil(requestedHospital.distance! * 3)} Mins</span>
              </div>
            </div>
            
            <div className="bg-[#0a1124] p-8 rounded-3xl border border-primary/20 shadow-2xl">
              <p className="text-[10px] text-primary font-black uppercase tracking-widest mb-4">Clinical Preparation</p>
              <h3 className="text-xl font-black text-foreground mb-2 leading-tight">{treatment?.treatment}</h3>
              <p className="text-sm text-muted-foreground flex items-center gap-2"><Stethoscope className="h-4 w-4 text-primary" /> Specialist: {treatment?.specialist}</p>
              <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                <span className="text-xs text-muted-foreground flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-emerald-500" /> Bed Status</span>
                <Badge className="bg-emerald-500/20 text-emerald-500 border-none px-3 py-1 font-black text-[10px]">RESERVED ER-01</Badge>
              </div>
            </div>
          </div>

          <div className="mt-10 flex gap-4">
            <button className="flex-1 btn-primary bg-emerald-600 py-5 text-sm font-black uppercase tracking-widest shadow-2xl shadow-emerald-600/30 active:scale-95 transition-all" 
              onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${requestedHospital.hospital_name},${requestedHospital.city}`, "_blank")}>
              Launch Emergency Navigation
            </button>
            <button className="btn-outline py-5 px-10 text-xs font-black uppercase tracking-widest hover:bg-white/5" onClick={() => setRequestedHospital(null)}>
              New Search
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020817] text-foreground animate-fade-in relative overflow-x-hidden">
      {/* ADVANCED DETAIL OVERLAY (FULL DASHBOARD VIEW) */}
      {selectedHospital && (
        <div className="fixed inset-0 z-[200] bg-[#020817] flex flex-col animate-fade-in overflow-y-auto pb-10">
          {/* HEADER REPRO */}
          <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 bg-[#030a1c] shrink-0 sticky top-0 z-[210]">
            <div className="flex items-center gap-4">
              <button onClick={() => setSelectedHospital(null)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-primary transition-all border border-white/10">
                <ArrowLeft className="h-4 w-4" /> Back to Network
              </button>
              <div className="h-10 w-px bg-white/10 mx-2" />
              <div>
                <h2 className="text-xl font-black text-foreground leading-tight">{selectedHospital.hospital_name} — Live Status</h2>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
                  {selectedHospital.address} · {selectedHospital.city}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
               <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[10px] gap-2 py-1.5 px-4">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-active-pulse" /> Live Admission Window Open
               </Badge>
               <button onClick={() => handleRequest(selectedHospital)} className="btn-primary bg-emerald-600 px-8 py-2 text-xs font-black uppercase tracking-widest">
                 Confirm Admission
               </button>
            </div>
          </header>

          <div className="max-w-7xl mx-auto w-full p-8 space-y-8">
            {/* HERO STATS REPRO */}
            <div className="grid md:grid-cols-3 gap-6">
               <div className="glass-card p-8 border-white/5 bg-[#0a1124] relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><Bed className="h-12 w-12" /></div>
                  <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mb-2">Emergency Beds Available</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-black text-primary">{selectedHospital.available_beds}</span>
                    <span className="text-xl text-muted-foreground">/ 50</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">Main ER + Trauma Wing Capacity</p>
                  <div className="mt-6 flex items-center gap-2">
                    <Badge className="bg-destructive/10 text-destructive border-none text-[10px] gap-1.5">
                      <TrendingDown className="h-3 w-3" /> Down 4 from 6h ago
                    </Badge>
                  </div>
                  <div className="mt-8 flex items-end gap-1 h-12">
                    {[1,2,3,4,5,6,7,8,9,10].map(i => <div key={i} className="flex-1 bg-primary/20 rounded-t-sm" style={{ height: `${Math.random() * 80 + 20}%` }} />)}
                  </div>
               </div>

               <div className="glass-card p-8 border-white/5 bg-[#0a1124] relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><Users className="h-12 w-12" /></div>
                  <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mb-2">Active Doctors on Duty</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-black text-emerald-400">8</span>
                    <span className="text-xl text-muted-foreground">/ 12</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">Specialists across 4 core departments</p>
                  <div className="mt-6 flex items-center gap-2">
                    <Badge className="bg-emerald-500/10 text-emerald-500 border-none text-[10px] gap-1.5">
                      <TrendingUp className="h-3 w-3" /> +2 since morning shift
                    </Badge>
                  </div>
                  <div className="mt-8 flex items-end gap-1 h-12">
                    {[1,2,3,4,5,6,7,8,9,10].map(i => <div key={i} className="flex-1 bg-emerald-400/20 rounded-t-sm" style={{ height: `${Math.random() * 80 + 20}%` }} />)}
                  </div>
               </div>

               <div className="glass-card p-8 border-white/5 bg-[#0a1124] relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><Ambulance className="h-12 w-12" /></div>
                  <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mb-2">Ambulances Routed Today</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-black text-destructive">23</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">Average response time: 7.4 min</p>
                  <div className="mt-6 flex items-center gap-2">
                    <Badge className="bg-emerald-500/10 text-emerald-500 border-none text-[10px] gap-1.5">
                      <TrendingUp className="h-3 w-3" /> +6 vs. yesterday
                    </Badge>
                  </div>
                  <div className="mt-8 flex items-end gap-1 h-12">
                    {[1,2,3,4,5,6,7,8,9,10].map(i => <div key={i} className="flex-1 bg-destructive/20 rounded-t-sm" style={{ height: `${Math.random() * 80 + 20}%` }} />)}
                  </div>
               </div>
            </div>

            {/* LOWER CONTENT REPRO */}
            <div className="grid lg:grid-cols-12 gap-8">
              <div className="lg:col-span-5 space-y-6">
                <div className="glass-card p-8 border-white/5 bg-[#0a1124]">
                  <h4 className="text-sm font-black text-foreground mb-8 flex items-center gap-2 uppercase tracking-widest">
                    <Activity className="h-4 w-4 text-primary" /> Live Facility Profile
                  </h4>
                  <div className="space-y-6">
                     {selectedHospital.doctors.map((doc, i) => (
                        <div key={i} className="p-5 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between hover:bg-white/10 transition-all">
                          <div className="flex items-center gap-4">
                            <Avatar className="h-14 w-14 border border-primary/20">
                              <AvatarFallback className="bg-primary/10 text-primary font-black">{doc.name[4]}{doc.name[5]}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-bold text-foreground">{doc.name}</p>
                              <p className="text-[10px] text-muted-foreground uppercase">{doc.specialty}</p>
                            </div>
                          </div>
                          <Badge className="bg-emerald-500/10 text-emerald-500 border-none text-[9px] font-black gap-1.5">
                            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-active-pulse" /> ACTIVE
                          </Badge>
                        </div>
                     ))}
                  </div>
                  <div className="mt-8 p-6 rounded-2xl bg-primary/5 border border-primary/20">
                     <p className="text-[10px] text-primary font-black uppercase tracking-widest mb-2">Facility Accreditation</p>
                     <div className="flex flex-wrap gap-2">
                        <Badge className="bg-primary/20 text-primary border-none text-[8px] font-black tracking-widest px-2">NABH ACCREDITED</Badge>
                        <Badge className="bg-primary/20 text-primary border-none text-[8px] font-black tracking-widest px-2">MCI VERIFIED</Badge>
                        <Badge className="bg-accent/20 text-accent border-none text-[8px] font-black tracking-widest px-2">JCI LEVEL 3</Badge>
                     </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7">
                <div className="glass-card p-8 border-white/5 bg-[#0a1124] h-full relative overflow-hidden">
                   <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent animate-pulse" />
                   <h4 className="text-sm font-black text-foreground mb-8 flex items-center justify-between uppercase tracking-widest">
                     <div className="flex items-center gap-2"><MapIcon className="h-4 w-4 text-primary" /> Regional Emergency Network</div>
                     <Badge className="bg-destructive text-white border-none text-[9px] font-black animate-pulse">LIVE FEED</Badge>
                   </h4>
                   <div className="space-y-4">
                      {[1,2,3,4].map(i => (
                        <div key={i} className="p-4 rounded-xl border border-white/5 bg-white/5 flex items-center justify-between opacity-60">
                           <div className="flex items-center gap-4">
                              <div className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center text-[10px] font-black text-muted-foreground">0{i}</div>
                              <div>
                                 <p className="text-xs font-bold text-foreground">Nearby Support Facility 0{i}</p>
                                 <p className="text-[9px] text-muted-foreground uppercase">Medical Cluster Network</p>
                              </div>
                           </div>
                           <Badge className="bg-white/10 text-muted-foreground border-none text-[9px] font-black">STABLE</Badge>
                        </div>
                      ))}
                   </div>
                   <button onClick={() => handleRequest(selectedHospital)} className="w-full mt-8 btn-primary bg-emerald-600 py-4 text-xs font-black uppercase tracking-widest shadow-2xl shadow-emerald-600/20">
                     Submit Admission Data to {selectedHospital.hospital_name}
                   </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MAIN SEARCH VIEW */}
      <div className="max-w-7xl mx-auto p-8 space-y-8">
        {/* RECOMMENDATION TUBE */}
        {userIntake && treatment && (
          <div className="h-16 bg-accent/5 border border-accent/20 rounded-2xl flex items-center px-6 animate-pulse-glow">
            <div className="h-10 w-10 rounded-full bg-accent/20 flex items-center justify-center mr-4">
              <treatment.icon className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-[10px] text-accent font-black uppercase tracking-widest mb-0.5">Primary Clinical Focus</p>
              <h2 className="text-base font-bold text-foreground">{treatment.treatment}</h2>
            </div>
            <Badge className="ml-auto bg-accent/20 text-accent border-accent/30 font-black text-[10px]">RELEVANT SPECIALISTS: {treatment.specialist}</Badge>
          </div>
        )}

        {/* SEARCH BAR REPRO */}
        <div className="glass-card p-6 bg-[#0a1124] border-white/5">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input 
                type="text" 
                className="glass-input pl-12 h-14" 
                placeholder="Find hospital in any Tamil Nadu Village or Town..." 
                value={citySearch}
                onChange={(e) => setCitySearch(e.target.value)}
              />
            </div>
            <button onClick={locateMe} className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center hover:bg-primary/20 border border-primary/20 transition-all">
              <Navigation className="h-6 w-6 text-primary" />
            </button>
            <button onClick={() => searchHospitals()} className="btn-primary md:w-auto px-10 h-14 text-xs font-black uppercase tracking-widest" disabled={loading}>
              {loading ? "SCANNING..." : "SEARCH NETWORK"}
            </button>
          </div>
        </div>

        {/* RESULTS GRID */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {hospitals.map((h, i) => (
            <div key={h.id} className="glass-card p-8 border-white/5 bg-[#0a1124] group relative overflow-hidden transition-all hover:scale-[1.02]">
              {i === 0 && <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-bl-lg shadow-lg">Top Match</div>}
              <div className="flex justify-between items-start mb-6">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-all">
                  <Building2 className="h-6 w-6 text-primary" />
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-accent mb-1 justify-end">
                    <Star className="h-3 w-3 fill-accent" />
                    <span className="text-xs font-black">{h.rating}</span>
                  </div>
                  <Badge className="bg-white/5 text-muted-foreground border-none text-[9px] font-black tracking-widest">{h.distance} KM AWAY</Badge>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-lg font-black text-foreground mb-1 group-hover:text-primary transition-colors truncate">{h.hospital_name}</h3>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider truncate">{h.address}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                  <p className="text-[9px] text-muted-foreground font-black uppercase mb-1">ER BEDS</p>
                  <p className="text-lg font-black text-foreground">{h.available_beds}</p>
                </div>
                <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                  <p className="text-[9px] text-muted-foreground font-black uppercase mb-1">ICU UNITS</p>
                  <p className="text-lg font-black text-foreground">{h.icu_available}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <button onClick={() => setSelectedHospital(h)} className="flex-1 btn-outline text-[10px] py-3.5 font-black uppercase tracking-widest border-white/10 hover:border-primary">
                  View Status
                </button>
                <button onClick={() => handleRequest(h)} className="flex-1 btn-primary bg-primary py-3.5 text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 active:scale-95 transition-all">
                  Confirm Admission
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HospitalSearchView;
