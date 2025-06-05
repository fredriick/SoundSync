import React, { useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function AboutUs() {
  // Set document title and ensure component is properly rendered
  useEffect(() => {
    document.title = "About Us | SoundSync";
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-beatforge-950 to-beatforge-900">
      <Navbar />
      
      <main className="container px-4 py-16 mx-auto">
        {/* About SoundSync Section */}
        <section className="max-w-4xl mx-auto mb-12 animate-in slide-in-from-bottom-4 duration-1000">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">About SoundSync</h1>
            <p className="text-beatforge-200 text-lg max-w-2xl mx-auto">
              Professional audio tools and marketplace for producers and artists worldwide
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-3">Our Mission</h2>
                <p className="text-beatforge-200">
                  At SoundSync, we're on a mission to empower music creators with professional tools and 
                  a vibrant marketplace. We believe in making high-quality audio production accessible to 
                  artists at every stage of their journey.
                </p>
              </div>
              
              <div>
                <h2 className="text-2xl font-bold text-white mb-3">Our Story</h2>
                <p className="text-beatforge-200">
                  Founded in 2020 by a team of music producers and software engineers, SoundSync emerged 
                  from a shared passion for music and technology. We recognized the need for a unified 
                  platform where producers could access professional services, sell their sounds, and 
                  connect with other creators.
                </p>
              </div>
              
              <div>
                <h2 className="text-2xl font-bold text-white mb-3">Our Values</h2>
                <ul className="text-beatforge-200 space-y-2 list-disc pl-5">
                  <li>Quality - We're committed to delivering exceptional audio services and products</li>
                  <li>Innovation - We continuously evolve our platform with cutting-edge technology</li>
                  <li>Accessibility - We make professional audio tools available to creators of all levels</li>
                  <li>Community - We foster a supportive environment for audio creators worldwide</li>
                </ul>
              </div>
              
              <div className="pt-4">
                <Link to="/contact">
                  <Button className="bg-beatforge-500 hover:bg-beatforge-600">
                    Contact Us
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="bg-beatforge-800/50 rounded-2xl overflow-hidden border border-beatforge-700">
              <div className="aspect-video bg-beatforge-800 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-4xl text-beatforge-500">🎵</span>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="space-y-1">
                  <h3 className="text-xl font-semibold text-white">SoundSync in Numbers</h3>
                  <p className="text-beatforge-300 text-sm">Trusted by creators worldwide</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-3xl font-bold text-beatforge-500">10K+</p>
                    <p className="text-sm text-beatforge-300">Active Users</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-beatforge-500">5K+</p>
                    <p className="text-sm text-beatforge-300">Audio Products</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-beatforge-500">1K+</p>
                    <p className="text-sm text-beatforge-300">Services Completed</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-beatforge-500">50+</p>
                    <p className="text-sm text-beatforge-300">Countries Served</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Team Section */}
        <section className="max-w-4xl mx-auto py-12 animate-in slide-in-from-bottom-4 duration-1000">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-white mb-3">Our Leadership Team</h2>
            <p className="text-beatforge-200 max-w-2xl mx-auto">
              Meet the passionate professionals behind SoundSync
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-background/80 backdrop-blur-lg rounded-lg border border-beatforge-800 overflow-hidden">
              <div className="aspect-square bg-beatforge-800 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-4xl">👨‍💼</span>
                </div>
              </div>
              <div className="p-4 text-center">
                <h3 className="text-lg font-semibold text-white">Michael Ross</h3>
                <p className="text-sm text-beatforge-500 mb-2">CEO & Co-Founder</p>
                <p className="text-sm text-beatforge-200">
                  Former music producer turned tech entrepreneur with 15+ years in audio production
                </p>
              </div>
            </div>
            
            <div className="bg-background/80 backdrop-blur-lg rounded-lg border border-beatforge-800 overflow-hidden">
              <div className="aspect-square bg-beatforge-800 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-4xl">👩‍💼</span>
                </div>
              </div>
              <div className="p-4 text-center">
                <h3 className="text-lg font-semibold text-white">Sarah Chen</h3>
                <p className="text-sm text-beatforge-500 mb-2">CTO & Co-Founder</p>
                <p className="text-sm text-beatforge-200">
                  Software engineer and audio enthusiast with expertise in audio processing technologies
                </p>
              </div>
            </div>
            
            <div className="bg-background/80 backdrop-blur-lg rounded-lg border border-beatforge-800 overflow-hidden">
              <div className="aspect-square bg-beatforge-800 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-4xl">👨‍🎨</span>
                </div>
              </div>
              <div className="p-4 text-center">
                <h3 className="text-lg font-semibold text-white">David Miller</h3>
                <p className="text-sm text-beatforge-500 mb-2">Creative Director</p>
                <p className="text-sm text-beatforge-200">
                  Grammy-nominated producer with a passion for creating innovative audio experiences
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
 
 
 
 
 
 
 
 
 