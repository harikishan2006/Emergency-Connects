import { ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Footer from "@/components/Footer";
import hospitalBg from "@/assets/hospital-bg.jpg";
import BrandLogo from "@/components/BrandLogo";

interface PageShellProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

const PageShell = ({ title, subtitle, children }: PageShellProps) => {
  const navigate = useNavigate();
  return (
    <div className="relative min-h-screen">
      <div className="fixed inset-0 -z-10">
        <img src={hospitalBg} alt="" className="w-full h-full object-cover" width={1920} height={1080} />
        <div className="absolute inset-0" style={{ background: "rgba(0, 20, 40, 0.85)" }} />
      </div>

      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-4"
        style={{ background: "hsla(207, 100%, 8%, 0.6)", backdropFilter: "blur(12px)" }}>
        <Link to="/">
          <BrandLogo />
        </Link>
        <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
          <Link to="/features" className="hover:text-primary transition-colors duration-300">Features</Link>
          <Link to="/how-it-works" className="hover:text-primary transition-colors duration-300">How It Works</Link>
          <Link to="/about" className="hover:text-primary transition-colors duration-300">About</Link>
          <Link to="/contact" className="hover:text-primary transition-colors duration-300">Contact</Link>
        </div>
        <button onClick={() => navigate("/")} className="btn-outline text-xs md:text-sm">
          Home
        </button>
      </nav>

      <main className="pt-32 pb-20 px-6 md:px-12 max-w-6xl mx-auto animate-fade-in">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors mb-6">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground mb-4 animate-fade-slide-up">
          {title}
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mb-12 animate-fade-slide-up-delay-1">
          {subtitle}
        </p>
        <div className="animate-fade-slide-up-delay-2">{children}</div>
      </main>

      <Footer />
    </div>
  );
};

export default PageShell;