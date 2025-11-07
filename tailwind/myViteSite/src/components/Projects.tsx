interface Project {
  id: number;
  title: string;
  description: string;
  tech: string[];
  link: string;
  image: string;
}

function Projects() {
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
    <section id="projects" className="min-h-screen py-20 bg-white dark:bg-gray-900 transition-colors">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-900 dark:text-white mb-4">
          Featured Projects
        </h2>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-16 max-w-2xl mx-auto">
          Here are some of my recent works that showcase my skills and experience.
        </p>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow border border-gray-200 dark:border-gray-700"
            >
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {project.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tech.map((tech, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-sm rounded-full"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                <a
                  href={project.link}
                  className="inline-flex items-center text-purple-600 dark:text-purple-400 font-medium hover:underline"
                >
                  View Project →
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Projects;