import { Activity } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-border px-6 md:px-12 py-12" style={{ background: "hsla(207, 100%, 4%, 0.6)" }}>
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Activity className="h-5 w-5 text-primary" />
              <span className="font-bold text-foreground">EmergencyConnect</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Precision emergency routing through real-time hospital data integration across Chennai.
            </p>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-3">Platform</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/features" className="hover:text-primary transition-colors">Features</Link></li>
              <li><Link to="/how-it-works" className="hover:text-primary transition-colors">How it Works</Link></li>
              <li><Link to="/compliance" className="hover:text-primary transition-colors">Compliance</Link></li>
              <li><Link to="/api-docs" className="hover:text-primary transition-colors">API Docs</Link></li>
            </ul>
          </div>

          {/* Portals */}
          <div>
            <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-3">Portals</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/patient-portal" className="hover:text-primary transition-colors">Patient Portal</Link></li>
              <li><Link to="/hospital-portal" className="hover:text-primary transition-colors">Hospital Portal</Link></li>
              <li><Link to="/ambulance-tracking" className="hover:text-primary transition-colors">Ambulance Tracking</Link></li>
              <li><Link to="/admin-dashboard" className="hover:text-primary transition-colors">Admin Dashboard</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-3">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
              <li><Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">© 2026 EmergencyConnect. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors text-xs">LinkedIn</a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors text-xs">Twitter</a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors text-xs">GitHub</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
