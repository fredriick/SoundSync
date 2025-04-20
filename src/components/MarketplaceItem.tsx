
import { Button } from "@/components/ui/button";
import { ShoppingCart, Headphones } from "lucide-react";
import { cn } from "@/lib/utils";

interface MarketplaceItemProps {
  title: string;
  producer: string;
  imageUrl: string;
  price: string;
  bpm: number;
  key: string;
  genre: string;
  className?: string;
}

export function MarketplaceItem({
  title,
  producer,
  imageUrl,
  price,
  bpm,
  key,
  genre,
  className,
}: MarketplaceItemProps) {
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
            {key}
          </span>
          <span className="rounded-full bg-beatforge-100 dark:bg-beatforge-900 px-2 py-1 font-medium text-beatforge-800 dark:text-beatforge-200">
            {genre}
          </span>
        </div>
        <Button className="w-full gap-2">
          <ShoppingCart className="h-4 w-4" />
          Add to Cart
        </Button>
      </div>
    </div>
  );
}
