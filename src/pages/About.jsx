import React from 'react'

function About() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="bg-blue-700 text-white">
        <div className="container py-16 px-4">
          <div style={{ maxWidth: '768px' }}>
            <h1 className="mb-4">About John Corp</h1>
            <p className="mb-6" style={{ fontSize: '1.25rem' }}>
              Our story, mission, and the people behind our innovation.
            </p>
          </div>
        </div>
      </div>

      {/* Our Story */}
      <div className="container py-16 px-4">
        <div className="flex flex-col md:flex-row" style={{ gap: '3rem', alignItems: 'center' }}>
          <div className="md:w-1/2">
            <h2 className="mb-6">Our Story</h2>
            <p className="text-gray-700 mb-4">
              John Corp was founded in 1634 with a simple mission: to create products and media that make a difference.
              What began as a small operation in London has grown into a global company with two distinct divisions:
              our revolutionary Jizz Tech adhesive products and our creative filmmaking studio.
            </p>
            <p className="text-gray-700 mb-4">
              Our founder, <a href="/founder" className="text-blue-700 font-semibold hover:underline">John Cunningham</a>, discovered the unique formula for Jizz Tech while experimenting with
              natural resins and animal proteins. Recognizing its potential to revolutionize construction and shipbuilding, he established
              John Corp to bring this innovation to market.
            </p>
            <p className="text-gray-700">
              As the company grew, Cunningham's vision expanded beyond adhesives to include visual storytelling, which eventually led to the establishment of our filmmaking
              division, allowing us to not only create groundbreaking products but also tell compelling stories
              through film.
            </p>
          </div>
          <div className="md:w-1/2">
            <div className="bg-gray-200 p-4" style={{ borderRadius: '0.5rem', height: '320px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <p className="text-gray-500" style={{ fontSize: '1.25rem', fontWeight: '600' }}>Company History Image</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mission & Values */}
      <div className="bg-gray-50 py-16">
        <div className="container px-4">
          <h2 className="text-center mb-12">Our Mission & Values</h2>

          <div style={{ maxWidth: '768px', margin: '0 auto' }}>
            <div className="bg-white p-4 mb-8" style={{ borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.12)' }}>
              <h3 className="text-blue-700 mb-4" style={{ fontSize: '1.5rem' }}>Our Mission</h3>
              <p className="text-gray-700">
                To create innovative products and compelling visual stories that solve problems, inspire creativity,
                and forge lasting connections.
              </p>
            </div>

            <div className="grid md:grid-cols-2">
              <div className="bg-white p-4 mb-4" style={{ borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.12)' }}>
                <h3 className="text-blue-700 mb-3" style={{ fontSize: '1.25rem' }}>Innovation</h3>
                <p className="text-gray-700">
                  We constantly push boundaries and explore new possibilities in both our adhesive technology
                  and filmmaking approaches.
                </p>
              </div>

              <div className="bg-white p-4 mb-4" style={{ borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.12)' }}>
                <h3 className="text-blue-700 mb-3" style={{ fontSize: '1.25rem' }}>Quality</h3>
                <p className="text-gray-700">
                  We are committed to excellence in everything we create, from the formulation of our adhesives
                  to the production value of our films.
                </p>
              </div>

              <div className="bg-white p-4 mb-4" style={{ borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.12)' }}>
                <h3 className="text-blue-700 mb-3" style={{ fontSize: '1.25rem' }}>Integrity</h3>
                <p className="text-gray-700">
                  We conduct our business with honesty, transparency, and respect for our customers, partners,
                  and team members.
                </p>
              </div>

              <div className="bg-white p-4" style={{ borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.12)' }}>
                <h3 className="text-blue-700 mb-3" style={{ fontSize: '1.25rem' }}>Creativity</h3>
                <p className="text-gray-700">
                  We foster a culture of creative thinking and artistic expression that drives our work in both
                  product development and filmmaking.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Leadership Team */}
      <div className="container py-16 px-4">
        <h2 className="text-center mb-12">Our Leadership Team</h2>

        <div className="grid md:grid-cols-3">
          <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
            <div style={{ backgroundColor: '#e5e7eb', borderRadius: '50%', height: '192px', width: '192px', margin: '0 auto 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <p className="text-gray-500">Photo</p>
            </div>
            <h3 className="mb-2" style={{ fontSize: '1.25rem' }}>Robert Cunningham IV</h3>
            <p className="text-blue-700 mb-3">CEO & Chairman</p>
            <p className="text-gray-700">
              Descendant of founder John Cunningham, continuing the family legacy of innovation and excellence.
            </p>
          </div>

          <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
            <div style={{ backgroundColor: '#e5e7eb', borderRadius: '50%', height: '192px', width: '192px', margin: '0 auto 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <p className="text-gray-500">Photo</p>
            </div>
            <h3 className="mb-2" style={{ fontSize: '1.25rem' }}>Sarah Johnson</h3>
            <p className="text-blue-700 mb-3">Chief Technology Officer</p>
            <p className="text-gray-700">
              Leading our research and development efforts for Jizz Tech adhesive products.
            </p>
          </div>

          <div style={{ textAlign: 'center' }}>
            <div style={{ backgroundColor: '#e5e7eb', borderRadius: '50%', height: '192px', width: '192px', margin: '0 auto 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <p className="text-gray-500">Photo</p>
            </div>
            <h3 className="mb-2" style={{ fontSize: '1.25rem' }}>Michael Chen</h3>
            <p className="text-blue-700 mb-3">Creative Director</p>
            <p className="text-gray-700">
              Award-winning filmmaker heading our filmmaking division with over 15 years of experience.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About
