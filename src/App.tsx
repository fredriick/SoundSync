import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/providers/ThemeProvider";
import Index from "./pages/Index";
import Services from "./pages/Services";
import Marketplace from "./pages/Marketplace";
import Pricing from "./pages/Pricing";
import SignIn from "./pages/SignIn";
import GetStarted from "./pages/GetStarted";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import ServiceDetail from "./pages/ServiceDetail";
import ServicePlanDetail from "./pages/ServicePlanDetail";
import FullProductionDetail from "./pages/FullProductionDetail";
import Profile from "./pages/Profile";
import StripeSuccess from "./pages/StripeSuccess";
import UploadFiles from "./pages/UploadFiles";
import AboutUs from "./pages/AboutUs";
import Careers from "./pages/Careers";
import Contact from "./pages/Contact";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import CookiePolicy from "./pages/CookiePolicy";

// Admin imports
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./pages/admin/Dashboard";
import UserManagement from "./pages/admin/UserManagement";
import TracksManagement from "./pages/admin/TracksManagement";
import ServicesManagement from "./pages/admin/ServicesManagement";
import MarketplaceManagement from "./pages/admin/MarketplaceManagement";
import CarouselManagement from "./pages/admin/CarouselManagement";
import UsersManagement from "./pages/admin/UsersManagement";
import SellersManagement from "./pages/admin/SellersManagement";
import AdminManagement from "./pages/admin/AdminManagement";
import Settings from "./pages/admin/Settings";
import FooterManagement from "./pages/admin/FooterManagement";

const queryClient = new QueryClient();

const PageWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
    {children}
  </div>
);

const App = () => (
  <ThemeProvider defaultTheme="dark">
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<PageWrapper><Index /></PageWrapper>} />
            <Route path="/services" element={<PageWrapper><Services /></PageWrapper>} />
            <Route path="/services/:serviceSlug" element={<PageWrapper><ServiceDetail /></PageWrapper>} />
            <Route path="/service-plans/:plan" element={<PageWrapper><ServicePlanDetail /></PageWrapper>} />
            <Route path="/full-production-detail" element={<PageWrapper><FullProductionDetail /></PageWrapper>} />
            <Route path="/marketplace" element={<PageWrapper><Marketplace /></PageWrapper>} />
            <Route path="/pricing" element={<PageWrapper><Pricing /></PageWrapper>} />
            <Route path="/aboutus" element={<PageWrapper><AboutUs /></PageWrapper>} />
            <Route path="/contact" element={<PageWrapper><Contact /></PageWrapper>} />
            <Route path="/careers" element={<PageWrapper><Careers /></PageWrapper>} />
            <Route path="/terms" element={<PageWrapper><TermsOfService /></PageWrapper>} />
            <Route path="/privacy" element={<PageWrapper><PrivacyPolicy /></PageWrapper>} />
            <Route path="/cookies" element={<PageWrapper><CookiePolicy /></PageWrapper>} />
            <Route path="/sign-in" element={<PageWrapper><SignIn /></PageWrapper>} />
            <Route path="/get-started" element={<PageWrapper><GetStarted /></PageWrapper>} />
            <Route path="/dashboard" element={<PageWrapper><Dashboard /></PageWrapper>} />
            <Route path="/profile" element={<PageWrapper><Profile /></PageWrapper>} />
            <Route path="/payment-success" element={<PageWrapper><StripeSuccess /></PageWrapper>} />
            <Route path="/upload-files" element={<PageWrapper><UploadFiles /></PageWrapper>} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="sellers" element={<SellersManagement />} />
              <Route path="tracks" element={<TracksManagement />} />
              <Route path="services" element={<ServicesManagement />} />
              <Route path="marketplace" element={<MarketplaceManagement />} />
              <Route path="carousel" element={<CarouselManagement />} />
              <Route path="admins" element={<AdminManagement />} />
              <Route path="settings" element={<Settings />} />
              <Route path="footer" element={<FooterManagement />} />
            </Route>
            
            <Route path="*" element={<PageWrapper><NotFound /></PageWrapper>} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
