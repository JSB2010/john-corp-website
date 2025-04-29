import React from 'react'
import { Link } from 'react-router-dom'

function Home() {
  return (
    <div className="container mx-auto p-8">
      <div className="bg-black text-white p-16 rounded-lg mb-8">
        <h1 className="text-4xl font-bold mb-4">JOHN CORP</h1>
        <p className="text-xl mb-8">Innovating with our revolutionary adhesive technology since 1634. Creating bonds that last.</p>
        <div className="flex gap-4">
          <Link to="/products" className="bg-white text-black px-6 py-3 rounded-md font-medium">
            Explore Jizz Tech
          </Link>
          <Link to="/filmmaking" className="border border-white px-6 py-3 rounded-md font-medium">
            View Our Films
          </Link>
        </div>
      </div>

      <h2 className="text-3xl font-bold text-center mb-8">What We Do</h2>

      <div className="grid md:grid-cols-2 gap-8 mb-16">
        <div className="border rounded-lg p-6 shadow-md">
          <h3 className="text-2xl font-bold mb-4">Jizz Tech Adhesive</h3>
          <p className="text-gray-600 mb-4">
            Our revolutionary adhesive technology provides unmatched bonding strength for all your needs.
            From industrial applications to everyday household use, Jizz Tech delivers exceptional results.
          </p>
          <Link to="/products" className="text-blue-600 font-medium">
            Learn more about Jizz Tech →
          </Link>
        </div>

        <div className="border rounded-lg p-6 shadow-md">
          <h3 className="text-2xl font-bold mb-4">Filmmaking Division</h3>
          <p className="text-gray-600 mb-4">
            Our talented team of filmmakers creates compelling visual stories that captivate audiences.
            From commercials to documentaries, we bring creative visions to life.
          </p>
          <Link to="/filmmaking" className="text-blue-600 font-medium">
            Explore our filmmaking projects →
          </Link>
        </div>
      </div>

      <div className="bg-gray-100 p-8 rounded-lg mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">What Our Customers Say</h2>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md">
              <p className="mb-4 text-gray-600">"{testimonial.content}"</p>
              <div>
                <p className="font-medium">{testimonial.name}</p>
                <p className="text-sm text-gray-500">{testimonial.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-black text-white p-16 rounded-lg text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Experience the Strength of Jizz Tech?</h2>
        <p className="text-xl mb-8">Join thousands of satisfied customers who trust our revolutionary adhesive technology.</p>
        <Link to="/products" className="bg-white text-black px-6 py-3 rounded-md font-medium inline-block">
          Shop Now
        </Link>
      </div>
    </div>
  )
}

// Testimonial data
const testimonials = [
  {
    content: "Jizz Tech is the strongest adhesive I've ever used. It bonds instantly and holds forever! I've tried many products, but nothing compares to the reliability of Jizz Tech.",
    name: "Sarah Johnson",
    title: "Professional Contractor"
  },
  {
    content: "The team at John Corp created an amazing promotional video for our business. Highly recommended! Their attention to detail and creative vision exceeded our expectations.",
    name: "Michael Chen",
    title: "Business Owner"
  },
  {
    content: "I use Jizz Tech for all my DIY projects. Nothing else compares to its strength and reliability. It's become an essential part of my toolkit for any home improvement project.",
    name: "David Williams",
    title: "DIY Enthusiast"
  }
]

export default Home
