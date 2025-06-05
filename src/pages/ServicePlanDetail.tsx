import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

export default function ServicePlanDetail() {
  const navigate = useNavigate();
  const { plan } = useParams();
  
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />
      <main className="flex-1">
        <section className="bg-gradient-to-br from-beatforge-900 to-black py-16">
          <div className="container px-4">
            <Button 
              variant="ghost" 
              className="mb-8 text-white" 
              asChild
            >
              <Link to="/services">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Services
              </Link>
            </Button>
            
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{plan} Plan Details</h1>
              <p className="text-lg text-beatforge-100 mb-8">This page has been temporarily moved.</p>
              <Button 
                className="bg-beatforge-500 hover:bg-beatforge-600 text-white"
                onClick={() => navigate(plan === "full-production" ? `/full-production-detail` : `/services/${plan}`)}
              >
                View Service Details
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
} 