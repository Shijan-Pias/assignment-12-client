import React from "react";
import aboutImg from "../../assets/logo.jpg"; // replace with your own image path

const AboutSection = () => {
  return (
    <section className="bg-gradient-to-b from-blue-50 to-white py-16 px-6 lg:px-12">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">
        {/* Left Image */}
        <div data-aos="fade-right">
          <img
            src={aboutImg}
            alt="About PharmaHub"
            className="rounded-2xl shadow-lg w-full object-cover h-80 md:h-[420px]"
          />
        </div>

        {/* Right Content */}
        <div data-aos="fade-left">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
            About <span className="text-blue-600">PharmaHub</span>
          </h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            <strong>PharmaHub</strong> is a modern <strong>multi-vendor pharmacy system</strong> designed to connect customers, sellers, and administrators in one secure platform.
            It simplifies the process of buying, selling, and managing medicines online while ensuring accuracy and trust.
          </p>

          <p className="text-gray-600 leading-relaxed mb-4">
            Users can easily explore and purchase medicines, sellers can list and manage their inventory, and admins maintain overall control of the system to ensure smooth operations.
          </p>

          <ul className="space-y-2 mb-6 text-gray-700">
            <li>✅ User-friendly medicine buying experience</li>
            <li>✅ Secure authentication and role-based access</li>
            <li>✅ Seller management for adding & editing products</li>
            <li>✅ Admin dashboard for monitoring the whole system</li>
          </ul>

         
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
