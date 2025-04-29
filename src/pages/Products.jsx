import React from 'react'
import { ShoppingCart } from 'lucide-react'

function Products() {
  return (
    <div className="container mx-auto p-8">
      {/* Hero Section */}
      <div className="bg-black text-white p-16 rounded-lg mb-8">
        <h1 className="text-4xl font-bold mb-4">Jizz Tech Adhesive</h1>
        <p className="text-xl">The revolutionary adhesive technology that bonds virtually anything.</p>
      </div>

      {/* Product Overview */}
      <div className="mb-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="bg-gray-100 aspect-square rounded-lg flex items-center justify-center">
            <p className="text-gray-500 text-xl font-medium">Jizz Tech Product Image</p>
          </div>

          <div>
            <h2 className="text-3xl font-bold mb-6">What Makes Jizz Tech Special</h2>
            <div className="space-y-4 text-gray-600">
              <p>
                Jizz Tech is our proprietary adhesive formula that provides unmatched bonding strength for virtually any material.
                Developed through years of research and innovation, our adhesive technology has revolutionized the industry.
              </p>
              <p>
                Whether you're a professional contractor, DIY enthusiast, or industrial manufacturer, Jizz Tech offers the
                reliability and performance you need for your most demanding projects.
              </p>
              <div className="pt-6">
                <button className="bg-black text-white px-6 py-3 rounded-md font-medium hover:bg-gray-800">
                  Request a Sample
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Key Features */}
      <div className="bg-gray-100 p-8 rounded-lg mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">Key Features</h2>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div key={feature.title} className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Product Lineup */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">Jizz Tech Product Lineup</h2>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
          {products.map((product) => (
            <div key={product.name} className="overflow-hidden border rounded-lg shadow-md">
              <div className="aspect-[4/3] bg-gray-100 flex items-center justify-center">
                <p className="text-gray-500">Product Image</p>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{product.name}</h3>
                <p className="text-gray-600 mb-4">{product.description}</p>
                <div className="flex justify-between items-center">
                  <p className="text-lg font-bold">${product.price}</p>
                  <button className="bg-black text-white px-4 py-2 rounded-md font-medium hover:bg-gray-800 flex items-center gap-2">
                    <ShoppingCart className="h-4 w-4" />
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-black text-white p-16 rounded-lg text-center">
        <h2 className="mb-6 text-3xl font-bold md:text-4xl">
          Ready to Place Your Order?
        </h2>
        <p className="mb-8 text-lg text-gray-300">
          Contact our sales team for bulk orders or special requirements.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <a href="tel:+15551234567" className="bg-white text-black px-8 py-3 rounded-md font-medium hover:bg-gray-100">
            Call Sales: (555) 123-4567
          </a>
          <a href="mailto:sales@johncorp.com" className="bg-gray-800 text-white px-8 py-3 rounded-md font-medium hover:bg-gray-700 border border-white">
            Email Sales Team
          </a>
        </div>
      </div>
    </div>
  )
}

// Features data
const features = [
  {
    title: "Superior Strength",
    description: "Bonds with incredible strength, creating connections that last a lifetime even under extreme conditions."
  },
  {
    title: "Quick Setting",
    description: "Sets in seconds, allowing for rapid project completion without long wait times."
  },
  {
    title: "Versatile Application",
    description: "Works on wood, metal, plastic, ceramic, glass, fabric, and more."
  },
  {
    title: "Water Resistant",
    description: "Maintains bond integrity even when exposed to moisture and humidity."
  },
  {
    title: "Temperature Stable",
    description: "Performs reliably in extreme temperatures from -40°F to 300°F."
  },
  {
    title: "Eco-Friendly",
    description: "Formulated with environmentally conscious ingredients and minimal VOCs."
  }
]

// Products data
const products = [
  {
    name: "Jizz Tech Original",
    description: "Our flagship adhesive product, perfect for general-purpose applications.",
    price: "19.99"
  },
  {
    name: "Jizz Tech Pro",
    description: "Industrial-grade adhesive for professional and heavy-duty applications.",
    price: "29.99"
  },
  {
    name: "Jizz Tech Quick",
    description: "Ultra-fast setting formula for time-sensitive projects.",
    price: "24.99"
  }
]

export default Products
