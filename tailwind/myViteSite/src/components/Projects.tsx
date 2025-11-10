interface Project {
  id: number;
  title: string;
  description: string;
  tech: string[];
  link: string;
  image: string;
}

export default function Projects() {
  const projects: Project[] = [
    {
      id: 1,
      title: "E-Commerce Platform",
      description: "A full-stack e-commerce solution with user authentication, product management, and payment integration.",
      tech: ["React", "Node.js", "MongoDB", "Stripe"],
      link: "#",
      image: "https://via.placeholder.com/400x300/6366f1/ffffff?text=Project+1"
    },
    {
      id: 2,
      title: "Task Management App",
      description: "Collaborative task tracker with real-time updates, team features, and productivity analytics.",
      tech: ["TypeScript", "React", "Firebase", "Tailwind"],
      link: "#",
      image: "https://via.placeholder.com/400x300/8b5cf6/ffffff?text=Project+2"
    },
    {
      id: 3,
      title: "Weather Dashboard",
      description: "Real-time weather application with location-based forecasts and interactive visualizations.",
      tech: ["React", "API Integration", "Chart.js"],
      link: "#",
      image: "https://via.placeholder.com/400x300/a78bfa/ffffff?text=Project+3"
    },
  ];

  return (
// Remove the pt-24 sm:pt-28 md:pt-32 from the section
<section className="w-full min-h-screen pt-8 pb-16 sm:pb-20 md:pb-24 lg:pb-28 bg-gray-950">
      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 mx-auto max-w-7xl">
        {/* Typography - Responsive heading with animations */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-3 sm:mb-4 md:mb-6 text-center animate-fade-in-down">
          Featured Projects
        </h2>
        
        {/* Typography - Subtitle with spacing */}
        <p className="text-center text-sm sm:text-base md:text-lg text-gray-400 mb-8 sm:mb-10 md:mb-12 lg:mb-16 max-w-2xl mx-auto animate-fade-in delay-100">
          Recent work that highlights my approach and stack.
        </p>
        
        {/* Grid - Responsive grid layout (1→2→3 columns) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {projects.map((project, index) => (
            <article
              key={project.id}
              className={`group bg-gray-900/70 backdrop-blur rounded-lg sm:rounded-xl border border-gray-800 p-4 sm:p-5 md:p-6 flex flex-col transition-all duration-300 hover:border-purple-500/50 hover:shadow-glow-lg hover:-translate-y-1 animate-fade-in-up delay-${index * 100}`}
            >
              {/* Effects & Filters - Backdrop blur on card + Image zoom animation */}
              <div className="overflow-hidden rounded-md mb-3 sm:mb-4">
                <img
                  src={project.image}
                  alt={project.title}
                  className="h-32 sm:h-40 md:h-48 w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              
              {/* Typography - Heading with hover color change */}
              <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-white mb-2 sm:mb-3 group-hover:text-purple-400 transition-colors">
                {project.title}
              </h3>
              
              {/* Typography - Line clamp for description */}
              <p className="text-xs sm:text-sm md:text-base text-gray-400 mb-3 sm:mb-4 flex-1 line-clamp-3 sm:line-clamp-4">
                {project.description}
              </p>
              
              {/* Flex - Wrapped tech badges + Colors - Custom opacity + Borders - Rounded pills */}
              <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4">
                {project.tech.map((tech) => (
                  <span
                    key={tech}
                    className="text-[10px] sm:text-xs md:text-sm px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-purple-600/20 text-purple-300 border border-purple-600/30 hover:bg-purple-600/30 hover:scale-105 transition-all duration-200"
                  >
                    {tech}
                  </span>
                ))}
              </div>
              
              {/* Animations - Arrow slides on hover */}
              <a
                href={project.link}
                className="text-xs sm:text-sm md:text-base text-purple-400 font-medium hover:text-purple-300 inline-flex items-center gap-1 group-hover:gap-2 transition-all"
              >
                View Project 
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}