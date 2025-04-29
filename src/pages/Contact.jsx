import React from 'react'
import { Mail, Phone, MapPin, Send } from 'lucide-react'

function Contact() {
  return (
    <div className="container mx-auto p-8">
      {/* Hero Section */}
      <div className="bg-black text-white p-16 rounded-lg mb-8">
        <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
        <p className="text-xl">Get in touch with our team for inquiries, support, or partnership opportunities.</p>
      </div>

      {/* Contact Form Section */}
      <div className="mb-16">
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-3xl font-bold mb-8">Send Us a Message</h2>

            <form className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="first-name" className="block font-medium">First name</label>
                  <input
                    id="first-name"
                    placeholder="Enter your first name"
                    className="w-full p-3 border rounded-md"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="last-name" className="block font-medium">Last name</label>
                  <input
                    id="last-name"
                    placeholder="Enter your last name"
                    className="w-full p-3 border rounded-md"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="block font-medium">Email</label>
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  className="w-full p-3 border rounded-md"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="subject" className="block font-medium">Subject</label>
                <input
                  id="subject"
                  placeholder="What is this regarding?"
                  className="w-full p-3 border rounded-md"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="block font-medium">Message</label>
                <textarea
                  id="message"
                  placeholder="Please provide details about your inquiry..."
                  className="w-full p-3 border rounded-md min-h-[150px]"
                ></textarea>
              </div>

              <button className="bg-black text-white px-6 py-3 rounded-md font-medium hover:bg-gray-800 flex items-center">
                <Send className="mr-2 h-4 w-4" />
                Send Message
              </button>
            </form>
          </div>

          <div>
            <h2 className="text-3xl font-bold mb-8">Contact Information</h2>

            <div className="space-y-6">
              <div className="border rounded-lg p-6 shadow-md">
                <div className="flex items-start space-x-4">
                  <Mail className="h-6 w-6 text-blue-600 mt-0.5" />
                  <div>
                    <h3 className="font-medium">Email Us</h3>
                    <p className="text-gray-600 mt-1">Our team will respond within 24 hours</p>
                    <a href="mailto:info@johncorp.com" className="text-blue-600 hover:underline block mt-2">
                      info@johncorp.com
                    </a>
                    <a href="mailto:support@johncorp.com" className="text-blue-600 hover:underline block mt-1">
                      support@johncorp.com
                    </a>
                  </div>
                </div>
              </div>

              <div className="border rounded-lg p-6 shadow-md">
                <div className="flex items-start space-x-4">
                  <Phone className="h-6 w-6 text-blue-600 mt-0.5" />
                  <div>
                    <h3 className="font-medium">Call Us</h3>
                    <p className="text-gray-600 mt-1">Monday to Friday, 9am to 5pm EST</p>
                    <a href="tel:+15551234567" className="text-blue-600 hover:underline block mt-2">
                      (555) 123-4567
                    </a>
                    <a href="tel:+18005551234" className="text-blue-600 hover:underline block mt-1">
                      1-800-555-1234 (Toll Free)
                    </a>
                  </div>
                </div>
              </div>

              <div className="border rounded-lg p-6 shadow-md">
                <div className="flex items-start space-x-4">
                  <MapPin className="h-6 w-6 text-blue-600 mt-0.5" />
                  <div>
                    <h3 className="font-medium">Visit Us</h3>
                    <p className="text-gray-600 mt-1">Our headquarters location</p>
                    <address className="not-italic text-sm mt-2 text-gray-600">
                      123 Innovation Way<br />
                      Tech City, TC 12345<br />
                      United States
                    </address>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className="bg-gray-100 p-8 rounded-lg">
        <h2 className="text-3xl font-bold text-center mb-4">Find Us</h2>
        <p className="text-center text-gray-600 mb-8">Visit our headquarters in Tech City</p>

        <div className="bg-gray-200 rounded-lg aspect-[16/9] md:aspect-[21/9] flex items-center justify-center">
          <p className="text-gray-500 text-lg">Interactive Map Would Be Displayed Here</p>
        </div>
      </div>
    </div>
  )
}

export default Contact
