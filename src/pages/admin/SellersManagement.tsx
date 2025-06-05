import { useState, useEffect } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { 
  Search, 
  MoreHorizontal, 
  CheckCircle, 
  XCircle,
  Eye,
  Clock,
  ShieldCheck,
  Users,
  Music,
  Store
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Genre {
  [key: string]: boolean;
}

interface SellerProfile {
  artistName: string;
  paypalEmail: string;
  biography?: string;
  genres?: string[];
  website?: string;
  instagram?: string;
  twitter?: string;
  soundcloud?: string;
}

interface SellerSteps {
  profile: boolean;
  upload: boolean;
  payment: boolean;
}

interface Seller {
  id: string;
  userId: string;
  name: string;
  email: string;
  isSellerApproved: boolean;
  isAdminApproved: boolean;
  isBlocked: boolean;
  applicationDate: string;
  sellerProfile?: SellerProfile;
  sellerSteps?: SellerSteps;
  salesCount: number;
  totalRevenue: number;
  avatarUrl?: string;
}

export default function SellersManagement() {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("pending");
  const [viewDetailsDialogOpen, setViewDetailsDialogOpen] = useState(false);
  const [currentSeller, setCurrentSeller] = useState<Seller | null>(null);
  
  // Function to load sellers data
  const loadSellers = () => {
    setIsLoading(true);
    
    // Simulate API call with setTimeout
    setTimeout(() => {
      try {
        // Create initial list with mock sellers (for demo purposes)
        const mockSellers: Seller[] = [
          {
            id: "1",
            userId: "user1",
            name: "Alex Johnson",
            email: "alex@example.com",
            isSellerApproved: true,
            isAdminApproved: false,
            isBlocked: false,
            applicationDate: "2023-09-15",
            sellerProfile: {
              artistName: "DJ AJ",
              paypalEmail: "alex@paypal.com",
              biography: "Producing beats for over 5 years with focus on trap and hip hop",
              genres: ["hipHop", "trap"],
              instagram: "@dj_aj",
              soundcloud: "soundcloud.com/dj_aj"
            },
            sellerSteps: {
              profile: true,
              upload: true,
              payment: true
            },
            salesCount: 0,
            totalRevenue: 0,
            avatarUrl: "https://api.dicebear.com/6.x/avataaars/svg?seed=Alex"
          },
          {
            id: "2",
            userId: "user2",
            name: "Maria Garcia",
            email: "maria@example.com",
            isSellerApproved: true,
            isAdminApproved: true,
            isBlocked: false,
            applicationDate: "2023-08-20",
            sellerProfile: {
              artistName: "Maria Beats",
              paypalEmail: "maria@paypal.com",
              biography: "Lo-fi and chill beats producer from Spain",
              genres: ["lofi", "jazz"],
              website: "mariabeats.com",
              instagram: "@maria_beats",
              twitter: "@mariabeats"
            },
            sellerSteps: {
              profile: true,
              upload: true,
              payment: true
            },
            salesCount: 28,
            totalRevenue: 560,
            avatarUrl: "https://api.dicebear.com/6.x/avataaars/svg?seed=Maria"
          },
          {
            id: "3",
            userId: "user3",
            name: "James Wilson",
            email: "james@example.com",
            isSellerApproved: true,
            isAdminApproved: false,
            isBlocked: false,
            applicationDate: "2023-09-18",
            sellerProfile: {
              artistName: "JW Productions",
              paypalEmail: "james@paypal.com",
              biography: "Specializing in EDM and house music",
              genres: ["edm", "house"],
              instagram: "@jw_productions"
            },
            sellerSteps: {
              profile: true,
              upload: true,
              payment: true
            },
            salesCount: 0,
            totalRevenue: 0,
            avatarUrl: "https://api.dicebear.com/6.x/avataaars/svg?seed=James"
          },
          {
            id: "4",
            userId: "user4",
            name: "Sofia Chen",
            email: "sofia@example.com",
            isSellerApproved: true,
            isAdminApproved: true,
            isBlocked: false,
            applicationDate: "2023-07-10",
            sellerProfile: {
              artistName: "Sofia Sounds",
              paypalEmail: "sofia@paypal.com",
              biography: "Creating ethnic fusion and world music samples",
              genres: ["other"],
              website: "sofiasounds.com"
            },
            sellerSteps: {
              profile: true,
              upload: true,
              payment: true
            },
            salesCount: 42,
            totalRevenue: 840,
            avatarUrl: "https://api.dicebear.com/6.x/avataaars/svg?seed=Sofia"
          }
        ];
        
        // Check localStorage for real user applications
        const storedUserRaw = localStorage.getItem('mockUser');
        if (storedUserRaw) {
          try {
            const storedUser = JSON.parse(storedUserRaw);
            
            // Check if this user has applied to be a seller
            if (storedUser.isSellerApproved === true) {
              // Check if this user is not already in our list
              const userExists = mockSellers.some(seller => seller.email === storedUser.email);
              
              if (!userExists) {
                // Create a new seller object from the user
                const newSeller: Seller = {
                  id: `user${Date.now()}`, // Generate a unique ID
                  userId: storedUser.id || `user${Date.now()}`,
                  name: storedUser.name || "Anonymous User",
                  email: storedUser.email || "no-email@example.com",
                  isSellerApproved: true,
                  isAdminApproved: storedUser.isAdminApproved || false,
                  isBlocked: false,
                  applicationDate: storedUser.applicationDate || new Date().toISOString().split('T')[0],
                  sellerProfile: storedUser.sellerProfile || {
                    artistName: storedUser.name || "Anonymous Artist",
                    paypalEmail: storedUser.email || "no-email@example.com"
                  },
                  sellerSteps: storedUser.sellerSteps || {
                    profile: true,
                    upload: false,
                    payment: false
                  },
                  salesCount: 0,
                  totalRevenue: 0,
                  avatarUrl: storedUser.avatar || `https://api.dicebear.com/6.x/avataaars/svg?seed=${storedUser.name}`
                };
                
                // Add this user to our sellers list
                mockSellers.push(newSeller);
              }
            }
          } catch (e) {
            console.error('Error parsing user data from localStorage', e);
          }
        }
        
        // Also check if there are multiple users stored in localStorage
        // This would be for a production app with multiple users
        // For the demo, we're checking a hypothetical 'mockUsers' key
        const storedUsersRaw = localStorage.getItem('mockUsers');
        if (storedUsersRaw) {
          try {
            const storedUsers = JSON.parse(storedUsersRaw);
            
            // Loop through all users
            storedUsers.forEach((user: any) => {
              // Check if this user has applied to be a seller
              if (user.isSellerApproved === true) {
                // Check if this user is not already in our list
                const userExists = mockSellers.some(seller => seller.email === user.email);
                
                if (!userExists) {
                  // Create a new seller object from the user
                  const newSeller: Seller = {
                    id: `user${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, // Generate a unique ID
                    userId: user.id || `user${Date.now()}`,
                    name: user.name || "Anonymous User",
                    email: user.email || "no-email@example.com",
                    isSellerApproved: true,
                    isAdminApproved: user.isAdminApproved || false,
                    isBlocked: false,
                    applicationDate: user.applicationDate || new Date().toISOString().split('T')[0],
                    sellerProfile: user.sellerProfile || {
                      artistName: user.name || "Anonymous Artist",
                      paypalEmail: user.email || "no-email@example.com"
                    },
                    sellerSteps: user.sellerSteps || {
                      profile: true,
                      upload: false,
                      payment: false
                    },
                    salesCount: 0,
                    totalRevenue: 0,
                    avatarUrl: user.avatar || `https://api.dicebear.com/6.x/avataaars/svg?seed=${user.name}`
                  };
                  
                  // Add this user to our sellers list
                  mockSellers.push(newSeller);
                }
              }
            });
          } catch (e) {
            console.error('Error parsing users data from localStorage', e);
          }
        }
        
        setSellers(mockSellers);
        setIsLoading(false);
      } catch (e) {
        console.error('Error loading sellers:', e);
        setSellers([]);
        setIsLoading(false);
      }
    }, 1000);
  };
  
  // Load sellers from localStorage on component mount
  useEffect(() => {
    loadSellers();
  }, []);

  // Handle refresh button click
  const handleRefresh = () => {
    toast({
      title: "Refreshing seller applications",
      description: "Checking for new applications...",
    });
    loadSellers();
  };
  
  // Filter sellers based on search query and active tab
  const filteredSellers = sellers.filter(seller => {
    const matchesQuery = 
      seller.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      seller.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (seller.sellerProfile?.artistName || '').toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeTab === "pending") {
      return matchesQuery && seller.isSellerApproved && !seller.isAdminApproved;
    } else if (activeTab === "approved") {
      return matchesQuery && seller.isSellerApproved && seller.isAdminApproved;
    }
    
    return matchesQuery;
  });
  
  // Get appropriate status badge for a seller
  const getStatusBadge = (seller: Seller) => {
    if (seller.isBlocked) {
      return <Badge className="bg-red-600 hover:bg-red-700">Blocked</Badge>;
    } else if (!seller.isAdminApproved) {
      return <Badge className="bg-yellow-500 hover:bg-yellow-600">Pending</Badge>;
    } else {
      return <Badge className="bg-green-600 hover:bg-green-700">Approved</Badge>;
    }
  };
  
  // Handle viewing seller details
  const handleViewDetails = (seller: Seller) => {
    setCurrentSeller(seller);
    setViewDetailsDialogOpen(true);
  };
  
  // Handle approving a seller
  const handleApproveSeller = (seller: Seller) => {
    // Update seller in our local state
    const updatedSellers = sellers.map(s => 
      s.id === seller.id ? { ...s, isAdminApproved: true } : s
    );
    
    setSellers(updatedSellers);
    
    // In a real app, this would be an API call
    // For now, we'll update the mockUser in localStorage if it matches
    try {
      // Check the individual mockUser
      const storedUserRaw = localStorage.getItem('mockUser');
      if (storedUserRaw) {
        const storedUser = JSON.parse(storedUserRaw);
        
        // If this is the logged in user, update their status
        if (storedUser.email === seller.email) {
          storedUser.isAdminApproved = true;
          localStorage.setItem('mockUser', JSON.stringify(storedUser));
        }
      }
      
      // Also check mockUsers array if it exists
      const storedUsersRaw = localStorage.getItem('mockUsers');
      if (storedUsersRaw) {
        const storedUsers = JSON.parse(storedUsersRaw);
        
        // Update the user in the array if found
        const updatedUsers = storedUsers.map((user: any) => 
          user.email === seller.email 
            ? { ...user, isAdminApproved: true } 
            : user
        );
        
        localStorage.setItem('mockUsers', JSON.stringify(updatedUsers));
      }
    } catch (e) {
      console.error('Error updating user:', e);
    }
    
    toast({
      title: "Seller Approved",
      description: `${seller.sellerProfile?.artistName || seller.name} has been approved as a seller.`,
    });
  };
  
  // Handle rejecting a seller
  const handleRejectSeller = (seller: Seller) => {
    // Update seller in our local state
    const updatedSellers = sellers.map(s => 
      s.id === seller.id ? { ...s, isSellerApproved: false, isAdminApproved: false } : s
    );
    
    setSellers(updatedSellers);
    
    // In a real app, this would be an API call
    // For now, we'll update the mockUser in localStorage if it matches
    try {
      // Check the individual mockUser
      const storedUserRaw = localStorage.getItem('mockUser');
      if (storedUserRaw) {
        const storedUser = JSON.parse(storedUserRaw);
        
        // If this is the logged in user, update their status
        if (storedUser.email === seller.email) {
          storedUser.isSellerApproved = false;
          storedUser.isAdminApproved = false;
          localStorage.setItem('mockUser', JSON.stringify(storedUser));
        }
      }
      
      // Also check mockUsers array if it exists
      const storedUsersRaw = localStorage.getItem('mockUsers');
      if (storedUsersRaw) {
        const storedUsers = JSON.parse(storedUsersRaw);
        
        // Update the user in the array if found
        const updatedUsers = storedUsers.map((user: any) => 
          user.email === seller.email 
            ? { ...user, isSellerApproved: false, isAdminApproved: false } 
            : user
        );
        
        localStorage.setItem('mockUsers', JSON.stringify(updatedUsers));
      }
    } catch (e) {
      console.error('Error updating user:', e);
    }
    
    toast({
      title: "Seller Rejected",
      description: `${seller.sellerProfile?.artistName || seller.name}'s seller application has been rejected.`,
      variant: "destructive"
    });
  };
  
  // Handle toggling a seller's blocked status
  const handleToggleBlockSeller = (seller: Seller) => {
    // Update seller in our local state
    const updatedSellers = sellers.map(s => 
      s.id === seller.id ? { ...s, isBlocked: !s.isBlocked } : s
    );
    
    setSellers(updatedSellers);
    
    // In a real app, this would be an API call
    // For now, we'll update the mockUser in localStorage if it matches
    try {
      // Check the individual mockUser
      const storedUserRaw = localStorage.getItem('mockUser');
      if (storedUserRaw) {
        const storedUser = JSON.parse(storedUserRaw);
        
        // If this is the logged in user, update their status
        if (storedUser.email === seller.email) {
          storedUser.isBlocked = !seller.isBlocked; // Toggle the blocked status
          localStorage.setItem('mockUser', JSON.stringify(storedUser));
        }
      }
      
      // Also check mockUsers array if it exists
      const storedUsersRaw = localStorage.getItem('mockUsers');
      if (storedUsersRaw) {
        const storedUsers = JSON.parse(storedUsersRaw);
        
        // Update the user in the array if found
        const updatedUsers = storedUsers.map((user: any) => 
          user.email === seller.email 
            ? { ...user, isBlocked: !seller.isBlocked } 
            : user
        );
        
        localStorage.setItem('mockUsers', JSON.stringify(updatedUsers));
      }
      
      // Show a toast notification
      if (!seller.isBlocked) {
        toast({
          title: "Seller Blocked",
          description: `${seller.sellerProfile?.artistName || seller.name} has been blocked from selling products.`,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Seller Unblocked",
          description: `${seller.sellerProfile?.artistName || seller.name} can now sell products again.`,
        });
      }
    } catch (e) {
      console.error('Error updating user:', e);
    }
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Seller Management</h2>
        <p className="text-muted-foreground">Manage seller applications and active sellers</p>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex w-full max-w-sm items-center space-x-2">
          <Input
            placeholder="Search sellers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-[250px]"
          />
          <Button 
            type="submit" 
            size="icon" 
            variant="outline"
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>
        
        <Button 
          onClick={handleRefresh} 
          variant="outline" 
          size="sm"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Refreshing...
            </>
          ) : (
            <>
              <svg className="h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </>
          )}
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="pending" className="flex gap-2 items-center">
            <Clock className="h-4 w-4" />
            Pending Approval
            {sellers.filter(s => s.isSellerApproved && !s.isAdminApproved).length > 0 && (
              <Badge variant="default" className="ml-1 bg-beatforge-500">
                {sellers.filter(s => s.isSellerApproved && !s.isAdminApproved).length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="approved" className="flex gap-2 items-center">
            <ShieldCheck className="h-4 w-4" />
            Approved Sellers
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="pending">
          <Card className="border shadow-sm">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Artist Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Application Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <div className="flex justify-center">
                        <svg className="animate-spin h-8 w-8 text-beatforge-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">Loading seller applications...</p>
                    </TableCell>
                  </TableRow>
                ) : filteredSellers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <div className="flex flex-col items-center gap-2">
                        <Clock className="h-10 w-10 text-muted-foreground" />
                        <p className="text-muted-foreground text-sm">No pending applications</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSellers.map((seller) => (
                    <TableRow key={seller.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={seller.avatarUrl} />
                            <AvatarFallback>{seller.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span>{seller.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{seller.sellerProfile?.artistName || "-"}</TableCell>
                      <TableCell>{seller.email}</TableCell>
                      <TableCell>{new Date(seller.applicationDate).toLocaleDateString()}</TableCell>
                      <TableCell>
                        {getStatusBadge(seller)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button 
                            onClick={() => handleViewDetails(seller)} 
                            variant="outline" 
                            size="sm"
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Details
                          </Button>
                          <Button 
                            onClick={() => handleApproveSeller(seller)}
                            variant="default" 
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button 
                            onClick={() => handleRejectSeller(seller)}
                            variant="destructive" 
                            size="sm"
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                          <Button 
                            onClick={() => handleToggleBlockSeller(seller)}
                            variant={seller.isBlocked ? "outline" : "secondary"} 
                            size="sm"
                            className={seller.isBlocked ? "" : "bg-gray-600 hover:bg-gray-700"}
                          >
                            {seller.isBlocked ? (
                              <>
                                <ShieldCheck className="h-4 w-4 mr-1" />
                                Unblock
                              </>
                            ) : (
                              <>
                                <XCircle className="h-4 w-4 mr-1" />
                                Block
                              </>
                            )}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
        
        <TabsContent value="approved">
          <Card className="border shadow-sm">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Artist Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Sales</TableHead>
                  <TableHead>Revenue</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <div className="flex justify-center">
                        <svg className="animate-spin h-8 w-8 text-beatforge-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">Loading approved sellers...</p>
                    </TableCell>
                  </TableRow>
                ) : filteredSellers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <div className="flex flex-col items-center gap-2">
                        <Users className="h-10 w-10 text-muted-foreground" />
                        <p className="text-muted-foreground text-sm">No approved sellers found</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSellers.map((seller) => (
                    <TableRow key={seller.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={seller.avatarUrl} />
                            <AvatarFallback>{seller.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span>{seller.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{seller.sellerProfile?.artistName || "-"}</TableCell>
                      <TableCell>{seller.email}</TableCell>
                      <TableCell>{seller.salesCount}</TableCell>
                      <TableCell>${seller.totalRevenue}</TableCell>
                      <TableCell>
                        {getStatusBadge(seller)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          onClick={() => handleViewDetails(seller)} 
                          variant="outline" 
                          size="sm"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Details
                        </Button>
                        <Button 
                          onClick={() => handleToggleBlockSeller(seller)}
                          variant={seller.isBlocked ? "outline" : "secondary"} 
                          size="sm"
                          className={seller.isBlocked ? "ml-2" : "ml-2 bg-gray-600 hover:bg-gray-700"}
                        >
                          {seller.isBlocked ? (
                            <>
                              <ShieldCheck className="h-4 w-4 mr-1" />
                              Unblock
                            </>
                          ) : (
                            <>
                              <XCircle className="h-4 w-4 mr-1" />
                              Block
                            </>
                          )}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Seller Details Dialog */}
      <Dialog open={viewDetailsDialogOpen} onOpenChange={setViewDetailsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center gap-2">
              <Store className="h-5 w-5" />
              Seller Details
            </DialogTitle>
            <DialogDescription>
              Detailed information about the seller and their application
            </DialogDescription>
          </DialogHeader>
          
          {currentSeller && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="flex flex-col items-center gap-2">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={currentSeller.avatarUrl} />
                    <AvatarFallback className="text-2xl">{currentSeller.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="text-center">
                    <h3 className="font-medium">{currentSeller.name}</h3>
                    <p className="text-sm text-muted-foreground">{currentSeller.email}</p>
                  </div>
                </div>
                
                <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">Artist Name</h4>
                      <p className="font-medium">{currentSeller.sellerProfile?.artistName || "-"}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">PayPal Email</h4>
                      <p>{currentSeller.sellerProfile?.paypalEmail || "-"}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">Application Date</h4>
                      <p>{new Date(currentSeller.applicationDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">Status</h4>
                      <Badge className={currentSeller.isAdminApproved 
                        ? "bg-green-600 hover:bg-green-700" 
                        : "bg-yellow-500 hover:bg-yellow-600"
                      }>
                        {currentSeller.isAdminApproved ? "Approved" : "Pending"}
                      </Badge>
                      {currentSeller.isBlocked && (
                        <Badge className="ml-2 bg-red-600 hover:bg-red-700">
                          Blocked
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Biography</h4>
                    <p className="text-sm">
                      {currentSeller.sellerProfile?.biography || "No biography provided"}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Genres</h4>
                  <div className="flex flex-wrap gap-2">
                    {currentSeller.sellerProfile?.genres && currentSeller.sellerProfile.genres.length > 0 ? (
                      currentSeller.sellerProfile.genres.map((genre) => (
                        <Badge key={genre} variant="outline" className="bg-beatforge-100 dark:bg-beatforge-900 text-beatforge-700 dark:text-beatforge-300 hover:bg-beatforge-200">
                          {genre.charAt(0).toUpperCase() + genre.slice(1)}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-sm text-muted-foreground">No genres specified</span>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Social Media</h4>
                    <div className="space-y-2">
                      {currentSeller.sellerProfile?.website && (
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium">Website:</span>
                          <a href={currentSeller.sellerProfile.website} target="_blank" rel="noopener noreferrer" className="text-xs text-beatforge-500 hover:underline">
                            {currentSeller.sellerProfile.website}
                          </a>
                        </div>
                      )}
                      {currentSeller.sellerProfile?.instagram && (
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium">Instagram:</span>
                          <span className="text-xs">{currentSeller.sellerProfile.instagram}</span>
                        </div>
                      )}
                      {currentSeller.sellerProfile?.twitter && (
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium">Twitter:</span>
                          <span className="text-xs">{currentSeller.sellerProfile.twitter}</span>
                        </div>
                      )}
                      {currentSeller.sellerProfile?.soundcloud && (
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium">SoundCloud:</span>
                          <span className="text-xs">{currentSeller.sellerProfile.soundcloud}</span>
                        </div>
                      )}
                      {!currentSeller.sellerProfile?.website && 
                       !currentSeller.sellerProfile?.instagram && 
                       !currentSeller.sellerProfile?.twitter && 
                       !currentSeller.sellerProfile?.soundcloud && (
                        <span className="text-xs text-muted-foreground">No social media provided</span>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2">Application Status</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-green-600 hover:bg-green-700">Profile Created</Badge>
                        <span className="text-xs text-muted-foreground">Completed</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={currentSeller.sellerSteps?.upload ? "bg-green-600 hover:bg-green-700" : "bg-gray-500 hover:bg-gray-600"}>
                          Sound Uploaded
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {currentSeller.sellerSteps?.upload ? "Completed" : "Not completed"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={currentSeller.sellerSteps?.payment ? "bg-green-600 hover:bg-green-700" : "bg-gray-500 hover:bg-gray-600"}>
                          Payment Info
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {currentSeller.sellerSteps?.payment ? "Completed" : "Not completed"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter className="flex justify-between items-center">
            <div>
              {currentSeller && !currentSeller.isAdminApproved && (
                <div className="flex gap-2">
                  <Button 
                    onClick={() => {
                      handleApproveSeller(currentSeller);
                      setViewDetailsDialogOpen(false);
                    }}
                    variant="default" 
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve
                  </Button>
                  <Button 
                    onClick={() => {
                      handleRejectSeller(currentSeller);
                      setViewDetailsDialogOpen(false);
                    }}
                    variant="destructive"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                </div>
              )}
              
              {currentSeller && (
                <Button 
                  onClick={() => {
                    handleToggleBlockSeller(currentSeller);
                    // Keep the dialog open to see changes
                    // Update the current seller to reflect the change
                    setCurrentSeller({
                      ...currentSeller,
                      isBlocked: !currentSeller.isBlocked
                    });
                  }}
                  variant={currentSeller.isBlocked ? "outline" : "secondary"} 
                  className={currentSeller.isBlocked 
                    ? "ml-2" 
                    : "ml-2 bg-gray-600 hover:bg-gray-700"
                  }
                >
                  {currentSeller.isBlocked ? (
                    <>
                      <ShieldCheck className="h-4 w-4 mr-2" />
                      Unblock
                    </>
                  ) : (
                    <>
                      <XCircle className="h-4 w-4 mr-2" />
                      Block
                    </>
                  )}
                </Button>
              )}
            </div>
            <DialogClose asChild>
              <Button variant="outline">Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 
 
 
 
 
 
 
 
 
 