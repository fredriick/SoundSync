import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ShoppingBag, Headphones, CreditCard, Settings, Download, Play, Pause, Package, Plus, ChevronRight, ArrowRight, Store, Upload, CheckCircle2, Clock, ShieldCheck, XCircle, File } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { format, addWeeks, isBefore } from "date-fns";

// Define types
interface Purchase {
  id: string;
  name: string;
  type: "beat" | "service" | "marketplace";
  date: string;
  price: string;
  status: "completed" | "in-progress" | "pending";
  downloadUrl?: string;
  imageUrl: string;
  progressSteps?: any[];
  progressValue?: number;
  files?: any[];
}

interface Listing {
  id: string;
  title: string;
  price: string;
  imageUrl: string;
  dateAdded: string;
  status: "active" | "pending" | "sold";
  salesCount: number;
}

// This would come from authentication context in a real app
const checkUserAuthentication = () => {
  // For demo, check if the user is mocked as signed in
  // We're getting this from the Navbar's mockUser directly
  // In a real app, this would be from a context, cookie, or local storage
  const mockUserRaw = localStorage.getItem('mockUser');
  if (mockUserRaw) {
    const mockUser = JSON.parse(mockUserRaw);
    return mockUser.isSignedIn;
  }
  
  return false;
};

export default function Dashboard() {
  const [activeAudio, setActiveAudio] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [listings, setListings] = useState<Listing[]>([]);
  const [isSellerApproved, setIsSellerApproved] = useState(false);
  const [isAdminApproved, setIsAdminApproved] = useState(false);
  const [isSellerBlocked, setIsSellerBlocked] = useState(false);
  const [allStepsCompleted, setAllStepsCompleted] = useState(false);
  const [applyDialogOpen, setApplyDialogOpen] = useState(false);
  const [applicationSubmitting, setApplicationSubmitting] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("US");
  const [taxFormType, setTaxFormType] = useState("W-9");
  const [showTaxForm, setShowTaxForm] = useState(false);
  const [bankAccountType, setBankAccountType] = useState("checking");
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [routingNumber, setRoutingNumber] = useState("");
  const [swiftCode, setSwiftCode] = useState("");
  const [formData, setFormData] = useState({
    artistName: "",
    biography: "",
    genres: {
      hipHop: false,
      trap: false,
      rnb: false,
      pop: false,
      edm: false,
      house: false,
      drill: false,
      lofi: false,
      rock: false,
      jazz: false,
      reggaeton: false,
      other: false
    },
    website: "",
    instagram: "",
    twitter: "",
    soundcloud: "",
    termsAccepted: false
  });
  const [showGettingStarted, setShowGettingStarted] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [stepCompleted, setStepCompleted] = useState({
    profile: false,
    upload: false,
    payment: false
  });
  const [paymentMethod, setPaymentMethod] = useState("bank");
  const [lastPaymentUpdate, setLastPaymentUpdate] = useState<Date | null>(null);
  const [paymentUpdateDisabled, setPaymentUpdateDisabled] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  // Add new state for service details dialog
  const [serviceDetailsOpen, setServiceDetailsOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Purchase | null>(null);
  // Add a new state for track upload
  const [serviceFileUpload, setServiceFileUpload] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Check if user is authenticated and check seller status
  useEffect(() => {
    // In a real app, this would be handled by a protected route component
    // or an authentication context
    if (!checkUserAuthentication()) {
      navigate('/sign-in', { replace: true });
      return;
    }

    // Check if user is an approved seller from localStorage
    const mockUserRaw = localStorage.getItem('mockUser');
    if (mockUserRaw) {
      try {
        const mockUser = JSON.parse(mockUserRaw);
        setIsSellerApproved(mockUser.isSellerApproved === true);
        setIsAdminApproved(mockUser.isAdminApproved === true);
        setIsSellerBlocked(mockUser.isBlocked === true);
        
        // Load step completion status
        if (mockUser.sellerSteps) {
          setStepCompleted(mockUser.sellerSteps);
          // Check if all steps are completed
          if (mockUser.sellerSteps.profile && 
              mockUser.sellerSteps.upload && 
              mockUser.sellerSteps.payment) {
            setAllStepsCompleted(true);
          }
        }
        
        // Load last payment update time
        if (mockUser.lastPaymentUpdate) {
          const lastUpdate = new Date(mockUser.lastPaymentUpdate);
          setLastPaymentUpdate(lastUpdate);
          
          // Check if a week has passed since last update
          const nextAllowedUpdate = addWeeks(lastUpdate, 1);
          setPaymentUpdateDisabled(isBefore(new Date(), nextAllowedUpdate));
        }
      } catch (e) {
        console.error('Error parsing mock user data', e);
      }
    }
  }, [navigate]);

  // Check for admin approval periodically (simulated)
  useEffect(() => {
    // Only check if all steps are completed but not yet admin approved
    if (allStepsCompleted && !isAdminApproved) {
      const checkInterval = setInterval(() => {
        // Simulate a 20% chance of approval every 15 seconds for demo purposes
        if (Math.random() < 0.2) {
          // Update localStorage
          try {
            const mockUserRaw = localStorage.getItem('mockUser');
            if (mockUserRaw) {
              const mockUser = JSON.parse(mockUserRaw);
              mockUser.isAdminApproved = true;
              localStorage.setItem('mockUser', JSON.stringify(mockUser));
              setIsAdminApproved(true);
              
              // Show approval notification
              toast({
                title: "Your seller account has been approved!",
                description: "You can now access the seller dashboard and start selling your content.",
                variant: "default",
              });
            }
          } catch (e) {
            console.error('Error updating mock user data', e);
          }
        }
      }, 15000); // Check every 15 seconds

      return () => clearInterval(checkInterval);
    }
  }, [allStepsCompleted, isAdminApproved]);

  // Update useEffect that loads purchases to correctly handle both mockUser and userPurchases
  useEffect(() => {
    // Create a function to load purchases so we can call it both on initial load and for polling
    const loadPurchasesData = () => {
      // Default purchases for demo purposes
      const defaultPurchases: Purchase[] = [
        {
          id: "1",
          name: "Neon Nights Beat",
          type: "beat",
          date: "2023-10-15",
          price: "$24.99",
          status: "completed",
          downloadUrl: "#",
          imageUrl: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=800&q=80"
        },
        {
          id: "2",
          name: "Lo-Fi Dreams",
          type: "beat",
          date: "2023-11-02",
          price: "$14.99",
          status: "completed",
          downloadUrl: "#",
          imageUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80"
        }
      ];
      
      // Check for currently displayed purchases to preserve state
      // This will help prevent flickering and state reversion
      const currentPurchases = [...purchases];
      
      // Array to hold all purchases from different sources
      let allPurchases: Purchase[] = [...defaultPurchases];
      
      // First, check for services in mockUser (which is where newly paid services are stored)
      const mockUserRaw = localStorage.getItem('mockUser');
      if (mockUserRaw) {
        try {
          const mockUser = JSON.parse(mockUserRaw);
          if (mockUser.purchases && Array.isArray(mockUser.purchases)) {
            // Convert the purchases from mockUser to our Purchase type
            const userPurchases = mockUser.purchases.map((p: any) => {
              // Handle marketplace purchases
              if (p.type === "marketplace") {
                return {
                  id: p.id || `marketplace-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
                  name: p.title || p.name || "Marketplace Item",
                  type: "marketplace",
                  date: p.date || new Date().toISOString().split('T')[0],
                  price: p.price || `$${p.amount || p.totalPrice || "0.00"}`,
                  status: "completed" as const,
                  imageUrl: p.imageUrl || "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80",
                  downloadUrl: "#"
                };
              }
              // Handle service purchases
              return {
                id: p.id || `service-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
                name: p.serviceName || p.name || "Service",
                type: p.type || "service",
                date: p.date || new Date().toISOString().split('T')[0],
                price: p.price || `$${p.amount || "0.00"}`,
                status: p.status === "paid" ? "pending" : (p.status || "pending"),
                imageUrl: p.imageUrl || "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?auto=format&fit=crop&w=800&q=80",
                progressValue: p.progressValue || 0,
                progressSteps: p.progressSteps || null,
                files: p.files || []
              };
            });
            
            // Add purchases to all purchases
            allPurchases = [...allPurchases, ...userPurchases];
          }
        } catch (e) {
          console.error('Error parsing mockUser purchases from localStorage', e);
        }
      }
      
      // Then, check purchaseHistory for marketplace purchases specifically
      const purchaseHistoryRaw = localStorage.getItem('purchaseHistory');
      if (purchaseHistoryRaw) {
        try {
          const purchaseHistory = JSON.parse(purchaseHistoryRaw);
          if (Array.isArray(purchaseHistory)) {
            const marketplacePurchases = purchaseHistory
              .filter((p: any) => p.type === 'marketplace')
              .flatMap((purchase: any) => {
                // Each purchase may contain multiple items
                if (purchase.items && Array.isArray(purchase.items)) {
                  return purchase.items.map((item: any) => ({
                    id: `${purchase.id}-${item.id}`,
                    name: item.title,
                    type: "marketplace",
                    date: purchase.date || new Date().toISOString().split('T')[0],
                    price: item.price,
                    status: "completed" as const,
                    imageUrl: item.imageUrl,
                    downloadUrl: "#"
                  }));
                }
                return [];
              });

            // Add marketplace purchases (avoiding duplicates)
            const existingIds = allPurchases.map(p => p.id);
            const newPurchases = marketplacePurchases.filter((p: Purchase) => !existingIds.includes(p.id));
            allPurchases = [...allPurchases, ...newPurchases];
          }
        } catch (e) {
          console.error('Error parsing purchaseHistory from localStorage', e);
        }
      }
      
      // Check userPurchases for any additional purchases
      const userPurchasesRaw = localStorage.getItem('userPurchases');
      if (userPurchasesRaw) {
        try {
          const userPurchases = JSON.parse(userPurchasesRaw);
          
          // Check for duplicates and merge with existing purchases
          const existingIds = allPurchases.map(p => p.id);
          const newPurchases = userPurchases.filter((p: Purchase) => !existingIds.includes(p.id));
          
          allPurchases = [...allPurchases, ...newPurchases];
        } catch (e) {
          console.error('Error parsing userPurchases from localStorage', e);
        }
      }
      
      // CRITICAL: Check for any purchases that are currently in "in-progress" state
      // and preserve their state to prevent reverting back to "pending"
      const mergedPurchases = allPurchases.map(newPurchase => {
        // Find this purchase in current state
        const existingPurchase = currentPurchases.find(p => p.id === newPurchase.id);
        
        // If this purchase is already in our state with files uploaded, preserve that state
        if (existingPurchase && 
            (existingPurchase.status === "in-progress" || existingPurchase.files?.length)) {
          // Keep the existing purchase data to preserve upload state
          return existingPurchase;
        }
        
        // For purchases that aren't in progress yet, still check upload keys
        if (newPurchase.type === "service") {
          const uploadKey = `service_upload_${newPurchase.id}`;
          const pendingUpload = localStorage.getItem(uploadKey);
          
          // If we have a completed upload, make sure it's reflected
          if (pendingUpload) {
            try {
              const uploadInfo = JSON.parse(pendingUpload);
              
              // If this upload is marked as complete, ensure the service shows that
              if (uploadInfo.uploadComplete === true) {
                const today = new Date(uploadInfo.timestamp).toISOString().split('T')[0];
                const files = newPurchase.files || [];
                
                // Ensure the file is in the files array
                if (!files.some(file => 
                    (typeof file === 'string' && file === uploadInfo.filename) || 
                    (typeof file === 'object' && file.name === uploadInfo.filename)
                )) {
                  files.push(uploadInfo.filename);
                }
                
                return {
                  ...newPurchase,
                  files,
                  progressValue: newPurchase.progressValue || 10,
                  status: "in-progress" as const,
                  progressSteps: [
                    {
                      title: "Files Uploaded",
                      completed: true,
                      date: today
                    },
                    {
                      title: "In Progress",
                      completed: true,
                      date: today
                    },
                    {
                      title: "Review",
                      completed: false
                    },
                    {
                      title: "Completed",
                      completed: false
                    }
                  ]
                };
              }
            } catch (e) {
              console.error('Error processing upload data', e);
            }
          }
        }
        
        return newPurchase;
      });
      
      // Add standardized progress steps if missing
      const processedPurchases = mergedPurchases.map((purchase: Purchase) => {
        if (purchase.type === "service") {
          // If the purchase already has progressSteps or files, don't modify it
          if (purchase.progressSteps || (purchase.files && purchase.files.length > 0)) {
            return purchase;
          }
          
          // Only add standard display formatting for purchases without progress info
          const today = new Date().toISOString().split('T')[0];
          
          // For services without files, prepare the standard progress steps for after upload
          return {
            ...purchase,
            status: "pending" as const
          };
        }
        return purchase;
      });
      
      // Only update state if there are actual changes to prevent unnecessary re-renders
      const currentIds = currentPurchases.map(p => p.id).sort().join(',');
      const newIds = processedPurchases.map(p => p.id).sort().join(',');
      
      if (currentIds !== newIds || currentPurchases.length !== processedPurchases.length) {
        // Preserve UI state by keeping existing purchases with the same IDs
        const finalPurchases = processedPurchases.map(newP => {
          const existingP = currentPurchases.find(p => p.id === newP.id);
          return existingP || newP;
        });
        
        setPurchases(finalPurchases);
        
        // Only save to localStorage when we have actual changes
        localStorage.setItem('userPurchases', JSON.stringify(finalPurchases));
      }
    };
    
    // Initial load
    loadPurchasesData();
    
    // Set up polling to check for new purchases every 5 seconds
    const purchasesPoller = setInterval(() => {
      loadPurchasesData();
    }, 5000);
    
    // Clean up the interval when component unmounts
    return () => clearInterval(purchasesPoller);
  }, []); // Empty dependency array so this only runs on mount

  // Get tab from URL query parameter
  const tabFromUrl = queryParams.get("tab");
  const [activeTab, setActiveTab] = useState<string>(
    tabFromUrl === "services" || tabFromUrl === "payments" || tabFromUrl === "seller"
      ? tabFromUrl 
      : "purchases"
  );
  
  // Update URL when tab changes
  const handleTabChange = (value: string) => {
    // If there's an active service with an upload in progress, save it to localStorage
    if (selectedService && serviceFileUpload) {
      // Create a key for this specific service's upload
      const uploadKey = `service_upload_${selectedService.id}`;
      
      // We can't directly store File objects in localStorage, so we'll store the filename
      // and a flag that an upload is in progress
      localStorage.setItem(uploadKey, JSON.stringify({
        filename: serviceFileUpload.name,
        inProgress: true,
        timestamp: new Date().toISOString()
      }));
    }
    
    // Continue with normal tab change operation
    const tabQuery = new URLSearchParams(location.search);
    tabQuery.set('tab', value);
    navigate({ search: tabQuery.toString() }, { replace: true });
  };

  // Update tab when URL changes
  useEffect(() => {
    const tab = queryParams.get("tab");
    if (tab === "services" || tab === "payments" || tab === "purchases" || (tab === "seller" && !isSellerBlocked)) {
      setActiveTab(tab);
    } else if (tab === "seller" && isSellerBlocked) {
      // If trying to access seller tab while blocked, show warning and redirect to purchases
      toast({
        title: "Access Restricted",
        description: "Your seller account has been blocked. Please contact support for assistance.",
        variant: "destructive"
      });
      setActiveTab("purchases");
      navigate("/dashboard?tab=purchases", { replace: true });
    }
  }, [location.search, isSellerBlocked, navigate]);

  const togglePlayPause = (id: string) => {
    if (activeAudio === id) {
      setIsPlaying(!isPlaying);
    } else {
      setActiveAudio(id);
      setIsPlaying(true);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: Purchase['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'in-progress':
        return 'bg-blue-500';
      case 'pending':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getListingStatusColor = (status: Listing['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'pending':
        return 'bg-yellow-500';
      case 'sold':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  // Handle input change for the application form
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle checkbox change for genres and terms
  const handleCheckboxChange = (name: string) => {
    if (name === "termsAccepted") {
      setFormData(prev => ({
        ...prev,
        termsAccepted: !prev.termsAccepted
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        genres: {
          ...prev.genres,
          [name]: !prev.genres[name as keyof typeof prev.genres]
        }
      }));
    }
  };

  // Handle application submission
  const handleApplicationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.termsAccepted) {
      toast({
        title: "Please accept the Terms and Conditions",
        description: "You must accept the terms to continue.",
        variant: "destructive"
      });
      return;
    }
    
    setApplicationSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      // Save to local storage that this user is now an approved seller
      try {
        const mockUserRaw = localStorage.getItem('mockUser');
        if (mockUserRaw) {
          const mockUser = JSON.parse(mockUserRaw);
          mockUser.isSellerApproved = true;
          mockUser.sellerProfile = {
            artistName: formData.artistName,
            genres: Object.keys(formData.genres).filter(key => 
              formData.genres[key as keyof typeof formData.genres]
            ),
            biography: formData.biography,
            website: formData.website || "",
            instagram: formData.instagram || "",
            twitter: formData.twitter || "",
            soundcloud: formData.soundcloud || ""
          };
          
          // Set profile step as completed
          mockUser.sellerSteps = {
            profile: true,
            upload: false,
            payment: false
          };
          
          localStorage.setItem('mockUser', JSON.stringify(mockUser));
          setIsSellerApproved(true);
          setStepCompleted({
            profile: true,
            upload: false,
            payment: false
          });
        }
      } catch (e) {
        console.error('Error updating mock user data', e);
      }
      
      setApplicationSubmitting(false);
      setApplyDialogOpen(false);
      setShowGettingStarted(true);
      
      toast({
        title: "Application Submitted Successfully",
        description: "You are now approved as a seller on SoundSync.",
      });
      
      // Change tab to seller dashboard
      handleTabChange("seller");
    }, 1500);
  };
  
  // Handle upload submission
  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!uploadFile) {
      toast({
        title: "No file selected",
        description: "Please select a file to upload.",
        variant: "destructive"
      });
      return;
    }
    
    // Simulate upload
    toast({
      title: "Uploading...",
      description: "Your file is being processed.",
    });
    
    setTimeout(() => {
      // Update localStorage
      try {
        const mockUserRaw = localStorage.getItem('mockUser');
        if (mockUserRaw) {
          const mockUser = JSON.parse(mockUserRaw);
          if (mockUser.sellerSteps) {
            mockUser.sellerSteps.upload = true;
          } else {
            mockUser.sellerSteps = {
              profile: true,
              upload: true,
              payment: false
            };
          }
          
          localStorage.setItem('mockUser', JSON.stringify(mockUser));
          setStepCompleted(prev => ({
            ...prev,
            upload: true
          }));
          
          // Check if all steps are now completed
          if (mockUser.sellerSteps.profile && 
              true && // upload is now true
              mockUser.sellerSteps.payment) {
            setAllStepsCompleted(true);
          }
        }
      } catch (e) {
        console.error('Error updating mock user data', e);
      }
      
      setUploadDialogOpen(false);
      
      toast({
        title: "Upload Complete",
        description: "Your sound has been uploaded successfully.",
      });
    }, 2000);
  };
  
  // Toggle payment method between bank and paypal
  const togglePaymentMethod = (method: string) => {
    setPaymentMethod(method);
  };
  
  // Handle payment info submission
  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Tax form submission
    if (showTaxForm) {
      // Handle tax form submission
      toast({
        title: "Submitting Tax Form...",
        description: "Processing your tax information.",
      });
      
      // Simulate form processing
      setTimeout(() => {
        const now = new Date();
        
        // Update localStorage to mark tax form as completed
        try {
          const mockUserRaw = localStorage.getItem('mockUser');
          if (mockUserRaw) {
            const mockUser = JSON.parse(mockUserRaw);
            
            // Make sure payment info exists
            if (!mockUser.paymentInfo) {
              mockUser.paymentInfo = {
                paymentMethod: paymentMethod,
                bankName: paymentMethod === "bank" ? bankName : "",
                accountType: paymentMethod === "bank" ? bankAccountType : "",
                accountNumber: paymentMethod === "bank" ? accountNumber : "",
                routingNumber: paymentMethod === "bank" && selectedCountry === "US" ? routingNumber : "",
                swiftCode: paymentMethod === "bank" && selectedCountry !== "US" ? swiftCode : "",
                paypalEmail: paymentMethod === "paypal" ? (document.getElementById('paypal-email') as HTMLInputElement)?.value || "" : "",
                country: selectedCountry,
                taxFormType: taxFormType
              };
            }
            
            // Update tax form status
            mockUser.paymentInfo.taxFormStatus = "completed";
            
            // Complete the seller steps
            if (mockUser.sellerSteps) {
              mockUser.sellerSteps.payment = true;
            } else {
              mockUser.sellerSteps = {
                profile: true,
                upload: false,
                payment: true
              };
            }
            
            // Store last payment update time
            mockUser.lastPaymentUpdate = now.toISOString();
            
            localStorage.setItem('mockUser', JSON.stringify(mockUser));
            
            // Update UI state
            setStepCompleted(prev => ({
              ...prev,
              payment: true
            }));
            
            // Check if all steps are now completed
            if (mockUser.sellerSteps.profile && 
                mockUser.sellerSteps.upload && 
                true) { // payment is now true
              setAllStepsCompleted(true);
            }
            
            setLastPaymentUpdate(now);
            setPaymentUpdateDisabled(true);
          }
        } catch (e) {
          console.error('Error updating tax form status', e);
        }
        
        // Close the dialog completely rather than just going back to payment form
        setPaymentDialogOpen(false);
        setShowTaxForm(false);
        
        toast({
          title: "Payment Setup Complete",
          description: "Your tax information and payment details have been successfully processed.",
        });
      }, 1500);
      
      return;
    }
    
    // Payment info submission
    toast({
      title: "Connecting...",
      description: "Setting up your payment information.",
    });
    
    setTimeout(() => {
      const now = new Date();
      
      // Update localStorage
      try {
        const mockUserRaw = localStorage.getItem('mockUser');
        if (mockUserRaw) {
          const mockUser = JSON.parse(mockUserRaw);
          
          // Add payment information
          mockUser.paymentInfo = {
            paymentMethod: paymentMethod,
            // Bank info (if applicable)
            bankName: paymentMethod === "bank" ? bankName : "",
            accountType: paymentMethod === "bank" ? bankAccountType : "",
            accountNumber: paymentMethod === "bank" ? accountNumber : "",
            routingNumber: paymentMethod === "bank" && selectedCountry === "US" ? routingNumber : "",
            swiftCode: paymentMethod === "bank" && selectedCountry !== "US" ? swiftCode : "",
            // PayPal info (if applicable)
            paypalEmail: paymentMethod === "paypal" ? (document.getElementById('paypal-email') as HTMLInputElement)?.value || "" : "",
            // Tax info
            country: selectedCountry,
            taxFormType: taxFormType,
            taxFormStatus: "pending"
          };
          
          // Don't mark steps as complete yet - that happens after tax form
          localStorage.setItem('mockUser', JSON.stringify(mockUser));
        }
      } catch (e) {
        console.error('Error updating mock user data', e);
      }
      
      // Show the tax form immediately after saving payment info
      setShowTaxForm(true);
      
      toast({
        title: "Payment Info Connected",
        description: `Your ${paymentMethod === "bank" ? "bank account" : "PayPal account"} information has been saved. Please complete your tax form to finalize setup.`,
      });
    }, 1500);
  };
  
  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadFile(e.target.files[0]);
    }
  };
  
  const getNextUpdateDate = () => {
    if (lastPaymentUpdate) {
      const nextDate = addWeeks(lastPaymentUpdate, 1);
      return format(nextDate, "MMMM d, yyyy");
    }
    return "";
  };

  // Handle country change for payment form
  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const country = e.target.value;
    setSelectedCountry(country);
    
    // Set appropriate tax form based on country
    if (country === "US") {
      setTaxFormType("W-9");
    } else if (["CA", "MX", "GB", "DE", "FR", "ES", "IT", "AU"].includes(country)) {
      setTaxFormType("W-8BEN");
    } else {
      setTaxFormType("W-8BEN-E");
    }
  };

  // Format tax form name for display
  const getTaxFormDisplayName = () => {
    switch (taxFormType) {
      case "W-9":
        return "Form W-9 (US persons)";
      case "W-8BEN":
        return "Form W-8BEN (Non-US individuals)";
      case "W-8BEN-E":
        return "Form W-8BEN-E (Non-US entities)";
      default:
        return "Tax Form";
    }
  };

  // Handle bank name input
  const handleBankNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBankName(e.target.value);
  };

  // Handle account number input
  const handleAccountNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAccountNumber(e.target.value);
  };

  // Handle routing number input
  const handleRoutingNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRoutingNumber(e.target.value);
  };

  // Handle swift code input
  const handleSwiftCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSwiftCode(e.target.value);
  };

  // Handle bank account type selection
  const handleBankAccountTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setBankAccountType(e.target.value);
  };

  // Toggle between payment info and tax form
  const toggleTaxForm = () => {
    setShowTaxForm(!showTaxForm);
  };

  // Add this to componentDidMount equivalent (useEffect with empty dependency array)
  useEffect(() => {
    // Setup event listener for entity type selection
    const setupEntityTypeListener = () => {
      const entityTypeSelect = document.getElementById('entity-type');
      const otherEntityContainer = document.getElementById('other-entity-type-container');
      
      if (entityTypeSelect && otherEntityContainer) {
        entityTypeSelect.addEventListener('change', function() {
          if ((this as HTMLSelectElement).value === 'other') {
            otherEntityContainer.style.display = 'block';
            (document.getElementById('other-entity-type') as HTMLInputElement).required = true;
          } else {
            otherEntityContainer.style.display = 'none';
            (document.getElementById('other-entity-type') as HTMLInputElement).required = false;
          }
        });
      }
    };
    
    // Call it when payment dialog opens
    if (paymentDialogOpen && showTaxForm && taxFormType === "W-8BEN-E") {
      // Use setTimeout to ensure DOM is ready
      setTimeout(setupEntityTypeListener, 100);
    }
  }, [paymentDialogOpen, showTaxForm, taxFormType]);

  // Function to open service details dialog
  const handleViewServiceDetails = (service: Purchase) => {
    setSelectedService(service);
    setServiceDetailsOpen(true);
  };

  // Add a function to handle service file changes
  const handleServiceFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setServiceFileUpload(e.target.files[0]);
    }
  };

  // Add a function to handle service file upload submission
  const handleServiceFileUpload = (serviceId: string) => {
    if (!serviceFileUpload) {
      toast({
        title: "Please select a file",
        description: "You need to select a file to upload.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    
    // Store upload information in localStorage with a flag indicating a successful upload
    const uploadKey = `service_upload_${serviceId}`;
    localStorage.setItem(uploadKey, JSON.stringify({
      filename: serviceFileUpload.name,
      inProgress: true,
      timestamp: new Date().toISOString(),
      uploadComplete: false // Will be set to true after processing
    }));
    
    // Simulate file upload process
    setTimeout(() => {
      // Get current date for timestamps
      const now = new Date();
      const formattedDate = now.toISOString().split('T')[0];
      
      // Update the service with the new file and progress steps
      const updatedPurchases = purchases.map(purchase => {
        if (purchase.id === serviceId) {
          const files = purchase.files || [];
          
          // Create progress steps similar to mastering
          const progressSteps = [
            {
              title: "Files Uploaded",
              completed: true, 
              date: formattedDate
            },
            {
              title: "In Progress",
              completed: true,
              date: formattedDate
            },
            {
              title: "Review",
              completed: false
            },
            {
              title: "Completed",
              completed: false
            }
          ];
          
          // Create the updated service
          const updatedService = {
            ...purchase,
            files: [...files, serviceFileUpload.name],
            progressValue: 10, // Start progress at 10%
            status: "in-progress" as const,
            progressSteps: progressSteps // Add the progress steps
          };
          
          return updatedService;
        }
        return purchase;
      });
      
      // Update state
      setPurchases(updatedPurchases);
      
      // Important: Save to both localStorage locations to ensure consistency
      localStorage.setItem('userPurchases', JSON.stringify(updatedPurchases));
      
      // Also update mockUser if it exists
      const mockUserRaw = localStorage.getItem('mockUser');
      if (mockUserRaw) {
        try {
          const mockUser = JSON.parse(mockUserRaw);
          if (mockUser.purchases && Array.isArray(mockUser.purchases)) {
            // Update the specific purchase in mockUser
            const updatedMockPurchases = mockUser.purchases.map((p: any) => {
              if (p.id === serviceId || (p.serviceName && p.serviceName === purchases.find(s => s.id === serviceId)?.name)) {
                return {
                  ...p,
                  files: [...(p.files || []), serviceFileUpload.name],
                  status: "in-progress",
                  progressValue: 10
                };
              }
              return p;
            });
            
            mockUser.purchases = updatedMockPurchases;
            localStorage.setItem('mockUser', JSON.stringify(mockUser));
          }
        } catch (e) {
          console.error('Error updating mockUser', e);
        }
      }
      
      // Mark this upload as complete to prevent it from being overwritten by polling
      localStorage.setItem(uploadKey, JSON.stringify({
        filename: serviceFileUpload.name,
        inProgress: false,
        timestamp: new Date().toISOString(),
        uploadComplete: true
      }));
      
      setServiceFileUpload(null);
      setIsUploading(false);
      
      toast({
        title: "File uploaded successfully",
        description: "Your track has been uploaded and the service is now in progress.",
        variant: "default",
      });
      
      // Close the dialog after successful upload
      setServiceDetailsOpen(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />
      <main className="flex-1 py-10">
        <div className="container">
          <h1 className="mb-6 text-3xl font-bold">My Dashboard</h1>
          
          {/* Become a Seller Button (visible only if not already a seller) */}
          {!isSellerApproved && (
            <div className="mb-8 relative overflow-hidden">
              <Card className="border-2 border-beatforge-500/50 hover:border-beatforge-500 transition-all duration-300">
                <CardContent className="pt-6 pb-6">
                  <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex gap-4 items-center">
                      <div className="h-12 w-12 rounded-full bg-beatforge-100 dark:bg-beatforge-900 flex items-center justify-center">
                        <Store className="h-6 w-6 text-beatforge-500" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">Become a Seller</h3>
                        <p className="text-sm text-muted-foreground">
                          Share your beats and samples with our community and earn money.
                        </p>
                      </div>
                    </div>
                    <Button 
                      className="group relative overflow-hidden bg-beatforge-500 hover:bg-beatforge-600 transition-all duration-300"
                      onClick={() => setApplyDialogOpen(true)}
                    >
                      <span className="relative z-10 flex items-center">
                        Apply Now 
                        <ArrowRight className="ml-2 h-4 w-4 transition-all duration-300 group-hover:translate-x-1" />
                      </span>
                      <span className="absolute inset-0 z-0 bg-gradient-to-r from-beatforge-400 to-beatforge-600 opacity-0 group-hover:opacity-100 transition-all duration-300"></span>
                    </Button>
                  </div>
                </CardContent>
                <div className="absolute -top-10 -right-10 h-32 w-32 bg-beatforge-500/10 rounded-full blur-xl"></div>
                <div className="absolute -bottom-8 -left-8 h-24 w-24 bg-beatforge-500/10 rounded-full blur-xl"></div>
              </Card>
            </div>
          )}
          
          {/* Seller Application Dialog */}
          <Dialog open={applyDialogOpen} onOpenChange={setApplyDialogOpen}>
            <DialogContent className="sm:max-w-[600px] bg-card dark:bg-card max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-xl">Apply to Become a Seller</DialogTitle>
                <DialogDescription>
                  Complete your artist profile to start selling beats and samples.
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleApplicationSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="artistName" className="text-sm font-medium">
                      Artist/Producer Name *
                    </Label>
                    <Input 
                      id="artistName"
                      name="artistName"
                      value={formData.artistName}
                      onChange={handleInputChange}
                      className="mt-1 border-beatforge-700/50 bg-background"
                      placeholder="Your artist name"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="biography" className="text-sm font-medium">
                    Biography *
                  </Label>
                  <Textarea 
                    id="biography"
                    name="biography"
                    value={formData.biography}
                    onChange={handleInputChange}
                    className="mt-1 border-beatforge-700/50 bg-background"
                    placeholder="Tell us about yourself and your music"
                    required
                  />
                </div>
                
                <div>
                  <div className="mb-2 text-sm font-medium">
                    Genres (Select all that apply) *
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="hipHop" 
                        checked={formData.genres.hipHop}
                        onCheckedChange={() => handleCheckboxChange("hipHop")} 
                      />
                      <label htmlFor="hipHop" className="text-sm cursor-pointer">Hip Hop</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="trap" 
                        checked={formData.genres.trap}
                        onCheckedChange={() => handleCheckboxChange("trap")} 
                      />
                      <label htmlFor="trap" className="text-sm cursor-pointer">Trap</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="rnb" 
                        checked={formData.genres.rnb}
                        onCheckedChange={() => handleCheckboxChange("rnb")} 
                      />
                      <label htmlFor="rnb" className="text-sm cursor-pointer">R&B</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="pop" 
                        checked={formData.genres.pop}
                        onCheckedChange={() => handleCheckboxChange("pop")} 
                      />
                      <label htmlFor="pop" className="text-sm cursor-pointer">Pop</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="edm" 
                        checked={formData.genres.edm}
                        onCheckedChange={() => handleCheckboxChange("edm")} 
                      />
                      <label htmlFor="edm" className="text-sm cursor-pointer">EDM</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="house" 
                        checked={formData.genres.house}
                        onCheckedChange={() => handleCheckboxChange("house")} 
                      />
                      <label htmlFor="house" className="text-sm cursor-pointer">House</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="drill" 
                        checked={formData.genres.drill}
                        onCheckedChange={() => handleCheckboxChange("drill")} 
                      />
                      <label htmlFor="drill" className="text-sm cursor-pointer">Drill</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="lofi" 
                        checked={formData.genres.lofi}
                        onCheckedChange={() => handleCheckboxChange("lofi")} 
                      />
                      <label htmlFor="lofi" className="text-sm cursor-pointer">Lo-Fi</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="rock" 
                        checked={formData.genres.rock}
                        onCheckedChange={() => handleCheckboxChange("rock")} 
                      />
                      <label htmlFor="rock" className="text-sm cursor-pointer">Rock</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="jazz" 
                        checked={formData.genres.jazz}
                        onCheckedChange={() => handleCheckboxChange("jazz")} 
                      />
                      <label htmlFor="jazz" className="text-sm cursor-pointer">Jazz</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="reggaeton" 
                        checked={formData.genres.reggaeton}
                        onCheckedChange={() => handleCheckboxChange("reggaeton")} 
                      />
                      <label htmlFor="reggaeton" className="text-sm cursor-pointer">Reggaeton</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="other" 
                        checked={formData.genres.other}
                        onCheckedChange={() => handleCheckboxChange("other")} 
                      />
                      <label htmlFor="other" className="text-sm cursor-pointer">Other</label>
                    </div>
                  </div>
                </div>
                
                <div className="text-sm font-medium mb-2">Social Media (Optional)</div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="website" className="text-sm">
                      Website
                    </Label>
                    <Input 
                      id="website"
                      name="website"
                      value={formData.website}
                      onChange={handleInputChange}
                      className="mt-1 border-beatforge-700/50 bg-background"
                      placeholder="https://yourwebsite.com"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="instagram" className="text-sm">
                      Instagram
                    </Label>
                    <Input 
                      id="instagram"
                      name="instagram"
                      value={formData.instagram}
                      onChange={handleInputChange}
                      className="mt-1 border-beatforge-700/50 bg-background"
                      placeholder="@yourusername"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="twitter" className="text-sm">
                      Twitter
                    </Label>
                    <Input 
                      id="twitter"
                      name="twitter"
                      value={formData.twitter}
                      onChange={handleInputChange}
                      className="mt-1 border-beatforge-700/50 bg-background"
                      placeholder="@yourusername"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="soundcloud" className="text-sm">
                      SoundCloud
                    </Label>
                    <Input 
                      id="soundcloud"
                      name="soundcloud"
                      value={formData.soundcloud}
                      onChange={handleInputChange}
                      className="mt-1 border-beatforge-700/50 bg-background"
                      placeholder="soundcloud.com/yourusername"
                    />
                  </div>
                </div>
                
                <div className="flex items-start space-x-2">
                  <Checkbox 
                    id="termsAccepted" 
                    checked={formData.termsAccepted}
                    onCheckedChange={() => handleCheckboxChange("termsAccepted")} 
                    className="mt-1"
                  />
                  <label htmlFor="termsAccepted" className="text-sm cursor-pointer">
                    I accept the <span className="text-beatforge-500">Terms and Conditions</span> for sellers, including the terms related to royalties, content ownership, and platform fees.
                  </label>
                </div>
                
                <DialogFooter className="flex sm:justify-end gap-2 pt-2">
                  <DialogClose asChild>
                    <Button type="button" variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button 
                    type="submit" 
                    disabled={applicationSubmitting}
                    className="bg-beatforge-500 hover:bg-beatforge-600"
                  >
                    {applicationSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Submitting...
                      </>
                    ) : (
                      "Submit Application"
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
          
          {/* Upload Sound Dialog */}
          <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
            <DialogContent className="sm:max-w-[500px] bg-card dark:bg-card max-h-[85vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-xl">Upload Your Sound</DialogTitle>
                <DialogDescription>
                  Upload a beat or sample pack to start selling.
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleUploadSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-gray-700 rounded-lg p-4 text-center">
                    <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-sm font-medium mb-2">Drag and drop or click to upload</p>
                    <p className="text-xs text-muted-foreground mb-3">Supports MP3, WAV, AIFF, FLAC (Max 100MB)</p>
                    <Input 
                      id="sound-file" 
                      type="file"
                      className="hidden"
                      onChange={handleFileChange}
                      accept=".mp3,.wav,.aiff,.flac"
                    />
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => document.getElementById('sound-file')?.click()}
                    >
                      Select File
                    </Button>
                    
                    {uploadFile && (
                      <div className="mt-3 text-left p-2 bg-background rounded-md">
                        <p className="text-sm font-medium truncate">{uploadFile.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {(uploadFile.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="sound-title">Title</Label>
                    <Input 
                      id="sound-title" 
                      placeholder="Enter title for your sound"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="sound-description">Description</Label>
                    <Textarea 
                      id="sound-description" 
                      placeholder="Describe your sound, including key, BPM, etc."
                      rows={3}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="sound-price">Price ($)</Label>
                      <Input 
                        id="sound-price" 
                        placeholder="19.99"
                        type="number"
                        min="0.99"
                        step="0.01"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="sound-genre">Genre</Label>
                      <select
                        id="sound-genre"
                        className="w-full h-10 px-3 rounded-md border border-input bg-background"
                        required
                      >
                        <option value="">Select genre</option>
                        <option value="hip-hop">Hip Hop</option>
                        <option value="trap">Trap</option>
                        <option value="rnb">R&B</option>
                        <option value="pop">Pop</option>
                        <option value="edm">EDM</option>
                        <option value="house">House</option>
                        <option value="drill">Drill</option>
                        <option value="lofi">Lo-Fi</option>
                        <option value="rock">Rock</option>
                        <option value="jazz">Jazz</option>
                        <option value="reggaeton">Reggaeton</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="sound-bpm">BPM</Label>
                      <Input 
                        id="sound-bpm" 
                        placeholder="120"
                        type="number"
                        min="1"
                        max="999"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="sound-key">Key</Label>
                      <select
                        id="sound-key"
                        className="w-full h-10 px-3 rounded-md border border-input bg-background"
                      >
                        <option value="">Select key</option>
                        <option value="C">C</option>
                        <option value="C#">C#</option>
                        <option value="D">D</option>
                        <option value="D#">D#</option>
                        <option value="E">E</option>
                        <option value="F">F</option>
                        <option value="F#">F#</option>
                        <option value="G">G</option>
                        <option value="G#">G#</option>
                        <option value="A">A</option>
                        <option value="A#">A#</option>
                        <option value="B">B</option>
                      </select>
                    </div>
                  </div>
                </div>
                
                <DialogFooter className="flex justify-end gap-2 pt-4 mt-2">
                  <DialogClose asChild>
                    <Button type="button" variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button 
                    type="submit" 
                    className="bg-beatforge-500 hover:bg-beatforge-600"
                  >
                    Upload Sound
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
          
          {/* Payment Info Dialog */}
          <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
            <DialogContent className="sm:max-w-[500px] bg-card dark:bg-card max-h-[85vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-xl">Connect Payment</DialogTitle>
                <DialogDescription>
                  Set up your payment information to receive earnings.
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handlePaymentSubmit} className="space-y-6">
                {paymentUpdateDisabled && (
                  <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-md">
                    <p className="text-sm text-yellow-500">
                      Payment information can only be updated once per week. 
                      Next update available on {getNextUpdateDate()}.
                    </p>
                  </div>
                )}
                
                {!showTaxForm ? (
                  /* Payment Information Form */
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="country">Country/Region *</Label>
                      <select 
                        id="country" 
                        value={selectedCountry}
                        onChange={handleCountryChange}
                        disabled={paymentUpdateDisabled}
                        className="w-full h-10 px-3 rounded-md border border-input bg-background"
                        required
                      >
                        <option value="US">United States</option>
                        <option value="CA">Canada</option>
                        <option value="GB">United Kingdom</option>
                        <option value="AU">Australia</option>
                        <option value="DE">Germany</option>
                        <option value="FR">France</option>
                        <option value="ES">Spain</option>
                        <option value="IT">Italy</option>
                        <option value="JP">Japan</option>
                        <option value="BR">Brazil</option>
                        <option value="MX">Mexico</option>
                        <option value="IN">India</option>
                        <option value="OTHER">Other</option>
                      </select>
                      <p className="text-xs text-muted-foreground">
                        Your tax form will be determined based on your country
                      </p>
                    </div>
                    
                    {/* Payment Method Toggle */}
                    <div className="flex items-center justify-center space-x-2 pt-2 border-t">
                      <div className="bg-muted rounded-lg p-1 flex w-full max-w-[300px] mx-auto">
                        <button
                          type="button"
                          className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                            paymentMethod === "bank" 
                              ? "bg-background shadow-sm" 
                              : "text-muted-foreground hover:bg-muted-foreground/10"
                          }`}
                          onClick={() => togglePaymentMethod("bank")}
                        >
                          Bank Account
                        </button>
                        <button
                          type="button"
                          className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                            paymentMethod === "paypal" 
                              ? "bg-background shadow-sm" 
                              : "text-muted-foreground hover:bg-muted-foreground/10"
                          }`}
                          onClick={() => togglePaymentMethod("paypal")}
                        >
                          PayPal
                        </button>
                      </div>
                    </div>
                    
                    {paymentMethod === "bank" ? (
                      /* Bank Account Form */
                      <div className="space-y-4 pt-2">
                        <h3 className="text-sm font-medium mb-1">Bank Account Information</h3>
                        
                        <div className="space-y-2">
                          <Label htmlFor="bank-name">Bank Name *</Label>
                          <Input 
                            id="bank-name" 
                            value={bankName}
                            onChange={handleBankNameChange}
                            placeholder="Enter your bank name"
                            disabled={paymentUpdateDisabled}
                            required
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="account-type">Account Type *</Label>
                          <select 
                            id="account-type" 
                            value={bankAccountType}
                            onChange={handleBankAccountTypeChange}
                            disabled={paymentUpdateDisabled}
                            className="w-full h-10 px-3 rounded-md border border-input bg-background"
                            required
                          >
                            <option value="checking">Checking</option>
                            <option value="savings">Savings</option>
                            <option value="business">Business</option>
                          </select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="account-number">Account Number *</Label>
                          <Input 
                            id="account-number" 
                            value={accountNumber}
                            onChange={handleAccountNumberChange}
                            placeholder="Enter account number"
                            disabled={paymentUpdateDisabled}
                            required
                          />
                        </div>
                        
                        <div className="space-y-2">
                          {selectedCountry === "US" ? (
                            <>
                              <Label htmlFor="routing-number">Routing Number *</Label>
                              <Input 
                                id="routing-number" 
                                value={routingNumber}
                                onChange={handleRoutingNumberChange}
                                placeholder="9-digit routing number"
                                disabled={paymentUpdateDisabled}
                                required
                              />
                            </>
                          ) : (
                            <>
                              <Label htmlFor="swift-code">SWIFT/BIC Code *</Label>
                              <Input 
                                id="swift-code" 
                                value={swiftCode}
                                onChange={handleSwiftCodeChange}
                                placeholder="International bank code"
                                disabled={paymentUpdateDisabled}
                                required
                              />
                            </>
                          )}
                        </div>
                      </div>
                    ) : (
                      /* PayPal Form */
                      <div className="space-y-4 pt-2">
                        <h3 className="text-sm font-medium mb-1">PayPal Information</h3>
                        
                        <div className="space-y-2">
                          <Label htmlFor="paypal-email">PayPal Email *</Label>
                          <Input 
                            id="paypal-email" 
                            type="email"
                            placeholder="your@email.com"
                            disabled={paymentUpdateDisabled}
                            required={paymentMethod === "paypal"}
                          />
                          <p className="text-xs text-muted-foreground">
                            Payments will be sent to this PayPal account
                          </p>
                        </div>

                        <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-md">
                          <p className="text-xs text-blue-500">
                            <strong>Note:</strong> While PayPal is convenient for smaller payments, direct bank deposits are recommended for larger amounts to minimize fees.
                          </p>
                        </div>
                      </div>
                    )}
                    
                    <div className="pt-4 mt-4 border-t">
                      <h3 className="text-sm font-medium mb-2">Tax Information</h3>
                      <p className="text-xs text-muted-foreground mb-4">
                        As required by tax regulations, you must complete the appropriate tax form.
                        Based on your country, we've determined you need to complete:
                      </p>
                      
                      <div className="p-4 border rounded-md bg-muted/50">
                        <div className="flex items-start">
                          <div className="h-6 w-6 flex-none rounded bg-primary/20 flex items-center justify-center mr-3 mt-0.5">
                            <span className="text-xs font-medium text-primary">TX</span>
                          </div>
                          <div>
                            <p className="font-medium">{getTaxFormDisplayName()}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {taxFormType === "W-9" 
                                ? "For US citizens and residents" 
                                : taxFormType === "W-8BEN" 
                                  ? "For non-US individuals" 
                                  : "For non-US entities and businesses"
                              }
                            </p>
                          </div>
                        </div>
                        
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm" 
                          className="mt-3 w-full"
                          disabled={paymentUpdateDisabled}
                          onClick={toggleTaxForm}
                        >
                          Complete Tax Form
                        </Button>
                      </div>
                    </div>
                    
                    <DialogFooter className="flex justify-end gap-2 pt-2 mt-2">
                      <DialogClose asChild>
                        <Button type="button" variant="outline">Cancel</Button>
                      </DialogClose>
                      <Button 
                        type="submit" 
                        className="bg-beatforge-500 hover:bg-beatforge-600"
                        disabled={
                          paymentUpdateDisabled && 
                          !(() => {
                            try {
                              const storedUserData = localStorage.getItem('mockUser');
                              return storedUserData && JSON.parse(storedUserData)?.paymentInfo?.taxFormStatus === "completed";
                            } catch (e) {
                              return false;
                            }
                          })() && 
                          ((paymentMethod === "bank" && (!bankName || !accountNumber || (selectedCountry === "US" ? !routingNumber : !swiftCode))) ||
                          (paymentMethod === "paypal" && !(document.getElementById('paypal-email') as HTMLInputElement)?.value))
                        }
                      >
                        Save Payment Information
                      </Button>
                    </DialogFooter>
                  </div>
                ) : (
                  /* Tax Form Content - Different forms based on tax form type */
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium">
                        {getTaxFormDisplayName()}
                      </h3>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={toggleTaxForm}
                        className="text-muted-foreground"
                      >
                        Back to Payment Info
                      </Button>
                    </div>
                    
                    {taxFormType === "W-9" ? (
                      /* W-9 Form (US) */
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="legal-name">Legal Name *</Label>
                          <Input 
                            id="legal-name" 
                            placeholder="As shown on your income tax return"
                            disabled={paymentUpdateDisabled}
                            required
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="business-name">Business Name (if different)</Label>
                          <Input 
                            id="business-name" 
                            placeholder="Disregarded entity name, if applicable"
                            disabled={paymentUpdateDisabled}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="tax-classification">Federal Tax Classification *</Label>
                          <select 
                            id="tax-classification" 
                            className="w-full h-10 px-3 rounded-md border border-input bg-background"
                            disabled={paymentUpdateDisabled}
                            required
                          >
                            <option value="">Select classification</option>
                            <option value="individual">Individual/Sole proprietor or single-member LLC</option>
                            <option value="c-corp">C Corporation</option>
                            <option value="s-corp">S Corporation</option>
                            <option value="partnership">Partnership</option>
                            <option value="trust-estate">Trust/Estate</option>
                            <option value="llc">Limited liability company</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="tax-id">Taxpayer Identification Number (SSN/EIN) *</Label>
                          <Input 
                            id="tax-id" 
                            placeholder="XXX-XX-XXXX or XX-XXXXXXX"
                            disabled={paymentUpdateDisabled}
                            required
                          />
                          <p className="text-xs text-muted-foreground">
                            For individuals, this is your Social Security Number (SSN). For other entities, it is your Employer Identification Number (EIN).
                          </p>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="address">Address *</Label>
                          <Input 
                            id="address" 
                            placeholder="Street address"
                            disabled={paymentUpdateDisabled}
                            required
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="city">City *</Label>
                            <Input 
                              id="city" 
                              placeholder="City"
                              disabled={paymentUpdateDisabled}
                              required
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="state">State *</Label>
                            <Input 
                              id="state" 
                              placeholder="State"
                              disabled={paymentUpdateDisabled}
                              required
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="zip">ZIP Code *</Label>
                          <Input 
                            id="zip" 
                            placeholder="ZIP Code"
                            disabled={paymentUpdateDisabled}
                            required
                          />
                        </div>
                        
                        <div className="flex items-start space-x-2 mt-4 pt-4 border-t">
                          <Checkbox 
                            id="certification" 
                            className="mt-1"
                            disabled={paymentUpdateDisabled}
                            required
                          />
                          <label htmlFor="certification" className="text-sm">
                            Under penalties of perjury, I certify that: 1) The number shown is my correct taxpayer identification number, 2) I am not subject to backup withholding, and 3) I am a U.S. citizen or other U.S. person.
                          </label>
                        </div>
                      </div>
                    ) : taxFormType === "W-8BEN" ? (
                      /* W-8BEN Form (Non-US Individuals) */
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="foreign-name">Full Name *</Label>
                          <Input 
                            id="foreign-name" 
                            placeholder="Individual who is the beneficial owner"
                            disabled={paymentUpdateDisabled}
                            required
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="country-citizenship">Country of Citizenship *</Label>
                          <Input 
                            id="country-citizenship" 
                            value={selectedCountry}
                            disabled={true}
                            required
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="permanent-residence">Permanent Residence Address *</Label>
                          <Input 
                            id="permanent-residence" 
                            placeholder="Street, apt. or suite no."
                            disabled={paymentUpdateDisabled}
                            required
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="foreign-city">City or Town *</Label>
                            <Input 
                              id="foreign-city" 
                              placeholder="City"
                              disabled={paymentUpdateDisabled}
                              required
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="foreign-state">Province/State/Region</Label>
                            <Input 
                              id="foreign-state" 
                              placeholder="Province"
                              disabled={paymentUpdateDisabled}
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="foreign-postal">Postal Code *</Label>
                            <Input 
                              id="foreign-postal" 
                              placeholder="Postal code"
                              disabled={paymentUpdateDisabled}
                              required
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="foreign-tax-id">Foreign Tax ID (if available)</Label>
                            <Input 
                              id="foreign-tax-id" 
                              placeholder="Foreign tax identifying number"
                              disabled={paymentUpdateDisabled}
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="reference-number">Reference Numbers (if applicable)</Label>
                          <Input 
                            id="reference-number" 
                            placeholder="SSN, ITIN, or reference number"
                            disabled={paymentUpdateDisabled}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="date-of-birth">Date of Birth (MM-DD-YYYY) *</Label>
                          <Input 
                            id="date-of-birth" 
                            placeholder="MM-DD-YYYY"
                            disabled={paymentUpdateDisabled}
                            required
                          />
                        </div>
                        
                        <div className="flex items-start space-x-2 mt-4 pt-4 border-t">
                          <Checkbox 
                            id="foreign-certification" 
                            className="mt-1"
                            disabled={paymentUpdateDisabled}
                            required
                          />
                          <label htmlFor="foreign-certification" className="text-sm">
                            I certify that: I am the individual who is the beneficial owner of the income, I am not a U.S. citizen or resident, and the information provided on this form is true and accurate.
                          </label>
                        </div>
                      </div>
                    ) : (
                      /* W-8BEN-E Form (Non-US Entities) - Simplified version */
                      <div className="space-y-4">
                        <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-md">
                          <p className="text-sm text-yellow-500">
                            The W-8BEN-E form is required for non-US entities. Please fill out this simplified version or contact our support team for assistance with the complete form.
                          </p>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="entity-name">Organization Name *</Label>
                          <Input 
                            id="entity-name" 
                            placeholder="Name of organization that is the beneficial owner"
                            disabled={paymentUpdateDisabled}
                            required
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="entity-country">Country of Incorporation *</Label>
                          <Input 
                            id="entity-country" 
                            value={selectedCountry}
                            disabled={true}
                            required
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="entity-type">Type of Entity *</Label>
                          <select 
                            id="entity-type" 
                            className="w-full h-10 px-3 rounded-md border border-input bg-background"
                            disabled={paymentUpdateDisabled}
                            required
                          >
                            <option value="">Select entity type</option>
                            <option value="corporation">Corporation</option>
                            <option value="disregarded">Disregarded entity</option>
                            <option value="partnership">Partnership</option>
                            <option value="simple-trust">Simple trust</option>
                            <option value="grantor-trust">Grantor trust</option>
                            <option value="complex-trust">Complex trust</option>
                            <option value="estate">Estate</option>
                            <option value="government">Government</option>
                            <option value="private-foundation">Private foundation</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                        
                        {/* Field for Other Entity Type Specification */}
                        <div className="space-y-2" id="other-entity-type-container" style={{display: 'none'}}>
                          <Label htmlFor="other-entity-type">Specify Entity Type *</Label>
                          <Input 
                            id="other-entity-type" 
                            placeholder="Specify your entity type"
                            disabled={paymentUpdateDisabled}
                          />
                          <p className="text-xs text-muted-foreground">
                            Please provide your specific entity classification
                          </p>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="permanent-address">Permanent Address *</Label>
                          <Input 
                            id="permanent-address" 
                            placeholder="Street, building, apt. or suite no."
                            disabled={paymentUpdateDisabled}
                            required
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="entity-city">City or Town *</Label>
                            <Input 
                              id="entity-city" 
                              placeholder="City"
                              disabled={paymentUpdateDisabled}
                              required
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="entity-region">Province/Region</Label>
                            <Input 
                              id="entity-region" 
                              placeholder="Province or region"
                              disabled={paymentUpdateDisabled}
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="entity-postal">Postal Code *</Label>
                          <Input 
                            id="entity-postal" 
                            placeholder="Postal code"
                            disabled={paymentUpdateDisabled}
                            required
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="tax-id">Tax Identification Number (TIN) / National Identification Number (NIN) *</Label>
                          <Input 
                            id="tax-id" 
                            placeholder="Enter your organization's TIN or NIN"
                            disabled={paymentUpdateDisabled}
                            required
                          />
                          <p className="text-xs text-muted-foreground">
                            Enter your organization's tax identification number or equivalent national identification number
                          </p>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="entity-contact">Contact Person Name *</Label>
                          <Input 
                            id="entity-contact" 
                            placeholder="Name of authorized person"
                            disabled={paymentUpdateDisabled}
                            required
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="entity-email">Contact Email *</Label>
                          <Input 
                            id="entity-email" 
                            type="email"
                            placeholder="contact@organization.com"
                            disabled={paymentUpdateDisabled}
                            required
                          />
                        </div>
                        
                        <div className="flex items-start space-x-2 mt-4 pt-4 border-t">
                          <Checkbox 
                            id="entity-certification" 
                            className="mt-1"
                            disabled={paymentUpdateDisabled}
                            required
                          />
                          <label htmlFor="entity-certification" className="text-sm">
                            I certify that the entity named is the beneficial owner of the income, is not a U.S. entity, and the information provided on this form is true and accurate.
                          </label>
                        </div>
                        
                        <DialogFooter className="flex sm:justify-end gap-2 pt-4 border-t">
                          <Button 
                            type="button" 
                            variant="outline" 
                            onClick={toggleTaxForm}
                          >
                            Back to Payment Info
                          </Button>
                          <Button 
                            type="submit" 
                            className="bg-beatforge-500 hover:bg-beatforge-600"
                          >
                            Submit Tax Form
                          </Button>
                        </DialogFooter>
                        
                        {/* Add JavaScript to show/hide the "other" entity type field */}
                      </div>
                    )}
                    
                    {/* Tax Form Submit Button */}
                    {taxFormType !== "W-8BEN-E" && (
                      <DialogFooter className="flex sm:justify-end gap-2 pt-4 border-t">
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={toggleTaxForm}
                        >
                          Back
                        </Button>
                        <Button 
                          type="submit" 
                          className="bg-beatforge-500 hover:bg-beatforge-600"
                          disabled={paymentUpdateDisabled}
                        >
                          Submit Tax Form
                        </Button>
                      </DialogFooter>
                    )}
                  </div>
                )}
              </form>
            </DialogContent>
          </Dialog>
          
          {/* Getting Started Card after approval but before all steps completed */}
          {showGettingStarted && !allStepsCompleted && (
            <Card className="mb-8 bg-card border-beatforge-500/20">
              <CardHeader>
                <CardTitle className="text-2xl">Getting Started</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 rounded-full ${stepCompleted.profile ? "bg-green-500/20 text-green-500" : "bg-zinc-700 text-white"} items-center justify-center`}>
                    {stepCompleted.profile ? (
                      <CheckCircle2 className="h-5 w-5" />
                    ) : (
                      <span className="text-sm font-medium">1</span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium">Create seller profile</h3>
                    <p className="text-sm text-muted-foreground">
                      {stepCompleted.profile ? "Completed" : "Fill out your artist information"}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div 
                    className={`flex h-10 w-10 rounded-full ${stepCompleted.upload ? "bg-green-500/20 text-green-500" : "bg-zinc-700 text-white"} items-center justify-center cursor-pointer`}
                    onClick={() => stepCompleted.profile && setUploadDialogOpen(true)}
                  >
                    {stepCompleted.upload ? (
                      <CheckCircle2 className="h-5 w-5" />
                    ) : (
                      <span className="text-sm font-medium">2</span>
                    )}
                  </div>
                  <div 
                    className={stepCompleted.profile ? "cursor-pointer" : ""}
                    onClick={() => stepCompleted.profile && setUploadDialogOpen(true)}
                  >
                    <h3 className="font-medium">Upload your first sound</h3>
                    <p className="text-sm text-muted-foreground">
                      Upload a beat or sample pack
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div 
                    className={`flex h-10 w-10 rounded-full ${stepCompleted.payment ? "bg-green-500/20 text-green-500" : "bg-zinc-700 text-white"} items-center justify-center ${stepCompleted.profile ? "cursor-pointer" : ""}`}
                    onClick={() => stepCompleted.profile && setPaymentDialogOpen(true)}
                  >
                    {stepCompleted.payment ? (
                      <CheckCircle2 className="h-5 w-5" />
                    ) : (
                      <span className="text-sm font-medium">3</span>
                    )}
                  </div>
                  <div 
                    className={stepCompleted.profile ? "cursor-pointer" : ""}
                    onClick={() => stepCompleted.profile && setPaymentDialogOpen(true)}
                  >
                    <h3 className="font-medium">Set up payment info</h3>
                    <p className="text-sm text-muted-foreground">
                      Connect your PayPal account {paymentUpdateDisabled && "(Next update available " + getNextUpdateDate() + ")"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Pending Approval Card - shown when all steps are complete but waiting for admin approval */}
          {allStepsCompleted && !isAdminApproved && (
            <Card className="mb-8 bg-card border-yellow-500/20">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-yellow-500" />
                  <CardTitle className="text-2xl">Pending Admin Approval</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-6 flex flex-col items-center text-center">
                  <div className="animate-pulse h-16 w-16 rounded-full bg-yellow-500/20 flex items-center justify-center mb-4">
                    <Clock className="h-8 w-8 text-yellow-500" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">Your seller application is under review</h3>
                  <p className="text-muted-foreground max-w-md">
                    Thanks for completing all the required steps! Our team is reviewing your application 
                    and will approve your seller account shortly. You'll receive a notification when approved.
                  </p>
                  
                  <div className="w-full max-w-md mt-6 pt-6 border-t border-border">
                    <div className="flex items-center gap-4 mb-2">
                      <div className="flex-none flex h-8 w-8 rounded-full bg-green-500/20 text-green-500 items-center justify-center">
                        <CheckCircle2 className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <p className="text-sm font-medium">Profile created</p>
                          <span className="text-xs text-muted-foreground">Completed</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 mb-2">
                      <div className="flex-none flex h-8 w-8 rounded-full bg-green-500/20 text-green-500 items-center justify-center">
                        <CheckCircle2 className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <p className="text-sm font-medium">Sound uploaded</p>
                          <span className="text-xs text-muted-foreground">Completed</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="flex-none flex h-8 w-8 rounded-full bg-green-500/20 text-green-500 items-center justify-center">
                        <CheckCircle2 className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <p className="text-sm font-medium">Payment info connected</p>
                          <span className="text-xs text-muted-foreground">Completed</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Approved Card - shown briefly when admin approves */}
          {isAdminApproved && allStepsCompleted && showGettingStarted && (
            <Card className="mb-8 bg-card border-green-500/20">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-green-500" />
                  <CardTitle className="text-2xl">Seller Account Approved!</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="p-4 flex flex-col items-center text-center">
                  <div className="h-16 w-16 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
                    <ShieldCheck className="h-8 w-8 text-green-500" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">Congratulations! You're now a verified seller</h3>
                  <p className="text-muted-foreground max-w-md mb-6">
                    Your seller account has been approved by our team. You can now access the seller dashboard 
                    and start selling your content to our community.
                  </p>
                  
                  <Button 
                    className="bg-beatforge-500 hover:bg-beatforge-600"
                    onClick={() => handleTabChange("seller")}
                  >
                    Go to Seller Dashboard
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Blocked Account Warning - shown when seller is blocked */}
          {isSellerApproved && isSellerBlocked && (
            <Card className="mb-8 bg-card border-red-500/20">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2">
                  <XCircle className="h-5 w-5 text-red-500" />
                  <CardTitle className="text-2xl">Seller Account Blocked</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="p-4 flex flex-col items-center text-center">
                  <div className="h-16 w-16 rounded-full bg-red-500/20 flex items-center justify-center mb-4">
                    <XCircle className="h-8 w-8 text-red-500" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">Your seller account has been blocked</h3>
                  <p className="text-muted-foreground max-w-md mb-6">
                    Your seller account has been temporarily blocked by our team. This means you can 
                    still use your user account, but you cannot sell content on our platform at this time.
                  </p>
                  
                  <p className="text-sm font-medium text-red-500 mb-4">
                    Possible reasons for account blocking:
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1 mb-6 text-left">
                    <li>• Violation of our terms of service</li>
                    <li>• Copyright infringement complaints</li>
                    <li>• Suspicious activity detected on your account</li>
                    <li>• Negative feedback from multiple customers</li>
                  </ul>
                  
                  <Button 
                    className="bg-red-500 hover:bg-red-600"
                    onClick={() => {
                      // Simulate sending an email or opening support
                      toast({
                        title: "Support Request Sent",
                        description: "Our team will contact you soon regarding your account status.",
                      });
                    }}
                  >
                    Contact Support
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
          
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className={`grid w-full ${isSellerApproved ? 'grid-cols-4' : 'grid-cols-3'} mb-8`}>
              <TabsTrigger value="purchases">
                <ShoppingBag className="h-4 w-4 mr-2" />
                My Purchases
              </TabsTrigger>
              <TabsTrigger value="services">
                <Headphones className="h-4 w-4 mr-2" />
                Services
              </TabsTrigger>
              {isSellerApproved && isAdminApproved && (
                <TabsTrigger value="seller">
                  <Package className="h-4 w-4 mr-2" />
                  Seller Dashboard
                </TabsTrigger>
              )}
              <TabsTrigger value="payments">
                <CreditCard className="h-4 w-4 mr-2" />
                Payment History
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="purchases" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {purchases.filter(item => item.type === "beat" || item.type === "marketplace").map((beat) => (
                  <Card key={beat.id} className="overflow-hidden">
                    <div className="h-40 relative">
                      <img 
                        src={beat.imageUrl} 
                        alt={beat.name} 
                        className="w-full h-full object-cover"
                      />
                      <Button 
                        size="icon" 
                        variant="secondary" 
                        className="absolute bottom-3 right-3 rounded-full opacity-90 hover:opacity-100"
                        onClick={() => togglePlayPause(beat.id)}
                      >
                        {isPlaying && activeAudio === beat.id ? 
                          <Pause className="h-5 w-5" /> : 
                          <Play className="h-5 w-5" />
                        }
                      </Button>
                    </div>
                    <CardHeader>
                      <CardTitle>{beat.name}</CardTitle>
                      <CardDescription>Purchased on {formatDate(beat.date)}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div className={`w-2 h-2 rounded-full ${getStatusColor(beat.status)} mr-2`}></div>
                          <span className="text-sm capitalize">{beat.status}</span>
                        </div>
                        <span className="font-medium">{beat.price}</span>
                      </div>
                      {beat.downloadUrl && beat.status === "completed" && (
                        <Button variant="outline" className="w-full mt-4">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              {purchases.filter(item => item.type === "beat" || item.type === "marketplace").length === 0 && (
                <div className="text-center py-12">
                  <ShoppingBag className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Purchases Yet</h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    You haven't made any purchases yet. Explore our marketplace to find high-quality beats, loops, and samples.
                  </p>
                  <Button onClick={() => navigate('/marketplace')}>
                    Browse Marketplace
                  </Button>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="services" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {purchases.filter(item => item.type === "service").map((service) => (
                  <Card key={service.id} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-xl font-semibold">{service.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              Ordered on {formatDate(service.date)}
                            </p>
                          </div>
                          <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(service.status)}`}>
                            {service.status.replace('-', ' ')}
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          {service.progressSteps ? (
                            <div className="space-y-3">
                              {service.progressSteps.map((step, index) => (
                                <div key={index} className="flex items-center">
                                  <div className={`h-4 w-4 rounded-full flex items-center justify-center mr-2 ${
                                    step.completed ? 'bg-green-500' : 'bg-muted'
                                  }`}>
                                    {step.completed && <CheckCircle2 className="h-3 w-3 text-white" />}
                                  </div>
                                  <div className="flex-1">
                                    <p className={`text-sm ${step.completed ? 'text-foreground' : 'text-muted-foreground'}`}>
                                      {step.title}
                                    </p>
                                    {step.date && step.completed && (
                                      <p className="text-xs text-muted-foreground">
                                        {formatDate(step.date)}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <ul className="text-sm space-y-2">
                              <li className="text-muted-foreground">Order received</li>
                              <li className="text-muted-foreground">Waiting for your files</li>
                            </ul>
                          )}
                          
                          {/* Show progress bar if available */}
                          {service.progressValue !== undefined && (
                            <div className="mt-4 space-y-1">
                              <div className="flex justify-between items-center text-xs">
                                <span>Progress</span>
                                <span>{service.progressValue}%</span>
                              </div>
                              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-beatforge-500" 
                                  style={{ width: `${service.progressValue}%` }}
                                ></div>
                              </div>
                            </div>
                          )}
                          
                          {/* Show uploaded files if any */}
                          {service.files && service.files.length > 0 && (
                            <div className="mt-4">
                              <p className="text-sm font-medium mb-1">Uploaded Files:</p>
                              <div className="text-xs text-muted-foreground">
                                {Array.isArray(service.files) && service.files.map((file: any, idx: number) => (
                                  <div key={idx} className="flex items-center py-1">
                                    <File className="h-3 w-3 mr-1" />
                                    <span className="truncate">{typeof file === 'string' ? file : file.name}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t">
                        <span className="font-medium">{service.price}</span>
                        <Button variant="outline" size="sm" onClick={() => handleViewServiceDetails(service)}>
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              {purchases.filter(item => item.type === "service").length === 0 && (
                <div className="text-center py-12">
                  <Headphones className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Services Yet</h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    You haven't purchased any services yet. Explore our mastering, mixing, and production services to enhance your music.
                  </p>
                  <Button onClick={() => navigate('/services')}>
                    Browse Services
                  </Button>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="payments" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Payment History</CardTitle>
                  <CardDescription>View all your past transactions and payment methods</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <div className="grid grid-cols-5 p-4 font-medium border-b">
                      <div>Date</div>
                      <div className="col-span-2">Description</div>
                      <div>Status</div>
                      <div className="text-right">Amount</div>
                    </div>
                    <div className="divide-y">
                      {purchases.map((purchase) => (
                        <div key={purchase.id} className="grid grid-cols-5 p-4 text-sm">
                          <div>{formatDate(purchase.date)}</div>
                          <div className="col-span-2">{purchase.name}</div>
                          <div className="capitalize">{purchase.status}</div>
                          <div className="text-right">{purchase.price}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <h3 className="text-lg font-medium mb-4">Payment Methods</h3>
                    <div className="flex flex-col space-y-4">
                      <div className="flex items-center justify-between p-4 border rounded-md">
                        <div className="flex items-center">
                          <div className="h-8 w-12 bg-gray-100 rounded mr-4 flex items-center justify-center">
                            <span className="text-xs font-medium">VISA</span>
                          </div>
                          <div>
                            <p className="font-medium">Visa ending in 4242</p>
                            <p className="text-sm text-muted-foreground">Expires 12/25</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">Edit</Button>
                      </div>
                      
                      <Button variant="outline">
                        <CreditCard className="h-4 w-4 mr-2" />
                        Add Payment Method
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {isSellerApproved && isAdminApproved && (
              <TabsContent value="seller" className="space-y-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">My Listings</h2>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create New Listing
                  </Button>
                </div>
                
                {listings.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {listings.map((listing) => (
                      <Card key={listing.id} className="overflow-hidden">
                        <div className="h-40 relative">
                          <img 
                            src={listing.imageUrl} 
                            alt={listing.title} 
                            className="w-full h-full object-cover"
                          />
                          <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs text-white ${getListingStatusColor(listing.status)}`}>
                            {listing.status}
                          </div>
                        </div>
                        <CardHeader>
                          <CardTitle>{listing.title}</CardTitle>
                          <CardDescription>Listed on {formatDate(listing.dateAdded)}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex justify-between items-center mb-4">
                            <span className="font-medium">{listing.price}</span>
                            <span className="text-sm text-muted-foreground">{listing.salesCount} sales</span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <Button variant="outline" size="sm">Edit</Button>
                            <Button variant="outline" size="sm">Manage</Button>
                            {listing.status === 'active' && (
                              <Button variant="outline" size="sm" className="text-red-500 hover:text-red-700">Unpublish</Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                      <Package className="h-16 w-16 text-muted-foreground mb-4" />
                      <h3 className="text-xl font-medium mb-2">No Listings Yet</h3>
                      <p className="text-muted-foreground text-center mb-6">Start selling your beats and audio resources today.</p>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Your First Listing
                      </Button>
                    </CardContent>
                  </Card>
                )}
                
                <Card>
                  <CardHeader>
                    <CardTitle>Sales Analytics</CardTitle>
                    <CardDescription>Performance metrics for your listings</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 border rounded-md">
                        <p className="text-sm text-muted-foreground">Total Revenue</p>
                        <p className="text-2xl font-bold">${listings.reduce((total, item) => total + (parseInt(item.price.replace('$', '')) * item.salesCount), 0)}</p>
                      </div>
                      <div className="p-4 border rounded-md">
                        <p className="text-sm text-muted-foreground">Total Sales</p>
                        <p className="text-2xl font-bold">{listings.reduce((total, item) => total + item.salesCount, 0)}</p>
                      </div>
                      <div className="p-4 border rounded-md">
                        <p className="text-sm text-muted-foreground">Active Listings</p>
                        <p className="text-2xl font-bold">{listings.filter(item => item.status === 'active').length}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            )}
          </Tabs>
        </div>
      </main>
      <Footer />

      {/* Add Service Details Dialog */}
      <Dialog open={serviceDetailsOpen} onOpenChange={setServiceDetailsOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Service Details</DialogTitle>
            <DialogDescription>
              {selectedService?.name}
            </DialogDescription>
          </DialogHeader>
          
          {selectedService && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/3">
                  <div className="rounded-lg overflow-hidden">
                    <img 
                      src={selectedService.imageUrl} 
                      alt={selectedService.name}
                      className="w-full h-auto object-cover" 
                    />
                  </div>
                  <div className="mt-4 space-y-1">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Order Date:</span>
                      <span className="text-sm font-medium">{formatDate(selectedService.date)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Price:</span>
                      <span className="text-sm font-medium">{selectedService.price}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Status:</span>
                      <span className={`text-sm font-medium ${
                        selectedService.status === "completed" ? "text-green-500" : 
                        selectedService.status === "in-progress" ? "text-blue-500" : 
                        "text-yellow-500"
                      }`}>
                        {selectedService.status.charAt(0).toUpperCase() + selectedService.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="md:w-2/3 space-y-4">
                  {/* Check if files are already uploaded */}
                  {(!selectedService.files || selectedService.files.length === 0) && (
                    <div className="border rounded-md p-4 space-y-4">
                      <div className="flex items-center gap-2">
                        <Upload className="h-5 w-5 text-beatforge-500" />
                        <h3 className="text-lg font-medium">Upload Your Track</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        To begin the {selectedService.name} process, please upload your track file.
                      </p>
                      
                      <div className="border-2 border-dashed border-muted rounded-lg p-6 text-center">
                        <input
                          type="file"
                          id="service-file-upload"
                          className="hidden"
                          accept=".mp3,.wav,.aiff,.flac"
                          onChange={handleServiceFileChange}
                        />
                        <label
                          htmlFor="service-file-upload"
                          className="flex flex-col items-center justify-center cursor-pointer"
                        >
                          <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                          <p className="text-sm font-medium mb-1">
                            {serviceFileUpload 
                              ? serviceFileUpload.name 
                              : "Drag and drop or click to upload"
                            }
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Supports MP3, WAV, AIFF, FLAC (Max 100MB)
                          </p>
                        </label>
                      </div>
                      
                      <Button 
                        className="w-full" 
                        onClick={() => handleServiceFileUpload(selectedService.id)}
                        disabled={!serviceFileUpload || isUploading}
                      >
                        {isUploading ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Uploading...
                          </>
                        ) : (
                          "Upload and Start Service"
                        )}
                      </Button>
                    </div>
                  )}
                  
                  {/* If files are uploaded, show the service progress */}
                  {selectedService.files && selectedService.files.length > 0 && (
                    <>
                      <div>
                        <h3 className="text-lg font-medium mb-2">Service Progress</h3>
                        {selectedService.progressSteps ? (
                          <div className="space-y-3">
                            {selectedService.progressSteps.map((step, index) => (
                              <div key={index} className="flex items-start">
                                <div className={`h-5 w-5 rounded-full flex items-center justify-center mr-3 ${
                                  step.completed ? 'bg-green-500' : 'bg-muted'
                                }`}>
                                  {step.completed && <CheckCircle2 className="h-3 w-3 text-white" />}
                                </div>
                                <div className="flex-1">
                                  <p className={`text-sm font-medium ${step.completed ? 'text-foreground' : 'text-muted-foreground'}`}>
                                    {step.title}
                                  </p>
                                  {step.date && step.completed && (
                                    <p className="text-xs text-muted-foreground">
                                      {formatDate(step.date)}
                                    </p>
                                  )}
                                  {step.description && (
                                    <p className="text-xs text-muted-foreground mt-1">
                                      {step.description}
                                    </p>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <ul className="text-sm space-y-2">
                            {selectedService.status === "pending" && (
                              <li className="text-muted-foreground">Waiting for processing</li>
                            )}
                            {selectedService.status === "in-progress" && (
                              <>
                                <li className="text-muted-foreground">Order received</li>
                                <li className="text-muted-foreground">Currently being worked on</li>
                              </>
                            )}
                            {selectedService.status === "completed" && (
                              <>
                                <li className="text-muted-foreground">Order received</li>
                                <li className="text-muted-foreground">Service completed</li>
                                <li className="text-muted-foreground">Files delivered</li>
                              </>
                            )}
                          </ul>
                        )}
                      </div>
                      
                      {selectedService.progressValue !== undefined && (
                        <div className="space-y-1">
                          <div className="flex justify-between items-center text-sm">
                            <span className="font-medium">Overall Progress</span>
                            <span>{selectedService.progressValue}%</span>
                          </div>
                          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-beatforge-500" 
                              style={{ width: `${selectedService.progressValue}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                      
                      <div>
                        <h3 className="text-lg font-medium mb-2">Uploaded Files</h3>
                        <div className="border rounded-md p-3 space-y-2">
                          {Array.isArray(selectedService.files) && selectedService.files.map((file: any, idx: number) => (
                            <div key={idx} className="flex items-center justify-between">
                              <div className="flex items-center">
                                <File className="h-4 w-4 mr-2 text-muted-foreground" />
                                <span className="text-sm truncate">{typeof file === 'string' ? file : file.name}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {selectedService.status === "in-progress" && (
                        <div className="border border-amber-200 bg-amber-50 dark:bg-amber-950 dark:border-amber-800 rounded-md p-3">
                          <p className="text-sm text-amber-800 dark:text-amber-400">
                            Your track is being processed. We'll update you on progress as our team works on your {selectedService.name.toLowerCase()}.
                          </p>
                        </div>
                      )}
                      
                      {selectedService.status === "completed" && (
                        <div className="border border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800 rounded-md p-3">
                          <p className="text-sm text-green-800 dark:text-green-400">
                            Your service has been completed! Download your files and enjoy your finished product.
                          </p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
              
              <DialogFooter className="flex justify-between items-center">
                {(!selectedService.files || selectedService.files.length === 0) ? (
                  <Button variant="outline" onClick={() => setServiceDetailsOpen(false)}>
                    Close
                  </Button>
                ) : (
                  <>
                    {selectedService.status === "pending" && (
                      <Button variant="outline" size="sm" className="text-red-500">
                        Cancel Order
                      </Button>
                    )}
                    {selectedService.status === "in-progress" && (
                      <Button variant="outline" size="sm">
                        Contact Support
                      </Button>
                    )}
                    {selectedService.status === "completed" && selectedService.files && selectedService.files.length > 0 && (
                      <Button className="gap-2">
                        <Download className="h-4 w-4" />
                        Download Results
                      </Button>
                    )}
                    <Button variant="outline" onClick={() => setServiceDetailsOpen(false)}>
                      Close
                    </Button>
                  </>
                )}
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
} 