import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [scrollDirection, setScrollDirection] = useState('none');
  const [lastScrollY, setLastScrollY] = useState(0);
  const headerRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  // Handle scroll effects for header
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Determine scroll direction
      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setScrollDirection('down');
      } else if (currentScrollY < lastScrollY) {
        setScrollDirection('up');
      }

      // Set scrolled state for background opacity
      if (currentScrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  // Disable body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  // Handle escape key to close mobile menu
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  return (
    <header
      ref={headerRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-black/90 backdrop-blur-md shadow-md' : 'bg-black/70'
      } ${
        scrollDirection === 'down' && !isMenuOpen ? '-translate-y-full' : 'translate-y-0'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center z-50 relative">
            <span className="text-white font-semibold text-xl animate-fade-in">JOHN CORP</span>
          </Link>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-white p-2 z-50 relative focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            <div className="w-6 h-6 relative">
              <span
                className={`absolute h-0.5 w-6 bg-white transform transition-all duration-300 ease-in-out ${
                  isMenuOpen ? 'rotate-45 top-3' : 'rotate-0 top-1'
                }`}
              ></span>
              <span
                className={`absolute h-0.5 bg-white transform transition-all duration-300 ease-in-out ${
                  isMenuOpen ? 'w-0 opacity-0 left-3' : 'w-6 opacity-100 left-0'
                } top-3`}
              ></span>
              <span
                className={`absolute h-0.5 w-6 bg-white transform transition-all duration-300 ease-in-out ${
                  isMenuOpen ? '-rotate-45 top-3' : 'rotate-0 top-5'
                }`}
              ></span>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {[
              { to: '/products', label: 'Products' },
              { to: '/about', label: 'About' },
              { to: '/founder', label: 'Founder' },
              { to: '/filmmaking', label: 'Films' },
              { to: '/contact', label: 'Contact' },
              { to: '/games', label: 'Games' }
            ].map((item, index) => (
              <Link
                key={item.to}
                to={item.to}
                className={`text-white hover:text-gray-300 transition-all duration-300 relative overflow-hidden group ${
                  location.pathname === item.to ? 'font-medium' : ''
                }`}
              >
                <span className="relative z-10 block">{item.label}</span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}

            <Link
              to="/payments"
              className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2.5 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
            >
              Shop Now
            </Link>

            {currentUser ? (
              <button
                onClick={handleLogout}
                className="border border-white text-white hover:bg-white hover:text-black px-5 py-2.5 rounded-full transition-all duration-300 transform hover:scale-105"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                className="border border-white text-white hover:bg-white hover:text-black px-5 py-2.5 rounded-full transition-all duration-300 transform hover:scale-105"
              >
                Login
              </Link>
            )}
          </nav>
        </div>
      </div>

      {/* Mobile Navigation - Full Screen Overlay */}
      <div
        className={`md:hidden fixed inset-0 bg-black/95 backdrop-blur-lg z-40 transition-all duration-500 ${
          isMenuOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex flex-col h-full justify-center px-6 pb-6 overflow-auto">
          <nav className="flex flex-col space-y-8 text-center">
            {[
              { to: '/products', label: 'Products' },
              { to: '/about', label: 'About' },
              { to: '/founder', label: 'Founder' },
              { to: '/filmmaking', label: 'Films' },
              { to: '/contact', label: 'Contact' },
              { to: '/games', label: 'Games' }
            ].map((item, index) => (
              <Link
                key={item.to}
                to={item.to}
                className={`text-white text-2xl font-light transition-all duration-300 transform ${
                  isMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                } ${location.pathname === item.to ? 'font-normal' : ''}`}
                style={{ transitionDelay: `${index * 50 + 100}ms` }}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}

            <div className="pt-8 flex flex-col space-y-4 items-center">
              <Link
                to="/payments"
                className={`bg-blue-500 hover:bg-blue-600 text-white w-full max-w-xs py-3.5 rounded-full transition-all duration-300 transform ${
                  isMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                }`}
                style={{ transitionDelay: '450ms' }}
                onClick={() => setIsMenuOpen(false)}
              >
                Shop Now
              </Link>

              {currentUser ? (
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className={`border border-white text-white hover:bg-white hover:text-black w-full max-w-xs py-3.5 rounded-full transition-all duration-300 transform ${
                    isMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                  }`}
                  style={{ transitionDelay: '500ms' }}
                >
                  Logout
                </button>
              ) : (
                <Link
                  to="/login"
                  className={`border border-white text-white hover:bg-white hover:text-black w-full max-w-xs py-3.5 rounded-full transition-all duration-300 transform ${
                    isMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                  }`}
                  style={{ transitionDelay: '500ms' }}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
              )}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
