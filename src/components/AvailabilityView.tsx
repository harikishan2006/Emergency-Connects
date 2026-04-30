import { useEffect, useState } from "react";
import { Bed, Building2, Stethoscope, UserCircle, Clock, Activity } from "lucide-react";
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

const AvailabilityView = () => {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

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
    };
    load();
  }, []);

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
      {/* Summary cards */}
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

      {/* Hospital availability snapshot */}
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

      {/* Combined records table */}
      <div className="glass-card p-6">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
          <Stethoscope className="h-4 w-4 text-primary" /> Hospital · Doctor · Patient Records
          <Badge className="bg-primary/15 text-primary border-primary/30 text-[10px] ml-2">Duplicates allowed</Badge>
        </h3>
        <div className="overflow-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-border/50">
                <TableHead className="text-muted-foreground">Hospital</TableHead>
                <TableHead className="text-muted-foreground text-center">Beds</TableHead>
                <TableHead className="text-muted-foreground">Doctor</TableHead>
                <TableHead className="text-muted-foreground">Patient</TableHead>
                <TableHead className="text-muted-foreground">Condition</TableHead>
                <TableHead className="text-muted-foreground text-center">Status</TableHead>
                <TableHead className="text-muted-foreground text-center">Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading && (
                <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-8">Loading...</TableCell></TableRow>
              )}
              {!loading && rows.length === 0 && (
                <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-8">No records found</TableCell></TableRow>
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
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      {r.specialty}
                      <span className={`h-1.5 w-1.5 rounded-full ${r.on_duty ? "bg-accent" : "bg-muted-foreground"}`} />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-foreground text-sm">{r.patient_name}</div>
                    <div className="text-xs text-muted-foreground">{r.age}y · {r.blood_group}</div>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">{r.condition}</TableCell>
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
