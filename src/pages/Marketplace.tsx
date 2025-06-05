import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { MarketplaceItem } from "@/components/MarketplaceItem";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

interface MarketplaceItem {
  id: string;
  title: string;
  artist: string;
  imageUrl: string;
  price: string;
  bpm: number;
  keySignature: string;
  genre: string;
  inStock: boolean;
  featured?: boolean;
  listens?: number;
  dateAdded?: string;
  salesCount?: number;
  description?: string;
}

export default function Marketplace() {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("all");
  const [items, setItems] = useState<MarketplaceItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showSellSection, setShowSellSection] = useState(false);
  
  const categories = [
    { id: "all", name: "All" },
    { id: "beats", name: "Beats" },
    { id: "samples", name: "Samples" },
    { id: "loops", name: "Loops" },
    { id: "midi", name: "MIDI" },
  ];

  // Parse URL parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryParam = params.get('category');
    
    if (categoryParam && categories.some(cat => cat.id === categoryParam.toLowerCase())) {
      setActiveCategory(categoryParam.toLowerCase());
    }
    
    // Handle sell tab if needed
    const tabParam = params.get('tab');
    if (tabParam === 'sell') {
      setShowSellSection(true);
    } else {
      setShowSellSection(false);
    }
  }, [location.search]);
  
  // Update URL when category changes
  const handleCategoryChange = (categoryId: string) => {
    setActiveCategory(categoryId);
    
    if (categoryId === 'all') {
      navigate('/marketplace');
    } else {
      navigate(`/marketplace?category=${categoryId}`);
    }
  };

  useEffect(() => {
    // Load marketplace items from localStorage
    setIsLoading(true);
    try {
      // Try to get marketplace items first
      const storedItems = localStorage.getItem('marketplaceItems');
      
      if (storedItems) {
        const parsedItems = JSON.parse(storedItems);
        console.log('Marketplace - Loaded items:', parsedItems);
        // Filter out items that are not in stock
        const inStockItems = parsedItems.filter((item: MarketplaceItem) => item.inStock === true);
        setItems(inStockItems);
      } else {
        // If no marketplace items found, try fallback to appTracks
        const storedTracks = localStorage.getItem('appTracks');
        if (storedTracks) {
          const parsedTracks = JSON.parse(storedTracks);
          console.log('Marketplace - Loaded tracks as fallback:', parsedTracks);
          
          // Convert tracks to marketplace items and set all as in stock
          const marketplaceItems = parsedTracks.map((track: any) => ({
            id: track.id,
            title: track.title,
            artist: track.artist,
            price: track.price || "$19.99",
            bpm: track.bpm || 128,
            keySignature: track.keySignature || "C",
            genre: track.genre || "Mixed",
            imageUrl: track.imageUrl,
            inStock: true,
            featured: track.featured || false,
            dateAdded: track.dateAdded || new Date().toISOString().split('T')[0]
          }));
          
          setItems(marketplaceItems);
          // Save these converted items to marketplaceItems for next time
          localStorage.setItem('marketplaceItems', JSON.stringify(marketplaceItems));
        } else {
          console.log('Marketplace - No items in localStorage, loading fallback items');
          loadFallbackItems();
        }
      }
    } catch (error) {
      console.error("Error loading marketplace items:", error);
      loadFallbackItems();
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  // Load fallback marketplace items
  const loadFallbackItems = () => {
    const fallbackItems = [
      {
        id: "1",
        title: "Neon Nights",
        artist: "DreamBeats",
        price: "$24.99",
        bpm: 128,
        keySignature: "Am",
        genre: "Synthwave",
        inStock: true,
        featured: false,
        dateAdded: new Date().toISOString().split('T')[0],
        imageUrl: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=800&q=80"
      },
      {
        id: "2",
        title: "Trap Soul",
        artist: "808 Mafia",
        price: "$19.99",
        bpm: 140,
        keySignature: "Fm",
        genre: "Trap",
        inStock: true,
        featured: false,
        dateAdded: new Date().toISOString().split('T')[0],
        imageUrl: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?auto=format&fit=crop&w=800&q=80"
      },
      {
        id: "3",
        title: "Lo-Fi Dreams",
        artist: "ChillHop",
        price: "$14.99",
        bpm: 90,
        keySignature: "C",
        genre: "Lo-Fi",
        inStock: true,
        featured: false,
        dateAdded: new Date().toISOString().split('T')[0],
        imageUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80"
      },
      {
        id: "4",
        title: "Future Bass",
        artist: "WaveMakers",
        price: "$29.99",
        bpm: 150,
        keySignature: "G",
        genre: "EDM",
        inStock: true,
        featured: false,
        dateAdded: new Date().toISOString().split('T')[0],
        imageUrl: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=800&q=80"
      },
      {
        id: "5",
        title: "Hip Hop Essentials",
        artist: "Urban Beats",
        price: "$34.99",
        bpm: 95,
        keySignature: "Dm",
        genre: "Hip Hop",
        inStock: true,
        featured: false,
        dateAdded: new Date().toISOString().split('T')[0],
        imageUrl: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=800&q=80"
      },
    ];
    
    setItems(fallbackItems);
    localStorage.setItem('marketplaceItems', JSON.stringify(fallbackItems));
  };

  // Filter items based on active category
  const filteredItems = activeCategory === "all" 
    ? items 
    : items.filter(item => item.genre.toLowerCase() === activeCategory.toLowerCase());

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-card py-16 md:py-24">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl">
                {showSellSection ? "Sell Your Sounds" : "Audio Marketplace"}
              </h1>
              <p className="mb-8 text-lg text-muted-foreground">
                {showSellSection 
                  ? "Turn your creativity into income by selling your audio creations on our marketplace."
                  : "Discover premium beats, samples, loops, and MIDI files from top producers."}
              </p>
              {showSellSection && (
                <Button 
                  className="bg-beatforge-500 hover:bg-beatforge-600 text-white"
                  onClick={() => navigate('/dashboard?tab=selling')}
                >
                  Get Started
                </Button>
              )}
            </div>
          </div>
        </section>

        {/* Sell Your Sounds Section */}
        {showSellSection ? (
          <div className="container py-12">
            <div className="grid gap-8 md:grid-cols-3">
              <div className="bg-card p-6 rounded-lg border">
                <div className="mb-4 text-3xl text-center text-beatforge-500">🎵</div>
                <h3 className="text-xl font-semibold mb-2 text-center">Create Quality Content</h3>
                <p className="text-muted-foreground text-center">
                  Produce high-quality audio files that stand out in the marketplace. Quality sells!
                </p>
              </div>
              
              <div className="bg-card p-6 rounded-lg border">
                <div className="mb-4 text-3xl text-center text-beatforge-500">📦</div>
                <h3 className="text-xl font-semibold mb-2 text-center">Upload & Price Your Work</h3>
                <p className="text-muted-foreground text-center">
                  Upload your creations to our platform and set competitive prices to maximize sales.
                </p>
              </div>
              
              <div className="bg-card p-6 rounded-lg border">
                <div className="mb-4 text-3xl text-center text-beatforge-500">💰</div>
                <h3 className="text-xl font-semibold mb-2 text-center">Earn Money</h3>
                <p className="text-muted-foreground text-center">
                  Get paid when customers purchase your audio files. Low fees, high profits.
                </p>
              </div>
            </div>
            
            <div className="mt-12 bg-card p-8 rounded-lg border">
              <h2 className="text-2xl font-bold mb-4">Ready to sell your sounds?</h2>
              <p className="text-muted-foreground mb-6">
                Join thousands of creators who earn income through SoundSync's marketplace. Our platform handles payments, delivery, and provides powerful analytics to help grow your business.
              </p>
              <div className="flex gap-4">
                <Button 
                  onClick={() => navigate('/dashboard?tab=selling')} 
                  className="bg-beatforge-500 hover:bg-beatforge-600"
                >
                  Start Selling
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/marketplace')}
                >
                  Browse Marketplace
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Filters */}
            <section className="border-y py-6">
              <div className="container">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <Button
                        key={category.id}
                        variant={activeCategory === category.id ? "default" : "outline"}
                        onClick={() => handleCategoryChange(category.id)}
                        className={
                          activeCategory === category.id
                            ? "bg-beatforge-500 hover:bg-beatforge-600"
                            : ""
                        }
                      >
                        {category.name}
                      </Button>
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Sort by:</span>
                    <select className="rounded-md border bg-background px-3 py-2 text-sm">
                      <option>Newest</option>
                      <option>Price: Low to High</option>
                      <option>Price: High to Low</option>
                      <option>Most Popular</option>
                    </select>
                  </div>
                </div>
              </div>
            </section>

            {/* Marketplace Items Grid */}
            <section className="container py-12">
              <h2 className="text-2xl font-bold mb-8">Browse {activeCategory !== "all" ? activeCategory : "All Sounds"}</h2>
              
              {isLoading ? (
                <div className="flex justify-center items-center py-16">
                  <Loader2 className="h-8 w-8 animate-spin text-beatforge-500" />
                </div>
              ) : filteredItems.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-muted-foreground">No items found in this category.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredItems.map((item) => (
                    <MarketplaceItem
                      key={item.id}
                      title={item.title}
                      producer={item.artist}
                      price={item.price}
                      bpm={item.bpm}
                      keySignature={item.keySignature}
                      genre={item.genre}
                      imageUrl={item.imageUrl}
                    />
                  ))}
                </div>
              )}
            </section>
          </>
        )}

        {/* Marketplace Grid */}
        <>
          <section className="py-16">
            <div className="container">
              {isLoading ? (
                <div className="flex justify-center items-center py-20">
                  <Loader2 className="h-8 w-8 animate-spin text-beatforge-500" />
                </div>
              ) : filteredItems.length > 0 ? (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  {filteredItems.map((item) => (
                    <MarketplaceItem
                      key={item.id}
                      title={item.title}
                      producer={item.artist}
                      price={item.price}
                      bpm={item.bpm}
                      keySignature={item.keySignature}
                      genre={item.genre}
                      imageUrl={item.imageUrl}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20">
                  <p className="text-muted-foreground text-lg">No items found in this category.</p>
                </div>
              )}
              {filteredItems.length > 8 && (
                <div className="mt-12 text-center">
                  <Button>Load More</Button>
                </div>
              )}
            </div>
          </section>
        </>
      </main>
      <Footer />
    </div>
  );
}
