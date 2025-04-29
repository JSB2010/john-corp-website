import React from 'react'
import { Link } from 'react-router-dom'

function About() {
  return (
    <div className="container mx-auto p-8">
      <div className="bg-black text-white p-16 rounded-lg mb-8">
        <h1 className="text-4xl font-bold mb-4">About John Corp</h1>
        <p className="text-xl">Our story, mission, and the people behind our innovation.</p>
      </div>

      {/* Our Story */}
      <div className="mb-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6">Our Story</h2>
            <div className="space-y-4 text-gray-600">
              <p>
                John Corp was founded in 1634 with a simple mission: to create products and media that make a difference.
                What began as a small operation in London has grown into a global company with two distinct divisions:
                our revolutionary Jizz Tech adhesive products and our creative filmmaking studio.
              </p>
              <p>
                Our founder, <Link to="/founder" className="text-blue-600 font-medium hover:underline">John Cunningham</Link>, discovered the unique formula for Jizz Tech while experimenting with
                natural resins and animal proteins. Recognizing its potential to revolutionize construction and shipbuilding, he established
                John Corp to bring this innovation to market.
              </p>
              <p>
                As the company grew, Cunningham's vision expanded beyond adhesives to include visual storytelling, which eventually led to the establishment of our filmmaking
                division, allowing us to not only create groundbreaking products but also tell compelling stories
                through film.
              </p>
            </div>
          </div>

          <div className="bg-gray-100 aspect-square rounded-lg flex items-center justify-center">
            <p className="text-gray-500 text-xl font-medium">Company History Image</p>
          </div>
        </div>
      </div>

      {/* Mission & Values */}
      <div className="bg-gray-100 p-8 rounded-lg mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">Our Mission & Values</h2>

        <div className="max-w-3xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
            <p className="text-gray-600">
              To create innovative products and compelling visual stories that solve problems, inspire creativity,
              and forge lasting connections.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {values.map((value) => (
              <div key={value.title} className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Leadership Team */}
      <div>
        <h2 className="text-3xl font-bold text-center mb-8">Our Leadership Team</h2>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
          {leaders.map((leader) => (
            <div key={leader.name} className="text-center">
              <div className="bg-gray-200 h-32 w-32 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-3xl font-bold">{leader.name.charAt(0)}</span>
              </div>
              <h3 className="text-xl font-bold">{leader.name}</h3>
              <p className="text-blue-600 mb-2">{leader.role}</p>
              <p className="text-gray-600">{leader.bio}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Values data
const values = [
  {
    title: "Innovation",
    description: "We constantly push boundaries and explore new possibilities in both our adhesive technology and filmmaking approaches."
  },
  {
    title: "Quality",
    description: "We are committed to excellence in everything we create, from the formulation of our adhesives to the production value of our films."
  },
  {
    title: "Integrity",
    description: "We conduct our business with honesty, transparency, and respect for our customers, partners, and team members."
  },
  {
    title: "Creativity",
    description: "We foster a culture of creative thinking and artistic expression that drives our work in both product development and filmmaking."
  }
]

// Leadership data
const leaders = [
  {
    name: "Robert Cunningham IV",
    role: "CEO & Chairman",
    bio: "Descendant of founder John Cunningham, continuing the family legacy of innovation and excellence."
  },
  {
    name: "Sarah Johnson",
    role: "Chief Technology Officer",
    bio: "Leading our research and development efforts for Jizz Tech adhesive products."
  },
  {
    name: "Michael Chen",
    role: "Creative Director",
    bio: "Award-winning filmmaker heading our filmmaking division with over 15 years of experience."
  }
]

export default About
