import React from "react";
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";
import { Link } from "react-router-dom";


const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-blue-500 to-pink-500 text-white font-fancy py-2">
      <div className="flex justify-between items-center px-5 lg:px-20">
        <div className="flex space-x-5">
          <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer">
            <FaFacebookF className="text-2xl" />
          </a>
          <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer">
            <FaInstagram className="text-2xl" />
          </a>
          <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer">
            <FaTwitter className="text-2xl" />
          </a>
          <a href="https://www.youtube.com/" target="_blank" rel="noopener noreferrer">
            <FaYoutube className="text-2xl" />
          </a>
        </div>
        <div className="text-lg font-bold">
          <p>&copy; 2023 VapeZ. All Rights Reserved.</p>
        </div>
        <div className="flex items-center space-x-2">
          <Link to="/">
            <img src="/logo.svg" alt="VapeZ Logo" className="w-24 h-24" />
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

