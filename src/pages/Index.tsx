
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AudioWaveform } from "@/components/AudioWaveform";
import { ServiceCard } from "@/components/ServiceCard";
import { MarketplaceItem } from "@/components/MarketplaceItem";
import { Headphones, Music3, AudioWaveform as AudioWaveformIcon, Volume2, ShoppingCart } from "lucide-react";

export default function Index() {

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
                Professional mixing, mastering, and a marketplace for premium audio samples and beats. Elevate your sound with BeatForge.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                <Button size="lg" className="bg-beatforge-500 text-white hover:bg-beatforge-600">
                  Get Started
                </Button>
                <Button size="lg" variant="outline">
                  Browse Marketplace
                </Button>
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
                price="$149"
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
                price="$79"
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
                price="$299"
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
        <section className="py-16 bg-card md:py-24">
          <div className="container">
            <div className="mb-12 text-center">
              <h2 className="mb-3 text-3xl font-bold md:text-4xl">Featured Tracks</h2>
              <p className="mx-auto max-w-2xl text-muted-foreground">
                Listen to some of our recent works and collaborations with artists.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              <AudioWaveform
                title="Midnight Echoes"
                artist="Luna Wave"
                imageUrl="https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?auto=format&fit=crop&w=800&q=80"
              />
              <AudioWaveform
                title="Electric Dreams"
                artist="Neon Pulse"
                imageUrl="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80"
              />
              <AudioWaveform
                title="Urban Symphony"
                artist="Metro Beats"
                imageUrl="https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=800&q=80"
              />
            </div>
          </div>
        </section>

        {/* Marketplace Section */}
        <section className="py-16 md:py-24">
          <div className="container">
            <div className="mb-12 text-center">
              <h2 className="mb-3 text-3xl font-bold md:text-4xl">Beat Marketplace</h2>
              <p className="mx-auto max-w-2xl text-muted-foreground">
                Find the perfect samples, beats, and audio resources for your next project.
              </p>
            </div>
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
            </div>
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
                Join thousands of artists and producers who trust BeatForge with their music.
              </p>
              <Button size="lg" className="bg-white text-beatforge-900 hover:bg-beatforge-100">
                Get Started Today
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
