
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Check, Headphones, Music3, ShoppingCart } from "lucide-react";

export default function Pricing() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-card py-16 md:py-24">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl">
                Simple, Transparent Pricing
              </h1>
              <p className="mb-8 text-lg text-muted-foreground">
                Choose the plan that works best for your music production needs.
              </p>
            </div>
          </div>
        </section>

        {/* Pricing Plans */}
        <section className="py-16 md:py-24">
          <div className="container">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {/* Basic Plan */}
              <div className="flex flex-col rounded-lg border bg-card p-8 shadow-sm">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-beatforge-100 dark:bg-beatforge-900 text-beatforge-500">
                  <Headphones className="h-6 w-6" />
                </div>
                <h2 className="mb-2 text-2xl font-bold">Basic</h2>
                <p className="mb-6 text-sm text-muted-foreground">
                  Perfect for beginners and hobbyists.
                </p>
                <div className="mb-6">
                  <span className="text-4xl font-bold">$9.99</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <ul className="mb-8 space-y-3 text-sm">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-beatforge-500" />
                    <span>5 downloads per month</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-beatforge-500" />
                    <span>Basic mixing consultation</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-beatforge-500" />
                    <span>Access to sample library</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-beatforge-500" />
                    <span>Standard license for all downloads</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-beatforge-500" />
                    <span>Email support</span>
                  </li>
                </ul>
                <Button className="mt-auto">Get Started</Button>
              </div>

              {/* Pro Plan */}
              <div className="relative flex flex-col rounded-lg border border-beatforge-500 bg-card p-8 shadow-md">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-beatforge-500 px-4 py-1 text-xs font-bold text-white">
                  MOST POPULAR
                </div>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-beatforge-100 dark:bg-beatforge-900 text-beatforge-500">
                  <Music3 className="h-6 w-6" />
                </div>
                <h2 className="mb-2 text-2xl font-bold">Pro</h2>
                <p className="mb-6 text-sm text-muted-foreground">
                  For serious producers and artists.
                </p>
                <div className="mb-6">
                  <span className="text-4xl font-bold">$24.99</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <ul className="mb-8 space-y-3 text-sm">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-beatforge-500" />
                    <span>20 downloads per month</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-beatforge-500" />
                    <span>2 mixing & mastering credits</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-beatforge-500" />
                    <span>Full access to sample library</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-beatforge-500" />
                    <span>Extended license for all downloads</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-beatforge-500" />
                    <span>Priority email & chat support</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-beatforge-500" />
                    <span>Unlimited cloud storage</span>
                  </li>
                </ul>
                <Button className="mt-auto bg-beatforge-500 hover:bg-beatforge-600">Get Started</Button>
              </div>

              {/* Premium Plan */}
              <div className="flex flex-col rounded-lg border bg-card p-8 shadow-sm">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-beatforge-100 dark:bg-beatforge-900 text-beatforge-500">
                  <ShoppingCart className="h-6 w-6" />
                </div>
                <h2 className="mb-2 text-2xl font-bold">Premium</h2>
                <p className="mb-6 text-sm text-muted-foreground">
                  For professional studios and labels.
                </p>
                <div className="mb-6">
                  <span className="text-4xl font-bold">$49.99</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <ul className="mb-8 space-y-3 text-sm">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-beatforge-500" />
                    <span>Unlimited downloads</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-beatforge-500" />
                    <span>5 mixing & mastering credits</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-beatforge-500" />
                    <span>Complete production resources</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-beatforge-500" />
                    <span>Commercial license for all downloads</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-beatforge-500" />
                    <span>24/7 priority support</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-beatforge-500" />
                    <span>Unlimited cloud storage</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-beatforge-500" />
                    <span>White-label distribution</span>
                  </li>
                </ul>
                <Button variant="outline" className="mt-auto">Get Started</Button>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="bg-card py-16 md:py-24">
          <div className="container">
            <div className="mb-12 text-center">
              <h2 className="mb-3 text-3xl font-bold md:text-4xl">Frequently Asked Questions</h2>
              <p className="mx-auto max-w-2xl text-muted-foreground">
                Find answers to common questions about our services and subscription plans.
              </p>
            </div>
            <div className="mx-auto max-w-3xl divide-y">
              <div className="py-6">
                <h3 className="mb-3 text-lg font-medium">Can I upgrade or downgrade my plan?</h3>
                <p className="text-muted-foreground">
                  Yes, you can upgrade or downgrade your subscription at any time. Changes will take effect on your next billing cycle.
                </p>
              </div>
              <div className="py-6">
                <h3 className="mb-3 text-lg font-medium">What payment methods do you accept?</h3>
                <p className="text-muted-foreground">
                  We accept all major credit cards, PayPal, and Apple Pay.
                </p>
              </div>
              <div className="py-6">
                <h3 className="mb-3 text-lg font-medium">Can I cancel my subscription?</h3>
                <p className="text-muted-foreground">
                  Yes, you can cancel your subscription at any time from your account settings. You'll retain access until the end of your current billing period.
                </p>
              </div>
              <div className="py-6">
                <h3 className="mb-3 text-lg font-medium">What happens to my downloads if I cancel?</h3>
                <p className="text-muted-foreground">
                  Any files you've downloaded are yours to keep, even after cancellation, according to the license terms at the time of download.
                </p>
              </div>
              <div className="py-6">
                <h3 className="mb-3 text-lg font-medium">How do mixing and mastering credits work?</h3>
                <p className="text-muted-foreground">
                  Each credit allows you to submit one track for professional mixing or mastering. Credits reset each month and don't roll over.
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
