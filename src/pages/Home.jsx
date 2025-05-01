import React from 'react'
import { ScrollReveal } from '../components/ScrollReveal'
import { Section, Grid, Container } from '../components/Section'
import { Button } from '../components/Button'

function Home() {
  return (
    <div className="bg-white">
      {/* Hero Section - Apple Style */}
      <div className="hero hero-gradient min-h-[90vh] flex items-center relative overflow-hidden mt-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black/90 to-black/70 z-0"></div>

        {/* Parallax background effect */}
        <div className="absolute inset-0 z-0 parallax">
          <div className="absolute inset-0 bg-black/50"></div>
        </div>

        <Container className="py-16 md:py-32 px-4 md:px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <ScrollReveal type={ScrollReveal.ANIMATION_TYPES.FADE_UP}>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight mb-6">
                JOHN CORP
              </h1>
            </ScrollReveal>

            <ScrollReveal type={ScrollReveal.ANIMATION_TYPES.FADE_UP} delay={200}>
              <p className="text-lg md:text-xl lg:text-2xl text-white font-medium mb-10 max-w-2xl mx-auto">
                Innovating with our revolutionary adhesive technology since 1634. Creating bonds that last.
              </p>
            </ScrollReveal>

            <ScrollReveal type={ScrollReveal.ANIMATION_TYPES.FADE_UP} delay={400}>
              <div className="flex flex-wrap justify-center gap-4 md:gap-6">
                <Button
                  to="/products"
                  variant="primary"
                  size="lg"
                  className="py-4 px-8"
                >
                  Explore Jizz Tech
                </Button>
                <Button
                  to="/filmmaking"
                  variant="outline"
                  size="lg"
                  className="py-4 px-8 text-white border-white hover:bg-white/10"
                >
                  View Our Films
                </Button>
              </div>
            </ScrollReveal>
          </div>
        </Container>

        {/* Animated scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 md:h-8 md:w-8 text-white opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>

      {/* Features Section - Apple Style */}
      <Section id="features" background="bg-white" className="py-16 md:py-24">
        <ScrollReveal type={ScrollReveal.ANIMATION_TYPES.ZOOM_IN}>
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 tracking-tight">What We Do</h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              At John Corp, we combine cutting-edge adhesive technology with creative storytelling to deliver exceptional products and experiences.
            </p>
            <div className="w-24 h-1 bg-blue-500 mx-auto mt-8"></div>
          </div>
        </ScrollReveal>

        <Grid cols={2} className="mt-12">
          <ScrollReveal type={ScrollReveal.ANIMATION_TYPES.FADE_RIGHT} delay={100}>
            <div className="bg-white rounded-2xl p-8 md:p-10 shadow-md hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mb-8 shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 md:h-10 md:w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-blue-700">Jizz Tech Adhesive</h3>
              <p className="text-gray-600 mb-8 leading-relaxed text-base md:text-lg">
                Our revolutionary adhesive technology provides unmatched bonding strength for all your needs.
                From industrial applications to everyday household use, Jizz Tech delivers exceptional results.
              </p>
              <Button
                to="/products"
                variant="text"
                className="inline-flex items-center font-semibold text-blue-600 hover:text-blue-800 text-lg group"
              >
                Learn more about Jizz Tech
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 transform transition-transform group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Button>
            </div>
          </ScrollReveal>

          <ScrollReveal type={ScrollReveal.ANIMATION_TYPES.FADE_LEFT} delay={300}>
            <div className="bg-white rounded-2xl p-8 md:p-10 shadow-md hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mb-8 shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 md:h-10 md:w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-blue-700">Filmmaking Division</h3>
              <p className="text-gray-600 mb-8 leading-relaxed text-base md:text-lg">
                Our talented team of filmmakers creates compelling visual stories that captivate audiences.
                From commercials to documentaries, we bring creative visions to life.
              </p>
              <Button
                to="/filmmaking"
                variant="text"
                className="inline-flex items-center font-semibold text-blue-600 hover:text-blue-800 text-lg group"
              >
                Explore our filmmaking projects
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 transform transition-transform group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Button>
            </div>
          </ScrollReveal>
        </Grid>
      </Section>

      {/* Testimonials - Apple Style */}
      <Section id="testimonials" background="bg-gray-50" className="py-16 md:py-24">
        <ScrollReveal type={ScrollReveal.ANIMATION_TYPES.ZOOM_IN}>
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 tracking-tight">What Our Customers Say</h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              Don't just take our word for it. Here's what our customers have to say about Jizz Tech.
            </p>
            <div className="w-24 h-1 bg-blue-500 mx-auto mt-8"></div>
          </div>
        </ScrollReveal>

        <Grid cols={3} className="mt-12">
          {[
            {
              id: "testimonial-1",
              text: "Jizz Tech is the strongest adhesive I've ever used. It bonds instantly and holds forever! I've tried many products, but nothing compares to the reliability of Jizz Tech.",
              name: "Sarah Johnson",
              role: "Professional Contractor",
              animation: ScrollReveal.ANIMATION_TYPES.FADE_RIGHT,
              delay: 100
            },
            {
              id: "testimonial-2",
              text: "The team at John Corp created an amazing promotional video for our business. Highly recommended! Their attention to detail and creative vision exceeded our expectations.",
              name: "Michael Chen",
              role: "Business Owner",
              animation: ScrollReveal.ANIMATION_TYPES.FADE_UP,
              delay: 300
            },
            {
              id: "testimonial-3",
              text: "I use Jizz Tech for all my DIY projects. Nothing else compares to its strength and reliability. It's become an essential part of my toolkit for any home improvement project.",
              name: "David Williams",
              role: "DIY Enthusiast",
              animation: ScrollReveal.ANIMATION_TYPES.FADE_LEFT,
              delay: 500
            }
          ].map((testimonial) => (
            <ScrollReveal
              key={testimonial.id}
              type={testimonial.animation}
              delay={testimonial.delay}
            >
              <div className="bg-white rounded-2xl p-8 md:p-10 shadow-md hover:shadow-xl transition-all duration-500 h-full flex flex-col">
                <p className="text-gray-600 mb-8 leading-relaxed text-base md:text-lg flex-grow">
                  "{testimonial.text}"
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 md:w-14 md:h-14 bg-gray-200 rounded-full mr-4 flex-shrink-0"></div>
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-gray-500 text-sm">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </Grid>
      </Section>

      {/* CTA Section - Apple Style */}
      <Section id="cta" background="bg-black" className="py-16 md:py-24">
        <ScrollReveal type={ScrollReveal.ANIMATION_TYPES.ZOOM_IN}>
          <div className="text-center text-white max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 tracking-tight">
              Ready to Experience the Strength of Jizz Tech?
            </h2>
            <p className="text-lg md:text-xl text-gray-300 mb-10">
              Join thousands of satisfied customers who trust our revolutionary adhesive technology.
              Discover the perfect solution for your bonding needs today.
            </p>
            <Button
              to="/products"
              variant="primary"
              size="lg"
              className="py-4 px-10 text-lg transform transition-transform hover:scale-105"
            >
              Shop Now
            </Button>
          </div>
        </ScrollReveal>
      </Section>
    </div>
  )
}

export default Home
