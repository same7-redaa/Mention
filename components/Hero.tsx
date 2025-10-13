import React, { useState, useEffect } from 'react';

const FloatingIcons: React.FC = () => {
  const icons = [
    { icon: 'fas fa-bullhorn', top: '15%', left: '10%', size: 'text-5xl', duration: '12s' },
    { icon: 'fas fa-camera-retro', top: '25%', left: '85%', size: 'text-6xl', duration: '15s' },
    { icon: 'fas fa-code', top: '70%', left: '5%', size: 'text-4xl', duration: '10s' },
    { icon: 'fas fa-chart-line', top: '80%', left: '90%', size: 'text-5xl', duration: '13s' },
    { icon: 'fas fa-film', top: '50%', left: '50%', size: 'text-3xl', duration: '18s' },
    { icon: 'fas fa-server', top: '5%', left: '40%', size: 'text-4xl', duration: '11s' },
    { icon: 'fas fa-paint-brush', top: '90%', left: '30%', size: 'text-5xl', duration: '16s' },
  ];

  return (
    <div className="absolute inset-0 z-0">
      {icons.map((item, index) => (
        <i
          key={index}
          className={`${item.icon} ${item.size} text-white/10 absolute`}
          style={{
            top: item.top,
            left: item.left,
            animation: `float ${item.duration} ease-in-out infinite`,
            animationDelay: `${index * 1.5}s`,
          }}
        ></i>
      ))}
    </div>
  );
};

const Hero: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Trigger animation shortly after component mounts
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section id="home" className="min-h-screen flex items-center justify-center text-center relative overflow-hidden bg-black">
      <div 
        className="absolute inset-[-10px] animated-gradient" 
        style={{ filter: 'blur(80px)' }}
      ></div>
      <FloatingIcons />
      <div className="relative z-10 container mx-auto px-4 sm:px-6">
        <div className={`transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h1 className="text-[6vw] sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight mb-4 drop-shadow-lg whitespace-nowrap">
            Mention it — Make it happen.
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto mb-8 drop-shadow-md">
            Your ideal partner in digital marketing, media production, and integrated technology solutions.
          </p>
          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              const id = 'contact';
              const el = document.getElementById(id);
              const header = document.querySelector('header');
              const headerHeight = header ? (header as HTMLElement).offsetHeight : 80;
              if (el) {
                const top = el.getBoundingClientRect().top + window.pageYOffset - headerHeight - 8; // small gap
                window.scrollTo({ top, behavior: 'smooth' });
                // ensure focus for accessibility
                el.setAttribute('tabindex', '-1');
                (el as HTMLElement).focus({ preventScroll: true });
              } else {
                // fallback to hash
                try { window.location.hash = id; } catch (err) {}
              }
            }}
            className="bg-red-600 text-white font-bold py-3 px-8 rounded-full hover:bg-red-700 transition-all duration-300 transform hover:scale-105 text-lg shadow-lg"
          >
            Get In Touch
          </a>
        </div>
      </div>

      {/* separator removed per request */}
    </section>
  );
};

export default Hero;