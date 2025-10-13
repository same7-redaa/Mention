import React, { useState, useEffect } from 'react';
import { PORTFOLIO_ITEMS, CLIENTS } from '../constants';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

// Helper component for animated images with a fade transition
const AnimatedImage: React.FC<{ imageUrls: string[]; alt: string; interval?: number; className?: string; imgClassName?: string }> = ({ imageUrls, alt, interval = 3000, className, imgClassName }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (imageUrls.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % imageUrls.length);
    }, interval);

    return () => clearInterval(timer);
  }, [imageUrls.length, interval]);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {imageUrls.map((url, index) => (
        <img
          key={index}
          src={url}
          alt={`${alt} ${index + 1}`}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${imgClassName} ${index === currentIndex ? 'opacity-100' : 'opacity-0'}`}
        />
      ))}
    </div>
  );
};


export const Portfolio: React.FC = () => {
  const { ref, isVisible } = useScrollAnimation<HTMLDivElement>({ triggerOnce: true, threshold: 0.1 });
  const allPortfolioUrls = PORTFOLIO_ITEMS.map(item => item.imageUrl);

  // Shuffle and slice arrays for each image placeholder to make them different
  const getImageSet = (offset: number) => {
      return [...allPortfolioUrls.slice(offset), ...allPortfolioUrls.slice(0, offset)];
  };
  
  const handlePortfolioClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const target = document.getElementById('portfolio');
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
  <section id="portfolio-preview" ref={ref} className="bg-white py-20">
      <div className="container mx-auto px-6">
        <div className={`transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          <h2 className="text-4xl font-bold text-center mb-4 text-gray-900">
            Our <span className="text-red-600">Work</span>
          </h2>
          <div className="w-24 h-1 bg-red-600 mx-auto mb-12"></div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12">
          <AnimatedImage imageUrls={getImageSet(0)} alt="Portfolio Work" className="aspect-square rounded-lg shadow-lg" interval={2500}/>
          <AnimatedImage imageUrls={getImageSet(3)} alt="Portfolio Work" className="aspect-square rounded-lg shadow-lg" interval={3000}/>
          <AnimatedImage imageUrls={getImageSet(6)} alt="Portfolio Work" className="aspect-square rounded-lg shadow-lg" interval={3500}/>
          <AnimatedImage imageUrls={getImageSet(9)} alt="Portfolio Work" className="aspect-square rounded-lg shadow-lg" interval={4000}/>
        </div>

        <div className="text-center">
          <a href="#portfolio" className="bg-red-600 text-white font-bold py-3 px-8 rounded-full hover:bg-red-700 transition-all duration-300 transform hover:scale-105 text-lg shadow-lg">
            View Full Portfolio
          </a>
        </div>
      </div>
    </section>
  );
};


export const Clients: React.FC = () => {
  const { ref, isVisible } = useScrollAnimation<HTMLDivElement>({ triggerOnce: true, threshold: 0.1 });
    
  return (
    <section id="clients" ref={ref} className="bg-gray-50 py-20 overflow-hidden">
      <div className="container mx-auto px-6">
        <div className={`transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
              Proudly <span className="text-red-600">trusted by</span>
          </h2>
        </div>
      </div>
      
      <div className="w-full inline-flex flex-nowrap">
        <div className="flex items-center justify-center md:justify-start [&_img]:max-h-24 animate-marquee">
            {CLIENTS.concat(CLIENTS).map((client, index) => (
                <div key={`${client.id}-${index}`} className="flex-shrink-0 w-40 h-40 mx-6 flex items-center justify-center">
                    <img 
                        src={client.logoUrl} 
                        alt={client.name}
                        className="max-w-full max-h-full object-contain rounded-2xl"
                    />
                </div>
            ))}
        </div>
      </div>
    </section>
  );
};