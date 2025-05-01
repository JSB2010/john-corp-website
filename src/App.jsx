import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import './styles/global.css'
import './apple-styles.css'
import './styles/modern-apple.css'
import './styles/animations.css'
import { initScrollAnimations, initParallaxEffect } from './utils/animationUtils'

// Pages
import Home from './pages/Home'
import Products from './pages/Products'
import Filmmaking from './pages/Filmmaking'
import About from './pages/About'
import Contact from './pages/Contact'
import Payments from './pages/Payments'
import Founder from './pages/Founder'
import Login from './pages/Login'
import Games from './pages/Games'

// Components
import { Header } from './components/Header'
import { Footer } from './components/Footer'
import PrivateRoute from './components/PrivateRoute'
import ScrollToTop from './components/ScrollToTop'

// Context
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'

function App() {
  // Initialize animations when component mounts
  useEffect(() => {
    // Set the title when the component mounts
    document.title = 'John Corp - Revolutionary Adhesive Technology';

    // Function to add active class with delay
    const addActiveClassWithDelay = (element, delay) => {
      setTimeout(() => {
        element.classList.add('active');
      }, delay);
    };

    // Initialize scroll animations for existing elements
    const handleScroll = () => {
      const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .footer-animate');
      const windowHeight = window.innerHeight;

      reveals.forEach((element, index) => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;

        if (elementTop < windowHeight - elementVisible) {
          // Add active class with staggered delay
          addActiveClassWithDelay(element, index * 50);
        } else {
          element.classList.remove('active');
        }
      });
    };

    // Initialize new scroll animations
    const scrollObserver = initScrollAnimations('.scroll-animate');

    // Initialize parallax effects for elements with parallax class
    const cleanupParallax = initParallaxEffect('.parallax');

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Check on initial load

    // Cleanup on unmount
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollObserver) {
        scrollObserver.disconnect();
      }
      if (cleanupParallax) {
        cleanupParallax();
      }
    };
  }, []);

  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <ScrollToTop />
          <div className="flex flex-col min-h-screen">
            <Header />

            {/* Main Content */}
            <main className="flex-grow pt-16">
              <Routes>
                <Route path="/login" element={<Login />} />

                <Route path="/" element={
                  <PrivateRoute>
                    <Home />
                  </PrivateRoute>
                } />

                <Route path="/products" element={
                  <PrivateRoute>
                    <Products />
                  </PrivateRoute>
                } />

                <Route path="/filmmaking" element={
                  <PrivateRoute>
                    <Filmmaking />
                  </PrivateRoute>
                } />

                <Route path="/about" element={
                  <PrivateRoute>
                    <About />
                  </PrivateRoute>
                } />

                <Route path="/founder" element={
                  <PrivateRoute>
                    <Founder />
                  </PrivateRoute>
                } />

                <Route path="/contact" element={
                  <PrivateRoute>
                    <Contact />
                  </PrivateRoute>
                } />

                <Route path="/payments" element={
                  <PrivateRoute>
                    <Payments />
                  </PrivateRoute>
                } />

                <Route path="/games" element={
                  <PrivateRoute>
                    <Games />
                  </PrivateRoute>
                } />
              </Routes>
            </main>

            <Footer />
          </div>
        </CartProvider>
      </AuthProvider>
    </Router>
  )
}

export default App
