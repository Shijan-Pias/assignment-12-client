import React from "react";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

const ContactSection = () => {
  return (
    <section
      id="contact"
      className="bg-gradient-to-b from-white to-blue-50 py-16 px-6 lg:px-12"
    >
      <div className="max-w-6xl mx-auto text-center mb-10">
        <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-3">
          Contact <span className="text-blue-600">Us</span>
        </h2>
        <p className="text-gray-600">
          Have any questions or need support? Get in touch with us anytime — we’re happy to help!
        </p>
      </div>

      {/* Contact Info + Form */}
      <div className="grid md:grid-cols-2 gap-10 max-w-6xl mx-auto">
        {/* Left Side - Info */}
        <div className="space-y-6 text-gray-700">
          <div className="flex items-center gap-4">
            <FaPhoneAlt className="text-blue-600 text-2xl" />
            <div>
              <h4 className="font-semibold text-lg">Phone</h4>
              <p>+880 1234 567 890</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <FaEnvelope className="text-blue-600 text-2xl" />
            <div>
              <h4 className="font-semibold text-lg">Email</h4>
              <p>support@pharmahub.com</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <FaMapMarkerAlt className="text-blue-600 text-2xl" />
            <div>
              <h4 className="font-semibold text-lg">Address</h4>
              <p>Dhaka, Bangladesh</p>
            </div>
          </div>

          <p className="mt-6 text-gray-600">
            Our support team is available 24/7 to assist with any queries about orders, accounts, or services.
          </p>
        </div>

        {/* Right Side - Form */}
        <div className="bg-white shadow-lg rounded-2xl p-6 md:p-8">
          <form className="space-y-5">
            <div>
              <label className="block text-left text-gray-700 font-medium mb-1">
                Name
              </label>
              <input
                type="text"
                placeholder="Enter your name"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-left text-gray-700 font-medium mb-1">
                Email
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-left text-gray-700 font-medium mb-1">
                Message
              </label>
              <textarea
                rows="4"
                placeholder="Write your message..."
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
