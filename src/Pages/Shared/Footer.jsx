import React from 'react';

import { FaFacebook, FaTwitter, FaLinkedin } from "react-icons/fa";
import { Link } from 'react-router';
import FirstLogo from './FirstLogo';

const Footer = () => {
  return (
    <footer className="bg-base-200 text-base-content mt-16">
      <div className="max-w-[1280px] mx-auto px-6 py-12 grid md:grid-cols-4 gap-10">
        
        {/* Logo + Tagline */}
        <div>
          <FirstLogo></FirstLogo>
          <p className="mt-3 text-gray-600">
            Your trusted multi-vendor medicine marketplace.  
            Affordable, fast and reliable healthcare products.
          </p>
        </div>

        {/* Links */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2">
            <li><Link to="/" className="hover:text-primary">Home</Link></li>
            
           
          </ul>
        </div>

        {/* Policies */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Support</h3>
          <ul className="space-y-2">
            <li><Link to="/faq" className="hover:text-primary">FAQ</Link></li>
            <li><Link to="/terms" className="hover:text-primary">Terms & Conditions</Link></li>
            <li><Link to="/privacy" className="hover:text-primary">Privacy Policy</Link></li>
          </ul>
        </div>

        {/* Social */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Follow Us</h3>
          <div className="flex gap-4 text-2xl text-primary">
            <a href="#"><FaFacebook /></a>
            <a href="#"><FaTwitter /></a>
            <a href="#"><FaLinkedin /></a>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-gray-300 py-4 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} MediBazaar. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;
