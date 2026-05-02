import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import Features from "./pages/marketing/Features.tsx";
import About from "./pages/marketing/About.tsx";
import Contact from "./pages/marketing/Contact.tsx";
import HowItWorks from "./pages/marketing/HowItWorks.tsx";
import Compliance from "./pages/marketing/Compliance.tsx";
import ApiDocs from "./pages/marketing/ApiDocs.tsx";
import Portal from "./pages/marketing/Portals.tsx";
import Privacy from "./pages/marketing/Privacy.tsx";
import Terms from "./pages/marketing/Terms.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/features" element={<Features />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/compliance" element={<Compliance />} />
          <Route path="/api-docs" element={<ApiDocs />} />
          <Route path="/patient-portal" element={<Portal kind="patient" />} />
          <Route path="/hospital-portal" element={<Portal kind="hospital" />} />
          <Route path="/ambulance-tracking" element={<Portal kind="ambulance" />} />
          <Route path="/admin-dashboard" element={<Portal kind="admin" />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
