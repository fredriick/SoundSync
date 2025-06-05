import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AudioWaveform } from "@/components/AudioWaveform";
import { ServiceCard } from "@/components/ServiceCard";
import { MarketplaceItem } from "@/components/MarketplaceItem";
import { Headphones, Music3, AudioWaveform as AudioWaveformIcon, Volume2, ShoppingCart, Play, Music } from "lucide-react";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from "@/components/ui/carousel";

// Define Track type
interface MarketplaceItem {
  id: string;
  title: string;
  artist: string;
  imageUrl: string;
  price?: string;
  bpm?: number;
  keySignature?: string;
  genre?: string;
  inStock: boolean;
  featured?: boolean;
  listens?: number;
  dateAdded?: string;
  salesCount?: number;
  description?: string;
  linkUrl?: string;
}

export default function Index() {
  const [isUserSignedIn, setIsUserSignedIn] = useState(false);
  const [featuredTracks, setFeaturedTracks] = useState<MarketplaceItem[]>([]);
  const [marketplaceTracks, setMarketplaceTracks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [recentWorks, setRecentWorks] = useState<MarketplaceItem[]>([]);
  const [carouselItems, setCarouselItems] = useState<any[]>([]);
  const [carouselApi, setCarouselApi] = useState<any>(null);
  const [recentWorksCarouselApi, setRecentWorksCarouselApi] = useState<any>(null);
  
  // Check if user is signed in
  useEffect(() => {
    const userDataRaw = localStorage.getItem('mockUser');
    if (userDataRaw) {
      try {
        const userData = JSON.parse(userDataRaw);
        setIsUserSignedIn(userData.isSignedIn);
      } catch (e) {
        console.error('Error parsing user data', e);
      }
    }
    
    // First try to load from marketplaceItems
    const storedItems = localStorage.getItem('marketplaceItems');
    
    if (storedItems) {
      try {
        const parsedItems: MarketplaceItem[] = JSON.parse(storedItems);
        console.log('Loaded marketplace items:', parsedItems);
        
        // Filter to only include in-stock items
        const inStockItems = parsedItems.filter(item => item.inStock === true);
        
        // Filter to only include featured tracks from in-stock items
        const featured = inStockItems.filter(item => item.featured === true);
        console.log('Featured items:', featured);
        
        setFeaturedTracks(featured);
        
        // Get up to 4 tracks for marketplace preview (only in-stock items)
        const marketplacePreview = inStockItems.slice(0, 4).map(item => ({
          id: item.id,
          title: item.title,
          producer: item.artist,
          price: item.price || "$19.99",
          bpm: item.bpm || 128,
          keySignature: item.keySignature || "C",
          genre: item.genre || "Mixed",
          imageUrl: item.imageUrl
        }));
        setMarketplaceTracks(marketplacePreview);
        
        // Get recent works for the carousel - use all items to show our complete portfolio
        // Sort by date added (most recent first) and get up to 10 items
        const sorted = [...parsedItems].sort((a, b) => {
          if (!a.dateAdded || !b.dateAdded) return 0;
          return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
        });
        setRecentWorks(sorted.slice(0, 10));
      } catch (e) {
        console.error('Error parsing stored marketplace items', e);
        // Try fallback to appTracks if error
        tryLoadAppTracks();
      }
    } else {
      // If no marketplaceItems, try appTracks as fallback
      tryLoadAppTracks();
    }
    
    // Load carousel items from localStorage
    const storedCarouselItems = localStorage.getItem('carouselItems');
    if (storedCarouselItems) {
      try {
        const parsedCarouselItems = JSON.parse(storedCarouselItems);
        // Only show active carousel items
        const activeItems = parsedCarouselItems.filter((item: any) => item.isActive === true);
        setCarouselItems(activeItems);
      } catch (e) {
        console.error('Error parsing carousel items', e);
        setCarouselItems([]);
      }
    }
    
    setIsLoading(false);
  }, []);
  
  // Fallback to appTracks if marketplaceItems doesn't exist
  const tryLoadAppTracks = () => {
    const storedTracks = localStorage.getItem('appTracks');
    
    if (storedTracks) {
      try {
        const parsedTracks = JSON.parse(storedTracks);
        console.log('Fallback - Loaded tracks:', parsedTracks);
        
        // Convert appTracks to marketplaceItems format and set all as in stock
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
        
        // Filter to only include featured tracks
        const featured = marketplaceItems.filter(item => item.featured === true);
        setFeaturedTracks(featured);
        
        // Get up to 4 tracks for marketplace preview
        const marketplacePreview = marketplaceItems.slice(0, 4).map(item => ({
          id: item.id,
          title: item.title,
          producer: item.artist,
          price: item.price || "$19.99",
          bpm: item.bpm || 128,
          keySignature: item.keySignature || "C",
          genre: item.genre || "Mixed",
          imageUrl: item.imageUrl
        }));
        setMarketplaceTracks(marketplacePreview);
        
        // Save converted items to marketplaceItems for next time
        localStorage.setItem('marketplaceItems', JSON.stringify(marketplaceItems));
        
        // Get recent works for the carousel - use all items to show our complete portfolio
        // Sort by date added (most recent first) and get up to 10 items
        const sorted = [...marketplaceItems].sort((a, b) => {
          if (!a.dateAdded || !b.dateAdded) return 0;
          return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
        });
        setRecentWorks(sorted.slice(0, 10));
      } catch (e) {
        console.error('Error parsing stored tracks', e);
        setFeaturedTracks([]);
        setMarketplaceTracks([]);
      }
    } else {
      console.log('No tracks or marketplace items in localStorage');
      setFeaturedTracks([]);
      setMarketplaceTracks([]);
    }
  };

  // Auto-slide for the main carousel
  useEffect(() => {
    if (!carouselApi) return;
    
    const interval = setInterval(() => {
      if (carouselApi.canScrollNext()) {
        carouselApi.scrollNext();
      } else {
        carouselApi.scrollTo(0);
      }
    }, 10000); // 10 seconds
    
    return () => clearInterval(interval);
  }, [carouselApi]);
  
  // Auto-slide for the recent works carousel
  useEffect(() => {
    if (!recentWorksCarouselApi) return;
    
    const interval = setInterval(() => {
      if (recentWorksCarouselApi.canScrollNext()) {
        recentWorksCarouselApi.scrollNext();
      } else {
        recentWorksCarouselApi.scrollTo(0);
      }
    }, 10000); // 10 seconds
    
    return () => clearInterval(interval);
  }, [recentWorksCarouselApi]);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 md:py-32">
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-beatforge-950 via-background to-background opacity-70"></div>
          <div className="absolute inset-0 -z-20 bg-[url('https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center bg-no-repeat opacity-20"></div>
          <div className="container relative">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-6xl">
                <span className="relative">
                  <span className="relative z-10">Your Sound. </span>
                  <span className="absolute bottom-2 left-0 right-0 z-0 h-3 bg-beatforge-500/30"></span>
                </span>
                <span className="bg-gradient-to-r from-beatforge-400 to-beatforge-600 bg-clip-text text-transparent">
                  Perfected.
                </span>
              </h1>
              <p className="mb-8 text-lg text-muted-foreground md:text-xl">
                Professional mixing, mastering, and a marketplace for premium audio samples and beats. Elevate your sound with SoundSync.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                {!isUserSignedIn ? (
                  <>
                    <Button size="lg" className="bg-beatforge-500 text-white hover:bg-beatforge-600" asChild>
                      <Link to="/get-started">Get Started</Link>
                    </Button>
                    <Button size="lg" variant="outline" asChild>
                      <Link to="/marketplace">Browse Marketplace</Link>
                    </Button>
                  </>
                ) : (
                  <Button size="lg" variant="outline" asChild>
                    <Link to="/marketplace">Browse Marketplace</Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-16 md:py-24">
          <div className="container">
            <div className="mb-12 text-center">
              <h2 className="mb-3 text-3xl font-bold md:text-4xl">Professional Audio Services</h2>
              <p className="mx-auto max-w-2xl text-muted-foreground">
                From raw recordings to polished tracks, our services bring out the best in your music.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              <ServiceCard
                title="Mixing"
                description="Full mix engineering with attention to detail and clarity."
                icon={<AudioWaveformIcon className="h-6 w-6" />}
                features={[
                  "Up to 64 tracks",
                  "2 revision rounds",
                  "Mixing & blending",
                  "EQ & compression",
                  "Delivery in 5-7 days"
                ]}
                price="$500"
              />
              <ServiceCard
                title="Mastering"
                description="Add the final polish to your mix with professional mastering."
                icon={<Volume2 className="h-6 w-6" />}
                features={[
                  "Loudness optimization",
                  "Stereo enhancement",
                  "EQ & dynamic processing",
                  "2 revision rounds",
                  "Delivery in 3-5 days"
                ]}
                price="$200"
                popular={true}
              />
              <ServiceCard
                title="Production"
                description="Complete track production from your concepts to finished beats."
                icon={<Music3 className="h-6 w-6" />}
                features={[
                  "Custom beat creation",
                  "Arrangement & structure",
                  "3 revision rounds",
                  "Stems delivery",
                  "Delivery in 7-10 days"
                ]}
                price="$700"
              />
            </div>
            <div className="mt-12 text-center">
              <Button variant="outline" asChild>
                <Link to="/services">View All Services</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Featured Tracks */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <h2 className="text-center text-3xl font-bold mb-12">Featured Tracks</h2>
            
            {isLoading ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : featuredTracks.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredTracks.map((track) => (
                  <Card key={track.id} className="overflow-hidden transition-all hover:shadow-lg">
                    <div className="relative h-48 bg-gray-100">
                      <img 
                        src={track.imageUrl || "https://via.placeholder.com/300x200"} 
                        alt={track.title}
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity">
                        <Button size="icon" variant="secondary" className="h-12 w-12 rounded-full">
                          <Play className="h-6 w-6" />
                        </Button>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg">{track.title}</h3>
                      <p className="text-muted-foreground">{track.artist}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground">No featured tracks available at the moment.</p>
            )}
            
            <div className="mt-12 text-center">
              <Button asChild variant="outline">
                <Link to="/marketplace">Browse All Tracks</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Marketplace Section */}
        <section className="py-16 md:py-24">
          <div className="container">
            <div className="mb-12 text-center">
              <h2 className="mb-3 text-3xl font-bold md:text-4xl">Sound Marketplace</h2>
              <p className="mx-auto max-w-2xl text-muted-foreground">
                Find the perfect samples, beats, and audio resources for your next project.
              </p>
            </div>
            
            {isLoading ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : marketplaceTracks.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {marketplaceTracks.map((track) => (
                  <MarketplaceItem
                    key={track.id}
                    title={track.title}
                    producer={track.producer}
                    price={track.price}
                    bpm={track.bpm}
                    keySignature={track.keySignature}
                    genre={track.genre}
                    imageUrl={track.imageUrl}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">No items currently available in the marketplace.</p>
                <p className="text-muted-foreground mt-2">Check back soon for new additions!</p>
              </div>
            )}
            
            <div className="mt-12 text-center">
              <Button variant="outline" asChild>
                <Link to="/marketplace">Browse Marketplace</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative py-16 md:py-24">
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-beatforge-900 to-beatforge-950"></div>
          <div className="container relative">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="mb-6 text-3xl font-bold text-white md:text-4xl">
                Ready to transform your sound?
              </h2>
              <p className="mb-8 text-lg text-beatforge-100">
                Join thousands of artists and producers who trust SoundSync with their music.
              </p>
              {!isUserSignedIn ? (
                <Button size="lg" className="bg-white text-beatforge-900 hover:bg-beatforge-100" asChild>
                  <Link to="/get-started">Get Started Today</Link>
                </Button>
              ) : (
                <Button size="lg" className="bg-white text-beatforge-900 hover:bg-beatforge-100" asChild>
                  <Link to="/services">Browse Services</Link>
                </Button>
              )}
            </div>
          </div>
        </section>
        
        {/* Recent Works Carousel */}
        <section className="py-16 bg-background">
          <div className="container">
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-bold mb-4">Our Recent Works</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Explore our latest productions and collaborations with top artists in the industry.
              </p>
            </div>
            
            {carouselItems.length > 0 ? (
              <Carousel
                opts={{
                  align: "start",
                  loop: true,
                }}
                setApi={setCarouselApi}
                className="w-full"
              >
                <CarouselContent className="-ml-2 md:-ml-4">
                  {carouselItems.map((item) => (
                    <CarouselItem key={item.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3 transition-all duration-300 hover:scale-[1.02]">
                      <div className="p-1">
                        <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg">
                          <div className="relative h-48 bg-gray-100 overflow-hidden">
                            <img 
                              src={item.imageUrl || "https://via.placeholder.com/300x200"} 
                              alt={item.title}
                              className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity">
                              <Button size="icon" variant="secondary" className="h-12 w-12 rounded-full" asChild>
                                {item.linkUrl?.startsWith('http') || item.linkUrl?.startsWith('www') ? (
                                  <a href={item.linkUrl} target="_blank" rel="noopener noreferrer">
                                    <Play className="h-6 w-6" />
                                  </a>
                                ) : (
                                  <Link to={item.linkUrl || ''}>
                                    <Play className="h-6 w-6" />
                                  </Link>
                                )}
                              </Button>
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                              <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-beatforge-500/80 text-white mb-2">
                                Featured
                              </div>
                            </div>
                          </div>
                          <CardContent className="p-4">
                            <h3 className="font-semibold text-lg">{item.title}</h3>
                            <p className="text-muted-foreground text-sm mt-1">{item.description}</p>
                            <div className="mt-4">
                              <Button variant="outline" size="sm" className="w-full" asChild>
                                {item.linkUrl?.startsWith('http') || item.linkUrl?.startsWith('www') ? (
                                  <a href={item.linkUrl} target="_blank" rel="noopener noreferrer">
                                    Learn More
                                  </a>
                                ) : (
                                  <Link to={item.linkUrl || ''}>
                                    Learn More
                                  </Link>
                                )}
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <div className="flex justify-center mt-4">
                  <CarouselPrevious className="static translate-y-0 mr-2" />
                  <CarouselNext className="static translate-y-0" />
                </div>
              </Carousel>
            ) : recentWorks.length > 0 ? (
              // Fallback to recent works if no carousel items are configured
              <Carousel
                opts={{
                  align: "start",
                  loop: true,
                }}
                setApi={setRecentWorksCarouselApi}
                className="w-full"
              >
                <CarouselContent className="-ml-2 md:-ml-4">
                  {recentWorks.map((work) => (
                    <CarouselItem key={work.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3 transition-all duration-300 hover:scale-[1.02]">
                      <div className="p-1">
                        <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg">
                          <div className="relative h-48 bg-gray-100 overflow-hidden">
                            <img 
                              src={work.imageUrl || "https://via.placeholder.com/300x200"} 
                              alt={work.title}
                              className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity">
                              <Button size="icon" variant="secondary" className="h-12 w-12 rounded-full">
                                <Play className="h-6 w-6" />
                              </Button>
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                              <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-beatforge-500/80 text-white mb-2">
                                {work.genre}
                              </div>
                            </div>
                          </div>
                          <CardContent className="p-4">
                            <h3 className="font-semibold text-lg">{work.title}</h3>
                            <p className="text-muted-foreground">{work.artist}</p>
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-sm text-muted-foreground">
                                {work.bpm} BPM • {work.keySignature}
                              </span>
                              <div className="flex items-center gap-1 text-beatforge-500">
                                <Music className="h-4 w-4" />
                                <span className="text-sm font-medium">{work.salesCount || 0} sales</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <div className="flex justify-center mt-4">
                  <CarouselPrevious className="static translate-y-0 mr-2" />
                  <CarouselNext className="static translate-y-0" />
                </div>
              </Carousel>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No carousel items available. Check back soon!</p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
