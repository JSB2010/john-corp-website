import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './styles/global.css'
import './apple-styles.css'
import './animations.css'

// Pages
import Home from './pages/Home'
import Products from './pages/Products'
import Filmmaking from './pages/Filmmaking'
import About from './pages/About'
import Contact from './pages/Contact'
import Payments from './pages/Payments'
import Founder from './pages/Founder'
import Login from './pages/Login'

// Components
import { Header } from './components/Header'
import { Footer } from './components/Footer'
import PrivateRoute from './components/PrivateRoute'

// Context
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
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
