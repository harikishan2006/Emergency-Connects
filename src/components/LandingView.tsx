import { Activity, BarChart3, ShieldCheck, Users } from "lucide-react";
import { Link } from "react-router-dom";
import Footer from "@/components/Footer";
import BrandLogo from "@/components/BrandLogo";

interface LandingViewProps {
  onNavigate: (view: "login" | "chooseRegister") => void;
}

const pillars = [
  {
    icon: Activity,
    title: "Real-time Updates",
    desc: "Facilitates immediate hospital capacity changes, empowering hospitals to respond swiftly during high-demand situations.",
  },
  {
    icon: Users,
    title: "User Integration",
    desc: "Engages users through accessible interfaces, ensuring they can efficiently communicate symptoms and locations.",
  },
  {
    icon: BarChart3,
    title: "Data Analytics",
    desc: "Utilizes hospital performance data for improving patient routing decisions.",
  },
  {
    icon: ShieldCheck,
    title: "Regulatory Compliance",
    desc: "Ensures adherence to health regulations by integrating automated tracking.",
  },
];

const LandingView = ({ onNavigate }: LandingViewProps) => {
  return (
    <div className="animate-fade-in">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-4"
        style={{ background: "hsla(207, 100%, 8%, 0.6)", backdropFilter: "blur(12px)" }}>
        <BrandLogo />
        <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
          <Link to="/features" className="hover:text-primary transition-colors duration-300">Features</Link>
          <Link to="/how-it-works" className="hover:text-primary transition-colors duration-300">How It Works</Link>
          <Link to="/about" className="hover:text-primary transition-colors duration-300">About</Link>
          <Link to="/contact" className="hover:text-primary transition-colors duration-300">Contact</Link>
        </div>
        <button onClick={() => onNavigate("login")} className="btn-outline text-xs md:text-sm">
          Hospital Portal
        </button>
      </nav>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center text-center px-6 pt-20">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground animate-fade-slide-up leading-tight">
            Precision Emergency<br />
            <span className="text-primary">Routing.</span>
          </h1>
          <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-xl mx-auto animate-fade-slide-up-delay-1">
            Saving lives through real-time data and hospital integration.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center animate-fade-slide-up-delay-2">
            <button onClick={() => onNavigate("chooseRegister")} className="btn-primary">
              Get Started
            </button>
            <button onClick={() => onNavigate("login")} className="btn-outline">
              Sign In
            </button>
          </div>
        </div>
      </section>

      {/* Pillars */}
      <section id="features" className="px-6 md:px-12 py-24 max-w-6xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-4 animate-fade-slide-up">
          Core Pillars
        </h2>
        <p className="text-muted-foreground text-center mb-16 max-w-lg mx-auto animate-fade-slide-up-delay-1">
          Built on four foundational principles to ensure rapid, reliable emergency response.
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((p, i) => (
            <div key={p.title} className={`glass-card p-6 animate-fade-slide-up-delay-${Math.min(i, 3)}`}>
              <div className="h-12 w-12 rounded-lg flex items-center justify-center mb-4"
                style={{ background: "hsla(190, 80%, 50%, 0.12)" }}>
                <p.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">{p.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingView;
