import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import hospitalBg from "@/assets/hospital-bg.jpg";
import LandingView from "@/components/LandingView";
import LoginView from "@/components/LoginView";
import RegistrationChooser from "@/components/RegistrationChooser";
import RegisterView from "@/components/RegisterView";
import PatientRegisterView from "@/components/PatientRegisterView";
import DashboardView from "@/components/DashboardView";
import DiseaseIntakeView from "@/components/DiseaseIntakeView";
import ResetPasswordView from "@/components/ResetPasswordView";
import BrandLogo from "@/components/BrandLogo";

type View = "landing" | "login" | "chooseRegister" | "register" | "patientRegister" | "intake" | "dashboard" | "resetPassword";

const Index = () => {
  const [view, setView] = useState<View>("landing");
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    // Single source of truth for auth-based navigation
    const handleNavigation = (session: any) => {
      if (!session) {
        // Only set to landing if we aren't already in an onboarding view
        setView(prev => ["login", "chooseRegister", "register", "patientRegister", "resetPassword"].includes(prev) ? prev : "landing");
        return;
      }

      const userType = session.user.user_metadata?.user_type;
      if (userType === "hospital") {
        setView("dashboard");
      } else {
        const hasIntake = !!localStorage.getItem("ec_intake");
        setView(hasIntake ? "dashboard" : "intake");
      }
    };

    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      handleNavigation(session);
      setTimeout(() => setCheckingAuth(false), 800);
    });

    // Listen for all auth events
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth Event:", event);
      
      if (event === "PASSWORD_RECOVERY") {
        setView("resetPassword");
      } else if (event === "SIGNED_IN" || event === "INITIAL_SESSION") {
        handleNavigation(session);
      } else if (event === "SIGNED_OUT") {
        setView("landing");
        localStorage.removeItem("ec_intake");
        localStorage.removeItem("ec_redirect_search");
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const renderView = () => {
    if (checkingAuth) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center space-y-4 bg-[#020817]">
          <BrandLogo iconClassName="h-12 w-12 animate-pulse text-primary" />
          <div className="flex flex-col items-center gap-1">
            <p className="text-primary font-black tracking-widest text-[10px] uppercase animate-pulse">Initializing Secure Session</p>
            <p className="text-muted-foreground text-[9px] uppercase tracking-tighter">EmergencyConnect TN Network</p>
          </div>
          <button 
            onClick={() => { localStorage.clear(); window.location.reload(); }}
            className="mt-8 text-[9px] text-muted-foreground hover:text-primary transition-colors underline underline-offset-4"
          >
            Stuck? Reset System Cache
          </button>
        </div>
      );
    }

    switch (view) {
      case "landing": return <LandingView onNavigate={setView as any} />;
      case "login": return <LoginView onNavigate={setView as any} />;
      case "chooseRegister": return <RegistrationChooser onNavigate={setView as any} />;
      case "register": return <RegisterView onNavigate={setView as any} />;
      case "patientRegister": return <PatientRegisterView onNavigate={setView as any} />;
      case "intake": return <DiseaseIntakeView onNavigate={setView as any} />;
      case "dashboard": return <DashboardView onNavigate={setView as any} />;
      case "resetPassword": return <ResetPasswordView onNavigate={setView as any} />;
      default: return <LandingView onNavigate={setView as any} />;
    }
  };

  return (
    <div className="relative min-h-screen selection:bg-primary/30 selection:text-white">
      {/* GLOBAL BACKGROUND SYSTEM */}
      <div className="fixed inset-0 -z-10">
        <img src={hospitalBg} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#020817]/95 via-[#020817]/85 to-[#020817]/95" />
      </div>
      
      {/* VIEW RENDERER */}
      <div className="relative z-10">
        {renderView()}
      </div>

      {/* TOASTER CONFIGURATION IS GLOBAL IN App.tsx */}
    </div>
  );
};

export default Index;
