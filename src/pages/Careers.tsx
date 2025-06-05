import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, MapPin, Clock, CreditCard } from "lucide-react";
import { Link } from "react-router-dom";

interface JobListing {
  id: string;
  title: string;
  department: string;
  location: string;
  type: "Full-time" | "Part-time" | "Contract";
  description: string;
  requirements: string[];
  salary: string;
}

export default function Careers() {
  const [activeTab, setActiveTab] = React.useState<string>("all");
  
  const jobListings: JobListing[] = [
    {
      id: "fe-dev-1",
      title: "Senior Frontend Developer",
      department: "Engineering",
      location: "Remote",
      type: "Full-time",
      description: "Join our team to build and maintain cutting-edge web applications for audio professionals. You'll work closely with designers and backend engineers to implement responsive and accessible user interfaces.",
      requirements: [
        "5+ years of experience with modern JavaScript frameworks (React preferred)",
        "Strong knowledge of TypeScript and CSS",
        "Experience with responsive design and accessibility",
        "Familiarity with audio processing web technologies is a plus"
      ],
      salary: "$100K - $130K"
    },
    {
      id: "be-dev-1",
      title: "Backend Engineer",
      department: "Engineering",
      location: "Remote",
      type: "Full-time",
      description: "Design and develop scalable APIs and services that power our audio marketplace. You'll be responsible for implementing business logic, database design, and ensuring system reliability.",
      requirements: [
        "3+ years of experience with backend technologies (Node.js, Python, or similar)",
        "Knowledge of SQL and NoSQL databases",
        "Experience with cloud infrastructure (AWS, GCP)",
        "Understanding of audio file formats is a plus"
      ],
      salary: "$90K - $120K"
    },
    {
      id: "audio-eng-1",
      title: "Audio Engineer",
      department: "Production",
      location: "Los Angeles, CA",
      type: "Full-time",
      description: "Help produce high-quality sample packs and audio content for our marketplace. You'll work with various audio processing tools and collaborate with music producers to create premium audio products.",
      requirements: [
        "Degree in audio engineering or equivalent experience",
        "Proficiency with DAWs (Ableton Live, Logic Pro, etc.)",
        "Understanding of music production workflows",
        "Portfolio demonstrating audio engineering skills"
      ],
      salary: "$70K - $90K"
    },
    {
      id: "marketing-1",
      title: "Digital Marketing Specialist",
      department: "Marketing",
      location: "Remote",
      type: "Full-time",
      description: "Drive our digital marketing efforts across social media, email, and advertising channels. You'll help grow our user base and engage with the audio creator community.",
      requirements: [
        "3+ years of experience in digital marketing",
        "Knowledge of social media platforms and analytics",
        "Experience with email marketing campaigns",
        "Understanding of the music production industry is a plus"
      ],
      salary: "$60K - $80K"
    },
    {
      id: "cs-1",
      title: "Customer Support Specialist",
      department: "Support",
      location: "Remote",
      type: "Part-time",
      description: "Provide exceptional support to our users through email, chat, and social media. You'll help troubleshoot issues, answer questions, and ensure a positive user experience.",
      requirements: [
        "Previous customer support experience",
        "Excellent written and verbal communication skills",
        "Problem-solving abilities",
        "Knowledge of audio production software is a plus"
      ],
      salary: "$25 - $30/hour"
    }
  ];
  
  const filteredJobs = activeTab === "all" 
    ? jobListings 
    : jobListings.filter(job => job.department.toLowerCase() === activeTab);
  
  const departments = ["all", ...new Set(jobListings.map(job => job.department.toLowerCase()))];

  // Set document title and ensure component is properly rendered
  useEffect(() => {
    document.title = "Careers | SoundSync";
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-beatforge-950 to-beatforge-900">
      <Navbar />
      
      <main className="container px-4 py-16 mx-auto">
        {/* Hero Section */}
        <section className="text-center max-w-4xl mx-auto mb-16 animate-in slide-in-from-bottom-4 duration-1000">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Join Our Team</h1>
          <p className="text-beatforge-200 text-lg max-w-2xl mx-auto mb-8">
            Help shape the future of audio production and marketplace technology
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="bg-beatforge-800/50 p-6 rounded-lg border border-beatforge-700">
              <div className="text-beatforge-500 text-3xl mb-3">🚀</div>
              <h3 className="text-xl font-semibold text-white mb-2">Innovation</h3>
              <p className="text-beatforge-300">
                Work on cutting-edge audio technology and help shape the future of music production.
              </p>
            </div>
            
            <div className="bg-beatforge-800/50 p-6 rounded-lg border border-beatforge-700">
              <div className="text-beatforge-500 text-3xl mb-3">🌎</div>
              <h3 className="text-xl font-semibold text-white mb-2">Remote-First</h3>
              <p className="text-beatforge-300">
                Enjoy the flexibility of working remotely with a global team of passionate professionals.
              </p>
            </div>
            
            <div className="bg-beatforge-800/50 p-6 rounded-lg border border-beatforge-700">
              <div className="text-beatforge-500 text-3xl mb-3">🎵</div>
              <h3 className="text-xl font-semibold text-white mb-2">Music Lovers</h3>
              <p className="text-beatforge-300">
                Join a team of music enthusiasts building tools for creators worldwide.
              </p>
            </div>
          </div>
        </section>
        
        {/* Job Listings Section */}
        <section className="max-w-4xl mx-auto animate-in slide-in-from-bottom-4 duration-1000">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-white">Open Positions</h2>
            
            <div className="flex space-x-2 overflow-x-auto pb-2">
              {departments.map((dept) => (
                <Button
                  key={dept}
                  variant={activeTab === dept ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveTab(dept)}
                  className={activeTab === dept ? "bg-beatforge-500" : ""}
                >
                  {dept.charAt(0).toUpperCase() + dept.slice(1)}
                </Button>
              ))}
            </div>
          </div>
          
          {filteredJobs.length === 0 ? (
            <div className="text-center py-12 bg-background/80 backdrop-blur-lg rounded-lg border border-beatforge-800">
              <p className="text-beatforge-200 text-lg">No open positions in this department at the moment.</p>
              <Button 
                variant="link" 
                onClick={() => setActiveTab("all")} 
                className="text-beatforge-500 mt-2"
              >
                View all positions
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredJobs.map((job) => (
                <div 
                  key={job.id}
                  className="p-6 bg-background/80 backdrop-blur-lg rounded-lg border border-beatforge-800 hover:border-beatforge-600 transition-all"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-1">{job.title}</h3>
                      <div className="flex flex-wrap gap-2 items-center text-sm text-beatforge-300">
                        <Badge variant="secondary">{job.department}</Badge>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          <span>{job.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{job.type}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <CreditCard className="h-3 w-3" />
                          <span>{job.salary}</span>
                        </div>
                      </div>
                    </div>
                    <Button className="mt-4 md:mt-0 bg-beatforge-500 hover:bg-beatforge-600">
                      Apply Now <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                  
                  <p className="text-beatforge-200 mb-4">{job.description}</p>
                  
                  <div>
                    <h4 className="text-sm font-medium text-white mb-2">Requirements:</h4>
                    <ul className="text-sm text-beatforge-300 space-y-1 list-disc pl-5">
                      {job.requirements.map((req, index) => (
                        <li key={index}>{req}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <div className="mt-12 p-6 bg-beatforge-800/30 rounded-lg border border-beatforge-700 text-center">
            <h3 className="text-xl font-semibold text-white mb-2">Don't see the right position?</h3>
            <p className="text-beatforge-200 mb-4">
              We're always looking for talented individuals to join our team. Send us your resume and tell us how you can contribute to SoundSync.
            </p>
            <Link to="/aboutus">
              <Button variant="outline" className="border-beatforge-500 text-beatforge-500 hover:bg-beatforge-500/10">
                Contact Us
              </Button>
            </Link>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
} 
 
 
 
 
 
 
 
 
 