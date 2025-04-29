import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import '../src/styles/global.css'

// Components
import { Navigation } from './components/navigation'
import { Footer } from './components/footer'

// Pages
import Home from './pages/Home'
import Products from './pages/Products'
import Filmmaking from './pages/Filmmaking'
import About from './pages/About'
import Contact from './pages/Contact'
import Payments from './pages/Payments'
import Founder from './pages/Founder'
import Test from './pages/Test'

function App() {
  return (
    <Router>
      <div className="flex min-h-screen flex-col">
        <Navigation />

        {/* Main Content */}
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/filmmaking" element={<Filmmaking />} />
            <Route path="/about" element={<About />} />
            <Route path="/founder" element={<Founder />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/payments" element={<Payments />} />
            <Route path="/test" element={<Test />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  )
}

export default App
