import { useState, useEffect, useRef, RefObject } from "react";
import { Button } from "@/components/ui/button";
import { GradientButton } from "@/components/ui/gradient-button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { SparklesUnderName } from "@/components/SparklesPreview";
import { Component as EtheralShadow } from "@/components/ui/etheral-shadow";
import { Github, Linkedin, Mail, ExternalLink, Download, Menu, X, Send } from "lucide-react";
import GitHubCalendar from 'react-github-calendar';

export default function Index() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogSource, setDialogSource] = useState<'contact' | 'footer'>("contact");
  const [emailForm, setEmailForm] = useState({
    email: "",
    subject: "",
    message: ""
  });
  const emailInputRef = useRef<HTMLInputElement>(null);
  const [shouldFocusEmail, setShouldFocusEmail] = useState(false);

  // Section refs for dynamic scroll detection
  const sectionIds = ["home", "about", "github-stats", "projects", "contact"];
  const sectionRefs: Record<string, RefObject<HTMLElement>> = {
    home: useRef<HTMLElement>(null),
    about: useRef<HTMLElement>(null),
    "github-stats": useRef<HTMLElement>(null),
    projects: useRef<HTMLElement>(null),
    contact: useRef<HTMLElement>(null),
  };

  // When dialogSource changes to 'footer' and dialog opens, pre-fill subject
  useEffect(() => {
    if (isDialogOpen && dialogSource === 'footer') {
      setEmailForm((prev) => ({ ...prev, subject: "Contacted from footer" }));
    }
    if (isDialogOpen && dialogSource === 'contact') {
      setEmailForm((prev) => ({ ...prev, subject: "" }));
    }
  }, [isDialogOpen, dialogSource]);

  useEffect(() => {
    if (isDialogOpen && shouldFocusEmail && emailInputRef.current) {
      emailInputRef.current.focus();
      setShouldFocusEmail(false);
    }
  }, [isDialogOpen, shouldFocusEmail]);

  useEffect(() => {
    const handleScroll = () => {
      // If at the very bottom, always highlight contact
      const isAtBottom = (window.innerHeight + window.scrollY) >= (document.body.offsetHeight - 2);
      if (isAtBottom) {
        setActiveSection("contact");
        return;
      }

      let maxVisible = 0;
      let mostVisibleSection = "home";
      for (const id of sectionIds) {
        const ref = sectionRefs[id];
        if (ref.current) {
          const rect = ref.current.getBoundingClientRect();
          const visibleHeight = Math.min(window.innerHeight, rect.bottom) - Math.max(0, rect.top);
          if (visibleHeight > maxVisible && visibleHeight > 0) {
            maxVisible = visibleHeight;
            mostVisibleSection = id === "github-stats" ? "stats" : id;
          }
        }
      }
      setActiveSection(mostVisibleSection);
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const ref = sectionRefs[sectionId === "stats" ? "github-stats" : sectionId];
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth" });
    }
    setIsMenuOpen(false);
  };

  // Email validation helper
  function isValidEmail(email: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  const handleEmailSubmit = async () => {
    if (!isValidEmail(emailForm.email)) {
      alert("Please enter a valid email address.");
      return;
    }
    const res = await fetch('/api/sendEmail', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(emailForm),
    });
    if (res.ok) {
      alert('Message sent!');
      setIsDialogOpen(false);
      setEmailForm({ email: "", subject: "", message: "" });
    } else {
      alert('Failed to send message. Please try again later.');
    }
  };

  const skills = [
    { name: "Python", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg" },
    { name: "NumPy", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/numpy/numpy-original.svg" },
    { name: "Git", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg" },
    { name: "VS Code", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vscode/vscode-original.svg" },
    { name: "C", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/c/c-original.svg" },
    { name: "C++", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/cplusplus/cplusplus-original.svg" },
    { name: "HTML", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg" },
    { name: "CSS", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original.svg" },
    { name: "JavaScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg" }
  ];

  type Project = {
    title: string;
    description: string;
    tech: string[];
    github: string;
    live: string | false;
    image: string;
  };

  const projects: Project[] = [
    {
      title: "Scientific Computing Python",
      description: "Projects and Concepts exercises from FreeCodeCamp’s Scientific Computing with Python course.",
      tech: ["Python", "Scientific Computing", "Data Analysis"],
      github: "https://github.com/SujitChaudhary2005/Scientific-Computing-Python",
      live: false,
      image: "https://opengraph.githubassets.com/1/SujitChaudhary2005/Scientific-Computing-Python"
    },
    {
      title: "AI ML Learning Journey",
      description: "A collection of projects and exercises from my AI/ML learning journey.",
      tech: ["jupyter notebook", "Python", "Pandas", "NumPy"],
      github: "https://github.com/SujitChaudhary2005/AI-ML-Learning-Journey",
      live: false,
      image: "https://opengraph.githubassets.com/1/SujitChaudhary2005/AI-ML-Learning-Journey"
    },
    {
      title: "Qr Code Generator",
      description: "Real-time analytics dashboard with data visualization, custom reporting, and API integrations for business intelligence.",
      tech: ["HTML", "CSS", "JavaScript"],
      github: "https://github.com/SujitChaudhary2005/QR-Code-Generator",
      live: false,
      image: "https://opengraph.githubassets.com/1/SujitChaudhary2005/QR-Code-Generator"
    }
    
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-background/80 backdrop-blur-sm border-b z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <img 
                src="/logo.png" 
                alt="SC Logo" 
                className="h-10 w-10 rounded-lg"
              />
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {["home", "about", "stats", "projects", "contact"].map((section) => (
  <button
    key={section}
    onClick={() => scrollToSection(section === "stats" ? "github-stats" : section)}
    className={`capitalize nav-button-hover ${
      activeSection === section ? "text-primary font-medium" : "text-muted-foreground"
    }`}
  >
    {section}
  </button>
))}

            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center space-x-2">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden py-4 space-y-2">
              {["home", "about", "stats", "projects", "contact"].map((section) => (
                <button
                  key={section}
                  onClick={() => scrollToSection(section === "stats" ? "github-stats" : section)}
                  className={`block w-full text-left py-2 capitalize nav-button-hover ${
                    activeSection === section ? "text-primary font-medium" : "text-muted-foreground"
                  }`}
                >
                  {section}
                </button>
              ))}
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" ref={sectionRefs.home} className="pt-16 min-h-screen flex items-center relative overflow-hidden">
        {/* Etheral Shadow Background */}
        <div className="absolute inset-0 z-0">
          <EtheralShadow
            color="rgba(255, 255, 255, 0.3)"
            animation={{ scale: 60, speed: 40 }}
            noise={{ opacity: 0.6, scale: 1.8 }}
            sizing="fill"
            className="w-full h-full"
          />
        </div>
        
        {/* Content overlay */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="order-2 lg:order-1 text-center lg:text-left">
              <div className="mb-4 lg:mb-6">
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
                  <span className="text-foreground">
                    Hi, I'm{" "}
                    <span className="relative inline-block">
                      Sujit Chaudhary
                      {/* Sparkles positioned exactly under just the name */}
                      <div className="absolute top-full left-0 w-full -mt-1">
                        <SparklesUnderName />
                      </div>
                    </span>
                  </span>
                </h1>
              </div>

              <p className="text-lg sm:text-xl lg:text-2xl text-foreground/90 mb-6 lg:mb-8 max-w-2xl mx-auto lg:mx-0">
                Aspiring AI/ML Developer | Learning Python, Pandas, NumPy | Focused on building strong foundations in data & ML
              </p>
              <div className="flex flex-col sm:flex-row gap-3 lg:gap-4 mb-6 lg:mb-8 justify-center lg:justify-start">
                <GradientButton onClick={() => scrollToSection("projects")} className="w-full sm:w-auto">
                  View My Work
                </GradientButton>
                <GradientButton variant="variant" className="w-full sm:w-auto" asChild>
                  <a href="/SujitChaudharyResume.pdf" download="SujitChaudhary_Resume.pdf" target="_blank" rel="noopener noreferrer">
                    <Download className="mr-2 h-4 w-4" />
                    Download CV
                  </a>
                </GradientButton>
              </div>
            </div>
            <div className="order-1 lg:order-2 relative">
              <div className="w-64 sm:w-80 md:w-96 lg:w-full aspect-square max-w-md mx-auto bg-gradient-to-br from-primary/20 to-primary/5 rounded-full p-2 backdrop-blur-sm">
                <img 
                  src="/SujitChaudhary.jpg" 
                  alt="Sujit Chaudhary - Portfolio"
                  className="w-full h-full object-cover rounded-full border-4 border-primary/20 shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" ref={sectionRefs.about} className="py-16 lg:py-20 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-8 lg:mb-12">About Me</h2>
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            <div className="space-y-4 lg:space-y-6">
              <p className="text-base lg:text-lg text-muted-foreground">
                I'm  a self-driven and curious learner passionate about artificial intelligence, 
                machine learning, and problem-solving with code.
              </p>
              <p className="text-base lg:text-lg text-muted-foreground">
                I’m currently focused on Python and working with tools like NumPy, Pandas, Matplotlib, and Scikit-learn to build real-world projects and deepen 
                my understanding of data and ML workflows. I enjoy taking what I learn and applying it through hands-on experiments, which I document clearly on GitHub and Notion.
              </p>
              <p className="text-base lg:text-lg text-muted-foreground">
                I also have a strong foundation in C and C++, and I’m comfortable using Git for version control and Jupyter/Colab for running experiments. My goal is to grow into an 
                AI/ML developer who builds practical, useful solutions — starting with small projects and scaling up.
              </p>
              <p className="text-base lg:text-lg text-muted-foreground">
                Right now, I’m looking for opportunities to collaborate, intern, or contribute to real projects that challenge me to learn and grow.
              </p>
              <div className="pt-2">
                <GradientButton className="w-full sm:w-auto" onClick={() => scrollToSection("contact")}>
                  Let's Work Together
                </GradientButton>
              </div>
            </div>
            <div>
              <h3 className="text-xl lg:text-2xl font-semibold mb-4 lg:mb-6 text-center lg:text-left">Skills & Technologies</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-4">
                {skills.map((skill) => {
                  return (
                    <div
                      key={skill.name}
                      className="flex flex-col items-center p-3 lg:p-4 rounded-lg bg-background/50 hover:bg-background/80 transition-all duration-300 hover:scale-105 group"
                    >
                      <img 
                        src={skill.icon}
                        alt={`${skill.name} icon`}
                        width={32}
                        height={32}
                        className="mb-2 group-hover:scale-110 transition-transform duration-300 lg:w-10 lg:h-10"
                        loading="lazy"
                      />
                      <span className="text-xs lg:text-sm font-medium text-center">{skill.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* GitHub Stats Section */}
      <section id="github-stats" ref={sectionRefs["github-stats"]} className="py-16 lg:py-20 bg-black">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-8 lg:mb-12 text-white">GitHub Statistics</h2>
          
          {/* GitHub Contribution Section */}
          <div className="mb-12">
            {/* GitHub Calendar */}
            <div className="flex justify-center overflow-x-auto">
              <div className="min-w-fit">
                <div className="mb-4">
                  <h3 className="text-white text-2xl font-semibold mb-4 text-left">GitHub Contribution</h3>
                  <p className="text-gray-400 text-sm mb-6 text-left">The following is my GitHub contribution graph which shows my coding activity and productivity on the platform.</p>
                </div>
                
                <GitHubCalendar
                  username="SujitChaudhary2005"
                  colorScheme="dark"
                  blockSize={14}
                  showWeekdayLabels={true}
                  theme={{
                    dark: ['#161b22', '#0a2444', '#1a4c7a', '#2e6ba8', '#58a6ff']
                  }}
                  style={{
                    color: '#fff',
                    fontSize: '14px',
                  }}
                />
              </div>
            </div>
          </div>

          {/* GitHub Activity Graph */}
          <div className="mb-12">
            <div className="flex justify-center">
              <div className="w-full max-w-5xl">
                <div className="mb-4">
                  <h3 className="text-white text-2xl font-semibold mb-4 text-left ml-4">GitHub Activity Graph</h3>
                  <p className="text-gray-400 text-sm mb-6 text-left ml-4">A dynamically generated activity graph to show my GitHub activities of last 31 days.</p>
                </div>
                
                <img
                  src="https://github-readme-activity-graph.vercel.app/graph?username=SujitChaudhary2005&theme=github-compact&bg_color=000000&color=58a6ff&line=58a6ff&point=ffffff&area=true&area_color=58a6ff&hide_border=true&custom_title=GitHub%20Activity%20Graph"
                  alt="GitHub Activity Graph"
                  className="w-full h-auto"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.style.display = 'none';
                    const fallback = document.createElement('div');
                    fallback.textContent = 'Unable to load GitHub Activity Graph.';
                    fallback.style.color = '#fff';
                    fallback.style.textAlign = 'center';
                    fallback.style.margin = '2rem 0';
                    target.parentElement?.appendChild(fallback);
                  }}
                />
              </div>
            </div>
          </div>

          {/* GitHub Profile Link */}
          <div className="text-center">
            <GradientButton variant="variant" asChild>
              <a href="https://github.com/SujitChaudhary2005" target="_blank" rel="noopener noreferrer">
                <Github className="mr-2 h-4 w-4" />
                View Full Profile
              </a>
            </GradientButton>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" ref={sectionRefs.projects} className="py-16 lg:py-20 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-8 lg:mb-12">Featured Projects/Repo</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {projects.map((project, index) => (
              <Card key={index} className="project-card overflow-hidden">
                <div className="aspect-video bg-muted relative overflow-hidden">
                  <img
                    src={project.image}
                    alt={`Screenshot of ${project.title} project`}
                    className="project-image w-full h-full object-cover"
                    loading="lazy"
                    width={400}
                    height={225}
                  />
                </div>
                <CardHeader className="p-4 lg:p-6">
                  <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <span className="text-lg lg:text-xl">{project.title}</span>
                    <div className="flex space-x-2">
                      <Button size="icon" variant="ghost" className="icon-button-hover h-8 w-8" asChild aria-label="View on GitHub">
                          <a href={project.github} target="_blank" rel="noopener noreferrer">
                            <Github className="h-4 w-4" />
                          </a>
                        </Button>
                        {project.live && typeof project.live === 'string' && project.live.trim() !== '' && project.live !== project.github && (
                          <Button size="icon" variant="ghost" className="icon-button-hover h-8 w-8" asChild aria-label="View Live Project">
                            <a href={project.live} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </Button>
                        )}
                    </div>
                  </CardTitle>
                  <CardDescription className="text-sm lg:text-base">{project.description}</CardDescription>
                </CardHeader>
                <CardContent className="p-4 lg:p-6 pt-0">
                  <div className="flex flex-wrap gap-1 lg:gap-2">
                    {project.tech.map((tech) => (
                      <Badge key={tech} variant="outline" className="project-tech-badge text-xs">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Dialog (moved to top level for global access) */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          {/* Hidden trigger, dialog is opened programmatically */}
          <span style={{ display: 'none' }} />
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] mx-4">
          <DialogHeader>
            <DialogTitle>
              {dialogSource === 'footer' ? 'Quick Contact from Footer' : 'Send me a message'}
            </DialogTitle>
            <DialogDescription className="text-sm">
              {dialogSource === 'footer'
                ? "You opened this from the footer. I'll get back to you as soon as possible!"
                : "I'll get back to you as soon as possible! You can also reach me directly at: "}
              <span className="font-medium text-foreground"> chaudharysujit765@gmail.com</span>
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Your Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={emailForm.email}
                onChange={(e) => setEmailForm(prev => ({ ...prev, email: e.target.value }))}
                ref={emailInputRef}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                placeholder="What's this about?"
                value={emailForm.subject}
                onChange={(e) => setEmailForm(prev => ({ ...prev, subject: e.target.value }))}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                placeholder="Tell me about your project or just say hi!"
                className="min-h-[100px]"
                value={emailForm.message}
                onChange={(e) => setEmailForm(prev => ({ ...prev, message: e.target.value }))}
              />
            </div>
          </div>
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3">
            <Button 
              variant="outline" 
              onClick={() => setIsDialogOpen(false)}
              className="h-12 px-6"
            >
              Cancel
            </Button>
            <GradientButton onClick={handleEmailSubmit} className="h-12">
              <Send className="mr-2 h-4 w-4" />
              Send Message
            </GradientButton>
          </div>
        </DialogContent>
      </Dialog>

      {/* Contact Section */}
      <section id="contact" ref={sectionRefs.contact} className="py-16 lg:py-20 relative overflow-hidden">
        {/* Etheral Shadow Background */}
        <div className="absolute inset-0 z-0">
          <EtheralShadow
            color="rgba(255, 255, 255, 0.4)"
            animation={{ scale: 50, speed: 30 }}
            noise={{ opacity: 0.7, scale: 2.0 }}
            sizing="fill"
            className="w-full h-full"
          />
        </div>
        {/* Content overlay */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 lg:mb-6">Let's Build Something Amazing</h2>
          <p className="text-base lg:text-lg text-muted-foreground mb-6 lg:mb-8 max-w-2xl mx-auto">
            I'm always interested in hearing about new opportunities and exciting projects. 
            Whether you have a question or just want to say hi, feel free to reach out!
          </p>
          <div className="flex flex-col sm:flex-row gap-3 lg:gap-4 justify-center">
            <GradientButton className="w-full sm:w-auto" onClick={() => { setDialogSource('contact'); setIsDialogOpen(true); }} aria-label="Open contact dialog">
              <Mail className="mr-2 h-4 w-4" />
              Get In Touch
            </GradientButton>
            <GradientButton variant="variant" className="w-full sm:w-auto" asChild aria-label="Connect on LinkedIn">
              <a href="https://www.linkedin.com/in/sujit-chaudhary2005/" target="_blank" rel="noopener noreferrer">
                <Linkedin className="mr-2 h-4 w-4" />
                Connect on LinkedIn
              </a>
            </GradientButton>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center">
            <p className="text-muted-foreground text-center">
              © 2024 Sujit Chaudhary. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
