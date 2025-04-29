import React from 'react'

function Filmmaking() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div style={{ backgroundColor: '#1f2937' }} className="text-white">
        <div className="container py-16 px-4">
          <div style={{ maxWidth: '768px' }}>
            <h1 className="mb-4">John Corp Filmmaking</h1>
            <p className="mb-6" style={{ fontSize: '1.25rem' }}>
              Creating compelling visual stories that captivate audiences.
            </p>
          </div>
        </div>
      </div>

      {/* Our Approach */}
      <div className="container py-16 px-4">
        <h2 className="text-center mb-12">Our Filmmaking Approach</h2>

        <div className="flex flex-col md:flex-row" style={{ gap: '3rem', alignItems: 'center' }}>
          <div className="md:w-1/2">
            <div className="bg-gray-200 p-4" style={{ borderRadius: '0.5rem', height: '320px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <p className="text-gray-500" style={{ fontSize: '1.25rem', fontWeight: '600' }}>Filmmaking Team Image</p>
            </div>
          </div>
          <div className="md:w-1/2">
            <p className="text-gray-700 mb-4">
              At John Corp, our filmmaking division combines technical expertise with creative storytelling to produce
              films that leave a lasting impression. From concept development to final delivery, we handle every aspect
              of the production process with meticulous attention to detail.
            </p>
            <p className="text-gray-700 mb-4">
              Our team of directors, cinematographers, editors, and production specialists work collaboratively to
              bring creative visions to life. Whether it's a commercial, documentary, corporate video, or narrative film,
              we approach each project with the same level of dedication and artistic integrity.
            </p>
            <p className="text-gray-700">
              We believe that great filmmaking is about more than just beautiful visuals—it's about telling stories
              that resonate with audiences and achieve our clients' objectives.
            </p>
          </div>
        </div>
      </div>

      {/* Services */}
      <div className="bg-gray-50 py-16">
        <div className="container px-4">
          <h2 className="text-center mb-12">Our Filmmaking Services</h2>

          <div className="grid md:grid-cols-2">
            <div className="bg-white p-4 mb-4" style={{ borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.12)' }}>
              <h3 className="mb-4" style={{ fontSize: '1.5rem' }}>Commercial Production</h3>
              <p className="text-gray-700 mb-4">
                Engaging commercials that showcase your products and services in the best light. We create
                advertisements that not only look great but also drive results for your business.
              </p>
              <ul style={{ listStyleType: 'disc', paddingLeft: '1.25rem' }} className="text-gray-700">
                <li>TV commercials</li>
                <li>Web advertisements</li>
                <li>Social media content</li>
                <li>Product demonstrations</li>
              </ul>
            </div>

            <div className="bg-white p-4 mb-4" style={{ borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.12)' }}>
              <h3 className="mb-4" style={{ fontSize: '1.5rem' }}>Corporate Videos</h3>
              <p className="text-gray-700 mb-4">
                Professional videos that communicate your company's message, values, and culture. From training
                videos to company profiles, we help you connect with your audience.
              </p>
              <ul style={{ listStyleType: 'disc', paddingLeft: '1.25rem' }} className="text-gray-700">
                <li>Company profiles</li>
                <li>Training videos</li>
                <li>Event coverage</li>
                <li>Internal communications</li>
              </ul>
            </div>

            <div className="bg-white p-4 mb-4" style={{ borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.12)' }}>
              <h3 className="mb-4" style={{ fontSize: '1.5rem' }}>Documentary Filmmaking</h3>
              <p className="text-gray-700 mb-4">
                Compelling documentaries that tell real stories with depth and authenticity. We research,
                interview, and craft narratives that inform and inspire.
              </p>
              <ul style={{ listStyleType: 'disc', paddingLeft: '1.25rem' }} className="text-gray-700">
                <li>Feature documentaries</li>
                <li>Short-form documentaries</li>
                <li>Series production</li>
                <li>Educational content</li>
              </ul>
            </div>

            <div className="bg-white p-4" style={{ borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.12)' }}>
              <h3 className="mb-4" style={{ fontSize: '1.5rem' }}>Narrative Films</h3>
              <p className="text-gray-700 mb-4">
                Creative storytelling through narrative filmmaking. From short films to feature productions,
                we bring scripts to life with cinematic excellence.
              </p>
              <ul style={{ listStyleType: 'disc', paddingLeft: '1.25rem' }} className="text-gray-700">
                <li>Short films</li>
                <li>Feature films</li>
                <li>Web series</li>
                <li>Music videos</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Portfolio */}
      <div className="container py-16 px-4">
        <h2 className="text-center mb-12">Featured Projects</h2>

        <div className="grid md:grid-cols-3">
          <div style={{ borderRadius: '0.5rem', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.12)', marginBottom: '1rem' }}>
            <div className="bg-gray-200" style={{ height: '192px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <p className="text-gray-500">Project Thumbnail</p>
            </div>
            <div className="p-4">
              <h3 className="mb-2" style={{ fontSize: '1.25rem' }}>The Greater Norway Movement</h3>
              <p className="text-gray-600 mb-3">Documentary</p>
              <p className="text-gray-700">
                Our award-winning exploration of Norway's cultural and political influence across Scandinavia.
              </p>
            </div>
          </div>

          <div style={{ borderRadius: '0.5rem', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.12)', marginBottom: '1rem' }}>
            <div className="bg-gray-200" style={{ height: '192px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <p className="text-gray-500">Project Thumbnail</p>
            </div>
            <div className="p-4">
              <h3 className="mb-2" style={{ fontSize: '1.25rem' }}>Bond</h3>
              <p className="text-gray-600 mb-3">Commercial Campaign</p>
              <p className="text-gray-700">
                Award-winning commercial series showcasing the strength of Jizz Tech in extreme conditions.
              </p>
            </div>
          </div>

          <div style={{ borderRadius: '0.5rem', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.12)' }}>
            <div className="bg-gray-200" style={{ height: '192px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <p className="text-gray-500">Project Thumbnail</p>
            </div>
            <div className="p-4">
              <h3 className="mb-2" style={{ fontSize: '1.25rem' }}>Connected</h3>
              <p className="text-gray-600 mb-3">Short Film</p>
              <p className="text-gray-700">
                A narrative short exploring human connections through the metaphor of adhesive bonds.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <button className="btn btn-primary" style={{ backgroundColor: '#1f2937' }}>
            View Full Portfolio
          </button>
        </div>
      </div>

      {/* Video Gallery */}
      <div className="bg-gray-900 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-white">Video Gallery</h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
              <div className="bg-gray-700 h-64 flex items-center justify-center">
                <div className="text-white text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-gray-300">Featured Documentary</p>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 text-white">The Greater Norway Movement</h3>
                <p className="text-gray-400 mb-4">
                  Our award-winning documentary exploring Norway's cultural and political influence across Scandinavia and beyond.
                </p>
                <button className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800 transition">
                  Watch Trailer
                </button>
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
              <div className="bg-gray-700 h-64 flex items-center justify-center">
                <div className="text-white text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-gray-300">Commercial</p>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 text-white">Jizz Tech: Bonds That Last</h3>
                <p className="text-gray-400 mb-4">
                  Our award-winning commercial showcasing the incredible strength of Jizz Tech adhesive in extreme conditions.
                </p>
                <button className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800 transition">
                  Watch Now
                </button>
              </div>
            </div>
          </div>

          <div className="mt-12 grid md:grid-cols-3 gap-6">
            <div className="bg-gray-800 rounded-lg overflow-hidden shadow-md">
              <div className="bg-gray-700 h-48 flex items-center justify-center">
                <div className="text-white text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-gray-300">Behind the Scenes</p>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-bold mb-2 text-white">Making of "The Greater Norway Movement"</h3>
                <p className="text-gray-400 text-sm">
                  Go behind the scenes of our acclaimed documentary on Norwegian influence.
                </p>
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg overflow-hidden shadow-md">
              <div className="bg-gray-700 h-48 flex items-center justify-center">
                <div className="text-white text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-gray-300">Interview</p>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-bold mb-2 text-white">Director's Commentary</h3>
                <p className="text-gray-400 text-sm">
                  Our director discusses the challenges and insights from filming in Norway.
                </p>
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg overflow-hidden shadow-md">
              <div className="bg-gray-700 h-48 flex items-center justify-center">
                <div className="text-white text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-gray-300">Teaser</p>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-bold mb-2 text-white">Upcoming: Norway's Legacy</h3>
                <p className="text-gray-400 text-sm">
                  A sneak peek at our upcoming sequel to The Greater Norway Movement.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Documentary */}
      <div className="container mx-auto py-16 px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">The Greater Norway Movement</h2>

        <div className="flex flex-col md:flex-row gap-12">
          <div className="md:w-1/2">
            <div className="bg-gray-200 rounded-lg p-8 h-80 flex items-center justify-center mb-6">
              <p className="text-gray-500 text-xl font-semibold">Documentary Poster</p>
            </div>
            <div className="flex gap-4 mb-6">
              <div className="bg-gray-100 p-2 rounded flex-1 text-center">
                <p className="text-gray-700 font-bold">Runtime</p>
                <p className="text-gray-600">92 minutes</p>
              </div>
              <div className="bg-gray-100 p-2 rounded flex-1 text-center">
                <p className="text-gray-700 font-bold">Release</p>
                <p className="text-gray-600">2023</p>
              </div>
              <div className="bg-gray-100 p-2 rounded flex-1 text-center">
                <p className="text-gray-700 font-bold">Language</p>
                <p className="text-gray-600">English, Norwegian</p>
              </div>
            </div>
          </div>

          <div className="md:w-1/2">
            <h3 className="text-2xl font-bold mb-4 text-blue-700">About the Film</h3>
            <p className="text-gray-700 mb-4">
              "The Greater Norway Movement" is our critically acclaimed documentary exploring Norway's cultural, economic, and political influence across Scandinavia and beyond. Through intimate interviews with key figures and stunning cinematography of the Nordic landscape, the film examines how Norwegian values and policies have shaped regional development.
            </p>
            <p className="text-gray-700 mb-6">
              Directed by our award-winning filmmaker Sofia Bergström and produced over three years, the documentary takes viewers on a journey through Norway's history and its growing influence in the 21st century. The film has been featured at multiple international film festivals and won the Best Documentary award at the Nordic Film Festival.
            </p>

            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <h4 className="font-bold text-blue-700 mb-2">Awards & Recognition</h4>
              <ul className="text-gray-700 space-y-1">
                <li>• Best Documentary - Nordic Film Festival 2023</li>
                <li>• Official Selection - Toronto International Film Festival</li>
                <li>• Cinematography Award - Documentary Film Awards</li>
                <li>• Audience Choice Award - Scandinavian Film Showcase</li>
              </ul>
            </div>

            <button className="bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-800 transition">
              Watch the Trailer
            </button>
          </div>
        </div>
      </div>

      {/* Our Team */}
      <div className="container mx-auto py-16 px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Meet Our Creative Team</h2>

        <div className="grid md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="bg-gray-200 rounded-full h-48 w-48 mx-auto mb-6 flex items-center justify-center">
              <p className="text-gray-500">Photo</p>
            </div>
            <h3 className="text-xl font-bold mb-2">Michael Chen</h3>
            <p className="text-blue-700 mb-3">Creative Director</p>
            <p className="text-gray-700">
              Award-winning filmmaker with over 15 years of experience directing commercials and documentaries.
            </p>
          </div>

          <div className="text-center">
            <div className="bg-gray-200 rounded-full h-48 w-48 mx-auto mb-6 flex items-center justify-center">
              <p className="text-gray-500">Photo</p>
            </div>
            <h3 className="text-xl font-bold mb-2">Sofia Bergström</h3>
            <p className="text-blue-700 mb-3">Director</p>
            <p className="text-gray-700">
              Visionary director behind "The Greater Norway Movement" with a passion for cultural documentaries.
            </p>
          </div>

          <div className="text-center">
            <div className="bg-gray-200 rounded-full h-48 w-48 mx-auto mb-6 flex items-center justify-center">
              <p className="text-gray-500">Photo</p>
            </div>
            <h3 className="text-xl font-bold mb-2">David Washington</h3>
            <p className="text-blue-700 mb-3">Senior Editor</p>
            <p className="text-gray-700">
              Masterful storyteller who transforms raw footage into compelling narratives with perfect pacing.
            </p>
          </div>

          <div className="text-center">
            <div className="bg-gray-200 rounded-full h-48 w-48 mx-auto mb-6 flex items-center justify-center">
              <p className="text-gray-500">Photo</p>
            </div>
            <h3 className="text-xl font-bold mb-2">Emma Thompson</h3>
            <p className="text-blue-700 mb-3">Production Manager</p>
            <p className="text-gray-700">
              Organizational genius who ensures every production runs smoothly from pre-production to final delivery.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Filmmaking
