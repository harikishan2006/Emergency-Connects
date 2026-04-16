

## Plan: Real Email Verification via Lovable Cloud

Currently, your app simulates verification by showing the code in a toast notification — no real email is sent. To send actual verification codes to users' Gmail inboxes, we need a backend email service.

### Recommended Approach: Enable Lovable Cloud

Lovable Cloud provides built-in authentication with real email verification — no external accounts or API keys needed.

### What Changes

1. **Enable Lovable Cloud** — this sets up a real database and auth system behind your app
2. **Replace simulated registration** with real Supabase Auth signup (sends a real verification email to the user's Gmail)
3. **Replace simulated login** with real Supabase Auth sign-in with email OTP verification
4. **Update VerifyView** to confirm the OTP code against the real auth system instead of matching a local variable
5. **Update Index.tsx** routing to use real auth session state

### What the User Experiences

- Register → receives a **real email** in their Gmail inbox with a verification code
- Login → receives a **real email** with an OTP code to confirm identity
- No more demo toast with the code — it arrives in their actual inbox

### Technical Details

- Uses Supabase Auth's built-in email provider (works out of the box)
- `supabase.auth.signUp()` for registration with email confirmation
- `supabase.auth.signInWithOtp()` for login verification
- `supabase.auth.verifyOtp()` in the VerifyView to confirm codes
- Auth state managed via `onAuthStateChange` listener
- Patient and Hospital user types tracked via a profiles table

### Files Modified

- `src/pages/Index.tsx` — auth session management
- `src/components/RegisterView.tsx` — real signup
- `src/components/PatientRegisterView.tsx` — real signup
- `src/components/LoginView.tsx` — real OTP login
- `src/components/VerifyView.tsx` — real OTP verification
- New: auth context/hook for session state

### Prerequisites

Lovable Cloud must be enabled on this project first. Once approved, I'll enable it and implement the full flow.

