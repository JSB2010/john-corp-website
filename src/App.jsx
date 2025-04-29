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

// Components
import { Header } from './components/Header'
import { Footer } from './components/Footer'

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header />

        {/* Main Content */}
        <main className="flex-grow pt-16">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/filmmaking" element={<Filmmaking />} />
            <Route path="/about" element={<About />} />
            <Route path="/founder" element={<Founder />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/payments" element={<Payments />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  )
}

export default App
