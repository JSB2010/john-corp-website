import React from 'react'

function Founder() {
  return (
    <div className="container mx-auto p-8">
      <div className="bg-black text-white p-16 rounded-lg mb-8">
        <h1 className="text-4xl font-bold mb-4">John Cunningham</h1>
        <p className="text-xl">Visionary founder of John Corp and inventor of Jizz Tech adhesive.</p>
      </div>

      {/* Founder Bio */}
      <div className="mb-16">
        <div className="grid md:grid-cols-3 gap-12 items-start">
          <div>
            <div className="bg-gray-100 aspect-[3/4] rounded-lg flex items-center justify-center mb-6">
              <p className="text-gray-500 text-xl font-medium">Portrait of John Cunningham</p>
            </div>

            <div className="border rounded-lg p-6 shadow-md">
              <h3 className="text-xl font-bold mb-4">Key Dates</h3>
              <div className="space-y-4">
                <div>
                  <p className="font-medium">1602</p>
                  <p className="text-gray-600">Born in London, England</p>
                  <hr className="my-2" />
                </div>
                <div>
                  <p className="font-medium">1634</p>
                  <p className="text-gray-600">Founded John Corp</p>
                  <hr className="my-2" />
                </div>
                <div>
                  <p className="font-medium">1645</p>
                  <p className="text-gray-600">Established Company Charter</p>
                  <hr className="my-2" />
                </div>
                <div>
                  <p className="font-medium">1672</p>
                  <p className="text-gray-600">Passed away at age 70</p>
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-2">
            <h2 className="text-3xl font-bold mb-6">The Visionary Behind John Corp</h2>
            <div className="space-y-6 text-gray-600">
              <p>
                Born in 1602 in a small village outside of London, John Cunningham showed an early aptitude for chemistry and natural sciences. His fascination with materials and their properties would eventually lead to the creation of one of the world's most enduring companies.
              </p>
              <p>
                In 1634, after years of experimentation, Cunningham developed a revolutionary adhesive formula derived from natural resins and animal proteins. This breakthrough formula, which would later evolve into what we now know as "Jizz Tech," was initially used for shipbuilding and construction during the early colonial period.
              </p>
              <p>
                Cunningham's vision extended beyond mere commerce. He believed that strong bonds—both literal and metaphorical—were the foundation of progress. This philosophy continues to guide John Corp to this day, nearly four centuries after our founding.
              </p>

              <div className="grid sm:grid-cols-2 gap-6 pt-4">
                <div className="bg-gray-100 p-6 rounded-lg">
                  <h3 className="text-lg font-bold mb-3">Education</h3>
                  <p className="text-gray-600">
                    Apprenticed to a master craftsman at age 16, where he first encountered the limitations of existing binding agents and began his experiments with adhesives.
                  </p>
                </div>

                <div className="bg-gray-100 p-6 rounded-lg">
                  <h3 className="text-lg font-bold mb-3">Journey</h3>
                  <p className="text-gray-600">
                    Traveled across Europe from 1625-1630, studying with alchemists, craftsmen, and natural philosophers in France, Germany, and Italy.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* The Birth of John Corp */}
      <div className="bg-gray-100 p-8 rounded-lg mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">The Birth of John Corp</h2>

        <div className="grid md:grid-cols-2 gap-12">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="aspect-[4/3] bg-gray-200 flex items-center justify-center">
              <p className="text-gray-500">Historical Illustration of First Workshop</p>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold mb-3">The First Workshop</h3>
              <p className="text-gray-600">
                In 1634, with financial backing from several prominent merchants who recognized the potential of his adhesive, Cunningham established the first John Corp workshop in London. The initial operation was modest, employing just five craftsmen who produced small batches of the adhesive for local shipbuilders and carpenters.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="aspect-[4/3] bg-gray-200 flex items-center justify-center">
              <p className="text-gray-500">Historical Document of Company Charter</p>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold mb-3">Early Success and Expansion</h3>
              <p className="text-gray-600">
                The superior quality of Cunningham's adhesive quickly gained recognition. By 1640, John Corp had secured contracts with the Royal Navy, providing adhesives for shipbuilding during a period of naval expansion. This royal patronage established the company's reputation and enabled rapid growth throughout the mid-17th century.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md mt-12 p-6">
          <h3 className="text-xl font-bold mb-4">Cunningham's Business Philosophy</h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4 text-gray-600">
              <p>
                From the beginning, John Cunningham established core principles that would guide his company for centuries to come. He believed in continuous innovation, insisting that his formula could always be improved upon. This commitment to research and development remains a cornerstone of John Corp today.
              </p>
              <p>
                Cunningham also emphasized quality and reliability above all else. He personally inspected batches of adhesive before they left the workshop and maintained strict quality control standards—revolutionary concepts for the 17th century.
              </p>
            </div>
            <div className="space-y-4 text-gray-600">
              <p>
                Perhaps most importantly, Cunningham fostered a culture of craftsmanship and pride in workmanship. He treated his employees with unusual respect for the time, providing fair wages and safe working conditions. He believed that the strength of his company, like his adhesive, depended on the strength of the bonds between the people who comprised it.
              </p>
              <p>
                This human-centered approach to business was codified in the company charter of 1645, which stated that John Corp existed "to create bonds that endure, between materials and between men, for the betterment of all."
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Famous Quotes */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">In His Own Words</h2>

        <div className="grid sm:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {quotes.map((quote) => (
            <div key={quote.source} className="bg-white p-6 rounded-lg shadow-md relative">
              <div className="absolute -left-3 -top-3 flex h-10 w-10 items-center justify-center rounded-full bg-black text-white">
                <span className="text-xl">"</span>
              </div>
              <p className="italic mb-4 text-gray-600 pt-4">
                "{quote.text}"
              </p>
              <p className="text-right text-sm text-gray-500">
                — {quote.source}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Visit Museum CTA */}
      <div className="bg-black text-white p-16 rounded-lg text-center">
        <h2 className="text-3xl font-bold mb-4">Visit the John Cunningham Museum</h2>
        <p className="text-xl mb-8">
          Explore the life and legacy of our founder at the John Cunningham Museum, located at our corporate headquarters in Tech City.
        </p>
        <button className="bg-white text-black px-8 py-3 rounded-md font-medium hover:bg-gray-100">
          Plan Your Visit
        </button>
      </div>
    </div>
  )
}

// Quotes data
const quotes = [
  {
    text: "The strength of a bond is measured not in its immediate grip, but in its endurance through time and trial. So it is with adhesives, and so it is with men and their enterprises.",
    source: "From Cunningham's journal, 1650"
  },
  {
    text: "Nature has provided us with the materials; it is our task to discover the methods by which these materials may be joined in ways that nature herself did not intend, yet which serve the advancement of human industry.",
    source: "Letter to the Royal Society, 1662"
  },
  {
    text: "I have failed a thousand times, and each failure has taught me more than any success. The path to discovery is paved with errors overcome through persistence.",
    source: "From Cunningham's workshop notes, 1645"
  },
  {
    text: "A company is not merely a means to profit, but a community of craftsmen united in purpose. Treat each man with respect, and the work of his hands will reflect his dignity.",
    source: "Company charter, 1645"
  }
]

export default Founder
