import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="border-t bg-card">
      <div className="container py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="flex flex-col">
            <Link to="/" className="flex items-center gap-2">
              <img src="/assets/logo.svg" alt="SoundSync" className="h-8 w-8" />
              <span className="text-xl font-bold">SoundSync</span>
            </Link>
            <p className="mt-2 text-sm text-muted-foreground">
              Professional mixing, mastering, and audio marketplace for producers and artists.
            </p>
          </div>
          
          <div>
            <h3 className="mb-3 text-sm font-semibold">Services</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/services" className="text-muted-foreground hover:text-beatforge-500 transition-colors">
                  Mixing
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-muted-foreground hover:text-beatforge-500 transition-colors">
                  Mastering
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-muted-foreground hover:text-beatforge-500 transition-colors">
                  Music Production
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-muted-foreground hover:text-beatforge-500 transition-colors">
                  Vocal Tuning
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="mb-3 text-sm font-semibold">Marketplace</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/marketplace" className="text-muted-foreground hover:text-beatforge-500 transition-colors">
                  Sample Packs
                </Link>
              </li>
              <li>
                <Link to="/marketplace" className="text-muted-foreground hover:text-beatforge-500 transition-colors">
                  Beats
                </Link>
              </li>
              <li>
                <Link to="/marketplace" className="text-muted-foreground hover:text-beatforge-500 transition-colors">
                  MIDI Files
                </Link>
              </li>
              <li>
                <Link to="/marketplace" className="text-muted-foreground hover:text-beatforge-500 transition-colors">
                  Sell Your Sounds
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="mb-3 text-sm font-semibold">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-beatforge-500 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-beatforge-500 transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-muted-foreground hover:text-beatforge-500 transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/careers" className="text-muted-foreground hover:text-beatforge-500 transition-colors">
                  Careers
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t pt-8 md:flex-row">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} SoundSync. All rights reserved.
          </p>
          
          <div className="flex items-center gap-4">
            <Link to="/terms" className="text-xs text-muted-foreground hover:text-beatforge-500 transition-colors">
              Terms of Service
            </Link>
            <Link to="/privacy" className="text-xs text-muted-foreground hover:text-beatforge-500 transition-colors">
              Privacy Policy
            </Link>
            <Link to="/cookies" className="text-xs text-muted-foreground hover:text-beatforge-500 transition-colors">
              Cookie Policy
            </Link>
          </div>

        </div>
      </div>
    </footer>
  );
}

