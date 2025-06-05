import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Music, ShoppingCart, User } from "lucide-react";
import { CartSheet } from "./CartSheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/components/ui/use-toast";

// Mock user state - in a real app, this would come from auth context
const mockUser = {
  isSignedIn: true,
  name: "John Doe",
  email: "john.doe@example.com",
  avatar: "https://i.pravatar.cc/150?u=john.doe@example.com"
};

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);
  const navigate = useNavigate();
  
  // Initialize user state from localStorage or default to mockUser
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('mockUser');
    return savedUser ? JSON.parse(savedUser) : mockUser;
  });

  // Save user state to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('mockUser', JSON.stringify(user));
  }, [user]);

  // Listen for storage events to update user state when mockUser changes in other tabs/components
  useEffect(() => {
    const handleStorageChange = () => {
      const savedUser = localStorage.getItem('mockUser');
      if (savedUser) {
        const updatedUser = JSON.parse(savedUser);
        // Only update if there's an actual change to avoid unnecessary re-renders
        if (updatedUser.avatar !== user.avatar || 
            updatedUser.name !== user.name || 
            updatedUser.email !== user.email || 
            updatedUser.isSignedIn !== user.isSignedIn) {
          setUser(updatedUser);
        }
      }
    };

    // Check for changes when the component mounts or gains focus
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('focus', handleStorageChange);
    window.addEventListener('mockUserUpdated', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', handleStorageChange);
      window.removeEventListener('mockUserUpdated', handleStorageChange);
    };
  }, [user.avatar, user.name, user.email, user.isSignedIn]);

  // Update cart count whenever localStorage changes or component mounts
  useEffect(() => {
    const updateCartCount = () => {
      const cart = localStorage.getItem('cart');
      if (cart) {
        try {
          const parsedCart = JSON.parse(cart);
          // Count total quantity instead of number of items
          const totalQuantity = parsedCart.reduce((total: number, item: any) => {
            return total + (item.quantity || 1);
          }, 0);
          setCartItemCount(totalQuantity);
        } catch (e) {
          console.error('Error parsing cart data', e);
          setCartItemCount(0);
        }
      } else {
        setCartItemCount(0);
      }
    };
    
    // Initial count
    updateCartCount();
    
    // Listen for storage events (if another tab updates the cart)
    window.addEventListener('storage', updateCartCount);
    
    // Custom event for cart updates within the same page
    window.addEventListener('cartUpdated', updateCartCount);
    
    return () => {
      window.removeEventListener('storage', updateCartCount);
      window.removeEventListener('cartUpdated', updateCartCount);
    };
  }, []);

  // Handle sign out
  const handleSignOut = () => {
    // In a real app, you would call an API to invalidate the session/token
    
    // Remove role and set isSignedIn to false
    const defaultUser = {
      isSignedIn: false,
      name: "John Doe",
      email: "john.doe@example.com",
      avatar: "https://i.pravatar.cc/150?u=john.doe@example.com",
      role: "user" // Reset role to default
    };
    
    // Replace the user object entirely rather than just modifying isSignedIn
    setUser(defaultUser);
    localStorage.setItem('mockUser', JSON.stringify(defaultUser));
    
    // Dispatch event to notify components of user update
    window.dispatchEvent(new Event('mockUserUpdated'));
    
    // Show success message
    toast({
      title: "Signed out",
      description: "You have been successfully signed out",
    });
    
    // Navigate to home page
    navigate("/");
  };

  // Use the original avatar URL
  const avatarUrl = user.avatar;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <img src="/assets/logo.svg" alt="SoundSync Logo" className="h-8 w-8" />
            <span className="text-xl font-bold">SoundSync</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/services" className="text-sm font-medium hover:text-beatforge-500 transition-colors">
            Services
          </Link>
          <Link to="/marketplace" className="text-sm font-medium hover:text-beatforge-500 transition-colors">
            Marketplace
          </Link>
          <Link to="/marketplace?tab=sell" className="text-sm font-medium hover:text-beatforge-500 transition-colors">
            Sell Your Sound
          </Link>
          <Link to="/pricing" className="text-sm font-medium hover:text-beatforge-500 transition-colors">
            Pricing
          </Link>
          <Link to="/contact" className="text-sm font-medium hover:text-beatforge-500 transition-colors">
            Contact
          </Link>
          <Link to="/aboutus" className="text-sm font-medium hover:text-beatforge-500 transition-colors">
            About Us
          </Link>
          {user.isSignedIn && (
            <Link to="/dashboard" className="text-sm font-medium hover:text-beatforge-500 transition-colors">
              Dashboard
            </Link>
          )}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setIsCartOpen(true)}
            className="relative hover:scale-105 transition-transform duration-200"
          >
            <ShoppingCart className="h-5 w-5" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-beatforge-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {cartItemCount > 9 ? '9+' : cartItemCount}
              </span>
            )}
          </Button>
          
          {user.isSignedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="relative h-8 w-8 rounded-full overflow-hidden border border-border hover:scale-105 transition-transform duration-200"
                  style={{
                    background: `url(${avatarUrl}) center/cover no-repeat, #374151`
                  }}
                >
                  {/* Keep the image for accessibility, but it's visually hidden */}
                  <span className="sr-only">{user.name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <div className="flex items-center justify-start gap-2 p-2">
                  <div 
                    className="w-8 h-8 rounded-full overflow-hidden"
                    style={{
                      background: `url(${avatarUrl}) center/cover no-repeat, #374151`
                    }}
                  >
                    <span className="sr-only">{user.name}</span>
                  </div>
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="w-full cursor-pointer">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/dashboard" className="w-full cursor-pointer">Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/dashboard?tab=purchases" className="w-full cursor-pointer">My Purchases</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/dashboard?tab=services" className="w-full cursor-pointer">Services</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={handleSignOut} className="cursor-pointer">
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link to="/sign-in">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link to="/get-started">
                <Button>Get Started</Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden flex flex-col gap-1 p-2"
          aria-label="Toggle menu"
        >
          <span className={`h-0.5 w-6 bg-foreground transition-all ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
          <span className={`h-0.5 w-6 bg-foreground transition-all ${isMenuOpen ? 'opacity-0' : 'opacity-100'}`} />
          <span className={`h-0.5 w-6 bg-foreground transition-all ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden container py-4 border-t">
          <nav className="flex flex-col gap-4">
            <Link 
              to="/services" 
              className="text-sm font-medium p-2 hover:bg-beatforge-100 dark:hover:bg-beatforge-950 rounded transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Services
            </Link>
            <Link 
              to="/marketplace" 
              className="text-sm font-medium p-2 hover:bg-beatforge-100 dark:hover:bg-beatforge-950 rounded transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Marketplace
            </Link>
            <Link 
              to="/marketplace?tab=sell" 
              className="text-sm font-medium p-2 hover:bg-beatforge-100 dark:hover:bg-beatforge-950 rounded transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Sell Your Sound
            </Link>
            <Link 
              to="/pricing" 
              className="text-sm font-medium p-2 hover:bg-beatforge-100 dark:hover:bg-beatforge-950 rounded transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Pricing
            </Link>
            <Link 
              to="/contact" 
              className="text-sm font-medium p-2 hover:bg-beatforge-100 dark:hover:bg-beatforge-950 rounded transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
            <Link 
              to="/aboutus" 
              className="text-sm font-medium p-2 hover:bg-beatforge-100 dark:hover:bg-beatforge-950 rounded transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              About Us
            </Link>
            
            {user.isSignedIn ? (
              <>
                <Link 
                  to="/dashboard" 
                  className="text-sm font-medium p-2 hover:bg-beatforge-100 dark:hover:bg-beatforge-950 rounded transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/profile" 
                  className="text-sm font-medium p-2 hover:bg-beatforge-100 dark:hover:bg-beatforge-950 rounded transition-colors flex items-center gap-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div 
                    className="w-6 h-6 rounded-full overflow-hidden border border-border"
                    style={{
                      background: `url(${avatarUrl}) center/cover no-repeat, #374151`
                    }}
                  >
                    <span className="sr-only">{user.name}</span>
                  </div>
                  Profile
                </Link>
                <Button 
                  variant="outline" 
                  className="mt-2"
                  onClick={handleSignOut}
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <div className="flex gap-2 mt-2">
                <Link to="/sign-in" className="flex-1">
                  <Button variant="outline" className="w-full">Sign In</Button>
                </Link>
                <Link to="/get-started" className="flex-1">
                  <Button className="w-full">Get Started</Button>
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}

      <CartSheet isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </header>
  );
}
