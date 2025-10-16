import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-black text-gray-300">
      <div className="container mx-auto px-6 py-8">
        {/* Main Footer Content */}
        <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-6 mb-6">
          <div>
            <p className="font-medium">© 2024 Mention Studio. All rights reserved.</p>
             <p className="text-sm">Benghazi, Libya — HW Center</p>
          </div>
          
          {/* Middle Section - Mention Studio */}
          <div className="flex flex-col items-center gap-3">
             <div className="text-2xl font-bold text-white mb-2">
                Mention<span className="text-red-400">.</span>Studio
            </div>
            
            {/* Mention Studio Social */}
            <div className="flex space-x-4">
              <a href="#" className="hover:text-red-400 transition-colors"><i className="fab fa-facebook-f text-lg"></i></a>
              <a href="#" className="hover:text-red-400 transition-colors"><i className="fab fa-instagram text-lg"></i></a>
              <a href="#" className="hover:text-red-400 transition-colors"><i className="fab fa-linkedin-in text-lg"></i></a>
              <a href="#" className="hover:text-red-400 transition-colors"><i className="fab fa-twitter text-lg"></i></a>
            </div>
          </div>
          
           <div className="flex flex-col items-center md:items-end gap-2">
            <a href="mailto:info@mention.studio" className="font-medium hover:text-red-400">info@mention.studio</a>
            <a href="tel:+218923379054" className="font-medium hover:text-red-400">+218-92-3379054</a>
          </div>
        </div>
        
        {/* Developer Credit - Bottom Section */}
        <div className="border-t border-gray-800 pt-6">
          <div className="text-center">
            <p className="text-sm text-gray-400 mb-1">Designed and Developed by:</p>
            <p className="font-semibold text-white mb-2">Sameh Reda</p>
            <p className="text-sm text-red-400 font-medium mb-3">Order Your Website Now</p>
            
            {/* Developer Social Links */}
            <div className="flex justify-center items-center gap-4">
              <a 
                href="https://wa.me/201023160657" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-green-400 transition-colors transform hover:scale-110 duration-200"
                title="WhatsApp"
              >
                <i className="fab fa-whatsapp text-2xl"></i>
              </a>
              <a 
                href="https://www.facebook.com/SAME7.REDAA" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-blue-400 transition-colors transform hover:scale-110 duration-200"
                title="Facebook"
              >
                <i className="fab fa-facebook-f text-2xl"></i>
              </a>
              <a 
                href="https://www.doc-digital.online/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-red-400 transition-colors transform hover:scale-110 duration-200"
                title="Website"
              >
                <i className="fas fa-globe text-2xl"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;