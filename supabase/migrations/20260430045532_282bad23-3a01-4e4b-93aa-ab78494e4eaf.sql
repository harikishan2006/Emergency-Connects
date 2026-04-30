-- Hospitals
CREATE TABLE public.hospitals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  total_beds INT NOT NULL DEFAULT 0,
  available_beds INT NOT NULL DEFAULT 0,
  icu_available INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Doctors
CREATE TABLE public.doctors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  hospital_id UUID NOT NULL REFERENCES public.hospitals(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  specialty TEXT NOT NULL,
  on_duty BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Patients
CREATE TABLE public.patients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  age INT NOT NULL,
  blood_group TEXT NOT NULL,
  condition TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Admissions (join: hospital + doctor + patient + status). Duplicates allowed.
CREATE TABLE public.admissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  hospital_id UUID NOT NULL REFERENCES public.hospitals(id) ON DELETE CASCADE,
  doctor_id UUID NOT NULL REFERENCES public.doctors(id) ON DELETE CASCADE,
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('admitted','waiting','discharged')),
  admitted_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.hospitals  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctors    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patients   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admissions ENABLE ROW LEVEL SECURITY;

-- Authenticated users can read all (operational data for hospital staff portal)
CREATE POLICY "Authenticated read hospitals"  ON public.hospitals  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated read doctors"    ON public.doctors    FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated read patients"   ON public.patients   FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated read admissions" ON public.admissions FOR SELECT TO authenticated USING (true);

-- Seed sample data
INSERT INTO public.hospitals (id, name, city, total_beds, available_beds, icu_available) VALUES
  ('11111111-1111-1111-1111-111111111111','Apollo Hospitals','Chennai',300,42,8),
  ('22222222-2222-2222-2222-222222222222','Fortis Malar','Chennai',180,15,3),
  ('33333333-3333-3333-3333-333333333333','MIOT International','Chennai',250,28,6),
  ('44444444-4444-4444-4444-444444444444','Kauvery Hospital','Trichy',120,9,2);

INSERT INTO public.doctors (id, hospital_id, name, specialty, on_duty) VALUES
  ('aaaaaaa1-0000-0000-0000-000000000001','11111111-1111-1111-1111-111111111111','Dr. Vijay Kishore','Cardiology',true),
  ('aaaaaaa1-0000-0000-0000-000000000002','11111111-1111-1111-1111-111111111111','Dr. Meera Raghavan','Trauma & Emergency',true),
  ('aaaaaaa1-0000-0000-0000-000000000003','22222222-2222-2222-2222-222222222222','Dr. Arjun Menon','Neurology',false),
  ('aaaaaaa1-0000-0000-0000-000000000004','22222222-2222-2222-2222-222222222222','Dr. Priya Iyer','Pediatrics',true),
  ('aaaaaaa1-0000-0000-0000-000000000005','33333333-3333-3333-3333-333333333333','Dr. Sanjay Gupta','Orthopedics',true),
  ('aaaaaaa1-0000-0000-0000-000000000006','44444444-4444-4444-4444-444444444444','Dr. Lakshmi Rao','General Medicine',true);

INSERT INTO public.patients (id, name, age, blood_group, condition) VALUES
  ('bbbbbbb1-0000-0000-0000-000000000001','Rajesh Kumar',45,'O+','Chest pain'),
  ('bbbbbbb1-0000-0000-0000-000000000002','Anitha Sharma',32,'A+','Road accident'),
  ('bbbbbbb1-0000-0000-0000-000000000003','Suresh Babu',58,'B-','Stroke symptoms'),
  ('bbbbbbb1-0000-0000-0000-000000000004','Karthik Subramanian',8,'AB+','High fever'),
  ('bbbbbbb1-0000-0000-0000-000000000005','Divya Krishnan',27,'O-','Fracture'),
  ('bbbbbbb1-0000-0000-0000-000000000006','Mohan Raj',62,'A-','Diabetic emergency');

-- Admissions (intentional duplicate combinations allowed)
INSERT INTO public.admissions (hospital_id, doctor_id, patient_id, status, admitted_at) VALUES
  ('11111111-1111-1111-1111-111111111111','aaaaaaa1-0000-0000-0000-000000000001','bbbbbbb1-0000-0000-0000-000000000001','admitted', now() - interval '2 hours'),
  ('11111111-1111-1111-1111-111111111111','aaaaaaa1-0000-0000-0000-000000000002','bbbbbbb1-0000-0000-0000-000000000002','admitted', now() - interval '45 minutes'),
  ('22222222-2222-2222-2222-222222222222','aaaaaaa1-0000-0000-0000-000000000003','bbbbbbb1-0000-0000-0000-000000000003','waiting',  now() - interval '20 minutes'),
  ('22222222-2222-2222-2222-222222222222','aaaaaaa1-0000-0000-0000-000000000004','bbbbbbb1-0000-0000-0000-000000000004','admitted', now() - interval '5 hours'),
  ('33333333-3333-3333-3333-333333333333','aaaaaaa1-0000-0000-0000-000000000005','bbbbbbb1-0000-0000-0000-000000000005','discharged', now() - interval '1 day'),
  ('44444444-4444-4444-4444-444444444444','aaaaaaa1-0000-0000-0000-000000000006','bbbbbbb1-0000-0000-0000-000000000006','admitted', now() - interval '3 hours'),
  -- duplicates: same patient/doctor/hospital combos
  ('11111111-1111-1111-1111-111111111111','aaaaaaa1-0000-0000-0000-000000000001','bbbbbbb1-0000-0000-0000-000000000001','discharged', now() - interval '10 days'),
  ('11111111-1111-1111-1111-111111111111','aaaaaaa1-0000-0000-0000-000000000002','bbbbbbb1-0000-0000-0000-000000000002','waiting', now() - interval '15 minutes'),
  ('33333333-3333-3333-3333-333333333333','aaaaaaa1-0000-0000-0000-000000000005','bbbbbbb1-0000-0000-0000-000000000005','admitted', now() - interval '6 hours');