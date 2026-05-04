import { useEffect, useState } from "react";
import { Bed, Building2, Stethoscope, UserCircle, Clock, Activity, ShieldCheck, ArrowLeft, Camera, Trash2, Wind, HeartPulse } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Row {
  id: string;
  hospital_name: string;
  city: string;
  available_beds: number;
  total_beds: number;
  icu_available: number;
  doctor_name: string;
  specialty: string;
  on_duty: boolean;
  patient_name: string;
  age: number;
  blood_group: string;
  condition: string;
  status: "admitted" | "waiting" | "discharged";
  admitted_at: string;
}

const formatTime = (iso: string) => {
  const d = new Date(iso);
  const diffMs = Date.now() - d.getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
};

const statusBadge = (s: string) => {
  if (s === "admitted") return "bg-accent/15 text-accent border-accent/30";
  if (s === "waiting") return "bg-yellow-500/15 text-yellow-400 border-yellow-500/30";
  return "bg-muted/30 text-muted-foreground border-border";
};

interface AvailabilityViewProps {
  currentUser?: any;
}

const AvailabilityView = ({ currentUser }: AvailabilityViewProps) => {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [myHospital, setMyHospital] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase
        .from("admissions")
        .select(`
          id, status, admitted_at,
          hospitals ( name, city, available_beds, total_beds, icu_available ),
          doctors   ( name, specialty, on_duty ),
          patients  ( name, age, blood_group, condition )
        `)
        .order("admitted_at", { ascending: false });

      if (error) {
        toast.error("Failed to load availability");
        setLoading(false);
        return;
      }

      const mapped: Row[] = (data || []).map((r: any) => ({
        id: r.id,
        hospital_name: r.hospitals?.name ?? "—",
        city: r.hospitals?.city ?? "—",
        available_beds: r.hospitals?.available_beds ?? 0,
        total_beds: r.hospitals?.total_beds ?? 0,
        icu_available: r.hospitals?.icu_available ?? 0,
        doctor_name: r.doctors?.name ?? "—",
        specialty: r.doctors?.specialty ?? "—",
        on_duty: r.doctors?.on_duty ?? false,
        patient_name: r.patients?.name ?? "—",
        age: r.patients?.age ?? 0,
        blood_group: r.patients?.blood_group ?? "—",
        condition: r.patients?.condition ?? "—",
        status: r.status,
        admitted_at: r.admitted_at,
      }));

      setRows(mapped);
      setLoading(false);

      if (currentUser?.user_metadata?.user_type === "hospital") {
        const { data: hData } = await supabase
          .from("hospitals")
          .select("*")
          .eq("hospital_name", currentUser.user_metadata.hospital_name)
          .single();
        if (hData) setMyHospital(hData);
      }
    };
    load();
  }, [currentUser]);

  const handleUpdateAvailability = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!myHospital) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from("hospitals")
        .update({
          available_beds: myHospital.available_beds,
          icu_available: myHospital.icu_available,
          lead_doctor: myHospital.lead_doctor,
          specialty: myHospital.specialty,
          mci_id: myHospital.mci_id,
          doctor_on_duty: myHospital.doctor_on_duty,
          staff_count: myHospital.staff_count
        })
        .eq("id", myHospital.id);
      if (error) throw error;
      toast.success("Facility availability updated!");
    } catch (err: any) {
      toast.error(err.message || "Failed to save updates");
    } finally {
      setSaving(false);
    }
  };

  const totalBeds = rows.reduce((acc, r) => {
    if (!acc.find(h => h.name === r.hospital_name)) acc.push({ name: r.hospital_name, available: r.available_beds, icu: r.icu_available });
    return acc;
  }, [] as { name: string; available: number; icu: number }[]);

  const stats = {
    admitted: rows.filter(r => r.status === "admitted").length,
    waiting: rows.filter(r => r.status === "waiting").length,
    discharged: rows.filter(r => r.status === "discharged").length,
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {myHospital && (
        <div className="glass-card p-6 md:p-8 border-primary/30 bg-primary/5 animate-fade-slide-up">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                <ShieldCheck className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">Facility & Medical Staff Management</h3>
                <p className="text-xs text-muted-foreground">Update your live emergency capacity and gallery</p>
              </div>
            </div>
            <button onClick={() => window.location.reload()} className="text-xs font-bold text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" /> Exit Management
            </button>
          </div>
          
          <form onSubmit={handleUpdateAvailability} className="space-y-8">
            <div className="space-y-4">
              <p className="text-[10px] text-primary font-black uppercase tracking-widest border-b border-primary/20 pb-1">Facility Gallery</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="aspect-video rounded-xl bg-background/40 border-2 border-dashed border-border/50 flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-all group">
                  <Camera className="h-5 w-5 text-primary mb-2" />
                  <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Upload</p>
                </div>
                {[1, 2, 3].map(i => (
                  <div key={i} className="aspect-video rounded-xl bg-background/40 border border-border/30 overflow-hidden group relative">
                    <img src={`https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=400&index=${i}`} alt="Hospital" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Trash2 className="h-5 w-5 text-white cursor-pointer hover:text-destructive transition-colors" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="space-y-4">
                <p className="text-[10px] text-primary font-black uppercase tracking-widest border-b border-primary/20 pb-1">Medical Staff</p>
                <div>
                  <label className="text-[11px] font-medium text-muted-foreground mb-1.5 block">Lead Doctor Name</label>
                  <input type="text" className="glass-input" placeholder="e.g., Dr. Vijay Kishore" value={myHospital.lead_doctor || ""} onChange={e => setMyHospital({...myHospital, lead_doctor: e.target.value})} />
                </div>
                <div>
                  <label className="text-[11px] font-medium text-muted-foreground mb-1.5 block">Doctor Specialty</label>
                  <select className="glass-input" value={myHospital.specialty || ""} onChange={e => setMyHospital({...myHospital, specialty: e.target.value})}>
                    <option value="">Select specialty</option>
                    <option value="Emergency Medicine">Emergency Medicine</option>
                    <option value="Cardiology">Cardiology</option>
                    <option value="Neurology">Neurology</option>
                    <option value="Trauma Care">Trauma Care</option>
                    <option value="General Surgery">General Surgery</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-medium text-muted-foreground mb-1.5 block">MCI ID</label>
                  <input type="text" className="glass-input" placeholder="MCI-67890" value={myHospital.mci_id || ""} onChange={e => setMyHospital({...myHospital, mci_id: e.target.value})} />
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-[10px] text-accent font-black uppercase tracking-widest border-b border-accent/20 pb-1">Duty Management</p>
                <div>
                  <label className="text-[11px] font-medium text-muted-foreground mb-1.5 block">Doctor on Duty</label>
                  <input type="text" className="glass-input" placeholder="Dr. Meera Raghavan" value={myHospital.doctor_on_duty || ""} onChange={e => setMyHospital({...myHospital, doctor_on_duty: e.target.value})} />
                </div>
                <div>
                  <label className="text-[11px] font-medium text-muted-foreground mb-1.5 block">Staff Count</label>
                  <input type="number" className="glass-input" value={myHospital.staff_count || 0} onChange={e => setMyHospital({...myHospital, staff_count: parseInt(e.target.value)})} />
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-[10px] text-destructive font-black uppercase tracking-widest border-b border-destructive/20 pb-1">Emergency Capacity</p>
                <div>
                  <label className="text-[11px] font-medium text-muted-foreground mb-1.5 block">ER Beds</label>
                  <input type="number" className="glass-input" value={myHospital.available_beds} onChange={e => setMyHospital({...myHospital, available_beds: parseInt(e.target.value)})} />
                </div>
                <div>
                  <label className="text-[11px] font-medium text-muted-foreground mb-1.5 block">ICU Beds</label>
                  <input type="number" className="glass-input" value={myHospital.icu_available} onChange={e => setMyHospital({...myHospital, icu_available: parseInt(e.target.value)})} />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button type="submit" className="btn-primary py-3 px-10 md:w-auto" disabled={saving}>
                {saving ? "Saving Changes..." : "Update Live Hospital Status"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid md:grid-cols-4 gap-4">
        <div className="glass-card p-5">
          <div className="flex items-center gap-3 mb-2">
            <Activity className="h-4 w-4 text-primary" />
            <span className="text-xs text-muted-foreground uppercase tracking-wider">Total Records</span>
          </div>
          <div className="text-3xl font-bold text-foreground">{rows.length}</div>
        </div>
        <div className="glass-card p-5">
          <div className="flex items-center gap-3 mb-2">
            <Bed className="h-4 w-4 text-accent" />
            <span className="text-xs text-muted-foreground uppercase tracking-wider">Admitted</span>
          </div>
          <div className="text-3xl font-bold text-accent">{stats.admitted}</div>
        </div>
        <div className="glass-card p-5">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="h-4 w-4 text-yellow-400" />
            <span className="text-xs text-muted-foreground uppercase tracking-wider">Waiting</span>
          </div>
          <div className="text-3xl font-bold text-yellow-400">{stats.waiting}</div>
        </div>
        <div className="glass-card p-5">
          <div className="flex items-center gap-3 mb-2">
            <UserCircle className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground uppercase tracking-wider">Discharged</span>
          </div>
          <div className="text-3xl font-bold text-muted-foreground">{stats.discharged}</div>
        </div>
      </div>

      <div className="glass-card p-6">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
          <Building2 className="h-4 w-4 text-primary" /> Hospital Bed Availability
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
          {totalBeds.map(h => (
            <div key={h.name} className="p-4 rounded-lg border border-border/30" style={{ background: "hsla(210, 50%, 95%, 0.04)" }}>
              <p className="text-sm font-medium text-foreground mb-2 truncate">{h.name}</p>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Beds</span>
                <span className="font-bold text-primary">{h.available}</span>
              </div>
              <div className="flex justify-between text-xs mt-1">
                <span className="text-muted-foreground">ICU</span>
                <span className="font-bold text-accent">{h.icu}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="glass-card p-6">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
          <Stethoscope className="h-4 w-4 text-primary" /> Hospital · Doctor · Patient Records
          <Badge className="bg-primary/15 text-primary border-primary/30 text-[10px] ml-2">Verified</Badge>
        </h3>
        <div className="overflow-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-border/50">
                <TableHead className="text-muted-foreground">Hospital</TableHead>
                <TableHead className="text-muted-foreground text-center">Beds</TableHead>
                <TableHead className="text-muted-foreground">Doctor</TableHead>
                <TableHead className="text-muted-foreground">Patient</TableHead>
                <TableHead className="text-muted-foreground text-center">Status</TableHead>
                <TableHead className="text-muted-foreground text-center">Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading && (
                <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">Loading...</TableCell></TableRow>
              )}
              {rows.map(r => (
                <TableRow key={r.id} className="border-border/30 hover:bg-transparent">
                  <TableCell>
                    <div className="font-medium text-foreground text-sm">{r.hospital_name}</div>
                    <div className="text-xs text-muted-foreground">{r.city}</div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="text-sm font-bold text-primary">{r.available_beds}/{r.total_beds}</div>
                    <div className="text-[10px] text-accent">ICU {r.icu_available}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-foreground text-sm">{r.doctor_name}</div>
                    <div className="text-xs text-muted-foreground">{r.specialty}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-foreground text-sm">{r.patient_name}</div>
                    <div className="text-xs text-muted-foreground">{r.age}y · {r.blood_group}</div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline" className={`${statusBadge(r.status)} text-xs capitalize`}>{r.status}</Badge>
                  </TableCell>
                  <TableCell className="text-center text-xs text-muted-foreground">{formatTime(r.admitted_at)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default AvailabilityView;
