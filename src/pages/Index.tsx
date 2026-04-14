import { useState } from "react";
import hospitalBg from "@/assets/hospital-bg.jpg";
import LandingView from "@/components/LandingView";
import LoginView from "@/components/LoginView";
import RegistrationChooser from "@/components/RegistrationChooser";
import RegisterView from "@/components/RegisterView";
import PatientRegisterView from "@/components/PatientRegisterView";
import VerifyView from "@/components/VerifyView";
import DashboardView from "@/components/DashboardView";

type View = "landing" | "login" | "chooseRegister" | "register" | "patientRegister" | "verify" | "patientVerify" | "loginVerify" | "dashboard";

const Index = () => {
  const [view, setView] = useState<View>("landing");
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");

  return (
    <div className="relative min-h-screen">
      <div className="fixed inset-0 -z-10">
        <img src={hospitalBg} alt="" className="w-full h-full object-cover" width={1920} height={1080} />
        <div className="absolute inset-0" style={{ background: "rgba(0, 20, 40, 0.82)" }} />
      </div>

      {view === "landing" && <LandingView onNavigate={setView as any} />}
      {view === "login" && <LoginView onNavigate={setView as any} onSetEmail={setEmail} onSetVerificationCode={setVerificationCode} />}
      {view === "chooseRegister" && <RegistrationChooser onNavigate={setView as any} />}
      {view === "register" && <RegisterView onNavigate={setView as any} onSetEmail={setEmail} onSetVerificationCode={setVerificationCode} />}
      {view === "patientRegister" && <PatientRegisterView onNavigate={setView as any} onSetEmail={setEmail} onSetVerificationCode={setVerificationCode} />}
      {view === "verify" && <VerifyView email={email} verificationCode={verificationCode} onNavigate={setView as any} />}
      {view === "patientVerify" && <VerifyView email={email} verificationCode={verificationCode} onNavigate={setView as any} />}
      {view === "loginVerify" && <VerifyView email={email} verificationCode={verificationCode} onNavigate={setView as any} />}
      {view === "dashboard" && <DashboardView onNavigate={setView as any} />}
    </div>
  );
};

export default Index;
