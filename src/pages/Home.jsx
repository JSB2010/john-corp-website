import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'

function Home() {

  useEffect(() => {
    // Function to handle scroll animations
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const elementVisible = 150;

      // Get all elements with reveal classes
      const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');

      revealElements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementBottom = element.getBoundingClientRect().bottom;

        // Add 'active' class when scrolling down and element comes into view
        if (elementTop < windowHeight - elementVisible) {
          element.classList.add('active');
        }
        // Remove 'active' class when element is out of view (for scrolling up animation)
        else if (elementTop > windowHeight || elementBottom < 0) {
          element.classList.remove('active');
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="bg-white">
      {/* Hero Section - Apple Style */}
      <div className="hero hero-gradient min-h-[90vh] flex items-center relative overflow-hidden mt-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black/90 to-black/70 z-0"></div>
        <div className="hero-content-wrapper container py-32 px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="hero-title animate-fadeIn text-white text-6xl">JOHN CORP</h1>
            <p className="hero-subtitle animate-fadeIn delay-200 text-white text-xl font-medium">
              Innovating with our revolutionary adhesive technology since 1634. Creating bonds that last.
            </p>
            <div className="flex flex-wrap justify-center gap-6 mt-10 animate-fadeIn delay-400">
              <Link to="/products" className="btn btn-primary btn-lg hover-lift py-4 px-8">
                Explore Jizz Tech
              </Link>
              <Link to="/filmmaking" className="btn btn-outline text-white border-white hover-lift py-4 px-8">
                View Our Films
              </Link>
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

      {/* Features Section - Apple Style */}
      <div className="section-xl pt-16">
        <div className="container px-6">
          <div className="text-center mb-12 reveal-scale">
            <h2 className="apple-section-title">What We Do</h2>
            <p className="apple-section-subtitle">
              At John Corp, we combine cutting-edge adhesive technology with creative storytelling to deliver exceptional products and experiences.
            </p>
            <div className="apple-divider"></div>
          </div>

          <div className="grid md:grid-cols-2 gap-16">
            <div className="card card-hover p-10 reveal-left">
              <div className="w-16 h-16 bg-gradient-blue rounded-full flex items-center justify-center mb-8 shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-6 text-gradient-blue">Jizz Tech Adhesive</h3>
              <p className="text-gray-600 mb-8 leading-relaxed text-lg">
                Our revolutionary adhesive technology provides unmatched bonding strength for all your needs.
                From industrial applications to everyday household use, Jizz Tech delivers exceptional results.
              </p>
              <Link to="/products" className="btn-icon inline-flex items-center font-semibold text-blue hover:underline text-lg">
                Learn more about Jizz Tech
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>

            <div className="card card-hover p-10 reveal-right">
              <div className="w-16 h-16 bg-gradient-blue rounded-full flex items-center justify-center mb-8 shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-6 text-gradient-blue">Filmmaking Division</h3>
              <p className="text-gray-600 mb-8 leading-relaxed text-lg">
                Our talented team of filmmakers creates compelling visual stories that captivate audiences.
                From commercials to documentaries, we bring creative visions to life.
              </p>
              <Link to="/filmmaking" className="btn-icon inline-flex items-center font-semibold text-blue hover:underline text-lg">
                Explore our filmmaking projects
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials - Apple Style */}
      <div className="section-xl bg-gray-50">
        <div className="container px-6">
          <div className="text-center mb-12 reveal-scale">
            <h2 className="apple-section-title">What Our Customers Say</h2>
            <p className="apple-section-subtitle">
              Don't just take our word for it. Here's what our customers have to say about Jizz Tech.
            </p>
            <div className="apple-divider"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            <div className="testimonial reveal-left p-10">
              <p className="testimonial-text">
                Jizz Tech is the strongest adhesive I've ever used. It bonds instantly and holds forever! I've tried many products, but nothing compares to the reliability of Jizz Tech.
              </p>
              <div className="testimonial-author">
                <div className="w-14 h-14 bg-gray-200 rounded-full mr-4"></div>
                <div>
                  <p className="testimonial-name">Sarah Johnson</p>
                  <p className="testimonial-role">Professional Contractor</p>
                </div>
              </div>
            </div>

            <div className="testimonial reveal p-10">
              <p className="testimonial-text">
                The team at John Corp created an amazing promotional video for our business. Highly recommended! Their attention to detail and creative vision exceeded our expectations.
              </p>
              <div className="testimonial-author">
                <div className="w-14 h-14 bg-gray-200 rounded-full mr-4"></div>
                <div>
                  <p className="testimonial-name">Michael Chen</p>
                  <p className="testimonial-role">Business Owner</p>
                </div>
              </div>
            </div>

            <div className="testimonial reveal-right p-10">
              <p className="testimonial-text">
                I use Jizz Tech for all my DIY projects. Nothing else compares to its strength and reliability. It's become an essential part of my toolkit for any home improvement project.
              </p>
              <div className="testimonial-author">
                <div className="w-14 h-14 bg-gray-200 rounded-full mr-4"></div>
                <div>
                  <p className="testimonial-name">David Williams</p>
                  <p className="testimonial-role">DIY Enthusiast</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section - Apple Style */}
      <div className="section-xl bg-black text-white py-24">
        <div className="container px-6">
          <div className="apple-cta mx-auto max-w-4xl reveal-scale">
            <h2 className="apple-cta-title text-4xl">Ready to Experience the Strength of Jizz Tech?</h2>
            <p className="apple-cta-text text-white text-xl">
              Join thousands of satisfied customers who trust our revolutionary adhesive technology.
              Discover the perfect solution for your bonding needs today.
            </p>
            <Link to="/products" className="btn btn-primary btn-lg hover-lift py-4 px-10 text-lg">
              Shop Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
