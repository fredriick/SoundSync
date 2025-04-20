
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ServiceCard } from "@/components/ServiceCard";
import { AudioWaveform as AudioWaveformIcon, Music3, Volume2, Music4, Mic, Headphones } from "lucide-react";

export default function Services() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-card py-16 md:py-24">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl">
                Professional Audio Services
              </h1>
              <p className="mb-8 text-lg text-muted-foreground">
                Take your music to the next level with our professional mixing, mastering, and production services.
              </p>
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-16 md:py-24">
          <div className="container">
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
              <ServiceCard
                title="Vocal Tuning"
                description="Perfect pitch correction and vocal enhancement."
                icon={<Mic className="h-6 w-6" />}
                features={[
                  "Pitch correction",
                  "Timing adjustment",
                  "Vocal effects",
                  "2 revision rounds",
                  "Delivery in 2-4 days"
                ]}
                price="$99"
              />
              <ServiceCard
                title="Sound Design"
                description="Custom sound design for your productions."
                icon={<Music4 className="h-6 w-6" />}
                features={[
                  "Custom sound creation",
                  "Synth programming",
                  "Effect processing",
                  "2 revision rounds",
                  "Delivery in 5-7 days"
                ]}
                price="$199"
              />
              <ServiceCard
                title="Full Production Package"
                description="End-to-end production, mixing, and mastering."
                icon={<Headphones className="h-6 w-6" />}
                features={[
                  "Production & arrangement",
                  "Full mixing",
                  "Mastering",
                  "4 revision rounds",
                  "Delivery in 10-14 days"
                ]}
                price="$499"
              />
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="bg-card py-16 md:py-24">
          <div className="container">
            <div className="mb-12 text-center">
              <h2 className="mb-3 text-3xl font-bold md:text-4xl">Our Process</h2>
              <p className="mx-auto max-w-2xl text-muted-foreground">
                We've refined our workflow to ensure you get the best results every time.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-beatforge-100 text-beatforge-900 dark:bg-beatforge-900 dark:text-beatforge-100">
                  <span className="text-xl font-bold">1</span>
                </div>
                <h3 className="mb-2 text-xl font-bold">Upload</h3>
                <p className="text-sm text-muted-foreground">
                  Upload your tracks and project details through our secure platform.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-beatforge-100 text-beatforge-900 dark:bg-beatforge-900 dark:text-beatforge-100">
                  <span className="text-xl font-bold">2</span>
                </div>
                <h3 className="mb-2 text-xl font-bold">Processing</h3>
                <p className="text-sm text-muted-foreground">
                  Our audio engineers work their magic according to your specifications.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-beatforge-100 text-beatforge-900 dark:bg-beatforge-900 dark:text-beatforge-100">
                  <span className="text-xl font-bold">3</span>
                </div>
                <h3 className="mb-2 text-xl font-bold">Review</h3>
                <p className="text-sm text-muted-foreground">
                  Review the results and request revisions if needed.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-beatforge-100 text-beatforge-900 dark:bg-beatforge-900 dark:text-beatforge-100">
                  <span className="text-xl font-bold">4</span>
                </div>
                <h3 className="mb-2 text-xl font-bold">Delivery</h3>
                <p className="text-sm text-muted-foreground">
                  Download your finished tracks in high-quality formats.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
