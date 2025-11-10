import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <section className="w-full min-h-screen pt-8 pb-16 sm:pb-20 md:pb-24 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 mx-auto max-w-7xl">
        <div className="flex flex-col items-center text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-4 sm:mb-6 animate-fade-in-down">
            Hi, I'm <span className="text-purple-400 hover:text-primary-400 transition-colors">Your Name</span>
          </h1>
          
          <p className="text-lg sm:text-xl md:text-2xl font-medium tracking-wide text-gray-300 mb-4 sm:mb-6 max-w-3xl animate-fade-in delay-100">
            Full Stack Developer | TypeScript Enthusiast | Problem Solver
          </p>
          
          <p className="text-sm sm:text-base md:text-lg font-light text-gray-400 max-w-2xl mb-8 sm:mb-10 md:mb-12 leading-relaxed animate-fade-in delay-200">
            I build modern web applications with React, TypeScript, and Tailwind CSS. Passionate about clean, efficient, user-friendly solutions.
          </p>
          
          <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 justify-center w-full sm:w-auto animate-fade-in delay-300">
            <Link
              to="/projects"
              className="px-6 sm:px-7 md:px-8 py-2.5 sm:py-3 rounded-lg bg-purple-600 text-white text-sm sm:text-base font-medium shadow-glow hover:bg-purple-500 hover:scale-105 hover:shadow-glow-lg transition-all duration-300 transform"
            >
              View My Work
            </Link>
            
            <Link
              to="/contact"
              className="px-6 sm:px-7 md:px-8 py-2.5 sm:py-3 rounded-lg border-2 border-purple-500 text-purple-300 text-sm sm:text-base font-medium hover:bg-purple-500/10 hover:scale-105 transition-all duration-300 transform"
            >
              Get In Touch
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}