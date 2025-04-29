import React from 'react'
import { Play, Award } from 'lucide-react'

function Filmmaking() {
  return (
    <div className="container mx-auto p-8">
      {/* Hero Section */}
      <div className="bg-black text-white p-16 rounded-lg mb-8">
        <h1 className="text-4xl font-bold mb-4">John Corp Filmmaking</h1>
        <p className="text-xl">Creating compelling visual stories that captivate audiences.</p>
      </div>

      {/* Our Approach */}
      <div className="mb-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="bg-gray-100 aspect-square rounded-lg flex items-center justify-center">
            <p className="text-gray-500 text-xl font-medium">Filmmaking Team Image</p>
          </div>

          <div>
            <h2 className="text-3xl font-bold mb-6">Our Filmmaking Approach</h2>
            <div className="space-y-4 text-gray-600">
              <p>
                At John Corp, our filmmaking division combines technical expertise with creative storytelling to produce
                films that leave a lasting impression. From concept development to final delivery, we handle every aspect
                of the production process with meticulous attention to detail.
              </p>
              <p>
                Our team of directors, cinematographers, editors, and production specialists work collaboratively to
                bring creative visions to life. Whether it's a commercial, documentary, corporate video, or narrative film,
                we approach each project with the same level of dedication and artistic integrity.
              </p>
              <p>
                We believe that great filmmaking is about more than just beautiful visuals—it's about telling stories
                that resonate with audiences and achieve our clients' objectives.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Services */}
      <div className="bg-gray-100 p-8 rounded-lg mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">Our Filmmaking Services</h2>

        <div className="grid sm:grid-cols-2 gap-6">
          {services.map((service) => (
            <div key={service.title} className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-2xl font-bold mb-4">{service.title}</h3>
              <p className="text-gray-600 mb-4">{service.description}</p>
              <ul className="space-y-1 text-gray-600">
                {service.items.map((item) => (
                  <li key={item} className="flex items-start">
                    <span className="mr-2">•</span> {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Projects */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">Featured Projects</h2>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
          {projects.map((project) => (
            <div key={project.title} className="overflow-hidden border rounded-lg shadow-md">
              <div className="aspect-[16/9] bg-gray-100 flex items-center justify-center">
                <p className="text-gray-500">Project Thumbnail</p>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-1">{project.title}</h3>
                <p className="text-sm text-gray-500 mb-3">{project.category}</p>
                <p className="text-gray-600">{project.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <button className="bg-black text-white px-6 py-3 rounded-md font-medium hover:bg-gray-800">
            View Full Portfolio
          </button>
        </div>
      </div>

      {/* Video Gallery */}
      <div className="bg-black text-white p-8 rounded-lg mb-16">
        <h2 className="text-3xl font-bold text-center mb-8 text-white">Video Gallery</h2>

        <div className="grid md:grid-cols-2 gap-8">
          {featuredVideos.map((video) => (
            <div key={video.title} className="bg-black/20 border border-gray-700 rounded-lg text-white overflow-hidden">
              <div className="aspect-video bg-black/30 flex items-center justify-center relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="rounded-full bg-white/10 p-4 backdrop-blur-sm">
                    <Play className="h-10 w-10 text-white" fill="white" />
                  </div>
                </div>
                <p className="text-white/60">{video.type}</p>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-3">{video.title}</h3>
                <p className="text-white/70 mb-4">{video.description}</p>
                <button className="border border-white text-white px-4 py-2 rounded-md hover:bg-white hover:text-black">
                  {video.buttonText}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6">
          {smallVideos.map((video) => (
            <div key={video.title} className="bg-black/20 border border-gray-700 rounded-lg text-white overflow-hidden">
              <div className="aspect-video bg-black/30 flex items-center justify-center relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Play className="h-8 w-8 text-white/70" />
                </div>
                <p className="text-white/60">{video.type}</p>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-bold mb-2">{video.title}</h3>
                <p className="text-white/70 text-sm">{video.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Documentary */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">The Greater Norway Movement</h2>

        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-6">
            <div className="bg-gray-100 aspect-[3/4] rounded-lg flex items-center justify-center">
              <p className="text-gray-500 text-xl font-medium">Documentary Poster</p>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gray-100 p-4 rounded-lg text-center">
                <h4 className="font-medium">Runtime</h4>
                <p className="text-gray-600">92 minutes</p>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg text-center">
                <h4 className="font-medium">Release</h4>
                <p className="text-gray-600">2023</p>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg text-center">
                <h4 className="font-medium">Language</h4>
                <p className="text-gray-600">English, Norwegian</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold mb-4">About the Film</h3>
              <div className="space-y-4 text-gray-600">
                <p>
                  "The Greater Norway Movement" is our critically acclaimed documentary exploring Norway's cultural, economic, and political influence across Scandinavia and beyond. Through intimate interviews with key figures and stunning cinematography of the Nordic landscape, the film examines how Norwegian values and policies have shaped regional development.
                </p>
                <p>
                  Directed by our award-winning filmmaker Sofia Bergström and produced over three years, the documentary takes viewers on a journey through Norway's history and its growing influence in the 21st century. The film has been featured at multiple international film festivals and won the Best Documentary award at the Nordic Film Festival.
                </p>
              </div>
            </div>

            <div className="bg-gray-100 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <Award className="h-5 w-5 mr-2" />
                Awards & Recognition
              </h3>
              <ul className="space-y-1 text-gray-600">
                <li className="flex items-start">
                  <span className="mr-2">•</span> Best Documentary - Nordic Film Festival 2023
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span> Official Selection - Toronto International Film Festival
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span> Cinematography Award - Documentary Film Awards
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span> Audience Choice Award - Scandinavian Film Showcase
                </li>
              </ul>
            </div>

            <button className="bg-black text-white px-6 py-3 rounded-md font-medium hover:bg-gray-800 flex items-center">
              <Play className="mr-2 h-4 w-4" />
              Watch the Trailer
            </button>
          </div>
        </div>
      </div>

      {/* Our Team */}
      <div className="bg-gray-100 p-8 rounded-lg">
        <h2 className="text-3xl font-bold text-center mb-8">Meet Our Creative Team</h2>

        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8">
          {team.map((member) => (
            <div key={member.name} className="text-center">
              <div className="bg-gray-200 h-32 w-32 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-3xl font-bold">{member.name.charAt(0)}</span>
              </div>
              <h3 className="text-xl font-bold">{member.name}</h3>
              <p className="text-blue-600 mb-2">{member.role}</p>
              <p className="text-gray-600">{member.bio}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Services data
const services = [
  {
    title: "Commercial Production",
    description: "Engaging commercials that showcase your products and services in the best light. We create advertisements that not only look great but also drive results for your business.",
    items: [
      "TV commercials",
      "Web advertisements",
      "Social media content",
      "Product demonstrations"
    ]
  },
  {
    title: "Corporate Videos",
    description: "Professional videos that communicate your company's message, values, and culture. From training videos to company profiles, we help you connect with your audience.",
    items: [
      "Company profiles",
      "Training videos",
      "Event coverage",
      "Internal communications"
    ]
  },
  {
    title: "Documentary Filmmaking",
    description: "Compelling documentaries that tell real stories with depth and authenticity. We research, interview, and craft narratives that inform and inspire.",
    items: [
      "Feature documentaries",
      "Short-form documentaries",
      "Series production",
      "Educational content"
    ]
  },
  {
    title: "Narrative Films",
    description: "Creative storytelling through narrative filmmaking. From short films to feature productions, we bring scripts to life with cinematic excellence.",
    items: [
      "Short films",
      "Feature films",
      "Web series",
      "Music videos"
    ]
  }
]

// Projects data
const projects = [
  {
    title: "The Greater Norway Movement",
    category: "Documentary",
    description: "Our award-winning exploration of Norway's cultural and political influence across Scandinavia."
  },
  {
    title: "Bond",
    category: "Commercial Campaign",
    description: "Award-winning commercial series showcasing the strength of Jizz Tech in extreme conditions."
  },
  {
    title: "Connected",
    category: "Short Film",
    description: "A narrative short exploring human connections through the metaphor of adhesive bonds."
  }
]

// Featured videos data
const featuredVideos = [
  {
    title: "The Greater Norway Movement",
    type: "Featured Documentary",
    description: "Our award-winning documentary exploring Norway's cultural and political influence across Scandinavia and beyond.",
    buttonText: "Watch Trailer"
  },
  {
    title: "Jizz Tech: Bonds That Last",
    type: "Commercial",
    description: "Our award-winning commercial showcasing the incredible strength of Jizz Tech adhesive in extreme conditions.",
    buttonText: "Watch Now"
  }
]

// Small videos data
const smallVideos = [
  {
    title: "Making of 'The Greater Norway Movement'",
    type: "Behind the Scenes",
    description: "Go behind the scenes of our acclaimed documentary on Norwegian influence."
  },
  {
    title: "Director's Commentary",
    type: "Interview",
    description: "Our director discusses the challenges and insights from filming in Norway."
  },
  {
    title: "Upcoming: Norway's Legacy",
    type: "Teaser",
    description: "A sneak peek at our upcoming sequel to The Greater Norway Movement."
  }
]

// Team data
const team = [
  {
    name: "Michael Chen",
    role: "Creative Director",
    bio: "Award-winning filmmaker with over 15 years of experience directing commercials and documentaries."
  },
  {
    name: "Sofia Bergström",
    role: "Director",
    bio: "Visionary director behind 'The Greater Norway Movement' with a passion for cultural documentaries."
  },
  {
    name: "David Washington",
    role: "Senior Editor",
    bio: "Masterful storyteller who transforms raw footage into compelling narratives with perfect pacing."
  },
  {
    name: "Emma Thompson",
    role: "Production Manager",
    bio: "Organizational genius who ensures every production runs smoothly from pre-production to final delivery."
  }
]

export default Filmmaking
