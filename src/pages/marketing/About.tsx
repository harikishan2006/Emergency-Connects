import PageShell from "./PageShell";

const About = () => (
  <PageShell title="About Us" subtitle="EmergencyConnect is a healthcare coordination platform built to save lives in the critical first minutes of an emergency.">
    <div className="grid md:grid-cols-2 gap-8">
      <div className="glass-card p-8">
        <h3 className="text-xl font-bold text-foreground mb-3">Our Mission</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          To eliminate delays in emergency care by connecting patients, ambulances, and hospitals
          through real-time data — so every second counts toward saving a life.
        </p>
      </div>
      <div className="glass-card p-8">
        <h3 className="text-xl font-bold text-foreground mb-3">Our Vision</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          A future where no patient is turned away because of unavailable beds, and no ambulance
          arrives at the wrong hospital. Precision routing, powered by data.
        </p>
      </div>
      <div className="glass-card p-8 md:col-span-2">
        <h3 className="text-xl font-bold text-foreground mb-3">The Team</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          We're a team of doctors, engineers, and emergency responders headquartered in Chennai,
          partnering with leading hospitals across India to make emergency care faster and smarter.
        </p>
      </div>
    </div>
  </PageShell>
);

export default About;