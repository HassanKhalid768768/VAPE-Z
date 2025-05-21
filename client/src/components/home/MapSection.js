import React from "react";

const MapSection = () => {
  return (
    <section className="bg-gray-100 py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-12">
        <div className="flex flex-col md:flex-row md:-mx-6">
          <div className="md:w-1/2 md:px-6">
            <h2 className="text-3xl md:text-4xl font-semibold mb-6">
              Locate us on your maps
            </h2>
            <p className="text-gray-600 mb-8">
              Visit us at our store location and check out our latest vaping products.
            </p>
          </div>
          <div className="md:w-1/2 md:px-6 mt-10 md:mt-0">
            <div className="aspect-w-16 aspect-h-9">
              <iframe
                src="https://maps.google.com/maps?q=31.543326,74.297400&z=14&output=embed"
                width="100%"
                height="100%"
                frameBorder="0"
                style={{ border: "0" }}
                allowFullScreen=""
                aria-hidden="false"
                tabIndex="0"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MapSection;
