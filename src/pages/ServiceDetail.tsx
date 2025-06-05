import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { 
  AudioWaveform as AudioWaveformIcon, 
  Volume2, 
  Music3, 
  CheckCircle2, 
  Clock, 
  StarIcon, 
  ArrowLeft,
  LogIn,
  Mic,
  Music4,
  Headphones,
  CreditCard,
  Phone,
  Link as LinkIcon
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock service data - in a real app, this would come from an API or database
const serviceData = {
  "mixing": {
    title: "Mixing",
    description: "Full mix engineering with attention to detail and clarity.",
    icon: <AudioWaveformIcon className="h-6 w-6" />,
    longDescription: "Our professional mixing services will transform your raw tracks into a polished, balanced, and professional-sounding mix. We use top-of-the-line equipment and software to ensure your music sounds its best.",
    features: [
      "Up to 64 tracks",
      "2 revision rounds",
      "Mixing & blending",
      "EQ & compression",
      "Delivery in 5-7 days"
    ],
    price: "$500",
    popular: false,
    faqs: [
      {
        question: "What files do I need to provide?",
        answer: "You'll need to provide individual stems or track files (WAV or AIFF format preferred), preferably at 24-bit/48kHz or higher."
      },
      {
        question: "How many revisions are included?",
        answer: "The standard package includes 2 rounds of revisions. Additional revisions can be purchased if needed."
      },
      {
        question: "How will I receive the final mix?",
        answer: "You'll receive the final stereo mix in both high-resolution WAV and MP3 formats via a secure download link."
      }
    ]
  },
  "mastering": {
    title: "Mastering",
    description: "Add the final polish to your mix with professional mastering.",
    icon: <Volume2 className="h-6 w-6" />,
    longDescription: "Our mastering service adds the final polish to your tracks, optimizing them for all platforms and making sure they sound great on any playback system. We enhance clarity, depth, and loudness without sacrificing dynamic range.",
    features: [
      "Loudness optimization",
      "Stereo enhancement",
      "EQ & dynamic processing",
      "2 revision rounds",
      "Delivery in 3-5 days"
    ],
    price: "$200",
    popular: true,
    faqs: [
      {
        question: "What format should I submit my mix in?",
        answer: "Please provide your final stereo mix as a WAV or AIFF file, 24-bit/44.1kHz or higher, with at least 3-6dB of headroom."
      },
      {
        question: "Will mastering fix problems in my mix?",
        answer: "Mastering is not designed to fix significant mix issues. For best results, your mix should be as polished as possible before mastering."
      },
      {
        question: "Do you provide stem mastering?",
        answer: "Yes, stem mastering is available for an additional fee. Please contact us for details."
      }
    ]
  },
  "production": {
    title: "Production",
    description: "Complete track production from your concepts to finished beats.",
    icon: <Music3 className="h-6 w-6" />,
    longDescription: "Our production service takes your ideas from concept to completion. We work closely with you to develop your vision, creating professional, radio-ready tracks that capture your unique style and sound.",
    features: [
      "Custom beat creation",
      "Arrangement & structure",
      "3 revision rounds",
      "Stems delivery",
      "Delivery in 7-10 days"
    ],
    price: "$700",
    popular: false,
    faqs: [
      {
        question: "How do I communicate my vision for the track?",
        answer: "We'll have an initial consultation where you can describe your vision, provide reference tracks, and share any demos or ideas you have."
      },
      {
        question: "Do I own the rights to the produced track?",
        answer: "Yes, you receive full ownership rights to the final production once payment is completed."
      },
      {
        question: "Can I request specific instruments or sounds?",
        answer: "Absolutely! We welcome your creative input and will work to incorporate your requested sounds and instruments into the production."
      }
    ]
  },
  "vocal-tuning": {
    title: "Vocal Tuning",
    description: "Perfect pitch correction and vocal enhancement.",
    icon: <Mic className="h-6 w-6" />,
    longDescription: "Our professional vocal tuning service provides precise pitch correction while preserving the natural qualities of the voice. We carefully enhance vocals to sound polished and professional without the artificial qualities that can come from automated tools.",
    features: [
      "Pitch correction",
      "Timing adjustment",
      "Vocal effects",
      "2 revision rounds",
      "Delivery in 2-4 days"
    ],
    price: "$50",
    popular: false,
    faqs: [
      {
        question: "What vocal files should I provide?",
        answer: "Please provide dry, unprocessed vocal tracks as WAV or AIFF files. If possible, include a reference mix so we understand how the vocals should sit in the track."
      },
      {
        question: "How natural will the tuning sound?",
        answer: "We pride ourselves on natural-sounding vocal tuning. We can achieve anything from transparent correction to stylized effects - just let us know your preference."
      },
      {
        question: "Can you add vocal effects like reverb and delay?",
        answer: "Yes, we can add basic vocal effects as part of this service. For more complex vocal production, you might consider our full production package."
      }
    ]
  },
  "sound-design": {
    title: "Sound Design",
    description: "Custom sound design for your productions.",
    icon: <Music4 className="h-6 w-6" />,
    longDescription: "Our sound design service creates custom, unique sounds tailored specifically for your project. From synthesizer programming to effect processing and audio manipulation, we craft distinctive sonic elements that will make your productions stand out.",
    features: [
      "Custom sound creation",
      "Synth programming",
      "Effect processing",
      "2 revision rounds",
      "Delivery in 5-7 days"
    ],
    price: "$150",
    popular: false,
    faqs: [
      {
        question: "What information do you need to create custom sounds?",
        answer: "Reference tracks, descriptions of the sounds you're looking for, and information about the context they'll be used in are all helpful. The more specific you can be, the better we can match your vision."
      },
      {
        question: "What format will I receive the sounds in?",
        answer: "We deliver sounds as high-quality WAV files. We can also provide Serum presets, Ableton Live instruments, or other formats upon request."
      },
      {
        question: "Do I own the rights to the sounds created?",
        answer: "Yes, all custom sounds created through this service are delivered with full rights for you to use in your productions."
      }
    ]
  },
  "full-production": {
    title: "Full Production Package",
    description: "End-to-end production, mixing, and mastering.",
    icon: <Headphones className="h-6 w-6" />,
    longDescription: "Our comprehensive production package handles every aspect of your music from start to finish. We take care of arrangement, production, mixing, and mastering to deliver radio-ready tracks that sound professional and polished.",
    features: [
      "Production & arrangement",
      "Full mixing",
      "Mastering",
      "4 revision rounds",
      "Delivery in 10-14 days"
    ],
    price: "Contact Us",
    popular: true,
    faqs: [
      {
        question: "What do you need from me to get started?",
        answer: "We can start with anything from a simple voice memo to a full demo. At minimum, we need the basic song idea, reference tracks for style guidance, and any specific direction you want to take the production."
      },
      {
        question: "How involved can I be in the production process?",
        answer: "As involved as you'd like! We can work closely with you through each stage, or you can leave it entirely to us. We're happy to accommodate your preferred workflow."
      },
      {
        question: "What deliverables will I receive?",
        answer: "You'll receive the final mastered track, a mix without mastering, stems of all the production elements, and any project files you might need for future work."
      }
    ]
  }
};

// Add the PaymentMethodOption component
const PaymentMethodOption = ({ 
  id, 
  label, 
  icon, 
  description,
  checked,
  onChange
}) => {
  return (
    <div className={`p-3 rounded-lg border-2 transition-all cursor-pointer ${checked ? 'border-beatforge-500 bg-beatforge-50 dark:bg-beatforge-950/20' : 'border-border hover:border-beatforge-300'}`}
         onClick={() => onChange(id)}>
      <div className="flex items-center gap-2">
        <RadioGroupItem value={id} id={id} className="data-[state=checked]:border-beatforge-500 data-[state=checked]:text-beatforge-500" />
        <div className="flex items-center gap-1.5">
          {icon}
          <Label htmlFor={id} className="text-sm font-medium cursor-pointer">{label}</Label>
        </div>
      </div>
      {description && (
        <p className="mt-0.5 pl-5 text-xs text-muted-foreground">{description}</p>
      )}
    </div>
  );
};

// Add a component for the card payment form
const CardPaymentForm = ({ processing, onSubmit }) => {
  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div className="space-y-1.5">
        <Label htmlFor="card-number" className="text-sm">Card Number</Label>
        <Input 
          id="card-number" 
          placeholder="1234 5678 9012 3456"
          className="font-mono h-9"
          maxLength={19}
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="expiry" className="text-sm">Expiry Date</Label>
          <Input 
            id="expiry" 
            placeholder="MM/YY"
            className="font-mono h-9"
            maxLength={5}
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="cvc" className="text-sm">CVC</Label>
          <Input 
            id="cvc" 
            placeholder="123"
            className="font-mono h-9"
            type="password"
            maxLength={4}
            required
          />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="name" className="text-sm">Name on Card</Label>
        <Input 
          id="name" 
          placeholder="John Doe"
          className="h-9"
          required
        />
      </div>
      <Button 
        type="submit" 
        className="w-full bg-beatforge-500 hover:bg-beatforge-600 mt-2"
        disabled={processing}
      >
        {processing ? "Processing..." : "Pay Now"}
      </Button>
    </form>
  );
};

