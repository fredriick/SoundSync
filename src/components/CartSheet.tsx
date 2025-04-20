
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface CartItem {
  title: string;
  price: string;
  imageUrl: string;
}

interface CartSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartSheet({ isOpen, onClose }: CartSheetProps) {
  // Temporary cart items for demonstration
  const [cartItems] = useState<CartItem[]>([
    {
      title: "Neon Nights",
      price: "$24.99",
      imageUrl: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "Trap Soul",
      price: "$19.99",
      imageUrl: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?auto=format&fit=crop&w=800&q=80"
    }
  ]);

  const total = cartItems.reduce((sum, item) => 
    sum + parseFloat(item.price.replace('$', '')), 0
  ).toFixed(2);

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[400px] sm:max-w-[540px]">
        <SheetHeader>
          <SheetTitle className="text-2xl font-bold">Your Cart</SheetTitle>
        </SheetHeader>
        <div className="mt-8 flex flex-col gap-6">
          {cartItems.map((item, index) => (
            <div 
              key={index} 
              className="flex items-center gap-4 p-4 rounded-lg bg-card animate-in fade-in-50 slide-in-from-right-5 duration-300"
            >
              <img 
                src={item.imageUrl} 
                alt={item.title} 
                className="w-20 h-20 object-cover rounded-md"
              />
              <div className="flex-1">
                <h3 className="font-semibold">{item.title}</h3>
                <p className="text-muted-foreground">{item.price}</p>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-destructive hover:text-destructive/90"
              >
                Remove
              </Button>
            </div>
          ))}

          {cartItems.length > 0 ? (
            <div className="mt-auto pt-6 border-t">
              <div className="flex justify-between mb-4">
                <span className="font-semibold">Total:</span>
                <span className="font-bold text-lg">${total}</span>
              </div>
              <Button className="w-full bg-beatforge-500 hover:bg-beatforge-600">
                Checkout
              </Button>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Your cart is empty</p>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
