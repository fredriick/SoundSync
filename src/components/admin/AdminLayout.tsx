import { useState, useEffect } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { 
  Users, 
  Music, 
  Package, 
  Settings, 
  BarChart, 
  DollarSign, 
  Shield, 
  LogOut,
  Menu,
  X,
  Image,
  ChevronRight,
  ChevronLeft,
  PanelRight,
  Server,
  Link2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

// User roles
type UserRole = "user" | "admin" | "superadmin";

// Check if user has admin privileges
const checkAdminAccess = (): { hasAccess: boolean; role: UserRole } => {
  // In a real app, this would check JWT claims or make an API call
  const mockUserRaw = localStorage.getItem('mockUser');
  if (mockUserRaw) {
    try {
      const mockUser = JSON.parse(mockUserRaw);
      const role = mockUser.role as UserRole || "user";
      const email = mockUser.email;
      
      // Additional check for admin status in adminUsers
      if (role === "admin" || role === "superadmin") {
        const adminUsersRaw = localStorage.getItem('adminUsers');
        if (adminUsersRaw) {
          try {
            const adminUsers = JSON.parse(adminUsersRaw);
            const foundAdmin = adminUsers.find((admin: any) => admin.email === email);
            
            // If admin exists in the adminUsers list and is inactive, deny access
            if (foundAdmin && foundAdmin.status === "inactive") {
              // Return false to trigger redirect
              return { hasAccess: false, role: "user" };
            }
          } catch (e) {
            console.error("Error checking admin status", e);
          }
        }
      }
      
      return { 
        hasAccess: role === "admin" || role === "superadmin", 
        role 
      };
    } catch (e) {
      console.error("Error parsing user data", e);
    }
  }
  
  return { hasAccess: false, role: "user" };
};

export default function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { hasAccess, role } = checkAdminAccess();
  
  // Set sidebar closed by default on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };
    
    // Call once on initial load
    handleResize();
    
    // Listen for window resize events
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  useEffect(() => {
    // Redirect if not admin
    if (!hasAccess) {
      // Check if user tried to access as admin but was rejected
      const mockUserRaw = localStorage.getItem('mockUser');
      if (mockUserRaw) {
        try {
          const mockUser = JSON.parse(mockUserRaw);
          const attemptedRole = mockUser.role;
          
          // If they have admin/superadmin role in localStorage but were denied access,
          // it means their account is inactive
          if (attemptedRole === "admin" || attemptedRole === "superadmin") {
            toast({
              title: "Account Deactivated",
              description: "Your admin account has been deactivated. Please contact a superadmin.",
              variant: "destructive"
            });
            
            // Reset the user role to regular user
            mockUser.role = "user";
            localStorage.setItem('mockUser', JSON.stringify(mockUser));
            
            // Dispatch event to notify components of user update
            window.dispatchEvent(new Event('mockUserUpdated'));
            
            navigate("/");
            return;
          }
        } catch (e) {
          console.error("Error checking user status", e);
        }
      }
      
      // Generic access denied message for non-admins
      toast({
        title: "Access Denied",
        description: "You don't have permission to access the admin dashboard.",
        variant: "destructive"
      });
      navigate("/");
    }
  }, [hasAccess, navigate]);
  
  // Close sidebar when navigating on mobile
  useEffect(() => {
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  }, [location.pathname]);
  
  // If no access, don't render the admin interface
  if (!hasAccess) {
    return null;
  }
  
  // Navigation items for all admins
  const navigation = [
    { name: "Dashboard", href: "/admin", icon: BarChart },
    { name: "Users", href: "/admin/users", icon: Users, 
      submenu: [
        { name: "All Users", href: "/admin/users" },
        { name: "Sellers", href: "/admin/sellers" }
      ]
    },
    { name: "Featured Tracks", href: "/admin/tracks", icon: Music },
    { name: "Marketplace", href: "/admin/marketplace", icon: Package },
    { name: "Carousel", href: "/admin/carousel", icon: Image },
    { name: "Footer Links", href: "/admin/footer", icon: Link2 },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ];
  
  // Additional items only for superadmins
  if (role === "superadmin") {
    navigation.push(
      { name: "Services", href: "/admin/services", icon: Server },
      { name: "Admin Management", href: "/admin/admins", icon: Shield }
    );
  }
  
  const handleLogout = () => {
    // Update user to be fully logged out, not just role change
    const mockUserRaw = localStorage.getItem('mockUser');
    if (mockUserRaw) {
      try {
        const mockUser = JSON.parse(mockUserRaw);
        // Set isSignedIn to false instead of just changing role
        mockUser.isSignedIn = false;
        mockUser.role = "user";
        localStorage.setItem('mockUser', JSON.stringify(mockUser));
        
        // Dispatch event to notify components of user update
        window.dispatchEvent(new Event('mockUserUpdated'));
        
        toast({
          title: "Logged out",
          description: "You have been signed out successfully.",
        });
        
        navigate("/");
      } catch (e) {
        console.error("Error logging out", e);
      }
    }
  };

  const toggleSubmenu = (name: string) => {
    if (openSubmenu === name) {
      setOpenSubmenu(null);
    } else {
      setOpenSubmenu(name);
    }
  };

  const handleSubmenuItemClick = (href: string) => {
    navigate(href);
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  };
  
  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Overlay to close sidebar when clicking outside on mobile */}
      {isSidebarOpen && window.innerWidth < 1024 && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 z-30 ${isSidebarMinimized ? 'w-20' : 'w-64'} transform bg-white dark:bg-gray-800 shadow-lg transition-all duration-300 ease-in-out lg:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className={`flex items-center ${isSidebarMinimized ? 'justify-center' : 'justify-between'} p-4 border-b dark:border-gray-700`}>
            {!isSidebarMinimized && (
              <div className="flex items-center space-x-2">
                <img src="/assets/logo.svg" alt="SoundSync Logo" className="h-8 w-8" />
                <span className="font-semibold text-lg">SoundSync Admin</span>
              </div>
            )}
            {isSidebarMinimized && (
              <img src="/assets/logo.svg" alt="SoundSync Logo" className="h-8 w-8" />
            )}
            {/* Minimize/Expand button: always visible */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarMinimized(!isSidebarMinimized)}
            >
              {isSidebarMinimized ? (
                <PanelRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </Button>
            {/* Close button: only on mobile */}
            <Button
              variant="ghost"
              size="icon"
              className="ml-2 lg:hidden"
              onClick={() => setIsSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          {/* Nav links */}
          <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href || 
                (item.href !== "/admin" && location.pathname.startsWith(item.href));
              const isOpen = openSubmenu === item.name;
              
              return (
                <div key={item.name}>
                  {item.submenu ? (
                    <>
                      <button
                        onClick={() => toggleSubmenu(item.name)}
                        className={`w-full flex items-center justify-between ${isSidebarMinimized ? 'px-2 py-2' : 'px-4 py-3'} rounded-md transition-colors ${
                          isActive 
                            ? 'bg-beatforge-100 dark:bg-beatforge-900 text-beatforge-600 dark:text-beatforge-400'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                      >
                        <div className={`flex items-center ${isSidebarMinimized ? 'mx-auto' : ''}`}>
                          <item.icon className={`h-5 w-5 ${isSidebarMinimized ? 'mr-0' : 'mr-3'}`} />
                          {!isSidebarMinimized && <span>{item.name}</span>}
                        </div>
                        {!isSidebarMinimized && (
                          <svg
                            className={`h-5 w-5 transform transition-transform ${isOpen ? 'rotate-180' : ''}`}
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </button>
                      
                      {/* Show dropdown menu in both modes */}
                      {isOpen && item.submenu && (
                        <div className={`${isSidebarMinimized ? 'absolute left-20 mt-0 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 min-w-[160px] z-50' : 'pl-6 pt-2 pb-1 space-y-2'}`}>
                          {item.submenu.map((subItem) => {
                            const isSubActive = location.pathname === subItem.href;
                            
                            return (
                              <Link
                                key={subItem.name}
                                to={subItem.href}
                                className={`block ${isSidebarMinimized ? 'px-4 py-2' : 'px-4 py-2 rounded-md'} text-sm transition-colors ${
                                  isSubActive 
                                    ? 'bg-beatforge-500 text-white'
                                    : 'bg-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                }`}
                                onClick={() => handleSubmenuItemClick(subItem.href)}
                              >
                                {subItem.name}
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </>
                  ) : (
                    <Link
                      to={item.href}
                      className={`flex items-center ${isSidebarMinimized ? 'justify-center px-2 py-2' : 'justify-between px-4 py-3'} rounded-md transition-colors ${
                        isActive 
                          ? 'bg-beatforge-100 dark:bg-beatforge-900 text-beatforge-600 dark:text-beatforge-400'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      <div className={`flex items-center ${isSidebarMinimized ? 'mx-auto' : ''}`}>
                        <item.icon className={`h-5 w-5 ${isSidebarMinimized ? 'mr-0' : 'mr-3'}`} />
                        {!isSidebarMinimized && <span>{item.name}</span>}
                      </div>
                    </Link>
                  )}
                </div>
              );
            })}
          </nav>
          
          {/* User info and logout */}
          <div className={`p-4 border-t dark:border-gray-700 ${isSidebarMinimized ? 'text-center' : ''}`}>
            {!isSidebarMinimized && (
              <div className="flex items-center space-x-3 mb-4">
                <div className="h-10 w-10 rounded-full bg-beatforge-500 flex items-center justify-center text-white">
                  {role === "superadmin" ? "SA" : "A"}
                </div>
                <div>
                  <p className="font-medium">{role === "superadmin" ? "Super Admin" : "Admin"}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {role === "superadmin" ? "Full Access" : "Limited Access"}
                  </p>
                </div>
              </div>
            )}
            {isSidebarMinimized && (
              <div className="mx-auto mb-4">
                <div className="h-10 w-10 rounded-full bg-beatforge-500 flex items-center justify-center text-white mx-auto">
                  {role === "superadmin" ? "SA" : "A"}
                </div>
              </div>
            )}
            <Button 
              variant="outline" 
              size={isSidebarMinimized ? "icon" : "default"}
              className={isSidebarMinimized ? "mx-auto" : "w-full flex items-center justify-center"}
              onClick={handleLogout}
            >
              <LogOut className={`h-4 w-4 ${isSidebarMinimized ? '' : 'mr-2'}`} />
              {!isSidebarMinimized && "Log Out"}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className={`flex flex-col flex-1 ${isSidebarMinimized ? 'lg:pl-20' : 'lg:pl-64'} transition-all duration-300`}>
        {/* Top navbar */}
        <header className="bg-white dark:bg-gray-800 shadow z-10">
          <div className="px-4 py-4 sm:px-6 lg:px-8 flex items-center justify-between">
            {/* Hamburger menu for mobile */}
            <Button
              variant="ghost"
              size="icon"
              className="mr-2 lg:hidden"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            
            <h1 className="text-xl font-semibold">{
              // Display current section in the header
              navigation.find(item => 
                location.pathname === item.href || 
                (item.href !== "/admin" && location.pathname.startsWith(item.href))
              )?.name || "Admin Dashboard"
            }</h1>
            
            {/* Expand sidebar button - only visible in minimized mode */}
            {isSidebarMinimized && (
              <Button
                variant="ghost"
                size="sm"
                className="hidden lg:flex items-center space-x-1 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md px-2 py-1"
                onClick={() => setIsSidebarMinimized(false)}
              >
                <PanelRight className="h-4 w-4 mr-1" />
                <span className="text-sm">Expand Menu</span>
              </Button>
            )}
          </div>
        </header>
        
        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-gray-100 dark:bg-gray-900">
          <Outlet />
        </main>
      </div>
    </div>
  );
} 