import { useState } from "react";
import hospitalBg from "@/assets/hospital-bg.jpg";
import LandingView from "@/components/LandingView";
import LoginView from "@/components/LoginView";
import RegisterView from "@/components/RegisterView";
import VerifyView from "@/components/VerifyView";
import DashboardView from "@/components/DashboardView";

type View = "landing" | "login" | "register" | "verify" | "dashboard";

const Index = () => {
  const [view, setView] = useState<View>("landing");
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");

  return (
    <div className="relative min-h-screen">
      {/* Fixed background */}
      <div className="fixed inset-0 -z-10">
        <img src={hospitalBg} alt="" className="w-full h-full object-cover" width={1920} height={1080} />
        <div className="absolute inset-0" style={{ background: "rgba(0, 20, 40, 0.82)" }} />
      </div>

      {view === "landing" && <LandingView onNavigate={setView} />}
      {view === "login" && <LoginView onNavigate={setView} />}
      {view === "register" && <RegisterView onNavigate={setView} onSetEmail={setEmail} onSetVerificationCode={setVerificationCode} />}
      {view === "verify" && <VerifyView email={email} verificationCode={verificationCode} onNavigate={setView} />}
      {view === "dashboard" && <DashboardView onNavigate={setView} />}
    </div>
  );
};

export default Index;
