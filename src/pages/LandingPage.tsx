import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/hooks/use-auth";

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useAuth();

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-white to-blue-50">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <span className="material-icons text-primary text-4xl mr-2 animate-pulse">smart_toy</span>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              SmartHire
            </h1>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-4">
            <a href="#features" className="text-neutral-700 hover:text-primary">Features</a>
            <a href="#benefits" className="text-neutral-700 hover:text-primary">Benefits</a>
            <Link href="/public-blog" className="text-neutral-700 hover:text-primary">Blog</Link>
            <Link href="/auth" className="text-neutral-700 hover:text-primary">Get Started</Link>
            <a href="#about" className="text-neutral-700 hover:text-primary">About</a>
          </div>
          
          {/* Desktop Buttons */}
          <div className="hidden md:flex space-x-2">
            <a href="#features">
              <Button variant="outline">Learn More</Button>
            </a>
            <Link href="/public-blog">
              <Button>
                <span className="material-icons mr-1 text-sm">article</span>
                Blog
              </Button>
            </Link>
{/* Test upload button removed - integrated into main app */}
            {user ? (
              <Link href="/dashboard">
                <Button variant="default" className="bg-primary hover:bg-primary/90">
                  <span className="material-icons mr-1 text-sm">dashboard</span>
                  Dashboard
                </Button>
              </Link>
            ) : (
              <Link href="/auth">
                <Button variant="default" className="bg-primary hover:bg-primary/90">
                  <span className="material-icons mr-1 text-sm">login</span>
                  Login / Register
                </Button>
              </Link>
            )}
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <span className="material-icons">menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <div className="flex flex-col space-y-4 pt-10">
                  <a 
                    href="#features" 
                    className="text-lg py-2 px-4 rounded-md hover:bg-primary/10"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Features
                  </a>
                  <a 
                    href="#benefits" 
                    className="text-lg py-2 px-4 rounded-md hover:bg-primary/10"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Benefits
                  </a>
                  <Link 
                    href="/public-blog"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span className="text-lg py-2 px-4 rounded-md hover:bg-primary/10 block">
                      Blog
                    </span>
                  </Link>
                  <Link 
                    href="/auth"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span className="text-lg py-2 px-4 rounded-md hover:bg-primary/10 block">
                      Get Started
                    </span>
                  </Link>
                  <a 
                    href="#about" 
                    className="text-lg py-2 px-4 rounded-md hover:bg-primary/10"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    About
                  </a>
                  <div className="pt-4 flex flex-col space-y-2">
                    <a href="#features" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="outline" className="w-full">Learn More</Button>
                    </a>
                    <Link href="/public-blog" onClick={() => setIsMenuOpen(false)}>
                      <Button className="w-full">
                        <span className="material-icons mr-1 text-sm">article</span>
                        Blog
                      </Button>
                    </Link>
                    {/* Test upload button removed - integrated into main app */}
                    {user ? (
                      <Link href="/dashboard" onClick={() => setIsMenuOpen(false)}>
                        <Button variant="default" className="w-full bg-primary hover:bg-primary/90">
                          <span className="material-icons mr-1 text-sm">dashboard</span>
                          Dashboard
                        </Button>
                      </Link>
                    ) : (
                      <Link href="/auth" onClick={() => setIsMenuOpen(false)}>
                        <Button variant="default" className="w-full bg-primary hover:bg-primary/90">
                          <span className="material-icons mr-1 text-sm">login</span>
                          Login / Register
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
      
      {/* Hero Section */}
      <section className="container mx-auto px-4 sm:px-6 py-12 md:py-24 flex flex-col md:flex-row items-center overflow-hidden">
        <div className="md:w-1/2 mb-10 md:mb-0">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            <span className="block">AI-Powered</span>
            <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              Candidate Selection
            </span>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-neutral-600 mb-8">
            Streamline your hiring process with our advanced AI technology. Match the right talent with the right job openings.
          </p>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            {user ? (
              <Link href="/dashboard">
                <Button size="lg" className="w-full sm:w-auto text-lg px-6 sm:px-8 bg-primary hover:bg-primary/90">
                  Go to Dashboard
                  <span className="material-icons ml-2">dashboard</span>
                </Button>
              </Link>
            ) : (
              <Link href="/auth">
                <Button size="lg" className="w-full sm:w-auto text-lg px-6 sm:px-8 bg-primary hover:bg-primary/90">
                  Get Started
                  <span className="material-icons ml-2">rocket_launch</span>
                </Button>
              </Link>
            )}
            <a href="#features">
              <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg px-6 sm:px-8">
                See How It Works
                <span className="material-icons ml-2">play_circle</span>
              </Button>
            </a>
          </div>
        </div>
        <div className="md:w-1/2">
          <div className="relative aspect-video rounded-xl bg-white shadow-2xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-blue-50"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-11/12 sm:w-4/5 h-4/5 bg-white rounded-lg shadow-lg p-2 sm:p-4 flex flex-col">
                <div className="flex items-center mb-2 sm:mb-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary flex items-center justify-center text-white">
                    <span className="material-icons text-sm sm:text-base">assignment_ind</span>
                  </div>
                  <div className="ml-3">
                    <div className="h-2 sm:h-3 w-16 sm:w-24 bg-blue-100 rounded"></div>
                    <div className="h-1 sm:h-2 w-10 sm:w-16 bg-blue-50 rounded mt-1"></div>
                  </div>
                </div>
                <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-1 sm:gap-2">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-blue-50 rounded p-1 sm:p-2 flex flex-col">
                      <div className="h-1 sm:h-2 w-8 sm:w-12 bg-blue-100 rounded mb-1 sm:mb-2"></div>
                      <div className="h-1 sm:h-2 w-full bg-blue-100 rounded"></div>
                    </div>
                  ))}
                </div>
                <div className="mt-2 sm:mt-4 h-4 sm:h-6 w-full bg-blue-100 rounded-full overflow-hidden">
                  <div className="h-full w-3/4 bg-gradient-to-r from-primary to-blue-600 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section id="features" className="py-12 sm:py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">Powerful Features</h2>
            <p className="text-base sm:text-lg md:text-xl text-neutral-600 max-w-2xl mx-auto">
              SmartHire uses advanced AI to streamline and enhance your recruitment process
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg border border-neutral-100 card-hover transform transition-transform duration-300 hover:scale-105">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-100 to-primary/20 rounded-full flex items-center justify-center mb-4 sm:mb-6 mx-auto shadow-md">
                <span className="material-icons text-primary text-3xl sm:text-4xl">source</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-center">Intelligent CV Parsing</h3>
              <p className="text-sm sm:text-base text-neutral-600">
                Extract key information from resumes automatically with our AI technology, saving hours of manual review time.
              </p>
            </div>
            
            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg border border-neutral-100 card-hover transform transition-transform duration-300 hover:scale-105">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-100 to-primary/20 rounded-full flex items-center justify-center mb-4 sm:mb-6 mx-auto shadow-md">
                <span className="material-icons text-primary text-3xl sm:text-4xl">compare</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-center">Smart Candidate Matching</h3>
              <p className="text-sm sm:text-base text-neutral-600">
                Match candidates to job descriptions with precision, considering skills, experience, and education requirements.
              </p>
            </div>
            
            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg border border-neutral-100 card-hover transform transition-transform duration-300 hover:scale-105">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-100 to-primary/20 rounded-full flex items-center justify-center mb-4 sm:mb-6 mx-auto shadow-md">
                <span className="material-icons text-primary text-3xl sm:text-4xl">insights</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-center">Detailed Assessments</h3>
              <p className="text-sm sm:text-base text-neutral-600">
                Get comprehensive insights on each candidate with personalized scores, strengths, and development areas.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Blog Section */}
      <section id="blog" className="py-12 sm:py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">Recruitment Insights</h2>
            <p className="text-base sm:text-lg md:text-xl text-neutral-600 max-w-2xl mx-auto">
              Read our latest articles about recruitment strategies and AI in hiring
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 mb-10">
            {/* This would normally be populated from an API call */}
            <div className="bg-white rounded-xl overflow-hidden shadow-lg border border-neutral-100 transform transition-transform duration-300 hover:scale-105">
              <div className="h-36 sm:h-48 bg-gradient-to-tr from-primary/20 to-blue-100 flex items-center justify-center">
                <span className="material-icons text-primary text-4xl sm:text-6xl">article</span>
              </div>
              <div className="p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-bold mb-2">6 Essential Resume Tips for Job Seekers</h3>
                <p className="text-sm sm:text-base text-neutral-600 mb-4 line-clamp-2">Essential resume tips for landing your dream job</p>
                <div className="flex justify-between items-center">
                  <span className="text-xs sm:text-sm text-neutral-500">By HR Expert</span>
                  <Link href="/public-blog/1">
                    <div className="text-primary hover:text-primary/80 text-xs sm:text-sm font-medium flex items-center">
                      Read More
                      <span className="material-icons text-xs sm:text-sm ml-1">arrow_forward</span>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl overflow-hidden shadow-lg border border-neutral-100 transform transition-transform duration-300 hover:scale-105">
              <div className="h-36 sm:h-48 bg-gradient-to-tr from-primary/20 to-blue-100 flex items-center justify-center">
                <span className="material-icons text-primary text-4xl sm:text-6xl">smart_toy</span>
              </div>
              <div className="p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-bold mb-2">How AI is Transforming Recruitment</h3>
                <p className="text-sm sm:text-base text-neutral-600 mb-4 line-clamp-2">The impact of artificial intelligence on modern recruitment practices</p>
                <div className="flex justify-between items-center">
                  <span className="text-xs sm:text-sm text-neutral-500">By Tech Recruiter</span>
                  <Link href="/public-blog">
                    <div className="text-primary hover:text-primary/80 text-xs sm:text-sm font-medium flex items-center">
                      Read More
                      <span className="material-icons text-xs sm:text-sm ml-1">arrow_forward</span>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl overflow-hidden shadow-lg border border-neutral-100 transform transition-transform duration-300 hover:scale-105">
              <div className="h-36 sm:h-48 bg-gradient-to-tr from-primary/20 to-blue-100 flex items-center justify-center">
                <span className="material-icons text-primary text-4xl sm:text-6xl">diversity_3</span>
              </div>
              <div className="p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-bold mb-2">Promoting Diversity Through Objective Hiring</h3>
                <p className="text-sm sm:text-base text-neutral-600 mb-4 line-clamp-2">Strategies for building more inclusive teams</p>
                <div className="flex justify-between items-center">
                  <span className="text-xs sm:text-sm text-neutral-500">By DEI Specialist</span>
                  <Link href="/public-blog">
                    <div className="text-primary hover:text-primary/80 text-xs sm:text-sm font-medium flex items-center">
                      Read More
                      <span className="material-icons text-xs sm:text-sm ml-1">arrow_forward</span>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <Link href="/public-blog">
              <Button variant="outline" size="lg" className="rounded-full text-sm sm:text-base">
                View All Blog Posts
                <span className="material-icons text-sm sm:text-base ml-2">arrow_forward</span>
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Benefits Section */}
      <section id="benefits" className="py-12 sm:py-16 md:py-20 bg-blue-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10 sm:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">Why Choose SmartHire?</h2>
              <p className="text-base sm:text-lg md:text-xl text-neutral-600 max-w-2xl mx-auto">
                Our platform transforms your recruitment process with AI-powered efficiency
              </p>
            </div>
            
            <div className="space-y-6 sm:space-y-8">
              {[
                {
                  icon: "schedule",
                  title: "Save Time",
                  description: "Reduce candidate screening time by up to 75% with automated resume parsing and analysis."
                },
                {
                  icon: "trending_up",
                  title: "Better Hiring Decisions",
                  description: "Make data-driven decisions with objective candidate assessments and job fit scores."
                },
                {
                  icon: "groups",
                  title: "Improve Team Collaboration",
                  description: "Centralize candidate data and assessments for better team coordination and decision-making."
                },
                {
                  icon: "diversity_3",
                  title: "Reduce Bias in Hiring",
                  description: "Focus on skills and qualifications with objective AI assessment to promote diversity."
                }
              ].map((benefit, index) => (
                <div 
                  key={index}
                  className="flex flex-col sm:flex-row bg-white p-5 sm:p-6 rounded-xl shadow-md card-hover transform transition-transform duration-300 hover:scale-105"
                >
                  <div className="flex-shrink-0 mb-4 sm:mb-0 sm:mr-6 flex justify-center sm:block">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-tr from-primary to-blue-400 rounded-full flex items-center justify-center text-white shadow-lg">
                      <span className="material-icons text-2xl sm:text-3xl">{benefit.icon}</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold mb-2 text-center sm:text-left">{benefit.title}</h3>
                    <p className="text-sm sm:text-base text-neutral-600 text-center sm:text-left">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-r from-primary to-blue-600 text-white">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">Ready to Transform Your Hiring Process?</h2>
          <p className="text-base sm:text-lg md:text-xl mb-8 sm:mb-10 max-w-2xl mx-auto">
            Join hundreds of companies using SmartHire to find the perfect candidates faster and more efficiently.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
            {user ? (
              <Link href="/dashboard">
                <Button size="lg" className="w-full sm:w-auto bg-white text-primary hover:bg-white/90 text-base sm:text-lg px-6 sm:px-8">
                  Go to Dashboard
                  <span className="material-icons ml-2">dashboard</span>
                </Button>
              </Link>
            ) : (
              <Link href="/auth">
                <Button size="lg" className="w-full sm:w-auto bg-white text-primary hover:bg-white/90 text-base sm:text-lg px-6 sm:px-8">
                  Get Started
                  <span className="material-icons ml-2">login</span>
                </Button>
              </Link>
            )}
            <a href="#features">
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-white border-white hover:bg-white/10 text-base sm:text-lg px-6 sm:px-8">
                Learn More
                <span className="material-icons ml-2">arrow_forward</span>
              </Button>
            </a>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-neutral-900 text-neutral-400 py-10 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row justify-between mb-8">
            <div className="mb-8 md:mb-0 text-center md:text-left">
              <div className="flex items-center mb-4 justify-center md:justify-start">
                <span className="material-icons text-primary text-3xl sm:text-4xl mr-2 animate-pulse">smart_toy</span>
                <h2 className="text-lg sm:text-xl font-bold text-white bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">SmartHire</h2>
              </div>
              <p className="max-w-xs mx-auto md:mx-0 text-sm sm:text-base">
                AI-powered recruitment platform that makes finding the right talent efficient and effective.
              </p>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-8">
              <div className="text-center sm:text-left">
                <h3 className="text-white font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Product</h3>
                <ul className="space-y-2 text-sm">
                  <li><a href="#features" className="hover:text-white">Features</a></li>
                  <li><a href="#" className="hover:text-white">Pricing</a></li>
                  <li><a href="#" className="hover:text-white">Case Studies</a></li>
                  <li><a href="#" className="hover:text-white">Documentation</a></li>
                </ul>
              </div>
              
              <div className="text-center sm:text-left">
                <h3 className="text-white font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Company</h3>
                <ul className="space-y-2 text-sm">
                  <li><a href="#about" className="hover:text-white">About</a></li>
                  <li><Link href="/public-blog" className="hover:text-white">Blog</Link></li>
                  <li><a href="#" className="hover:text-white">Careers</a></li>
                  <li><a href="#" className="hover:text-white">Contact</a></li>
                </ul>
              </div>
              
              <div className="text-center sm:text-left col-span-2 sm:col-span-1">
                <h3 className="text-white font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Legal</h3>
                <ul className="space-y-2 text-sm">
                  <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                  <li><a href="#" className="hover:text-white">Terms of Service</a></li>
                  <li><a href="#" className="hover:text-white">Cookie Policy</a></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="border-t border-neutral-800 pt-6 sm:pt-8 mt-6 sm:mt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm mb-4 md:mb-0">© 2025 SmartHire. All rights reserved.</p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-primary transition-transform duration-300 hover:scale-125">
                <span className="material-icons text-xl sm:text-2xl">facebook</span>
              </a>
              <a href="#" className="hover:text-primary transition-transform duration-300 hover:scale-125">
                <span className="material-icons text-xl sm:text-2xl">twitter</span>
              </a>
              <a href="#" className="hover:text-primary transition-transform duration-300 hover:scale-125">
                <span className="material-icons text-xl sm:text-2xl">linkedin</span>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}