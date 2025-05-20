import React, { useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

const STOCK_LIMITS = {
  1: 10, // Original Formula stock
  2: 5,  // Advanced Formula stock
  3: 8   // Quick Formula stock
};

const productData = [
  {
    id: 1,
    name: 'Jizz Tech Original Formula',
    description: 'Our original adhesive product, perfect for general-purpose applications.',
    price: 19.99,
    image: 'product-image-placeholder',
    badge: 'Best Seller',
    badgeColor: 'bg-apple-blue'
  },
  {
    id: 2,
    name: 'Jizz Tech Advanced Formula',
    description: 'Industrial-grade adhesive for professional and heavy-duty applications.',
    price: 29.99,
    image: 'product-image-placeholder',
    badge: 'Premium',
    badgeColor: 'bg-apple-purple'
  },
  {
    id: 3,
    name: 'Jizz Tech Quick',
    description: 'Ultra-fast setting formula for time-sensitive projects.',
    price: 24.99,
    image: 'product-image-placeholder',
    badge: 'New',
    badgeColor: 'bg-apple-green'
  }
];

const features = [
  {
    title: 'Superior Strength',
    description: 'Bonds with incredible strength, creating connections that last a lifetime even under extreme conditions.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    )
  },
  {
    title: 'Quick Setting',
    description: 'Sets in seconds, allowing for rapid project completion without long wait times.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  },
  {
    title: 'Versatile Application',
    description: 'Works on wood, metal, plastic, ceramic, glass, and more - the only adhesive you\'ll ever need.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    )
  },
  {
    title: 'Water Resistant',
    description: 'Maintains bond integrity even when exposed to moisture and humid environments.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
      </svg>
    )
  },
  {
    title: 'Temperature Stable',
    description: 'Performs reliably in extreme temperatures from -40°F to 300°F.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
      </svg>
    )
  },
  {
    title: 'Eco-Friendly',
    description: 'Formulated with environmentally conscious ingredients and minimal VOCs.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    )
  }
];

function Products() {
  const { addToCart, cart } = useCart();

  // Add scroll reveal effect
  useEffect(() => {
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');

    const revealOnScroll = () => {
      for (const element of revealElements) {
        const windowHeight = window.innerHeight;
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;

        if (elementTop < windowHeight - elementVisible) {
          element.classList.add('active');
        }
      }
    };

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Initial check

    return () => window.removeEventListener('scroll', revealOnScroll);
  }, []);

  const handleAddToCart = (product) => {
    const currentQuantity = cart.find(item => item.id === product.id)?.quantity || 0;
    const stockLimit = STOCK_LIMITS[product.id];

    if (currentQuantity >= stockLimit) {
      alert(`Sorry, only ${stockLimit} units available`);
      return;
    }

    addToCart(product);
    alert(`${product.name} added to cart!`);
  };

  return (
    <div className="bg-white">
      {/* Hero Section - Apple Style */}
      <div className="hero hero-gradient min-h-[70vh] flex items-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/90 to-black/70 z-0"></div>
        <div className="hero-content-wrapper container py-32 px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="hero-title animate-fadeIn">Jizz Tech Adhesive</h1>
            <p className="hero-subtitle animate-fadeIn delay-200">
              The revolutionary adhesive technology that bonds virtually anything.
              Engineered for strength, designed for versatility.
            </p>
            <div className="flex flex-wrap justify-center gap-6 mt-10 animate-fadeIn delay-400">
              <a href="#products" className="btn btn-primary btn-lg hover-lift py-4 px-8">
                View Products
              </a>
              <button className="btn btn-outline text-white border-white hover-lift py-4 px-8">
                Request a Sample
              </button>
            </div>
          </div>
        </div>

        {/* Animated scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>

      {/* Product Overview - Apple Style */}
      <div className="section-xl">
        <div className="container px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="reveal-left">
              <div className="bg-gray-100 rounded-2xl h-[400px] flex items-center justify-center shadow-lg overflow-hidden">
                <p className="text-gray-500 font-semibold text-xl">Jizz Tech Product Image</p>
              </div>
            </div>
            <div className="reveal-right">
              <h2 className="apple-section-title text-left">What Makes Jizz Tech Special</h2>
              <div className="w-16 h-1 bg-apple-blue mb-6"></div>
              <p className="text-gray-700 mb-6 leading-relaxed text-lg">
                Jizz Tech is our proprietary adhesive formula that provides unmatched bonding strength for virtually any material.
                Developed through years of research and innovation, it represents the pinnacle of adhesive technology.
              </p>
              <p className="text-gray-700 mb-8 leading-relaxed text-lg">
                Whether you're working on industrial applications, construction projects, or household repairs,
                Jizz Tech delivers exceptional results every time.
              </p>
              <div className="flex gap-4">
                <div className="apple-tag apple-tag-blue">Industrial Strength</div>
                <div className="apple-tag apple-tag-green">Eco-Friendly</div>
                <div className="apple-tag apple-tag-red">Fast Setting</div>
              </div>
              <div className="mt-8">
                <button className="btn btn-primary btn-lg hover-lift">
                  Request a Sample
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Features - Apple Style */}
      <div className="section-xl bg-gray-50">
        <div className="container px-6">
          <div className="text-center mb-20 reveal-scale">
            <h2 className="apple-section-title">Key Features</h2>
            <p className="apple-section-subtitle">
              Discover what makes Jizz Tech the most advanced adhesive solution on the market.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="card card-hover p-6 reveal"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-12 h-12 bg-gradient-blue rounded-full flex items-center justify-center mb-4 text-white">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-gradient-blue">{feature.title}</h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Product Lineup - Apple Style */}
      <div className="section-xl" id="products">
        <div className="container px-6">
          <div className="text-center mb-20 reveal-scale">
            <h2 className="apple-section-title">Jizz Tech Products</h2>
            <p className="apple-section-subtitle">
              Choose the perfect adhesive solution for your specific needs.
            </p>
            <div className="apple-divider"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {productData.map((product, index) => (
              <div key={product.id} className="product-card shadow-md rounded-xl overflow-hidden reveal" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className={`product-badge absolute top-4 right-4 px-3 py-1 rounded-full text-white text-sm font-medium ${product.badgeColor}`}>{product.badge}</div>
                <div className="bg-gray-100 h-48 flex items-center justify-center">
                  <p className="text-gray-500 font-semibold">{product.name}</p>
                </div>
                <div className="product-content p-6">
                  <h3 className="text-xl font-bold mb-2">{product.name}</h3>
                  <p className="text-lg font-medium text-blue-600 mb-3">${product.price}</p>
                  <p className="text-gray-600 mb-4">{product.description}</p>
                  <div className="flex justify-between items-center mb-4">
                    <p className="text-sm text-gray-500">
                      Stock: <span className="font-semibold">{STOCK_LIMITS[product.id]} units</span>
                    </p>
                  </div>
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="btn btn-primary w-full py-3 rounded-lg hover-lift transition-all duration-300"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section - Apple Style */}
      <div className="section-xl bg-black text-white py-32">
        <div className="container px-6">
          <div className="apple-cta mx-auto max-w-4xl reveal-scale">
            <h2 className="apple-cta-title text-4xl">Ready to Experience the Strength of Jizz Tech?</h2>
            <p className="apple-cta-text text-white text-xl">
              Join thousands of satisfied customers who trust our revolutionary adhesive technology.
              Discover the perfect solution for your bonding needs today.
            </p>
            <Link to="/contact" className="btn btn-primary btn-lg hover-lift py-4 px-10 text-lg">
              Contact Sales Team
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Products;
