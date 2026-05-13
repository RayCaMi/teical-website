import { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';

type ThemeMode = 'light' | 'dark';

export function Navbar() {
  const [top, setTop] = useState(true);
  const [theme, setTheme] = useState<ThemeMode>('light');
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const storedTheme = window.localStorage.getItem('theme') as ThemeMode | null;
    const initialTheme = storedTheme ?? 'light';
    setTheme(initialTheme);
    document.documentElement.dataset.theme = initialTheme;
  }, []);

  useEffect(() => {
    const scrollHandler = () => {
      window.pageYOffset > 10 ? setTop(false) : setTop(true);
    };
    window.addEventListener('scroll', scrollHandler);
    return () => window.removeEventListener('scroll', scrollHandler);
  }, []);

  const toggleTheme = () => {
    const nextTheme: ThemeMode = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    document.documentElement.dataset.theme = nextTheme;
    window.localStorage.setItem('theme', nextTheme);
  };

  const isDark = theme === 'dark';

  const baseLink = "text-sm px-3 py-2 transition-colors duration-200 text-gray-300 hover:text-secondary";
  const activeLink = "text-secondary font-bold border-b-2 border-secondary";

  return (
    <header className={`sticky top-0 w-full z-50 transition-all duration-300 ease-in-out ${!top ? 'bg-primary-dark/90 backdrop-blur-md shadow-lg py-3' : 'bg-primary-dark py-3'}`}>
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between gap-4">
          <div className="shrink-0">
            <Link to="/" className="flex items-center gap-3">
              <img src="/logo.svg" alt="Teical Logo" className="w-10 h-10 object-contain" />
            </Link>
          </div>

          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 p-2 text-white hover:bg-white/10 transition"
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? 'Fechar menu' : 'Abrir menu'}
            onClick={() => setMobileOpen(prev => !prev)}
          >
            <span className="sr-only">Toggle navigation</span>
            <div className="space-y-1">
              <span className={`block h-0.5 w-5 bg-white transition-transform ${mobileOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
              <span className={`block h-0.5 w-5 bg-white transition-opacity ${mobileOpen ? 'opacity-0' : 'opacity-100'}`} />
              <span className={`block h-0.5 w-5 bg-white transition-transform ${mobileOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
            </div>
          </button>

          <nav className="hidden md:flex grow justify-center">
            <ul className="flex items-center gap-3">
              <li>
                <NavLink
                  to="/imoveis"
                  className={({ isActive }) => `${baseLink} ${isActive ? activeLink : 'text-gray-300'}`}
                >
                  Imóveis
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/noticias"
                  className={({ isActive }) => `${baseLink} ${isActive ? activeLink : 'text-gray-300'}`}
                >
                  Notícias
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/quem-somos"
                  className={({ isActive }) => `${baseLink} ${isActive ? activeLink : 'text-gray-300'}`}
                >
                  Quem somos
                </NavLink>
              </li>
            </ul>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <Link to="/login" className="btn-primary py-2 px-5 text-sm font-bold">
              Entrar
            </Link>
            <Link to="/seja-membro" className="btn-primary text-secondary outline-2 outline-secondary bg-transparent hover:bg-secondary/30 py-2 px-5 text-sm font-bold">
              Seja Membro
            </Link>
            <button
              type="button"
              aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
              onClick={toggleTheme}
              className={`relative w-12 h-6 rounded-full transition-colors duration-500 focus:outline-none ${isDark ? 'bg-primary-light' : 'bg-secondary-light'}`}
            >
              <span
                className={`absolute top-1 left-1 w-4 h-4 rounded-full shadow transition-transform duration-300 flex items-center justify-center ${isDark ? 'translate-x-6 bg-gray-900' : 'translate-x-0 bg-yellow-300'}`}
              >
                {isDark ? (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-2.5 h-2.5 text-yellow-200">
                    <path fillRule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-2.5 h-2.5 text-yellow-600">
                    <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.166 17.834a.75.75 0 00-1.06 1.06l1.59 1.591a.75.75 0 001.061-1.06l-1.59-1.591zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.166 6.166a.75.75 0 001.06 1.06l1.591-1.59a.75.75 0 00-1.06-1.061L6.166 6.166z" />
                  </svg>
                )}
              </span>
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="mt-4 rounded-3xl border border-white/10 bg-primary-dark/95 p-4 shadow-xl md:hidden">
            <ul className="flex flex-col gap-3">
              <li>
                <NavLink
                  to="/imoveis"
                  className={({ isActive }) => `block rounded-xl px-4 py-2 ${isActive ? 'bg-secondary text-primary font-bold' : 'text-gray-300 hover:bg-white/10'}`}
                  onClick={() => setMobileOpen(false)}
                >
                  Imóveis
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/noticias"
                  className={({ isActive }) => `block rounded-xl px-4 py-2 ${isActive ? 'bg-secondary text-primary font-bold' : 'text-gray-300 hover:bg-white/10'}`}
                  onClick={() => setMobileOpen(false)}
                >
                  Notícias
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/quem-somos"
                  className={({ isActive }) => `block rounded-xl px-4 py-2 ${isActive ? 'bg-secondary text-primary font-bold' : 'text-gray-300 hover:bg-white/10'}`}
                  onClick={() => setMobileOpen(false)}
                >
                  Quem somos
                </NavLink>
              </li>
              <li>
                <Link to="/login" className="block rounded-xl bg-secondary px-4 py-2 text-primary font-bold text-center" onClick={() => setMobileOpen(false)}>
                  Entrar
                </Link>
              </li>
              <li>
                <Link to="/seja-membro" className="block rounded-xl border border-secondary px-4 py-2 text-secondary text-center hover:bg-secondary/20" onClick={() => setMobileOpen(false)}>
                  Seja Membro
                </Link>
              </li>
              <li>
                <button
                  type="button"
                  onClick={toggleTheme}
                  className="w-full rounded-xl border border-white/10 px-4 py-2 text-left text-gray-300 hover:bg-white/10"
                >
                  Alternar tema
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </header>
  );
}