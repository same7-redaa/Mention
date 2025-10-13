import React from 'react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const AboutUs: React.FC = () => {
  const { ref, isVisible } = useScrollAnimation<HTMLDivElement>({ triggerOnce: true, threshold: 0.3 });

  return (
    <section id="about" className="py-20 bg-gradient-to-br from-gray-50 to-gray-200">
      <div ref={ref} className="container mx-auto px-6">
        <div className={`transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          <h2 className="text-4xl font-bold text-center mb-4 text-gray-900">
            About <span className="text-red-600">Mention Studio</span>
          </h2>
          <div className="w-24 h-1 bg-red-600 mx-auto mb-12"></div>
        </div>
        <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Who We Are</h3>
                <p className="text-gray-700 leading-relaxed">
                    Mention Studio was founded to be the ideal partner for companies and organizations in the fields of digital marketing, media production, and integrated technology solutions. Our creative team brings deep expertise that enables us to turn ideas into tangible reality. We build brands and strengthen their digital presence through innovative strategies and measurable results.
                </p>
                <br/>
                <p className="text-gray-700 leading-relaxed">
                    We believe that our clients’ success is the foundation of our own, and therefore we are committed to providing comprehensive services that meet market demands and keep pace with the latest developments in the digital and media world.
                </p>
            </div>
             <div className={`hidden md:block transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
                <div className="glass-card rounded-xl p-8 text-center">
                    <i className="fas fa-rocket text-5xl text-red-600 mb-4"></i>
                    <h4 className="text-xl font-bold text-gray-900">Our Goal</h4>
                    <p className="text-gray-700 mt-2">Turning great ideas into tangible, impactful realities that drive success.</p>
                </div>
            </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;