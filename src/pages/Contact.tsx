import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { toast } from "@/components/ui/use-toast";
import { Mail, MapPin, Phone, Clock } from "lucide-react";

export default function Contact() {
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isLoading, setIsLoading] = React.useState(false);

  // Set document title and ensure component is properly rendered
  useEffect(() => {
    document.title = "Contact Us | SoundSync";
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate sending the message
    setTimeout(() => {
      setIsLoading(false);
      
      // Success notification
      toast({
        title: "Message Sent",
        description: "Thank you! We'll get back to you soon.",
      });
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-beatforge-950 to-beatforge-900">
      <Navbar />
      
      <main className="container px-4 py-16 mx-auto">
        <div className="text-center mb-12 animate-in slide-in-from-bottom-4 duration-1000">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Contact Us</h1>
          <p className="text-beatforge-200 text-lg max-w-2xl mx-auto">
            Have questions or feedback? We're here to help.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Contact Information */}
          <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-1000">
            <div className="bg-background/80 backdrop-blur-lg rounded-lg border border-beatforge-800 p-6">
              <h2 className="text-2xl font-bold text-white mb-6">Get in Touch</h2>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-beatforge-900 p-3 rounded-full">
                    <Mail className="h-5 w-5 text-beatforge-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-white">Email Us</h3>
                    <p className="text-beatforge-300 mt-1">For general inquiries</p>
                    <a 
                      href="mailto:support@soundsync.com" 
                      className="text-beatforge-500 hover:text-beatforge-400 transition-colors"
                    >
                      support@soundsync.com
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="bg-beatforge-900 p-3 rounded-full">
                    <Phone className="h-5 w-5 text-beatforge-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-white">Call Us</h3>
                    <p className="text-beatforge-300 mt-1">Mon-Fri from 9am to 6pm EST</p>
                    <a 
                      href="tel:+1-800-555-0123" 
                      className="text-beatforge-500 hover:text-beatforge-400 transition-colors"
                    >
                      +1 (800) 555-0123
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="bg-beatforge-900 p-3 rounded-full">
                    <MapPin className="h-5 w-5 text-beatforge-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-white">Our Location</h3>
                    <p className="text-beatforge-300 mt-1">Headquarters</p>
                    <p className="text-beatforge-500">
                      123 Music Avenue<br />
                      New York, NY 10001<br />
                      United States
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="bg-beatforge-900 p-3 rounded-full">
                    <Clock className="h-5 w-5 text-beatforge-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-white">Hours of Operation</h3>
                    <p className="text-beatforge-300 mt-1">When we're available</p>
                    <p className="text-beatforge-500">
                      Monday - Friday: 9:00 AM - 6:00 PM EST<br />
                      Saturday: 10:00 AM - 4:00 PM EST<br />
                      Sunday: Closed
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-background/80 backdrop-blur-lg rounded-lg border border-beatforge-800 p-6">
              <h2 className="text-2xl font-bold text-white mb-4">Specialized Support</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-white">Business Partnerships</h3>
                  <a 
                    href="mailto:partnerships@soundsync.com" 
                    className="text-beatforge-500 hover:text-beatforge-400 transition-colors"
                  >
                    partnerships@soundsync.com
                  </a>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-white">Careers</h3>
                  <a 
                    href="mailto:careers@soundsync.com" 
                    className="text-beatforge-500 hover:text-beatforge-400 transition-colors"
                  >
                    careers@soundsync.com
                  </a>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-white">Press Inquiries</h3>
                  <a 
                    href="mailto:press@soundsync.com" 
                    className="text-beatforge-500 hover:text-beatforge-400 transition-colors"
                  >
                    press@soundsync.com
                  </a>
                </div>
              </div>
            </div>
          </div>
          
          {/* Contact Form */}
          <div className="animate-in slide-in-from-bottom-4 duration-1000">
            <div className="bg-background/80 backdrop-blur-lg rounded-lg border border-beatforge-800 p-6">
              <h2 className="text-2xl font-bold text-white mb-6">Send Us a Message</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground/90" htmlFor="name">
                      Name
                    </label>
                    <Input
                      id="name"
                      placeholder="Your name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground/90" htmlFor="email">
                      Email
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Your email address"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground/90" htmlFor="subject">
                    Subject
                  </label>
                  <Input
                    id="subject"
                    placeholder="What is your message about?"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground/90" htmlFor="message">
                    Message
                  </label>
                  <Textarea
                    id="message"
                    placeholder="How can we help you?"
                    rows={5}
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    className="resize-none"
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-beatforge-500 hover:bg-beatforge-600"
                  disabled={isLoading}
                >
                  {isLoading ? "Sending..." : "Send Message"}
                </Button>
              </form>
              
              <div className="mt-6 text-center">
                <p className="text-sm text-beatforge-300">
                  By submitting this form, you agree to our{' '}
                  <a href="/privacy" className="text-beatforge-500 hover:text-beatforge-400 transition-colors">
                    Privacy Policy
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
} 
 
 
 
 
 
 
 
 
 