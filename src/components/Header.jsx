import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeLink, setActiveLink] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const headerRef = useRef(null);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  // Handle scroll effect for transparent to solid header
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Set active link based on current location
  useEffect(() => {
    setActiveLink(location.pathname);
  }, [location]);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  return (
    <header
      ref={headerRef}
      className={`apple-nav ${scrolled ? 'apple-nav-solid' : 'apple-nav-transparent'} transition-all duration-500`}
    >
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between py-4">
          <Link
            to="/"
            className="nav-logo text-white font-semibold text-xl tracking-tight hover:opacity-80 transition-opacity duration-300"
          >
            <span className="gradient-text gradient-text-blue">JOHN CORP</span>
          </Link>

          <button
            className="md:hidden relative z-50 w-10 h-10 flex items-center justify-center"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <div className="relative w-6 h-5">
              <span
                className={`absolute h-0.5 w-full bg-white transform transition-all duration-300 ease-in-out ${isMenuOpen ? 'rotate-45 top-2' : 'top-0'}`}
              ></span>
              <span
                className={`absolute h-0.5 w-full bg-white transform transition-all duration-300 ease-in-out ${isMenuOpen ? 'opacity-0' : 'top-2'}`}
              ></span>
              <span
                className={`absolute h-0.5 w-full bg-white transform transition-all duration-300 ease-in-out ${isMenuOpen ? '-rotate-45 top-2' : 'top-4'}`}
              ></span>
            </div>
          </button>

          <div
            className={`fixed md:relative top-0 left-0 w-full h-screen md:h-auto bg-black md:bg-transparent z-40 transform transition-transform duration-500 ease-in-out ${
              isMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
            } md:flex md:items-center`}
          >
            <nav className="h-full flex flex-col md:flex-row items-center justify-center md:justify-end space-y-8 md:space-y-0 md:space-x-6">
              {[
                { path: '/products', label: 'Products' },
                { path: '/about', label: 'About' },
                { path: '/founder', label: 'Founder' },
                { path: '/filmmaking', label: 'Films' },
                { path: '/contact', label: 'Contact' },
                { path: '/games', label: 'Games' },
              ].map((item, index) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative text-white text-lg md:text-base font-medium transition-all duration-300 hover:opacity-100 ${
                    location.pathname === item.path ? 'opacity-100' : 'opacity-70'
                  }`}
                  style={{
                    transitionDelay: `${isMenuOpen ? index * 100 : 0}ms`,
                    transform: `${isMenuOpen ? 'translateY(0)' : 'translateY(20px)'}`,
                    opacity: `${isMenuOpen ? '1' : '0'}`,
                  }}
                >
                  {item.label}
                  {location.pathname === item.path && (
                    <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-white rounded-full transform origin-left transition-transform duration-300"></span>
                  )}
                </Link>
              ))}

              <Link
                to="/payments"
                className="apple-btn apple-btn-primary px-6 py-2 text-sm font-medium"
                style={{
                  transitionDelay: `${isMenuOpen ? 600 : 0}ms`,
                  transform: `${isMenuOpen ? 'translateY(0)' : 'translateY(20px)'}`,
                  opacity: `${isMenuOpen ? '1' : '0'}`,
                }}
              >
                Shop Now
              </Link>

              {currentUser ? (
                <button
                  onClick={handleLogout}
                  className="apple-btn apple-btn-outline px-6 py-2 text-sm font-medium"
                  style={{
                    transitionDelay: `${isMenuOpen ? 700 : 0}ms`,
                    transform: `${isMenuOpen ? 'translateY(0)' : 'translateY(20px)'}`,
                    opacity: `${isMenuOpen ? '1' : '0'}`,
                  }}
                >
                  Logout
                </button>
              ) : (
                <Link
                  to="/login"
                  className="apple-btn apple-btn-outline px-6 py-2 text-sm font-medium"
                  style={{
                    transitionDelay: `${isMenuOpen ? 700 : 0}ms`,
                    transform: `${isMenuOpen ? 'translateY(0)' : 'translateY(20px)'}`,
                    opacity: `${isMenuOpen ? '1' : '0'}`,
                  }}
                >
                  Login
                </Link>
              )}
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
