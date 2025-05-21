import React, { useState, useEffect } from 'react';

function FAQSection() {
  const [faqs] = useState([
    {
      question: "What is vaping?",
      answer:
        "Vaping is the act of inhaling and exhaling vapor that is produced by an electronic cigarette or similar device. The device heats a liquid (e-liquid) to produce the vapor, which is then inhaled. Vaping has become a popular alternative to smoking traditional cigarettes for many people.",
    },
    {
      question: "What is e-liquid?",
      answer:
        "E-liquid, also known as vape juice, is the liquid that is used in electronic cigarettes or vaporizers to produce the vapor that is inhaled. E-liquid is typically made up of propylene glycol, vegetable glycerin, flavorings, and nicotine (although some e-liquids are nicotine-free).",
    },
    {
      question: "What are the different types of electronic cigarettes?",
      answer:
        "There are many different types of electronic cigarettes on the market, including cigalikes, vape pens, and mods. Cigalikes are designed to look and feel like traditional cigarettes, while vape pens are larger and have more battery life. Mods are the largest type of electronic cigarette and are designed for experienced vapers.",
    },
    {
      question: "How do I choose an electronic cigarette?",
      answer:
        "Choosing an electronic cigarette can be overwhelming due to the variety of options available. The best way to choose is to start by deciding what type of device you want (cigalike, vape pen, or mod) and then consider factors such as battery life, ease of use, and price.",
    },
    {
      question: "Is vaping safe?",
      answer:
        "While vaping is generally considered to be safer than smoking traditional cigarettes, it is not completely risk-free. E-liquids can contain harmful chemicals, and the long-term effects of vaping are still not well understood. It is important to use electronic cigarettes responsibly and only as intended.",
    },
  ]);

  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      if (currentPage === Math.ceil(faqs.length / 3)) {
        setCurrentPage(1);
      } else {
        setCurrentPage(currentPage + 1);
      }
    }, 10000);
    return () => clearInterval(interval);
  }, [currentPage, faqs]);

  const handlePrevPage = () => {
    setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  return (
    <div className="bg-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Frequently Asked Questions</h2>
        </div>
        <div className="mt-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {faqs.slice((currentPage - 1) * 3, currentPage * 3).map((faq, index) => (
              <div key={index} className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                  <h2 className="text-lg leading-6 font-medium text-gray-900">{faq.question}</h2>
                </div>
                <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                    <div className="mt-1 sm:mt-0 sm:col-span-2">
                      <dd className="text-sm text-gray-900">{faq.answer}</dd>
                    </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-center">
            <nav className="inline-flex rounded-md shadow">
              <button className={`${currentPage === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-gray-200 hover:bg-gray-300'} text-gray-500 font-medium px-4 py-2 rounded-l-md`} onClick={handlePrevPage} disabled={currentPage === 1}>
                Previous
              </button>
              <button className={`${currentPage === Math.ceil(faqs.length / 3) ? 'bg-gray-300 cursor-not-allowed' : 'bg-gray-200 hover:bg-gray-300'} text-gray-500 font-medium px-4 py-2 rounded-r-md`} onClick={handleNextPage} disabled={currentPage === Math.ceil(faqs.length / 3)}>
                Next
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};
export default FAQSection;
