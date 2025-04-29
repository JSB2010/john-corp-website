import React from 'react'
import { Link } from 'react-router-dom'

function Home() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="hero relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-80 z-0"></div>
        <div className="absolute inset-0 z-0">
          <div className="w-full h-full bg-gradient-to-r from-black to-gray-900"></div>
        </div>
        <div className="container py-24 px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center animate-fadeIn">
            <h1 className="text-5xl font-bold mb-6 tracking-tight">JOHN CORP</h1>
            <p className="text-xl mb-10 text-gray-300 max-w-2xl mx-auto">
              Innovating with our revolutionary adhesive technology since 1634. Creating bonds that last.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/products" className="btn-primary px-8 py-3 text-lg hover:shadow-xl transition transform hover:scale-105">
                Explore Jizz Tech
              </Link>
              <Link to="/filmmaking" className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-md text-lg font-semibold hover:bg-white hover:text-black transition transform hover:scale-105">
                View Our Films
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black to-transparent"></div>
      </div>

      {/* Features Section */}
      <div className="section">
        <div className="container px-4">
          <div className="text-center mb-16 animate-slideUp">
            <h2 className="text-4xl font-bold mb-4">What We Do</h2>
            <div className="w-24 h-1 bg-black mx-auto"></div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="card p-8 hover:shadow-xl transition">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4">Jizz Tech Adhesive</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Our revolutionary adhesive technology provides unmatched bonding strength for all your needs.
                From industrial applications to everyday household use, Jizz Tech delivers exceptional results.
              </p>
              <Link to="/products" className="inline-flex items-center font-semibold text-black hover:underline">
                Learn more about Jizz Tech
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>

            <div className="card p-8 hover:shadow-xl transition">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4">Filmmaking Division</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Our talented team of filmmakers creates compelling visual stories that captivate audiences.
                From commercials to documentaries, we bring creative visions to life.
              </p>
              <Link to="/filmmaking" className="inline-flex items-center font-semibold text-black hover:underline">
                Explore our filmmaking projects
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="section-light py-20">
        <div className="container px-4">
          <div className="text-center mb-16 animate-slideUp">
            <h2 className="text-4xl font-bold mb-4">What Our Customers Say</h2>
            <div className="w-24 h-1 bg-black mx-auto"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition relative">
              <div className="absolute -top-5 -left-5 w-10 h-10 bg-black text-white flex items-center justify-center text-2xl rounded-full">
                "
              </div>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Jizz Tech is the strongest adhesive I've ever used. It bonds instantly and holds forever! I've tried many products, but nothing compares to the reliability of Jizz Tech.
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-200 rounded-full mr-4"></div>
                <div>
                  <p className="font-bold">Sarah Johnson</p>
                  <p className="text-gray-500 text-sm">Professional Contractor</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition relative">
              <div className="absolute -top-5 -left-5 w-10 h-10 bg-black text-white flex items-center justify-center text-2xl rounded-full">
                "
              </div>
              <p className="text-gray-600 mb-6 leading-relaxed">
                The team at John Corp created an amazing promotional video for our business. Highly recommended! Their attention to detail and creative vision exceeded our expectations.
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-200 rounded-full mr-4"></div>
                <div>
                  <p className="font-bold">Michael Chen</p>
                  <p className="text-gray-500 text-sm">Business Owner</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition relative">
              <div className="absolute -top-5 -left-5 w-10 h-10 bg-black text-white flex items-center justify-center text-2xl rounded-full">
                "
              </div>
              <p className="text-gray-600 mb-6 leading-relaxed">
                I use Jizz Tech for all my DIY projects. Nothing else compares to its strength and reliability. It's become an essential part of my toolkit for any home improvement project.
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-200 rounded-full mr-4"></div>
                <div>
                  <p className="font-bold">David Williams</p>
                  <p className="text-gray-500 text-sm">DIY Enthusiast</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-black text-white py-20">
        <div className="container px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">Ready to Experience the Strength of Jizz Tech?</h2>
            <p className="text-xl mb-8 text-gray-300">
              Join thousands of satisfied customers who trust our revolutionary adhesive technology.
            </p>
            <Link to="/products" className="inline-block bg-white text-black px-8 py-3 rounded-md text-lg font-semibold hover:bg-gray-200 transition transform hover:scale-105">
              Shop Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
