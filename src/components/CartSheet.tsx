import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import { Plus, Minus, X, LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface CartItem {
  id: string;
  title: string;
  price: string;
  imageUrl: string;
  producer?: string;
  quantity: number;
}

interface CartSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartSheet({ isOpen, onClose }: CartSheetProps) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isUserSignedIn, setIsUserSignedIn] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [returnAfterLogin, setReturnAfterLogin] = useState(false);
  const navigate = useNavigate();
  
  // Load cart items and check user login status
  useEffect(() => {
    if (isOpen) {
      loadCartItems();
      checkUserLoginStatus();
    }
    
    // Handle login status changes
    const handleStorageChange = () => {
      checkUserLoginStatus();
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('mockUserUpdated', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('mockUserUpdated', handleStorageChange);
    };
  }, [isOpen]);
  
  // Check if user returned after login
  useEffect(() => {
    if (returnAfterLogin && isUserSignedIn) {
      setReturnAfterLogin(false);
      handleCheckout();
    }
  }, [returnAfterLogin, isUserSignedIn]);
  
  const checkUserLoginStatus = () => {
    const mockUserRaw = localStorage.getItem('mockUser');
    if (mockUserRaw) {
      try {
        const mockUser = JSON.parse(mockUserRaw);
        setIsUserSignedIn(mockUser.isSignedIn);
      } catch (e) {
        console.error('Error parsing user data', e);
        setIsUserSignedIn(false);
      }
    } else {
      setIsUserSignedIn(false);
    }
  };
  
  const loadCartItems = () => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      try {
        const parsedCart = JSON.parse(storedCart);
        // Ensure all items have a quantity property
        const updatedCart = parsedCart.map((item: CartItem) => ({
          ...item,
          quantity: item.quantity || 1
        }));
        setCartItems(updatedCart);
      } catch (e) {
        console.error('Error parsing cart data', e);
        setCartItems([]);
      }
    }
  };
  
  const removeItem = (id: string) => {
    const updatedCart = cartItems.filter(item => item.id !== id);
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    
    // Dispatch custom event to notify components about cart update
    window.dispatchEvent(new Event('cartUpdated'));
    
    toast({
      title: "Item removed",
      description: "The item has been removed from your cart."
    });
  };

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return; // Don't allow quantities less than 1
    
    const updatedCart = cartItems.map(item => {
      if (item.id === id) {
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
    
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    
    // Dispatch custom event to notify components about cart update
    window.dispatchEvent(new Event('cartUpdated'));
  };
  
  const initiateCheckout = () => {
    if (!isUserSignedIn) {
      // Show login dialog if user is not signed in
      setShowLoginDialog(true);
    } else {
      // Proceed with checkout if user is signed in
      handleCheckout();
    }
  };
  
  const handleRedirectToLogin = () => {
    // Close login dialog
    setShowLoginDialog(false);
    // Close cart
    onClose();
    // Set flag to return after login
    setReturnAfterLogin(true);
    // Store cart state for after login
    localStorage.setItem('pendingCheckout', 'true');
    // Redirect to sign in page
    navigate('/sign-in', { state: { returnTo: window.location.pathname } });
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) return;
    
    setIsCheckingOut(true);
    
    try {
      // Clear pending checkout flag if it exists
      localStorage.removeItem('pendingCheckout');
      
      // Simulate processing payment (in a real app, this would call your payment API)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Create a unique order ID
      const orderId = `order-${Date.now()}`;
      
      // Save purchase history to localStorage
      const purchaseHistory = JSON.parse(localStorage.getItem('purchaseHistory') || '[]');
      const purchase = {
        id: orderId,
        date: new Date().toISOString(),
        items: cartItems,
        total: total,
        type: 'marketplace'
      };
      purchaseHistory.push(purchase);
      localStorage.setItem('purchaseHistory', JSON.stringify(purchaseHistory));
      
      // Add to user's purchases in mockUser
      const mockUserRaw = localStorage.getItem('mockUser');
      if (mockUserRaw) {
        const mockUser = JSON.parse(mockUserRaw);
        const purchases = mockUser.purchases || [];
        
        // Add each item as a separate purchase
        cartItems.forEach(item => {
          purchases.push({
            id: `purchase-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            itemId: item.id,
            title: item.title,
            producer: item.producer,
            amount: parseFloat(item.price.replace('$', '')),
            quantity: item.quantity,
            totalPrice: (parseFloat(item.price.replace('$', '')) * item.quantity).toFixed(2),
            currency: 'USD',
            status: "paid",
            date: new Date().toISOString(),
            imageUrl: item.imageUrl,
            type: "marketplace"
          });
        });
        
        // Update user data
        localStorage.setItem('mockUser', JSON.stringify({
          ...mockUser,
          purchases,
          currentOrderId: orderId
        }));
      }
      
      // Clear cart
      localStorage.setItem('cart', '[]');
      setCartItems([]);
      
      // Notify components about cart update
      window.dispatchEvent(new Event('cartUpdated'));
      
      // Show success message
      toast({
        title: "Order successful!",
        description: "Your order has been placed. Thank you for your purchase!",
      });
      
      // Close the cart sheet
      onClose();
      
      // Redirect to success page with marketplace type parameter
      navigate(`/payment-success?type=marketplace&amount=${total}&currency=USD`);
    } catch (error) {
      console.error('Checkout error:', error);
      toast({
        title: "Checkout failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCheckingOut(false);
    }
  };

  const total = cartItems.reduce((sum, item) => 
    sum + (parseFloat(item.price.replace('$', '')) * (item.quantity || 1)), 0
  ).toFixed(2);

  return (
    <>
    <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="w-[400px] sm:max-w-[540px] flex flex-col h-full">
        <SheetHeader>
          <SheetTitle className="text-2xl font-bold">Your Cart</SheetTitle>
        </SheetHeader>
          
          <div className="flex flex-col flex-1 overflow-hidden">
            {/* Scrollable cart items */}
            <div className="flex-1 overflow-y-auto py-4 pr-2">
              <div className="flex flex-col gap-4">
                {cartItems.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">Your cart is empty</p>
                  </div>
                ) : (
                  cartItems.map((item) => (
                    <div 
                      key={item.id} 
                      className="flex flex-col p-4 rounded-lg bg-card animate-in fade-in-50 duration-300"
                    >
                      <div className="flex items-center gap-4 mb-2">
              <img 
                src={item.imageUrl} 
                alt={item.title} 
                className="w-20 h-20 object-cover rounded-md"
              />
              <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                <h3 className="font-semibold">{item.title}</h3>
                <p className="text-muted-foreground">{item.price}</p>
                              {item.producer && <p className="text-xs text-muted-foreground">By {item.producer}</p>}
              </div>
              <Button 
                variant="ghost" 
                              size="icon" 
                              className="text-destructive hover:text-destructive/90 h-8 w-8"
                              onClick={() => removeItem(item.id)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-7 w-7" 
                            onClick={() => updateQuantity(item.id, (item.quantity || 1) - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="text-sm w-8 text-center">{item.quantity || 1}</span>
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-7 w-7" 
                            onClick={() => updateQuantity(item.id, (item.quantity || 1) + 1)}
                          >
                            <Plus className="h-3 w-3" />
              </Button>
                        </div>
                        <div className="text-right font-medium">
                          Total: ${((parseFloat(item.price.replace('$', '')) * (item.quantity || 1))).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Fixed checkout section */}
            {cartItems.length > 0 && (
              <div className="border-t mt-auto pt-4 bg-background">
              <div className="flex justify-between mb-4">
                <span className="font-semibold">Total:</span>
                <span className="font-bold text-lg">${total}</span>
              </div>
                <Button 
                  className="w-full bg-beatforge-500 hover:bg-beatforge-600"
                  onClick={initiateCheckout}
                  disabled={isCheckingOut}
                >
                  {isCheckingOut ? "Processing..." : "Checkout"}
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
      
      {/* Login Required Dialog */}
      <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Sign In Required</DialogTitle>
            <DialogDescription>
              You need to be signed in to complete your purchase. Please sign in to continue with checkout.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col sm:flex-row gap-2 mt-4">
            <Button 
              variant="outline" 
              onClick={() => setShowLoginDialog(false)}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
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
    </>
  );
}
