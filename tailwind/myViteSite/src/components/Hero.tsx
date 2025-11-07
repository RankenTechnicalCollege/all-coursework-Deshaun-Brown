function Hero() {
  return (
    <section id="home" className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 transition-colors pt-20">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6">
          Hi, I'm <span className="text-purple-600 dark:text-purple-400">Your Name</span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8">
          Full Stack Developer | TypeScript Enthusiast | Problem Solver
        </p>
        <p className="text-lg text-gray-500 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
          I build modern web applications with React, TypeScript, and Tailwind CSS.
          Passionate about creating clean, efficient, and user-friendly solutions.
        </p>
        <div className="flex gap-4 justify-center">
          <a
            href="#projects"
            className="px-8 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors shadow-lg"
          >
            View My Work
          </a>
          <a
            href="#contact"
            className="px-8 py-3 bg-white dark:bg-gray-800 text-purple-600 dark:text-purple-400 border-2 border-purple-600 dark:border-purple-400 rounded-lg font-medium hover:bg-purple-50 dark:hover:bg-gray-700 transition-colors"
          >
            Get In Touch
          </a>
        </div>
      </div>
    </section>
  );
}

export default Hero;