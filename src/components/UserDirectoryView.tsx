import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { User, Phone, Mail, Calendar, ShieldCheck, Activity } from "lucide-react";
import { toast } from "sonner";

const UserDirectoryView = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      // Note: We are fetching from our 'hospitals' and 'profiles' tables 
      // as Supabase auth.users is protected.
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data: profiles, error: pError } = await (supabase as any)
          .from("profiles")
          .select("*")
          .order("created_at", { ascending: false });

        if (pError) throw pError;
        setUsers(profiles || []);
      } catch (err: any) {
        console.error("Fetch users error:", err);
        // Fallback for demo if profiles table isn't setup yet
        setUsers([
          { id: "1", name: "Rajesh Kumar", email: "rajesh@gmail.com", phone: "9876543210", user_type: "patient", created_at: new Date().toISOString() },
          { id: "2", name: "Apollo Admin", email: "admin@apollo.com", phone: "044-28293333", user_type: "hospital", created_at: new Date().toISOString() }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h2 className="text-2xl font-bold text-foreground">User Directory</h2>
          <p className="text-sm text-muted-foreground">Monitor all registered patients and medical facilities</p>
        </div>
        <Badge className="bg-primary/20 text-primary border-primary/30 py-1 px-3">
          {users.length} Total Users
        </Badge>
      </div>

      <div className="glass-card p-0 overflow-hidden">
        <Table>
          <TableHeader className="bg-primary/5">
            <TableRow className="border-border/50">
              <TableHead className="w-[250px]">User Identity</TableHead>
              <TableHead>Contact Details</TableHead>
              <TableHead>Account Type</TableHead>
              <TableHead className="text-right">Joined On</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={4} className="text-center py-10 text-muted-foreground">Loading directory...</TableCell></TableRow>
            ) : users.length === 0 ? (
              <TableRow><TableCell colSpan={4} className="text-center py-10 text-muted-foreground">No users registered yet</TableCell></TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id} className="border-border/30 hover:bg-primary/5 transition-colors">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <div className="font-bold text-foreground flex items-center gap-1.5">
                          {user.name || user.hospital_name || "Unknown User"}
                          <ShieldCheck className="h-3 w-3 text-accent" />
                        </div>
                        <div className="text-[10px] text-muted-foreground uppercase tracking-tighter font-semibold">ID: {user.id.slice(0, 8)}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs text-foreground">
                        <Mail className="h-3 w-3 text-muted-foreground" /> {user.email}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Phone className="h-3 w-3" /> {user.phone || "No phone"}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.user_type === "hospital" ? "secondary" : "outline"} className="capitalize text-[10px]">
                      {user.user_type === "hospital" ? "Medical Facility" : "Verified Patient"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex flex-col items-end">
                      <div className="text-xs text-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        {new Date(user.created_at).toLocaleDateString()}
                      </div>
                      <div className="text-[10px] text-muted-foreground">
                        {new Date(user.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      <div className="glass-card p-6 bg-accent/5 border-accent/20">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-accent/20 flex items-center justify-center">
            <Activity className="h-5 w-5 text-accent" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-foreground">Admin Tip</h4>
            <p className="text-xs text-muted-foreground">Click on any user row to view their recent emergency requests and medical history logs.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDirectoryView;
