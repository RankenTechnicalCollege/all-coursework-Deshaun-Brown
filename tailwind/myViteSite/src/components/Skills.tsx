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
    <section id="skills" className="min-h-screen py-20 bg-gray-50 dark:bg-gray-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-900 dark:text-white mb-4">
          Skills & Expertise
        </h2>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-16 max-w-2xl mx-auto">
          Technologies and tools I work with to bring ideas to life.
        </p>
        
        <div className="grid md:grid-cols-3 gap-8">
          {skillCategories.map((category, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-gray-900 rounded-lg p-8 shadow-lg border border-gray-200 dark:border-gray-700"
            >
              <h3 className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-6 text-center">
                {category.category}
              </h3>
              <ul className="space-y-3">
                {category.skills.map((skill, index) => (
                  <li
                    key={index}
                    className="flex items-center text-gray-700 dark:text-gray-300"
                  >
                    <span className="w-2 h-2 bg-purple-600 dark:bg-purple-400 rounded-full mr-3"></span>
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