import { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';

export default function Navbar() {
  const [isDark, setIsDark] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    const prefers = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (saved === 'dark' || (!saved && prefers)) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDark = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
  };

  const linkBase =
    'px-3 py-2 text-sm font-medium transition-colors';
  const active =
    'text-purple-600 dark:text-purple-400';
  const inactive =
    'text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400';

  return (
    <header className="fixed top-0 left-0 w-full z-50 border-b border-white/10 dark:border-gray-800 bg-white/70 dark:bg-gray-900/70 backdrop-blur">
      <div className="container-fluid flex items-center justify-between h-16">
        <Link to="/" className="font-bold text-lg text-purple-600 dark:text-purple-400">
          Portfolio
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-2">
          {[
            { to: '/', label: 'Home' },
            { to: '/projects', label: 'Projects' },
            { to: '/skills', label: 'Skills' },
            { to: '/contact', label: 'Contact' },
          ].map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `${linkBase} ${isActive ? active : inactive}`
              }
            >
              {item.label}
            </NavLink>
          ))}

          <button
            onClick={toggleDark}
            className="ml-2 rounded-lg p-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
            aria-label="Toggle dark mode"
          >
            {isDark ? '🌙' : '☀️'}
          </button>
        </nav>

        {/* Mobile buttons */}
        <div className="flex md:hidden items-center gap-2">
            <button
              onClick={toggleDark}
              className="rounded-lg p-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
              aria-label="Toggle dark mode"
            >
              {isDark ? '🌙' : '☀️'}
            </button>
            <button
              onClick={() => setOpen(o => !o)}
              className="rounded-lg p-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
              aria-label="Menu"
            >
              {open ? '✕' : '☰'}
            </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-white/10 dark:border-gray-800 bg-white/90 dark:bg-gray-900/90 backdrop-blur">
          <nav className="flex flex-col px-4 py-3 gap-1">
            {[
              { to: '/', label: 'Home' },
              { to: '/projects', label: 'Projects' },
              { to: '/skills', label: 'Skills' },
              { to: '/contact', label: 'Contact' },
            ].map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `${linkBase} rounded ${isActive ? active : inactive}`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}