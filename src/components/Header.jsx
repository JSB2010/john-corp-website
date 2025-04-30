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
    <header className={`nav fixed w-full transition-all duration-300 ${scrolled ? 'bg-black/90' : 'bg-black/80'} z-50`}>
      <div className="container mx-auto px-6">
        <div className="nav-container py-4">
          <Link to="/" className="nav-logo">
            JOHN CORP
          </Link>

          <button
            className="nav-mobile-toggle md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>

          <nav className={`nav-menu ${isMenuOpen ? 'open' : ''} md:flex`}>
            <Link to="/products" className={`nav-link ${location.pathname === '/products' ? 'active' : ''}`}>
              Products
            </Link>
            <Link to="/about" className={`nav-link ${location.pathname === '/about' ? 'active' : ''}`}>
              About
            </Link>
            <Link to="/founder" className={`nav-link ${location.pathname === '/founder' ? 'active' : ''}`}>
              Founder
            </Link>
            <Link to="/filmmaking" className={`nav-link ${location.pathname === '/filmmaking' ? 'active' : ''}`}>
              Films
            </Link>
            <Link to="/contact" className={`nav-link ${location.pathname === '/contact' ? 'active' : ''}`}>
              Contact
            </Link>
            <Link to="/games" className={`nav-link ${location.pathname === '/games' ? 'active' : ''}`}>
              Games
            </Link>
            <Link to="/payments" className="btn btn-primary ml-6 py-2 px-6 text-sm">
              Shop Now
            </Link>

            {currentUser ? (
              <button
                onClick={handleLogout}
                className="btn btn-outline text-white border-white ml-4 py-2 px-6 text-sm"
              >
                Logout
              </button>
            ) : (
              <Link to="/login" className="btn btn-outline text-white border-white ml-4 py-2 px-6 text-sm">
                Login
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
