import { useState } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { ArrowLeft, Headphones, Clock, CheckCircle2, Music, Send } from "lucide-react";

interface FormData {
  name: string;
  email: string;
  projectType: string;
  message: string;
}

export default function FullProductionDetail() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    projectType: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission with a delay
    setTimeout(() => {
      setIsSubmitting(false);
      
      // Display success message
      toast({
        title: "Request Sent",
        description: "Thanks for your interest! Our team will contact you within 24 hours.",
      });
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        projectType: "",
        message: ""
      });
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />
      <main className="flex-1">
        <section className="bg-gradient-to-br from-beatforge-900 to-black py-16">
          <div className="container px-4">
            <Button 
              variant="ghost" 
              className="mb-8 text-white" 
              asChild
            >
              <Link to="/services">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Services
              </Link>
            </Button>
            
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
              <div className="bg-beatforge-800 rounded-full p-8 flex items-center justify-center">
                <Headphones className="h-12 w-12 text-white" />
              </div>
              <div className="flex-1">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Full Production Package</h1>
                <p className="text-lg text-beatforge-100 mb-6">End-to-end production, mixing, and mastering.</p>
                <p className="text-white mb-8">
                  Our comprehensive production package handles every aspect of your music from start to finish. We take care of arrangement, production, mixing, and mastering to deliver radio-ready tracks that sound professional and polished.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <h2 className="text-3xl font-bold mb-6">What's Included</h2>
                <ul className="space-y-4 mb-10">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 text-beatforge-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-lg">Production & arrangement</h3>
                      <p className="text-muted-foreground">Professional arrangement and production of your track, crafting it into a polished, commercial-ready piece.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 text-beatforge-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-lg">Full mixing</h3>
                      <p className="text-muted-foreground">Complete mixing service ensuring all elements are balanced and clear with proper EQ, compression, and spatial treatment.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 text-beatforge-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-lg">Mastering</h3>
                      <p className="text-muted-foreground">Professional mastering to optimize your track for all platforms with ideal loudness, clarity, and depth.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 text-beatforge-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-lg">4 revision rounds</h3>
                      <p className="text-muted-foreground">Four rounds of revisions to ensure your track meets your vision and expectations.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 text-beatforge-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-lg">Delivery in 10-14 days</h3>
                      <p className="text-muted-foreground">Quick turnaround time while maintaining professional quality standards.</p>
                    </div>
                  </li>
                </ul>

                <h2 className="text-3xl font-bold mb-6">Service Process</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                  <Card className="bg-card border-border">
                    <CardContent className="pt-6">
                      <div className="mb-4 text-center">
                        <span className="inline-block w-10 h-10 rounded-full bg-beatforge-100 dark:bg-beatforge-900 text-beatforge-900 dark:text-beatforge-100 flex items-center justify-center font-bold text-lg">1</span>
                      </div>
                      <h3 className="text-xl font-semibold mb-2 text-center">Submit</h3>
                      <p className="text-sm text-muted-foreground">
                        Upload your files and provide creative direction. We accept anything from voice memos to full demos. Include reference tracks and notes about your vision.
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-card border-border">
                    <CardContent className="pt-6">
                      <div className="mb-4 text-center">
                        <span className="inline-block w-10 h-10 rounded-full bg-beatforge-100 dark:bg-beatforge-900 text-beatforge-900 dark:text-beatforge-100 flex items-center justify-center font-bold text-lg">2</span>
                      </div>
                      <h3 className="text-xl font-semibold mb-2 text-center">Process</h3>
                      <p className="text-sm text-muted-foreground">
                        Our engineers work on your project, creating a professional production including arrangement, sound design, mixing and mastering to industry standards.
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-card border-border">
                    <CardContent className="pt-6">
                      <div className="mb-4 text-center">
                        <span className="inline-block w-10 h-10 rounded-full bg-beatforge-100 dark:bg-beatforge-900 text-beatforge-900 dark:text-beatforge-100 flex items-center justify-center font-bold text-lg">3</span>
                      </div>
                      <h3 className="text-xl font-semibold mb-2 text-center">Deliver</h3>
                      <p className="text-sm text-muted-foreground">
                        Receive your completed production ready for release. We deliver the master, stems, and project files so you have everything you need for your music.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
              
              <div className="lg:col-span-1">
                <Card className="sticky top-8 bg-card border-border">
                  <CardContent className="pt-6">
                    <h3 className="text-2xl font-bold mb-2">Service Package</h3>
                    <p className="text-muted-foreground mb-6">Everything you need for professional full production package</p>
                    
                    <div className="space-y-4 mb-6">
                      <div className="flex items-center gap-2">
                        <Clock className="h-5 w-5 text-beatforge-500" />
                        <span>Turnaround: 10-14 days</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-beatforge-500" />
                        <span>Revisions: 4 revision</span>
                      </div>
                    </div>
                    
                    <h4 className="text-lg font-semibold mb-3">What you'll get:</h4>
                    <ul className="space-y-2 mb-6">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-beatforge-500" />
                        <span>Production & arrangement</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-beatforge-500" />
                        <span>Full mixing</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-beatforge-500" />
                        <span>Mastering</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-beatforge-500" />
                        <span>4 revision rounds</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-beatforge-500" />
                        <span>Delivery in 10-14 days</span>
                      </li>
                    </ul>
                    
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <h3 className="text-xl font-bold">Contact Us</h3>
                      
                      <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input 
                          id="name" 
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Your name"
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input 
                          id="email" 
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="Your email address"
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="projectType">Project Type</Label>
                        <Input 
                          id="projectType" 
                          value={formData.projectType}
                          onChange={handleInputChange}
                          placeholder="Song, EP, Album, etc."
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="message">Tell us about your project</Label>
                        <Textarea 
                          id="message" 
                          value={formData.message}
                          onChange={handleInputChange}
                          placeholder="Describe your vision, genre, references, and any other details"
                          className="resize-none"
                          rows={4}
                          required
                        />
                      </div>
                      
                      <Button 
                        type="submit"
                        className="w-full bg-beatforge-500 hover:bg-beatforge-600"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <span className="flex items-center gap-2">
                            <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                            Sending...
                          </span>
                        ) : (
                          <span className="flex items-center gap-2">
                            <Send className="h-4 w-4" />
                            Send Request
                          </span>
                        )}
                      </Button>
                      
                      <p className="text-xs text-muted-foreground text-center">
                        We'll respond to your inquiry within 24 hours
                      </p>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
} 