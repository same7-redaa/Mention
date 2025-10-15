import React from 'react';
import { VISION_TEXT, MISSION_TEXT, VALUES } from '../constants';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const Vision: React.FC = () => {
    const { ref, isVisible } = useScrollAnimation<HTMLDivElement>({ triggerOnce: true, threshold: 0.2 });

    return (
        <section id="vision" ref={ref} className="py-20 text-white relative">
            <div className="container mx-auto px-6 relative z-10">
                <div className={`transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
                    <h2 className="text-4xl font-bold text-center mb-4">
                        Vision, Mission & Values
                    </h2>
                    <div className="w-24 h-1 bg-red-300 mx-auto mb-12"></div>
                </div>

                <div className="grid lg:grid-cols-2 gap-8 mb-12">
                    <div className={`extra-glass-card p-8 rounded-xl transition-all duration-700 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
                        <div className="flex items-center mb-4">
                            <i className="fas fa-binoculars text-3xl"></i>
                            <h3 className="text-2xl font-bold ml-4">Our Vision</h3>
                        </div>
                        <p className="text-red-100">{VISION_TEXT}</p>
                    </div>
                    <div className={`extra-glass-card p-8 rounded-xl transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
                        <div className="flex items-center mb-4">
                            <i className="fas fa-bullseye text-3xl"></i>
                            <h3 className="text-2xl font-bold ml-4">Our Mission</h3>
                        </div>
                        <p className="text-red-100">{MISSION_TEXT}</p>
                    </div>
                </div>
                
                <div className="text-center">
                     <h3 className={`text-2xl font-bold mb-8 transition-opacity duration-700 delay-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>Our Values</h3>
                     <div className="flex flex-wrap justify-center gap-6">
                        {VALUES.map((value, index) => (
                             <div key={index} className={`flex items-center py-2 px-4 rounded-full transition-all duration-500 extra-glass-card ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`} style={{transitionDelay: `${300 + index * 100}ms`}}>
                                <i className={`${value.icon} mr-3`}></i>
                                <span className="font-semibold">{value.text}</span>
                            </div>
                        ))}
                     </div>
                </div>
            </div>
        </section>
    );
};

export default Vision;