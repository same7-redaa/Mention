import React from 'react';
import { SERVICES } from '../constants';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const ServiceCard: React.FC<{ service: typeof SERVICES[0], index: number }> = ({ service, index }) => {
  const { ref, isVisible } = useScrollAnimation<HTMLDivElement>({ triggerOnce: true });
  return (
    <div 
        ref={ref} 
        className={`extra-glass-card rounded-xl p-8 text-left h-full flex flex-col transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} 
        style={{ transitionDelay: `${index * 150}ms` }}>
      <div className="flex items-center mb-4">
        <i className={`${service.icon} text-3xl text-white`}></i>
        <h3 className="text-xl font-bold text-white ml-4">{service.title}</h3>
      </div>
      <p className="text-red-100 mb-4 flex-grow">{service.description}</p>
      <ul className="space-y-2">
        {service.items.map((item, i) => (
          <li key={i} className="flex items-start">
            <i className="fas fa-check-circle text-white mt-1 mr-2"></i>
            <span className="text-red-100">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

const Services: React.FC = () => {
    const { ref, isVisible } = useScrollAnimation<HTMLDivElement>({ triggerOnce: true });

  return (
    <section id="services" className="py-20 text-white relative">
      <div ref={ref} className="container mx-auto px-6 relative z-10">
        <div className={`transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          <h2 className="text-4xl font-bold text-center mb-4">
            Our Services
          </h2>
          <div className="w-24 h-1 bg-red-300 mx-auto mb-12"></div>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SERVICES.map((service, index) => (
            <ServiceCard key={index} service={service} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;