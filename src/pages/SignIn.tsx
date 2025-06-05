import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { toast } from "@/components/ui/use-toast";
import { FaGoogle } from "react-icons/fa";

// Admin credentials for demo purposes - hidden from UI but still usable
const ADMIN_CREDENTIALS = [
  { email: "admin@example.com", password: "admin123", role: "admin" },
  { email: "superadmin@example.com", password: "super123", role: "superadmin" }
];

export default function SignIn() {
  const [showPassword, setShowPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = React.useState(false);
  const [formData, setFormData] = React.useState({
    email: "",
    password: "",
  });
  const [isFormValid, setIsFormValid] = React.useState(false);
  const [hasPendingServicePurchase, setHasPendingServicePurchase] = React.useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get return path if any
  const returnTo = location.state?.returnTo || "/dashboard";

  useEffect(() => {
    // Check for pending service purchase or checkout
    const pendingServicePurchase = localStorage.getItem('pendingServicePurchase');
    const pendingCheckout = localStorage.getItem('pendingCheckout');
    
    if (pendingServicePurchase === 'true' || pendingCheckout === 'true') {
      setHasPendingServicePurchase(true);
    }
  }, []);

  // Validate form
  useEffect(() => {
    setIsFormValid(formData.email.trim() !== "" && formData.password.trim() !== "" && formData.password.length >= 6);
  }, [formData.email, formData.password]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      
      // Simple validation
      if (!formData.email || !formData.password) {
        toast({
          title: "Error",
          description: "Please fill in all fields",
          variant: "destructive",
        });
        return;
      }
      
      // Check if this is an admin login
      const adminMatch = ADMIN_CREDENTIALS.find(
        cred => cred.email === formData.email && cred.password === formData.password
      );
      
      if (adminMatch) {
        // Check admin status in localStorage
        const adminUsers = localStorage.getItem('adminUsers');
        if (adminUsers) {
          try {
            const parsedAdmins = JSON.parse(adminUsers);
            const adminUser = parsedAdmins.find((admin: any) => admin.email === formData.email);
            
            if (adminUser && adminUser.status === "inactive") {
              toast({
                title: "Access Denied",
                description: "Your admin account has been deactivated. Please contact a superadmin.",
                variant: "destructive",
              });
              return;
            }
            
            // If admin is found and active, set up admin user
            if (adminUser && adminUser.status === "active") {
              const loggedInAdmin = {
                id: adminUser.id || "mock-user-id",
                isSignedIn: true,
                name: adminUser.name || (adminMatch.role === "admin" ? "Admin User" : "Super Admin"),
                email: formData.email,
                role: adminUser.role || adminMatch.role,
                avatar: adminUser.avatar || `https://i.pravatar.cc/150?u=${formData.email}`
              };
              
              // Update admin's last login time
              const updatedAdmins = parsedAdmins.map((admin: any) => {
                if (admin.email === formData.email) {
                  return { ...admin, lastLogin: new Date().toISOString() };
                }
                return admin;
              });
              
              // Save updated admin list with login time
              localStorage.setItem('adminUsers', JSON.stringify(updatedAdmins));
              
              // Save to localStorage
              localStorage.setItem('mockUser', JSON.stringify(loggedInAdmin));
              
              // Dispatch event to notify components of user update
              window.dispatchEvent(new Event('mockUserUpdated'));
              
              toast({
                title: "Admin Login Successful",
                description: `Welcome back, ${loggedInAdmin.name}!`,
              });
              
              // Navigate to admin dashboard
              navigate("/admin");
              return;
            }
          } catch (e) {
            console.error("Error parsing admin data:", e);
          }
        }
        
        // If admin wasn't found in localStorage or there was an error, use default behavior
        // Set up admin user with default values
        const adminUser = {
          id: "mock-user-id",
          isSignedIn: true,
          name: adminMatch.role === "admin" ? "Admin User" : "Super Admin",
          email: formData.email,
          role: adminMatch.role
        };
        
        // Save to localStorage
        localStorage.setItem('mockUser', JSON.stringify(adminUser));
        
        // Dispatch event to notify components of user update
        window.dispatchEvent(new Event('mockUserUpdated'));
        
        toast({
          title: "Admin Login Successful",
          description: `Welcome back, ${adminUser.name}!`,
        });
        
        // Navigate to admin dashboard
        navigate("/admin");
        return;
      }
      
      // Regular user login if not an admin
      const mockUser = {
        isSignedIn: true,
        name: "John Doe",
        email: formData.email,
        avatar: `https://i.pravatar.cc/150?u=${formData.email}`
      };
      
      // Save to localStorage
      localStorage.setItem('mockUser', JSON.stringify(mockUser));
      
      // Dispatch event to notify components of user update
      window.dispatchEvent(new Event('mockUserUpdated'));
      
      // Successful login simulation
      toast({
        title: "Success",
        description: "You have successfully signed in!",
      });
      
      // Check for pending service purchase
      const pendingServicePurchase = localStorage.getItem('pendingServicePurchase');
      const pendingServiceSlug = localStorage.getItem('pendingServiceSlug');
      const pendingCheckout = localStorage.getItem('pendingCheckout');
      
      if (pendingServicePurchase === 'true' && pendingServiceSlug) {
        // Clear the pending flags but keep the slug for the redirect
        localStorage.removeItem('pendingServicePurchase');
        
        // Show success toast
        toast({
          title: "Sign in successful",
          description: "Redirecting you back to complete your service purchase.",
        });
        
        // Redirect back to the service detail page
        navigate(`/services/${pendingServiceSlug}`);
      } else if (pendingCheckout === 'true') {
        // Clear the pending checkout flag
        localStorage.removeItem('pendingCheckout');
        
        // Show success toast
        toast({
          title: "Sign in successful",
          description: "Redirecting you back to complete your purchase.",
        });
        
        // Redirect back to cart to complete checkout
        navigate('/cart');
      } else {
        // Navigate to return path or dashboard
        navigate(returnTo);
      }
    }, 1500);
  };

  const handleGoogleSignIn = () => {
    setIsGoogleLoading(true);
    
    // Simulate Google authentication
    setTimeout(() => {
      setIsGoogleLoading(false);
      
      // Create mock user with Google profile
      const googleUser = {
        isSignedIn: true,
        name: "John Smith",
        email: "jsmith@gmail.com",
        avatar: "https://i.pravatar.cc/150?u=googleuser",
        provider: "google"
      };
      
      // Save to localStorage
      localStorage.setItem('mockUser', JSON.stringify(googleUser));
      
      // Dispatch event to notify components of user update
      window.dispatchEvent(new Event('mockUserUpdated'));
      
      // Success toast
      toast({
        title: "Google Sign In Successful",
        description: "You have successfully signed in with Google!",
      });
      
      // Check for pending service purchase
      const pendingServicePurchase = localStorage.getItem('pendingServicePurchase');
      const pendingServiceSlug = localStorage.getItem('pendingServiceSlug');
      const pendingCheckout = localStorage.getItem('pendingCheckout');
      
      if (pendingServicePurchase === 'true' && pendingServiceSlug) {
        // Clear the pending flags but keep the slug for the redirect
        localStorage.removeItem('pendingServicePurchase');
        navigate(`/services/${pendingServiceSlug}`);
      } else if (pendingCheckout === 'true') {
        // Clear the pending checkout flag
        localStorage.removeItem('pendingCheckout');
        navigate('/cart');
      } else {
        // Navigate to return path or dashboard
        navigate(returnTo);
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-beatforge-950 to-beatforge-900">
      <Navbar />
      <div className="container px-4 py-16 mx-auto">
        <div className="max-w-md mx-auto space-y-6 animate-in slide-in-from-bottom-4 duration-1000">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-white">Welcome back</h1>
            <p className="text-beatforge-200">
              Sign in to continue to SoundSync
              {hasPendingServicePurchase && " and complete your purchase"}
            </p>
          </div>

          <form id="sign-in-form" onSubmit={handleSubmit} className="p-6 space-y-4 bg-background/80 backdrop-blur-lg rounded-lg border border-beatforge-800">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground/90" htmlFor="email">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="email"
                    placeholder="Enter your email"
                    type="email"
                    className="pl-10"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground/90" htmlFor="password">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="pl-10 pr-10"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-beatforge-500 hover:bg-beatforge-600"
              disabled={!isFormValid || isLoading}
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </Button>

            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link to="/get-started" className="text-beatforge-500 hover:text-beatforge-400">
                  Get Started
                </Link>
              </p>
            </div>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                OR CONTINUE WITH
              </span>
            </div>
          </div>
          <div className="flex justify-center">
            <Button 
              variant="outline" 
              className="flex items-center justify-center gap-2 px-10 py-6 w-full max-w-[300px] bg-black hover:bg-gray-900 text-white border-none"
              onClick={handleGoogleSignIn}
              disabled={isGoogleLoading}
            >
              <FaGoogle className="h-5 w-5" />
              <span className="text-base">{isGoogleLoading ? "Signing in..." : "Google"}</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
