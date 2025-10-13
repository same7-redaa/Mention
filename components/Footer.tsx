import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-gray-400">
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-6">
          <div>
            <p className="font-medium">© 2024 Mention Studio. All rights reserved.</p>
             <p className="text-sm">Benghazi, Libya — HW Center</p>
          </div>
          <div className="flex flex-col items-center md:items-center gap-4">
             <div className="text-2xl font-bold text-white">
                Mention<span className="text-red-600">.</span>Studio
            </div>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-red-600 transition-colors"><i className="fab fa-facebook-f text-xl"></i></a>
              <a href="#" className="hover:text-red-600 transition-colors"><i className="fab fa-instagram text-xl"></i></a>
              <a href="#" className="hover:text-red-600 transition-colors"><i className="fab fa-linkedin-in text-xl"></i></a>
              <a href="#" className="hover:text-red-600 transition-colors"><i className="fab fa-twitter text-xl"></i></a>
            </div>
          </div>
           <div className="flex flex-col items-center md:items-end gap-2">
            <a href="mailto:info@mention.studio" className="font-medium hover:text-red-600">info@mention.studio</a>
            <a href="tel:+218923379054" className="font-medium hover:text-red-600">+218-92-3379054</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;