export default function ServiceDetail() {
  const { serviceSlug } = useParams();
  const navigate = useNavigate();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [processingPayment, setProcessingPayment] = useState(false);

  // Map URL slugs to serviceData keys
  const slugToServiceMap: Record<string, keyof typeof serviceData> = {
    'mixing': 'mixing',
    'mastering': 'mastering',
    'production': 'production',
    'vocal-tuning': 'vocal-tuning',
    'sound-design': 'sound-design',
    'full-production': 'full-production'
  };
  
  // Get the service using the mapped key
  const serviceKey = serviceSlug ? slugToServiceMap[serviceSlug] : undefined;
  const service = serviceKey ? serviceData[serviceKey] : undefined;

  // Add Stripe test checkout URL for mastering service
  const stripeTestCheckoutUrl = "https://buy.stripe.com/test_6oE4j5cJmaWdcScbII";

  useEffect(() => {
    checkUserLoginStatus();
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleStorageChange = () => {
    checkUserLoginStatus();
  };

  const checkUserLoginStatus = () => {
    // Check multiple possible authentication storage keys
    const user = localStorage.getItem('user');
    const mockUser = localStorage.getItem('mockUser');
    
    // User is logged in if either auth method has data and contains isSignedIn: true
    let loggedIn = false;
    
    if (mockUser) {
      try {
        const parsedUser = JSON.parse(mockUser);
        loggedIn = parsedUser && parsedUser.isSignedIn === true;
      } catch (e) {
        console.error("Error parsing mockUser", e);
      }
    }
    
    if (user && !loggedIn) {
      try {
        const parsedUser = JSON.parse(user);
        loggedIn = parsedUser && parsedUser.isSignedIn === true;
      } catch (e) {
        console.error("Error parsing user", e);
      }
    }
    
    setIsLoggedIn(loggedIn);
    
    // Handle pending service purchase only if actually logged in
    if (loggedIn) {
      const pendingServicePurchase = localStorage.getItem('pendingServicePurchase');
      const pendingServiceSlug = localStorage.getItem('pendingServiceSlug');
      
      if (pendingServicePurchase === 'true' && pendingServiceSlug === serviceSlug) {
        // Clear the pending flags
        localStorage.removeItem('pendingServicePurchase');
        localStorage.removeItem('pendingServiceSlug');
        
        // Small delay to ensure UI is ready
        setTimeout(() => handleCheckout(), 500);
      }
    }
  };

  const handleRedirectToLogin = () => {
    setShowLoginDialog(false);
    // Store intended destination to return after login
    localStorage.setItem('pendingServicePurchase', 'true');
    localStorage.setItem('pendingServiceSlug', serviceSlug || '');
    navigate('/sign-in');
  };

  const handleExternalCheckout = () => {
    try {
      // Store service info in localStorage for the success page
      localStorage.setItem('currentCheckoutService', JSON.stringify({
        serviceId: serviceSlug,
        serviceName: service.title,
        amount: parseInt(service.price.replace(/[^0-9]/g, "")),
        currency: 'USD',
        type: 'service'
      }));
      
      // Create full return URL for the success page - this must use Stripe's special template variable
      // The template variable {CHECKOUT_SESSION_ID} will be replaced by Stripe with the actual session ID
      const successUrl = `${window.location.origin}/payment-success?session_id={CHECKOUT_SESSION_ID}`;
      const cancelUrl = window.location.href;
      
      // Use Stripe's hosted checkout with required success_url and cancel_url parameters
      window.location.href = `${stripeTestCheckoutUrl}?success_url=${encodeURIComponent(successUrl)}&cancel_url=${encodeURIComponent(cancelUrl)}`;
      
      console.log("Redirecting to Stripe checkout:", successUrl);
    } catch (error) {
      console.error("Error in handleExternalCheckout:", error);
      toast({
        title: "Checkout Error",
        description: "There was an issue starting the checkout process. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleCheckout = () => {
    // Re-check login status in case it changed
    checkUserLoginStatus();
    
    // Double-check that user is actually logged in before proceeding
    if (!isLoggedIn) {
      setShowLoginDialog(true);
      return;
    }
    
    // Use the external Stripe checkout for all standard services
    handleExternalCheckout();
  };

  // Handle internal checkout
  const handleInternalCheckout = () => {
    // Re-check login status
    checkUserLoginStatus();
    
    // Open payment dialog if logged in
    if (isLoggedIn) {
      setShowPaymentDialog(true);
    } else {
      setShowLoginDialog(true);
    }
  };

  // Handle payment form submit
  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    setProcessingPayment(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setProcessingPayment(false);
      setShowPaymentDialog(false);
      
      // Get price as number from the price string
      const priceAsNumber = parseInt(service.price.replace(/[^0-9]/g, ""));
      
      // Show success toast
      toast({
        title: "Payment Successful!",
        description: `Your ${paymentMethod === 'card' ? 'card payment' : paymentMethod === 'cashapp' ? 'Cash App payment' : 'Link payment'} has been processed.`,
      });
      
      // Navigate to payment success page with service details
      navigate(`/payment-success?serviceId=${serviceSlug}&serviceName=${service.title}&amount=${priceAsNumber}&currency=USD&type=service`);
    }, 2000);
  };

  // Handle payment method change
  const handlePaymentMethodChange = (value) => {
    setPaymentMethod(value);
  };

  if (!service) {
    return (
      <div className="min-h-screen flex flex-col bg-background text-foreground">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Service Not Found</h1>
            <p className="text-muted-foreground mb-8">The service you're looking for doesn't exist.</p>
            <Button asChild>
              <Link to="/services">Back to Services</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />
      <main className="flex-1">
        <div className="container px-4 py-12">
          <Button 
            variant="ghost" 
            className="mb-8" 
            asChild
          >
            <Link to="/services">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Services
            </Link>
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Service Details */}
            <div className="lg:col-span-2 space-y-8">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-beatforge-100 dark:bg-beatforge-900 text-beatforge-500">
                  {service.icon}
                </div>
                <div>
                  <h1 className="text-4xl font-bold">{service.title}</h1>
                  <p className="text-muted-foreground">{service.description}</p>
                </div>
              </div>
              
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <p>{service.longDescription}</p>
                
                <h2 className="text-2xl font-bold mt-8 mb-4">What's Included</h2>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {service.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-beatforge-500 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <h2 className="text-2xl font-bold mt-8 mb-4">Service Process</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">1. Submit</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Upload your files and provide any specific instructions or references.
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">2. Process</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Our engineers work on your project with professional tools and techniques.
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">3. Deliver</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Receive your completed files and request revisions if needed.
                      </p>
                    </CardContent>
                  </Card>
                </div>
                
                <h2 className="text-2xl font-bold mt-8 mb-4">Frequently Asked Questions</h2>
                <Accordion type="single" collapsible className="w-full">
                  {service.faqs.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger>{faq.question}</AccordionTrigger>
                      <AccordionContent>
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </div>
            
            {/* Pricing Card */}
            <div>
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Service Package</CardTitle>
                  <CardDescription>Everything you need for professional {service.title.toLowerCase()}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-4xl font-bold">{service.price}</div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>Turnaround: {
                        service.features.find(f => f.includes("day"))?.replace("Delivery in ", "") || "5-7 days"
                      }</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <StarIcon className="h-4 w-4 text-muted-foreground" />
                      <span>Revisions: {
                        service.features.find(f => f.includes("revision"))?.replace(" rounds", "") || "2 revision"
                      }</span>
                    </div>
                  </div>
                  
                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-2">What you'll get:</h4>
                    <ul className="space-y-2">
                      {service.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <CheckCircle2 className="h-4 w-4 text-beatforge-500 mt-0.5 shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {serviceSlug === 'full-production' ? (
                    <Button 
                      onClick={() => navigate('/full-production-detail')}
                      className="w-full bg-beatforge-500 hover:bg-beatforge-600"
                    >
                      Contact Us
                    </Button>
                  ) : (
                    <div className="space-y-3">
                      <Button 
                        onClick={handleCheckout} 
                        disabled={isCheckingOut || processingPayment}
                        className="w-full bg-beatforge-500 hover:bg-beatforge-600"
                      >
                        Test Stripe Checkout
                      </Button>
                      <Button 
                        onClick={handleInternalCheckout} 
                        variant="outline"
                        disabled={isCheckingOut || processingPayment}
                        className="w-full"
                      >
                        Use Internal Checkout
                      </Button>
                    </div>
                  )}
                  
                  <p className="text-xs text-center text-muted-foreground">
                    By ordering, you agree to our Terms of Service and Privacy Policy
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />

      <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sign In Required</DialogTitle>
            <DialogDescription>
              Please sign in to purchase this service.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              onClick={handleRedirectToLogin} 
              className="w-full sm:w-auto flex items-center gap-2 bg-beatforge-500 hover:bg-beatforge-600"
            >
              <LogIn className="h-4 w-4" />
              Sign In
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add the payment dialog */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden max-h-[90vh] flex flex-col">
          <DialogHeader className="px-6 pt-6 pb-2">
            <DialogTitle className="text-xl">Checkout</DialogTitle>
            <DialogDescription>
              Complete your payment for {service?.title}
            </DialogDescription>
          </DialogHeader>
          
          <div className="px-6 py-4 overflow-y-auto">
            <div className="flex justify-between items-center pb-4 mb-4 border-b">
              <span className="text-sm">Total</span>
              <span className="text-lg font-bold">{service?.price}</span>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Payment Method</h3>
              
              <RadioGroup 
                value={paymentMethod} 
                onValueChange={handlePaymentMethodChange}
                className="space-y-3"
              >
                <PaymentMethodOption
                  id="card"
                  label="Credit Card"
                  icon={<CreditCard className="h-4 w-4 text-muted-foreground" />}
                  description="Pay with Visa, MasterCard, or American Express"
                  checked={paymentMethod === 'card'}
                  onChange={handlePaymentMethodChange}
                />
                <PaymentMethodOption
                  id="cashapp"
                  label="Cash App Pay"
                  icon={<Phone className="h-4 w-4 text-muted-foreground" />}
                  description="Fast and secure payment with Cash App"
                  checked={paymentMethod === 'cashapp'}
                  onChange={handlePaymentMethodChange}
                />
                <PaymentMethodOption
                  id="link"
                  label="Link"
                  icon={<LinkIcon className="h-4 w-4 text-muted-foreground" />}
                  description="Faster checkout with your saved payment info"
                  checked={paymentMethod === 'link'}
                  onChange={handlePaymentMethodChange}
                />
              </RadioGroup>
              
              <div className="pt-4 pb-2">
                {paymentMethod === 'card' && (
                  <CardPaymentForm 
                    processing={processingPayment} 
                    onSubmit={handlePaymentSubmit} 
                  />
                )}
                {paymentMethod === 'cashapp' && (
                  <div className="text-center py-4 space-y-4">
                    <Phone className="h-16 w-16 text-green-500 mx-auto" />
                    <h3 className="text-lg font-medium">Cash App Pay</h3>
                    <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                      Scan the QR code with your Cash App mobile app to complete payment
                    </p>
                    <Button 
                      onClick={handlePaymentSubmit} 
                      className="w-full bg-green-500 hover:bg-green-600"
                      disabled={processingPayment}
                    >
                      {processingPayment ? "Processing..." : "Complete Cash App Payment"}
                    </Button>
                  </div>
                )}
                {paymentMethod === 'link' && (
                  <div className="text-center py-4 space-y-4">
                    <LinkIcon className="h-16 w-16 text-blue-500 mx-auto" />
                    <h3 className="text-lg font-medium">Pay with Link</h3>
                    <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                      Use your saved payment information for faster checkout
                    </p>
                    <Input 
                      type="email" 
                      placeholder="Email address"
                      className="mb-2"
                      required
                    />
                    <Button 
                      onClick={handlePaymentSubmit} 
                      className="w-full bg-blue-500 hover:bg-blue-600"
                      disabled={processingPayment}
                    >
                      {processingPayment ? "Processing..." : "Pay with Link"}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <DialogFooter className="px-6 py-4 bg-muted/50 mt-auto">
            <div className="text-xs text-muted-foreground text-center w-full">
              Your payment is secured with industry-standard encryption
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 