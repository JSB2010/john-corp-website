import React from 'react'

function Products() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="bg-blue-700 text-white">
        <div className="container py-16 px-4">
          <div style={{ maxWidth: '768px' }}>
            <h1 className="mb-4">Jizz Tech Adhesive</h1>
            <p className="mb-6" style={{ fontSize: '1.25rem' }}>
              The revolutionary adhesive technology that bonds virtually anything.
            </p>
          </div>
        </div>
      </div>

      {/* Product Overview */}
      <div className="container py-16 px-4">
        <div className="flex flex-col md:flex-row" style={{ gap: '3rem', alignItems: 'center' }}>
          <div className="md:w-1/2">
            <div className="bg-gray-200 p-4" style={{ borderRadius: '0.5rem', height: '320px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <p className="text-gray-500" style={{ fontSize: '1.25rem', fontWeight: '600' }}>Jizz Tech Product Image</p>
            </div>
          </div>
          <div className="md:w-1/2">
            <h2 className="mb-6">What Makes Jizz Tech Special</h2>
            <p className="text-gray-700 mb-4">
              Jizz Tech is our proprietary adhesive formula that provides unmatched bonding strength for virtually any material.
              Developed through years of research and innovation, it represents the pinnacle of adhesive technology.
            </p>
            <p className="text-gray-700 mb-4">
              Whether you're working on industrial applications, construction projects, or household repairs,
              Jizz Tech delivers exceptional results every time.
            </p>
            <div className="mt-8">
              <button className="btn btn-primary">
                Request a Sample
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Product Features */}
      <div className="bg-gray-50 py-16">
        <div className="container px-4">
          <h2 className="text-center mb-12">Key Features</h2>
          
          <div className="grid md:grid-cols-3">
            <div className="bg-white p-4 mb-4" style={{ borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.12)' }}>
              <h3 className="text-blue-700 mb-3" style={{ fontSize: '1.25rem' }}>Superior Strength</h3>
              <p className="text-gray-700">
                Bonds with incredible strength, creating connections that last a lifetime even under extreme conditions.
              </p>
            </div>
            
            <div className="bg-white p-4 mb-4" style={{ borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.12)' }}>
              <h3 className="text-blue-700 mb-3" style={{ fontSize: '1.25rem' }}>Quick Setting</h3>
              <p className="text-gray-700">
                Sets in seconds, allowing for rapid project completion without long wait times.
              </p>
            </div>
            
            <div className="bg-white p-4 mb-4" style={{ borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.12)' }}>
              <h3 className="text-blue-700 mb-3" style={{ fontSize: '1.25rem' }}>Versatile Application</h3>
              <p className="text-gray-700">
                Works on wood, metal, plastic, ceramic, glass, and more - the only adhesive you'll ever need.
              </p>
            </div>
            
            <div className="bg-white p-4 mb-4" style={{ borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.12)' }}>
              <h3 className="text-blue-700 mb-3" style={{ fontSize: '1.25rem' }}>Water Resistant</h3>
              <p className="text-gray-700">
                Maintains bond integrity even when exposed to moisture and humid environments.
              </p>
            </div>
            
            <div className="bg-white p-4 mb-4" style={{ borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.12)' }}>
              <h3 className="text-blue-700 mb-3" style={{ fontSize: '1.25rem' }}>Temperature Stable</h3>
              <p className="text-gray-700">
                Performs reliably in extreme temperatures from -40°F to 300°F.
              </p>
            </div>
            
            <div className="bg-white p-4" style={{ borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.12)' }}>
              <h3 className="text-blue-700 mb-3" style={{ fontSize: '1.25rem' }}>Eco-Friendly</h3>
              <p className="text-gray-700">
                Formulated with environmentally conscious ingredients and minimal VOCs.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Product Lineup */}
      <div className="container py-16 px-4">
        <h2 className="text-center mb-12">Jizz Tech Product Lineup</h2>
        
        <div className="grid md:grid-cols-3">
          <div style={{ border: '1px solid #e5e7eb', borderRadius: '0.5rem', overflow: 'hidden', marginBottom: '1rem' }}>
            <div className="bg-gray-100" style={{ height: '192px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <p className="text-gray-500">Product Image</p>
            </div>
            <div className="p-4">
              <h3 className="mb-2" style={{ fontSize: '1.25rem' }}>Jizz Tech Original</h3>
              <p className="text-gray-700 mb-4">
                Our flagship adhesive product, perfect for general-purpose applications.
              </p>
              <p className="text-blue-700" style={{ fontWeight: 'bold' }}>$19.99</p>
            </div>
          </div>
          
          <div style={{ border: '1px solid #e5e7eb', borderRadius: '0.5rem', overflow: 'hidden', marginBottom: '1rem' }}>
            <div className="bg-gray-100" style={{ height: '192px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <p className="text-gray-500">Product Image</p>
            </div>
            <div className="p-4">
              <h3 className="mb-2" style={{ fontSize: '1.25rem' }}>Jizz Tech Pro</h3>
              <p className="text-gray-700 mb-4">
                Industrial-grade adhesive for professional and heavy-duty applications.
              </p>
              <p className="text-blue-700" style={{ fontWeight: 'bold' }}>$29.99</p>
            </div>
          </div>
          
          <div style={{ border: '1px solid #e5e7eb', borderRadius: '0.5rem', overflow: 'hidden' }}>
            <div className="bg-gray-100" style={{ height: '192px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <p className="text-gray-500">Product Image</p>
            </div>
            <div className="p-4">
              <h3 className="mb-2" style={{ fontSize: '1.25rem' }}>Jizz Tech Quick</h3>
              <p className="text-gray-700 mb-4">
                Ultra-fast setting formula for time-sensitive projects.
              </p>
              <p className="text-blue-700" style={{ fontWeight: 'bold' }}>$24.99</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Products
