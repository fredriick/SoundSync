
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { MarketplaceItem } from "@/components/MarketplaceItem";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function Marketplace() {
  const [activeCategory, setActiveCategory] = useState("all");
  
  const categories = [
    { id: "all", name: "All" },
    { id: "beats", name: "Beats" },
    { id: "samples", name: "Samples" },
    { id: "loops", name: "Loops" },
    { id: "midi", name: "MIDI" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-card py-16 md:py-24">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl">
                Audio Marketplace
              </h1>
              <p className="mb-8 text-lg text-muted-foreground">
                Discover premium beats, samples, loops, and MIDI files from top producers.
              </p>
            </div>
          </div>
        </section>

        {/* Filters */}
        <section className="border-y py-6">
          <div className="container">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={activeCategory === category.id ? "default" : "outline"}
                    onClick={() => setActiveCategory(category.id)}
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

        {/* Marketplace Grid */}
        <section className="py-16">
          <div className="container">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <MarketplaceItem
                title="Neon Nights"
                producer="DreamBeats"
                price="$24.99"
                bpm={128}
                key="Am"
                genre="Synthwave"
                imageUrl="https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=800&q=80"
              />
              <MarketplaceItem
                title="Trap Soul"
                producer="808 Mafia"
                price="$19.99"
                bpm={140}
                key="Fm"
                genre="Trap"
                imageUrl="https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?auto=format&fit=crop&w=800&q=80"
              />
              <MarketplaceItem
                title="Lo-Fi Dreams"
                producer="ChillHop"
                price="$14.99"
                bpm={90}
                key="C"
                genre="Lo-Fi"
                imageUrl="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80"
              />
              <MarketplaceItem
                title="Future Bass"
                producer="WaveMakers"
                price="$29.99"
                bpm={150}
                key="G"
                genre="EDM"
                imageUrl="https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=800&q=80"
              />
              <MarketplaceItem
                title="Hip Hop Essentials"
                producer="Urban Beats"
                price="$34.99"
                bpm={95}
                key="Dm"
                genre="Hip Hop"
                imageUrl="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=800&q=80"
              />
              <MarketplaceItem
                title="Ambient Textures"
                producer="Atmosphere"
                price="$22.99"
                bpm={75}
                key="Eb"
                genre="Ambient"
                imageUrl="https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=800&q=80"
              />
              <MarketplaceItem
                title="Deep House"
                producer="Club Essentials"
                price="$27.99"
                bpm={124}
                key="Bm"
                genre="House"
                imageUrl="https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?auto=format&fit=crop&w=800&q=80"
              />
              <MarketplaceItem
                title="Pop Vocals"
                producer="Hit Factory"
                price="$39.99"
                bpm={110}
                key="A"
                genre="Pop"
                imageUrl="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80"
              />
            </div>
            <div className="mt-12 text-center">
              <Button>Load More</Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
