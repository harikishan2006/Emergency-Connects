import { Mail, MapPin, Phone } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import PageShell from "./PageShell";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill in all fields");
      return;
    }
    toast.success("Message sent! We'll get back to you within 24 hours.");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <PageShell title="Contact Us" subtitle="Reach out for hospital partnerships, patient support, or general questions.">
      <div className="grid md:grid-cols-3 gap-6 mb-10">
        <div className="glass-card p-6 flex items-start gap-3">
          <Mail className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-foreground text-sm">Email</h4>
            <p className="text-xs text-muted-foreground mt-1">support@emergencyconnect.in</p>
          </div>
        </div>
        <div className="glass-card p-6 flex items-start gap-3">
          <Phone className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-foreground text-sm">Phone</h4>
            <p className="text-xs text-muted-foreground mt-1">+91 44 1234 5678</p>
          </div>
        </div>
        <div className="glass-card p-6 flex items-start gap-3">
          <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-foreground text-sm">Office</h4>
            <p className="text-xs text-muted-foreground mt-1">Anna Salai, Chennai 600002</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="glass-card p-8 max-w-2xl space-y-5">
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Name</label>
          <input className="glass-input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Your full name" />
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Email</label>
          <input type="email" className="glass-input" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="you@gmail.com" />
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Message</label>
          <textarea rows={5} className="glass-input resize-none" value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} placeholder="How can we help?" />
        </div>
        <button type="submit" className="btn-primary">Send Message</button>
      </form>
    </PageShell>
  );
};

export default Contact;