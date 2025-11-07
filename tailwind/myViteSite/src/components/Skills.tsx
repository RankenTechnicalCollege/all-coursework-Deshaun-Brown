function Skills() {
  const skillCategories = [
    {
      category: "Frontend",
      skills: ["React", "TypeScript", "Tailwind CSS", "HTML/CSS", "JavaScript"]
    },
    {
      category: "Backend",
      skills: ["Node.js", "Express", "MongoDB", "PostgreSQL", "REST APIs"]
    },
    {
      category: "Tools & Others",
      skills: ["Git", "VS Code", "Postman", "Figma", "Agile/Scrum"]
    }
  ];

  return (
    <section className="w-full min-h-screen pt-24 sm:pt-28 md:pt-32 pb-16 sm:pb-20 md:pb-24 lg:pb-28 bg-gray-900">
      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 mx-auto max-w-7xl">
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-center text-white mb-3 sm:mb-4 md:mb-6">
          Skills & Expertise
        </h2>
        <p className="text-center text-sm sm:text-base md:text-lg text-gray-400 mb-8 sm:mb-10 md:mb-12 lg:mb-16 max-w-2xl mx-auto">
          Technologies and tools I work with to bring ideas to life.
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {skillCategories.map((category, idx) => (
            <div
              key={idx}
              className="bg-gray-950/70 backdrop-blur rounded-lg sm:rounded-xl p-6 sm:p-8 shadow-lg border border-gray-800 hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/10 hover:scale-105 transition-all duration-500"
            >
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-purple-400 mb-4 sm:mb-6 text-center">
                {category.category}
              </h3>
              <ul className="space-y-2 sm:space-y-3">
                {category.skills.map((skill, index) => (
                  <li
                    key={index}
                    className="flex items-center text-sm sm:text-base text-gray-300 hover:text-purple-400 transition-all duration-300 hover:translate-x-2 cursor-default group"
                  >
                    <span className="w-2 h-2 bg-purple-500 rounded-full mr-3 group-hover:scale-150 transition-transform"></span>
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Skills;