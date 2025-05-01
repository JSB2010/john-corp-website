import React, { useEffect } from 'react'
import '../styles/about.css'

function About() {
  useEffect(() => {
    // Function to handle scroll animations
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const elementVisible = 150;

      // Get all elements with fadeIn animation
      const fadeElements = document.querySelectorAll('.animate-fadeIn');

      fadeElements.forEach((element) => {
        const elementTop = element.getBoundingClientRect().top;
        if (elementTop < windowHeight - elementVisible) {
          // Apply animation styles directly
          element.style.opacity = '1';
          element.style.transform = 'translateY(0)';
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check on initial load

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="bg-blue-700 text-white">
        <div className="container py-12 md:py-16 px-4">
          <div className="max-w-3xl animate-fadeIn">
            <h1 className="mb-4 text-4xl md:text-5xl font-bold tracking-tight">About John Corp</h1>
            <p className="mb-6 text-xl md:text-2xl font-light">
              Our story, mission, and the people behind our innovation.
            </p>
          </div>
        </div>
      </div>

      {/* Our Story */}
      <div className="container py-12 md:py-16 px-4">
        <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center">
          <div className="md:w-1/2 animate-fadeIn">
            <h2 className="mb-6 text-3xl md:text-4xl font-bold tracking-tight">Our Story</h2>
            <p className="text-gray-700 mb-6 text-base md:text-lg">
              John Corp was founded in 1634 with a simple mission: to create products and media that make a difference.
              What began as a small operation in London has grown into a global company with two distinct divisions:
              our revolutionary Jizz Tech adhesive products and our creative filmmaking studio.
            </p>
            <p className="text-gray-700 mb-6 text-base md:text-lg">
              Our founder, <a href="/founder" className="text-blue-700 font-semibold hover:underline">John Cunningham</a>, discovered the unique formula for Jizz Tech while experimenting with
              natural resins and animal proteins. Recognizing its potential to revolutionize construction and shipbuilding, he established
              John Corp to bring this innovation to market.
            </p>
            <p className="text-gray-700 text-base md:text-lg">
              As the company grew, Cunningham's vision expanded beyond adhesives to include visual storytelling, which eventually led to the establishment of our filmmaking
              division, allowing us to not only create groundbreaking products but also tell compelling stories
              through film.
            </p>
          </div>
          <div className="md:w-1/2 animate-fadeIn" style={{animationDelay: '0.2s'}}>
            <div className="bg-gray-200 p-6 rounded-xl shadow-sm h-64 md:h-96 flex items-center justify-center overflow-hidden">
              <p className="text-gray-500 text-xl font-semibold">Company History Image</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mission & Values */}
      <div className="bg-gray-50 py-12 md:py-16">
        <div className="container px-4">
          <h2 className="section-title text-center mb-8 md:mb-12 text-3xl md:text-4xl font-bold tracking-tight animate-fadeIn">Our Mission & Values</h2>

          <div className="max-w-4xl mx-auto">
            <div className="bg-white p-6 md:p-8 mb-8 rounded-xl shadow-sm animate-fadeIn">
              <h3 className="text-blue-700 mb-4 text-xl md:text-2xl font-semibold">Our Mission</h3>
              <p className="text-gray-700 text-base md:text-lg">
                To create innovative products and compelling visual stories that solve problems, inspire creativity,
                and forge lasting connections.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm transition-all duration-300 hover:shadow-md animate-fadeIn" style={{animationDelay: '0.1s'}}>
                <h3 className="text-blue-700 mb-3 text-lg md:text-xl font-semibold">Innovation</h3>
                <p className="text-gray-700">
                  We constantly push boundaries and explore new possibilities in both our adhesive technology
                  and filmmaking approaches.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm transition-all duration-300 hover:shadow-md animate-fadeIn" style={{animationDelay: '0.2s'}}>
                <h3 className="text-blue-700 mb-3 text-lg md:text-xl font-semibold">Quality</h3>
                <p className="text-gray-700">
                  We are committed to excellence in everything we create, from the formulation of our adhesives
                  to the production value of our films.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm transition-all duration-300 hover:shadow-md animate-fadeIn" style={{animationDelay: '0.3s'}}>
                <h3 className="text-blue-700 mb-3 text-lg md:text-xl font-semibold">Integrity</h3>
                <p className="text-gray-700">
                  We conduct our business with honesty, transparency, and respect for our customers, partners,
                  and team members.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm transition-all duration-300 hover:shadow-md animate-fadeIn" style={{animationDelay: '0.4s'}}>
                <h3 className="text-blue-700 mb-3 text-lg md:text-xl font-semibold">Creativity</h3>
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
      <div className="container py-12 md:py-16 px-4">
        <h2 className="section-title text-center mb-8 md:mb-12 text-3xl md:text-4xl font-bold tracking-tight">Our Leadership Team</h2>

        <div className="team-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
          {/* John Cunningham */}
          <div className="team-card bg-white rounded-xl p-6 transition-all duration-300 hover:shadow-md text-center animate-fadeIn">
            <div className="team-member-photo bg-gray-200 rounded-full w-36 h-36 md:w-48 md:h-48 mx-auto mb-6 flex items-center justify-center overflow-hidden">
              <p className="text-gray-500">Photo</p>
            </div>
            <h3 className="team-member-name mb-2 text-xl md:text-2xl font-semibold">John Cunningham</h3>
            <p className="team-member-title text-blue-700 mb-3 font-medium">CEO & Chairman</p>
            <p className="team-member-bio text-gray-700">
              Founder Of John Corp, continuing the legacy of innovation and excellence.
            </p>
          </div>

          {/* Jacob Barkin */}
          <div className="team-card bg-white rounded-xl p-6 transition-all duration-300 hover:shadow-md text-center animate-fadeIn" style={{animationDelay: '0.1s'}}>
            <div className="team-member-photo bg-gray-200 rounded-full w-36 h-36 md:w-48 md:h-48 mx-auto mb-6 flex items-center justify-center overflow-hidden">
              <p className="text-gray-500">Photo</p>
            </div>
            <h3 className="team-member-name mb-2 text-xl md:text-2xl font-semibold">Jacob Barkin</h3>
            <p className="team-member-title text-blue-700 mb-3 font-medium">Chief Technology Officer</p>
            <p className="team-member-bio text-gray-700">
              Leading our research and development efforts for Jizz Tech and innovative new products.
            </p>
          </div>

          {/* Jonah Wimer */}
          <div className="team-card bg-white rounded-xl p-6 transition-all duration-300 hover:shadow-md text-center animate-fadeIn" style={{animationDelay: '0.2s'}}>
            <div className="team-member-photo bg-gray-200 rounded-full w-36 h-36 md:w-48 md:h-48 mx-auto mb-6 flex items-center justify-center overflow-hidden">
              <p className="text-gray-500">Photo</p>
            </div>
            <h3 className="team-member-name mb-2 text-xl md:text-2xl font-semibold">Jonah Wimer</h3>
            <p className="team-member-title text-blue-700 mb-3 font-medium">Head Chemist and Product Lead</p>
            <p className="team-member-bio text-gray-700">
              Award-winning specilist leding our R&D division with over 15 years of experience.
            </p>
          </div>

          {/* Charles Cuneo */}
          <div className="team-card bg-white rounded-xl p-6 transition-all duration-300 hover:shadow-md text-center animate-fadeIn" style={{animationDelay: '0.3s'}}>
            <div className="team-member-photo bg-gray-200 rounded-full w-36 h-36 md:w-48 md:h-48 mx-auto mb-6 flex items-center justify-center overflow-hidden">
              <p className="text-gray-500">Photo</p>
            </div>
            <h3 className="team-member-name mb-2 text-xl md:text-2xl font-semibold">Charles Cuneo</h3>
            <p className="team-member-title text-blue-700 mb-3 font-medium">R&D Director</p>
            <p className="team-member-bio text-gray-700">
              Visionary leader of our R&D division with extensive industry experience as well as being a revolutionary board member.
            </p>
          </div>

          {/* Matthew Hues */}
          <div className="team-card bg-white rounded-xl p-6 transition-all duration-300 hover:shadow-md text-center animate-fadeIn" style={{animationDelay: '0.4s'}}>
            <div className="team-member-photo bg-gray-200 rounded-full w-36 h-36 md:w-48 md:h-48 mx-auto mb-6 flex items-center justify-center overflow-hidden">
              <p className="text-gray-500">Photo</p>
            </div>
            <h3 className="team-member-name mb-2 text-xl md:text-2xl font-semibold">Matthew Hues</h3>
            <p className="team-member-title text-blue-700 mb-3 font-medium">Head Janator and Simp of the centruy</p>
            <p className="team-member-bio text-gray-700">
              Oversees all janitorial operations and ensures a clean and safe work environment for all employees. Also is a massive hater on many of our prevous successful endevors.
            </p>
          </div>

          {/* Declan Garner */}
          <div className="team-card bg-white rounded-xl p-6 transition-all duration-300 hover:shadow-md text-center animate-fadeIn" style={{animationDelay: '0.5s'}}>
            <div className="team-member-photo bg-gray-200 rounded-full w-36 h-36 md:w-48 md:h-48 mx-auto mb-6 flex items-center justify-center overflow-hidden">
              <p className="text-gray-500">Photo</p>
            </div>
            <h3 className="team-member-name mb-2 text-xl md:text-2xl font-semibold">Declan Garner</h3>
            <p className="team-member-title text-blue-700 mb-3 font-medium">Creative Director</p>
            <p className="team-member-bio text-gray-700">
              Leading our creative vision across all projects with innovative design thinking and artistic excellence.
            </p>
          </div>

          {/* Connor Speigal */}
          <div className="team-card bg-white rounded-xl p-6 transition-all duration-300 hover:shadow-md text-center animate-fadeIn" style={{animationDelay: '0.6s'}}>
            <div className="team-member-photo bg-gray-200 rounded-full w-36 h-36 md:w-48 md:h-48 mx-auto mb-6 flex items-center justify-center overflow-hidden">
              <p className="text-gray-500">Photo</p>
            </div>
            <h3 className="team-member-name mb-2 text-xl md:text-2xl font-semibold">Connor Speigal</h3>
            <p className="team-member-title text-blue-700 mb-3 font-medium">Director of Filmmaking</p>
            <p className="team-member-bio text-gray-700">
              Award-winning filmmaker overseeing all production aspects of our filmmaking division with a passion for visual storytelling.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About
