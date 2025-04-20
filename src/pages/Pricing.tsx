
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Check, Headphones, Music3, ShoppingCart } from "lucide-react";

export default function Pricing() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section with enhanced animation */}
        <section className="bg-card py-16 md:py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-beatforge-500/20 to-transparent pointer-events-none" />
          <div className="container relative">
            <div className="mx-auto max-w-3xl text-center animate-in fade-in slide-in-from-bottom-4 duration-1000">
              <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl bg-gradient-to-r from-beatforge-500 to-beatforge-300 bg-clip-text text-transparent">
                Simple, Transparent Pricing
              </h1>
              <p className="mb-8 text-lg text-muted-foreground">
                Choose the plan that works best for your music production needs.
              </p>
            </div>
          </div>
        </section>

        {/* Pricing Plans with staggered animations */}
        <section className="py-16 md:py-24">
          <div className="container">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {/* Basic Plan */}
              <div className="group flex flex-col rounded-lg border bg-card p-8 shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-beatforge-100 dark:bg-beatforge-900 text-beatforge-500 transition-transform group-hover:scale-110">
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
              <div className="relative flex flex-col rounded-lg border-2 border-beatforge-500 bg-card p-8 shadow-md transition-all duration-300 hover:scale-105 hover:shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-beatforge-500 px-4 py-1 text-xs font-bold text-white animate-bounce">
                  MOST POPULAR
                </div>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-beatforge-100 dark:bg-beatforge-900 text-beatforge-500 transition-transform group-hover:scale-110">
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
              <div className="group flex flex-col rounded-lg border bg-card p-8 shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-beatforge-100 dark:bg-beatforge-900 text-beatforge-500 transition-transform group-hover:scale-110">
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

        {/* FAQ Section with improved animations */}
        <section className="bg-card py-16 md:py-24">
          <div className="container">
            <div className="mb-12 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
              <h2 className="mb-3 text-3xl font-bold md:text-4xl bg-gradient-to-r from-beatforge-500 to-beatforge-300 bg-clip-text text-transparent">
                Frequently Asked Questions
              </h2>
              <p className="mx-auto max-w-2xl text-muted-foreground">
                Find answers to common questions about our services and subscription plans.
              </p>
            </div>
            <div className="mx-auto max-w-3xl divide-y">
              {[
                {
                  question: "Can I upgrade or downgrade my plan?",
                  answer: "Yes, you can upgrade or downgrade your subscription at any time. Changes will take effect on your next billing cycle."
                },
                {
                  question: "What payment methods do you accept?",
                  answer: "We accept all major credit cards, PayPal, and Apple Pay."
                },
                {
                  question: "Can I cancel my subscription?",
                  answer: "Yes, you can cancel your subscription at any time from your account settings. You'll retain access until the end of your current billing period."
                },
                {
                  question: "What happens to my downloads if I cancel?",
                  answer: "Any files you've downloaded are yours to keep, even after cancellation, according to the license terms at the time of download."
                },
                {
                  question: "How do mixing and mastering credits work?",
                  answer: "Each credit allows you to submit one track for professional mixing or mastering. Credits reset each month and don't roll over."
                }
              ].map((faq, index) => (
                <div 
                  key={index} 
                  className="py-6 animate-in fade-in slide-in-from-bottom-4 duration-700"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <h3 className="mb-3 text-lg font-medium hover:text-beatforge-500 transition-colors">
                    {faq.question}
                  </h3>
                  <p className="text-muted-foreground">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
