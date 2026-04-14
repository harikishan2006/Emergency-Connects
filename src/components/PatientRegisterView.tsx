import { Activity, AlertCircle, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface PatientRegisterViewProps {
  onNavigate: (view: "landing" | "login" | "chooseRegister" | "patientVerify") => void;
  onSetEmail: (email: string) => void;
  onSetVerificationCode: (code: string) => void;
}

interface FormErrors {
  [key: string]: string;
}

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const genders = ["Male", "Female", "Other"];
const relationships = ["Spouse", "Parent", "Sibling", "Child", "Friend", "Other"];

const validatePatientForm = (form: Record<string, string>): FormErrors => {
  const errors: FormErrors = {};

  if (form.firstName.trim().length < 2) errors.firstName = "First name must be at least 2 characters";
  if (form.lastName.trim().length < 2) errors.lastName = "Last name must be at least 2 characters";

  if (!form.dob) {
    errors.dob = "Date of birth is required";
  } else {
    const age = (Date.now() - new Date(form.dob).getTime()) / (365.25 * 24 * 60 * 60 * 1000);
    if (age < 0 || age > 120) errors.dob = "Enter a valid date of birth";
  }

  if (!form.bloodGroup) errors.bloodGroup = "Please select your blood group";
  if (!form.gender) errors.gender = "Please select your gender";

  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailPattern.test(form.email.trim())) errors.email = "Enter a valid email address";

  const phonePattern = /^[6-9]\d{9}$/;
  if (!phonePattern.test(form.phone.replace(/\s/g, ""))) errors.phone = "Enter a valid 10-digit Indian mobile number";

  if (form.city.trim().length < 2) errors.city = "City is required";

  if (form.emergencyName.trim().length < 2) errors.emergencyName = "Emergency contact name is required";
  if (!form.emergencyRelation) errors.emergencyRelation = "Relationship is required";
  if (!phonePattern.test(form.emergencyPhone.replace(/\s/g, ""))) errors.emergencyPhone = "Enter a valid 10-digit mobile number";

  if (form.password.length < 8) errors.password = "Password must be at least 8 characters";
  else if (!/[A-Z]/.test(form.password)) errors.password = "Must contain at least one uppercase letter";
  else if (!/[0-9]/.test(form.password)) errors.password = "Must contain at least one number";

  return errors;
};

const PatientRegisterView = ({ onNavigate, onSetEmail, onSetVerificationCode }: PatientRegisterViewProps) => {
  const [form, setForm] = useState<Record<string, string>>({
    firstName: "", lastName: "", dob: "", bloodGroup: "", gender: "",
    email: "", phone: "", city: "",
    emergencyName: "", emergencyRelation: "", emergencyPhone: "",
    password: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const update = (key: string, val: string) => {
    setForm(f => ({ ...f, [key]: val }));
    if (errors[key]) setErrors(e => { const n = { ...e }; delete n[key]; return n; });
  };

  const handleBlur = (key: string) => {
    setTouched(t => ({ ...t, [key]: true }));
    const fieldErrors = validatePatientForm(form);
    if (fieldErrors[key]) setErrors(e => ({ ...e, [key]: fieldErrors[key] }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validatePatientForm(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      const allTouched: Record<string, boolean> = {};
      Object.keys(form).forEach(k => { allTouched[k] = true; });
      setTouched(allTouched);
      toast.error("Please fix the errors below before submitting");
      return;
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    onSetVerificationCode(code);
    onSetEmail(form.email);
    toast.success(`Verification code sent to ${form.email}`, { description: `Demo code: ${code}`, duration: 15000 });
    onNavigate("patientVerify");
  };

  const renderInput = (key: string, label: string, placeholder: string, type = "text", hint?: string) => (
    <div key={key}>
      <label className="text-xs font-medium text-muted-foreground mb-1.5 block">{label}</label>
      <input
        type={type}
        className={`glass-input ${errors[key] && touched[key] ? "!border-destructive/60" : ""}`}
        placeholder={placeholder}
        value={form[key]}
        onChange={e => update(key, e.target.value)}
        onBlur={() => handleBlur(key)}
      />
      {errors[key] && touched[key] ? (
        <p className="text-[11px] text-destructive mt-1 flex items-center gap-1"><AlertCircle className="h-3 w-3 flex-shrink-0" /> {errors[key]}</p>
      ) : hint && <p className="text-[10px] text-muted-foreground/60 mt-1">{hint}</p>}
    </div>
  );

  const renderSelect = (key: string, label: string, options: string[], placeholder: string) => (
    <div key={key}>
      <label className="text-xs font-medium text-muted-foreground mb-1.5 block">{label}</label>
      <select
        className={`glass-input ${errors[key] && touched[key] ? "!border-destructive/60" : ""}`}
        value={form[key]}
        onChange={e => update(key, e.target.value)}
        onBlur={() => handleBlur(key)}
      >
        <option value="" className="bg-card text-foreground">{placeholder}</option>
        {options.map(o => <option key={o} value={o} className="bg-card text-foreground">{o}</option>)}
      </select>
      {errors[key] && touched[key] && (
        <p className="text-[11px] text-destructive mt-1 flex items-center gap-1"><AlertCircle className="h-3 w-3 flex-shrink-0" /> {errors[key]}</p>
      )}
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-20 animate-fade-in">
      <div className="glass-card p-8 md:p-10 w-full max-w-lg animate-fade-slide-up">
        <button onClick={() => onNavigate("chooseRegister")} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors duration-300 mb-6">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <div className="flex items-center gap-2 mb-6">
          <Activity className="h-6 w-6 text-primary" />
          <span className="text-lg font-bold text-foreground">EmergencyConnect</span>
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Patient Registration</h2>
        <p className="text-sm text-muted-foreground mb-8">Create your personal emergency profile</p>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <h3 className="text-xs font-semibold text-primary uppercase tracking-wider pt-2">Personal Information</h3>
          <div className="grid grid-cols-2 gap-4">
            {renderInput("firstName", "First Name", "Rajesh")}
            {renderInput("lastName", "Last Name", "Kumar")}
          </div>
          {renderInput("dob", "Date of Birth", "", "date")}
          <div className="grid grid-cols-2 gap-4">
            {renderSelect("bloodGroup", "Blood Group", bloodGroups, "Select blood group")}
            {renderSelect("gender", "Gender", genders, "Select gender")}
          </div>

          <h3 className="text-xs font-semibold text-primary uppercase tracking-wider pt-4">Contact Details</h3>
          {renderInput("email", "Email Address", "rajesh@gmail.com", "email")}
          {renderInput("phone", "Mobile Number", "9876543210", "tel", "10-digit Indian mobile number")}
          {renderInput("city", "City", "Chennai")}

          <h3 className="text-xs font-semibold text-primary uppercase tracking-wider pt-4">Emergency Contact</h3>
          {renderInput("emergencyName", "Contact Name", "Priya Kumar")}
          {renderSelect("emergencyRelation", "Relationship", relationships, "Select relationship")}
          {renderInput("emergencyPhone", "Contact Phone", "9876543211", "tel")}

          <h3 className="text-xs font-semibold text-primary uppercase tracking-wider pt-4">Security</h3>
          {renderInput("password", "Password", "••••••••", "password", "Min 8 chars, 1 uppercase, 1 number")}

          <button type="submit" className="btn-primary mt-2">Register</button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already registered?{" "}
          <button onClick={() => onNavigate("login")} className="text-primary font-medium hover:underline">Sign in</button>
        </p>
      </div>
    </div>
  );
};

export default PatientRegisterView;
