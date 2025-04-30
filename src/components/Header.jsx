import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
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



  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-black/90 backdrop-blur-md' : 'bg-black/70'}`}>
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-white font-semibold text-xl">JOHN CORP</span>
          </Link>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-white p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
              />
            </svg>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/products" className={`text-white hover:text-gray-300 transition-colors ${location.pathname === '/products' ? 'font-medium' : ''}`}>
              Products
            </Link>
            <Link to="/about" className={`text-white hover:text-gray-300 transition-colors ${location.pathname === '/about' ? 'font-medium' : ''}`}>
              About
            </Link>
            <Link to="/founder" className={`text-white hover:text-gray-300 transition-colors ${location.pathname === '/founder' ? 'font-medium' : ''}`}>
              Founder
            </Link>
            <Link to="/filmmaking" className={`text-white hover:text-gray-300 transition-colors ${location.pathname === '/filmmaking' ? 'font-medium' : ''}`}>
              Films
            </Link>
            <Link to="/contact" className={`text-white hover:text-gray-300 transition-colors ${location.pathname === '/contact' ? 'font-medium' : ''}`}>
              Contact
            </Link>
            <Link to="/games" className={`text-white hover:text-gray-300 transition-colors ${location.pathname === '/games' ? 'font-medium' : ''}`}>
              Games
            </Link>
            <Link to="/payments" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full transition-colors">
              Shop Now
            </Link>

            {currentUser ? (
              <button
                onClick={handleLogout}
                className="border border-white text-white hover:bg-white hover:text-black px-4 py-2 rounded-full transition-colors"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                className="border border-white text-white hover:bg-white hover:text-black px-4 py-2 rounded-full transition-colors"
              >
                Login
              </Link>
            )}
          </nav>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className={`md:hidden fixed inset-0 bg-black z-40 transition-transform duration-300 transform ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full pt-20 px-6 pb-6">
          <nav className="flex flex-col space-y-6 text-center">
            <Link
              to="/products"
              className={`text-white text-xl ${location.pathname === '/products' ? 'font-medium' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Products
            </Link>
            <Link
              to="/about"
              className={`text-white text-xl ${location.pathname === '/about' ? 'font-medium' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <Link
              to="/founder"
              className={`text-white text-xl ${location.pathname === '/founder' ? 'font-medium' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Founder
            </Link>
            <Link
              to="/filmmaking"
              className={`text-white text-xl ${location.pathname === '/filmmaking' ? 'font-medium' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Films
            </Link>
            <Link
              to="/contact"
              className={`text-white text-xl ${location.pathname === '/contact' ? 'font-medium' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
            <Link
              to="/games"
              className={`text-white text-xl ${location.pathname === '/games' ? 'font-medium' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Games
            </Link>

            <div className="pt-6 flex flex-col space-y-4">
              <Link
                to="/payments"
                className="bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-full transition-colors"
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
                  className="border border-white text-white hover:bg-white hover:text-black py-3 rounded-full transition-colors"
                >
                  Logout
                </button>
              ) : (
                <Link
                  to="/login"
                  className="border border-white text-white hover:bg-white hover:text-black py-3 rounded-full transition-colors"
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
