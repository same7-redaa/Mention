import React, { useState, useEffect } from 'react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

const AboutUs: React.FC = () => {
  const { ref, isVisible } = useScrollAnimation<HTMLDivElement>({ triggerOnce: true, threshold: 0.3 });
  const [aboutImage, setAboutImage] = useState('https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop');

  useEffect(() => {
    const loadAboutImage = async () => {
      try {
        const docRef = doc(db, 'siteSettings', 'main');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().aboutImage) {
          setAboutImage(docSnap.data().aboutImage);
        }
      } catch (error) {
        console.error('Error loading about image:', error);
      }
    };
    loadAboutImage();
  }, []);

  return (
    <section id="about" className="py-20 text-white relative">
      {/* تدرج أسود في بداية القسم */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black to-transparent z-0"></div>
      
      <div ref={ref} className="container mx-auto px-6 relative z-10">
        <div className={`transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          <h2 className="text-4xl font-bold text-center mb-4">
            About <span className="text-red-300">Mention Studio</span>
          </h2>
          <div className="w-24 h-1 bg-red-300 mx-auto mb-12"></div>
        </div>
        <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
                <h3 className="text-2xl font-bold mb-4">Who We Are</h3>
                <p className="text-red-100 leading-relaxed">
                    Mention Studio was founded to be the ideal partner for companies and organizations in the fields of digital marketing, media production, and integrated technology solutions. Our creative team brings deep expertise that enables us to turn ideas into tangible reality. We build brands and strengthen their digital presence through innovative strategies and measurable results.
                </p>
                <br/>
                <p className="text-red-100 leading-relaxed">
                    We believe that our clients’ success is the foundation of our own, and therefore we are committed to providing comprehensive services that meet market demands and keep pace with the latest developments in the digital and media world.
                </p>
            </div>
             <div className={`transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
                <img 
                    src={aboutImage} 
                    alt="Our Team" 
                    className="rounded-xl w-full h-auto object-cover shadow-2xl"
                />
            </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;