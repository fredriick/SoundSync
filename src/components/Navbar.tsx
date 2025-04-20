
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Music, ShoppingCart } from "lucide-react";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <Music className="h-6 w-6 text-beatforge-500" />
            <span className="text-xl font-bold">Nades</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-sm font-medium hover:text-beatforge-500 transition-colors">
            Home
          </Link>
          <Link to="/services" className="text-sm font-medium hover:text-beatforge-500 transition-colors">
            Services
          </Link>
          <Link to="/marketplace" className="text-sm font-medium hover:text-beatforge-500 transition-colors">
            Marketplace
          </Link>
          <Link to="/pricing" className="text-sm font-medium hover:text-beatforge-500 transition-colors">
            Pricing
          </Link>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <Button variant="ghost" size="icon">
            <ShoppingCart className="h-5 w-5" />
          </Button>
          <Link to="/sign-in">
            <Button variant="ghost">Sign In</Button>
          </Link>
          <Link to="/get-started">
            <Button>Get Started</Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden flex flex-col gap-1 p-2"
          aria-label="Toggle menu"
        >
          <span className={`h-0.5 w-6 bg-foreground transition-all ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
          <span className={`h-0.5 w-6 bg-foreground transition-all ${isMenuOpen ? 'opacity-0' : 'opacity-100'}`} />
          <span className={`h-0.5 w-6 bg-foreground transition-all ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden container py-4 border-t">
          <nav className="flex flex-col gap-4">
            <Link 
              to="/" 
              className="text-sm font-medium p-2 hover:bg-beatforge-100 dark:hover:bg-beatforge-950 rounded transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/services" 
              className="text-sm font-medium p-2 hover:bg-beatforge-100 dark:hover:bg-beatforge-950 rounded transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Services
            </Link>
            <Link 
              to="/marketplace" 
              className="text-sm font-medium p-2 hover:bg-beatforge-100 dark:hover:bg-beatforge-950 rounded transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Marketplace
            </Link>
            <Link 
              to="/pricing" 
              className="text-sm font-medium p-2 hover:bg-beatforge-100 dark:hover:bg-beatforge-950 rounded transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Pricing
            </Link>
            <div className="flex gap-2 mt-2">
              <Link to="/sign-in" className="flex-1">
                <Button variant="outline" className="w-full">Sign In</Button>
              </Link>
              <Link to="/get-started" className="flex-1">
                <Button className="w-full">Get Started</Button>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
