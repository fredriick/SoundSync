import { Button } from "@/components/ui/button";
import { ShoppingCart, Headphones } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/use-toast";

interface MarketplaceItemProps {
  title: string;
  producer: string;
  imageUrl: string;
  price: string;
  bpm: number;
  keySignature: string;
  genre: string;
  className?: string;
}

export function MarketplaceItem({
  title,
  producer,
  imageUrl,
  price,
  bpm,
  keySignature,
  genre,
  className,
}: MarketplaceItemProps) {
  const handleAddToCart = () => {
    // Get existing cart from localStorage or initialize empty array
    const existingCart = localStorage.getItem('cart');
    const cart = existingCart ? JSON.parse(existingCart) : [];
    
    // Create a unique item identifier based on title and producer
    const itemIdentifier = `${title}-${producer}`;
    
    // Check if the item already exists in the cart
    const existingItemIndex = cart.findIndex(
      (item: any) => `${item.title}-${item.producer}` === itemIdentifier
    );
    
    if (existingItemIndex >= 0) {
      // Item exists, increment quantity
      if (!cart[existingItemIndex].quantity) {
        cart[existingItemIndex].quantity = 1; // Initialize if not present
      }
      cart[existingItemIndex].quantity += 1;
      
      toast({
        title: "Cart updated",
        description: `${title} quantity increased to ${cart[existingItemIndex].quantity}.`,
      });
    } else {
      // Add new item to cart with quantity 1
      cart.push({
        id: Date.now().toString(),
        title,
        price,
        imageUrl,
        producer,
        quantity: 1
      });
      
      toast({
        title: "Added to cart",
        description: `${title} has been added to your cart.`,
      });
    }
    
    // Save updated cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Dispatch custom event to notify components about cart update
    window.dispatchEvent(new Event('cartUpdated'));
  };

  return (
    <div className={cn("group overflow-hidden rounded-lg border bg-card transition-all hover:shadow-md", className)}>
      <div className="relative aspect-square overflow-hidden">
        <img
          src={imageUrl || "https://placehold.co/600x600/252836/8b5cf6"}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
          <Button size="icon" variant="ghost" className="h-12 w-12 rounded-full bg-beatforge-500/90 text-white hover:bg-beatforge-600 hover:text-white">
            <Headphones className="h-6 w-6" />
          </Button>
        </div>
      </div>
      <div className="p-4">
        <div className="mb-2 flex items-start justify-between">
          <div>
            <h3 className="font-bold">{title}</h3>
            <p className="text-sm text-muted-foreground">{producer}</p>
          </div>
          <div className="text-right font-bold text-beatforge-500">{price}</div>
        </div>
        <div className="mb-4 flex gap-2 text-xs">
          <span className="rounded-full bg-beatforge-100 dark:bg-beatforge-900 px-2 py-1 font-medium text-beatforge-800 dark:text-beatforge-200">
            {bpm} BPM
          </span>
          <span className="rounded-full bg-beatforge-100 dark:bg-beatforge-900 px-2 py-1 font-medium text-beatforge-800 dark:text-beatforge-200">
            {keySignature}
          </span>
          <span className="rounded-full bg-beatforge-100 dark:bg-beatforge-900 px-2 py-1 font-medium text-beatforge-800 dark:text-beatforge-200">
            {genre}
          </span>
        </div>
        <Button className="w-full gap-2" onClick={handleAddToCart}>
          <ShoppingCart className="h-4 w-4" />
          Add to Cart
        </Button>
      </div>
    </div>
  );
}
