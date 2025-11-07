import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    const prefers = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (saved === 'dark' || (!saved && prefers)) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
  };

  return (
    <header className="fixed top-0 w-full border-b bg-white/70 dark:bg-gray-900/70 backdrop-blur z-50">
      <div className="mx-auto max-w-7xl px-4 py-4 flex items-center justify-between">
        <Link to="/" className="font-bold text-xl text-purple-600 dark:text-purple-400">Portfolio</Link>
        <nav className="flex items-center gap-6">
          <Link to="/" className="text-sm font-medium hover:text-purple-600 dark:hover:text-purple-400">Home</Link>
            <Link to="/projects" className="text-sm font-medium hover:text-purple-600 dark:hover:text-purple-400">Projects</Link>
          <Link to="/skills" className="text-sm font-medium hover:text-purple-600 dark:hover:text-purple-400">Skills</Link>
          <Link to="/contact" className="text-sm font-medium hover:text-purple-600 dark:hover:text-purple-400">Contact</Link>
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
            aria-label="Toggle dark mode"
          >
            {isDark ? '🌙' : '☀️'}
          </button>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;