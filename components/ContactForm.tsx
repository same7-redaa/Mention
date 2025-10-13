import React from 'react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const Contact: React.FC = () => {
    const { ref, isVisible } = useScrollAnimation<HTMLDivElement>({ triggerOnce: true });

  return (
    <section id="contact" ref={ref} className={`subtle-pattern py-20 transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div className="container mx-auto px-6">
        <div className={`transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            <h2 className="text-4xl font-bold text-center mb-4 text-gray-900">
                Contact <span className="text-red-600">Us</span>
            </h2>
            <div className="w-24 h-1 bg-red-600 mx-auto mb-12"></div>
        </div>

        <div className="max-w-4xl mx-auto text-center">
            <div className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">Get in Touch</h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">Have a project in mind? We'd love to hear from you. Reach out through our channels below, and we'll get back to you shortly.</p>
                <div className="glass-card p-8 rounded-lg text-gray-900">
                    <div className="flex flex-col md:flex-row justify-around items-center gap-6 md:gap-4 text-lg">
                        <a href="mailto:info@mention.studio" className="flex items-center hover:text-red-600 font-medium">
                            <i className="fas fa-envelope text-red-600 w-6 mr-3"></i>
                            <span>info@mention.studio</span>
                        </a>
                        <a href="tel:+218923379054" className="flex items-center hover:text-red-600 font-medium">
                            <i className="fas fa-phone text-red-600 w-6 mr-3"></i>
                            <span>+218-92-3379054</span>
                        </a>
                        <p className="font-medium flex items-center">
                            <i className="fas fa-map-marker-alt text-red-600 w-6 mr-3"></i>
                            <span>Benghazi, Libya — HW Center</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;