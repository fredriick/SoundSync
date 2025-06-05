import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, ArrowRight, ShoppingBag } from "lucide-react";

// Add this function at the beginning of the file, before the component
function getDataFromStripeSources() {
  // Try to get session_id from URL parameters first - this is what Stripe will send back
  const urlParams = new URLSearchParams(window.location.search);
  const sessionId = urlParams.get("session_id");
  
  console.log("Stripe session ID from URL:", sessionId);
  
  // If we have a session ID, use it as the primary source of truth
  if (sessionId) {
    return {
      sessionId,
      // These will be populated later if needed
      serviceId: urlParams.get("serviceId") || "unknown",
      serviceName: urlParams.get("serviceName") || "Service",
      amount: urlParams.get("amount") || "0.00",
      currency: urlParams.get("currency") || "USD",
      purchaseType: urlParams.get("type") || "service"
    };
  }
  
  // Fall back to our stored data or other URL params
  const storedData = localStorage.getItem('currentCheckoutService');
  let parsedStoredData = null;
  
  if (storedData) {
    try {
      parsedStoredData = JSON.parse(storedData);
      // Clear stored data to prevent reuse
      localStorage.removeItem('currentCheckoutService');
      console.log("Using stored checkout data:", parsedStoredData);
    } catch (e) {
      console.error("Error parsing stored checkout data", e);
    }
  }
  
  // Combine data, prioritizing URL params
  return {
    sessionId: null,
    serviceId: urlParams.get("serviceId") || (parsedStoredData?.serviceId) || "unknown",
    serviceName: urlParams.get("serviceName") || (parsedStoredData?.serviceName) || "Service",
    amount: urlParams.get("amount") || (parsedStoredData?.amount) || "0.00",
    currency: urlParams.get("currency") || (parsedStoredData?.currency) || "USD",
    purchaseType: urlParams.get("type") || (parsedStoredData?.type) || "service"
  };
}

export default function StripeSuccess() {
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  
  // Get service data from all possible sources
  const [serviceData, setServiceData] = useState(getDataFromStripeSources());
  
  // Log the initial data on component mount
  useEffect(() => {
    console.log("StripeSuccess component mounted");
    console.log("Initial service data:", serviceData);
    
    // Re-fetch data in case it wasn't available during initial state setting
    const freshData = getDataFromStripeSources();
    
    // Only update state if we have better data than before
    if (freshData.sessionId && !serviceData.sessionId) {
      console.log("Updating service data with session ID:", freshData.sessionId);
      setServiceData(freshData);
    }
  }, []);
  
  // Simulate API check of payment status
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      
      // Only create a new purchase for service type, marketplace purchases are handled in CartSheet
      if (serviceData.purchaseType === "service") {
        console.log("Creating service purchase with data:", serviceData);
        
        // Store purchase info in localStorage
        const mockUserRaw = localStorage.getItem('mockUser');
        if (mockUserRaw) {
          const mockUser = JSON.parse(mockUserRaw);
          const purchases = mockUser.purchases || [];
          
          // Add the new purchase
          const newPurchase = {
            id: `purchase-${Date.now()}`,
            serviceId: serviceData.serviceId,
            serviceName: serviceData.serviceName,
            amount: serviceData.amount,
            currency: serviceData.currency,
            status: "paid",
            date: new Date().toISOString(),
            fileUploaded: false,
            progressValue: 0,
            type: "service",
            stripeSessionId: serviceData.sessionId // Store the Stripe session ID for reference
          };
          
          purchases.push(newPurchase);
          
          // Update user data
          localStorage.setItem('mockUser', JSON.stringify({
            ...mockUser,
            purchases,
            // Store the current purchase ID for the file upload page
            currentPurchaseId: newPurchase.id
          }));
        }
      }
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [serviceData]);
  
  const handleContinue = () => {
    if (serviceData.purchaseType === "marketplace") {
      // Redirect to the dashboard purchases tab
      navigate("/dashboard?tab=purchases");
    } else {
      // Redirect to file upload for services
      navigate("/upload-files", { state: { returnTo: "/dashboard?tab=services" } });
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />
      <main className="flex-1 py-16 flex flex-col items-center justify-center">
        <div className="container max-w-lg">
          <Card className="border-green-200 dark:border-green-900">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-green-100 dark:bg-green-900 mb-4">
                <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <CardTitle className="text-2xl font-bold">Payment Successful!</CardTitle>
              <CardDescription>
                Thank you for your purchase. Your payment has been processed successfully.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoading ? (
                <div className="flex flex-col items-center py-6">
                  <div className="h-8 w-8 rounded-full border-2 border-t-transparent border-beatforge-500 animate-spin"></div>
                  <p className="mt-2 text-sm text-muted-foreground">Confirming payment details...</p>
                </div>
              ) : (
                <>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        {serviceData.purchaseType === "marketplace" ? "Purchase" : "Service"}
                      </span>
                      <span className="font-medium">{serviceData.serviceName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Amount</span>
                      <span className="font-medium">{serviceData.currency} {serviceData.amount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status</span>
                      <span className="font-medium text-green-600 dark:text-green-400">Paid</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Date</span>
                      <span className="font-medium">{new Date().toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <div className="pt-4 text-center">
                    {serviceData.purchaseType === "marketplace" ? (
                      <p className="text-sm text-muted-foreground mb-2">
                        Your purchase is complete. You can view your purchased items in your dashboard.
                      </p>
                    ) : (
                      <p className="text-sm text-muted-foreground mb-2">
                        Next, you'll need to upload your audio files for this service.
                      </p>
                    )}
                  </div>
                </>
              )}
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                onClick={handleContinue}
                disabled={isLoading}
              >
                {serviceData.purchaseType === "marketplace" ? (
                  <>
                    View My Purchases
                    <ShoppingBag className="ml-2 h-4 w-4" />
                  </>
                ) : (
                  <>
                    Continue to File Upload
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
} 
