
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";

export default function SignIn() {
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-beatforge-950 to-beatforge-900">
      <Navbar />
      <div className="container px-4 py-16 mx-auto">
        <div className="max-w-md mx-auto space-y-6 animate-in slide-in-from-bottom-4 duration-1000">
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold text-white">Welcome back</h1>
            <p className="text-beatforge-200">Sign in to continue to Nades</p>
          </div>

          <div className="p-6 space-y-4 bg-background/80 backdrop-blur-lg rounded-lg border border-beatforge-800">
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

            <Button className="w-full bg-beatforge-500 hover:bg-beatforge-600">
              Sign In
            </Button>

            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link to="/get-started" className="text-beatforge-500 hover:text-beatforge-400">
                  Get Started
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
