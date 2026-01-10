import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Bus, MapPin, Calendar, ArrowRight, Shield, Star } from 'lucide-react';
import RouteSearch from './RouteSearch';

const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: {
          ease: 'power4.out'
        }
      });

      // Staggered entrance animations
      tl.from(badgeRef.current, {
        y: -30,
        opacity: 0,
        duration: 0.8,
        ease: 'back.out(1.7)'
      })
      .from(titleRef.current, {
        y: 80,
        opacity: 0,
        duration: 1.2,
        ease: 'power4.out'
      }, '-=0.4')
      .from(subtitleRef.current, {
        y: 50,
        opacity: 0,
        duration: 1,
      }, '-=0.7')
      .from(statsRef.current?.children || [], {
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
      }, '-=0.6')
      .from(searchRef.current, {
        y: 60,
        opacity: 0,
        scale: 0.95,
        duration: 1,
        ease: 'power3.out'
      }, '-=0.5');

      // Subtle floating animation for background elements
      gsap.to('.hero-blob-1', {
        y: -20,
        x: 10,
        duration: 4,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1
      });

      gsap.to('.hero-blob-2', {
        y: 15,
        x: -15,
        duration: 5,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1
      });

    }, heroRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={heroRef} className="relative min-h-screen lg:min-h-[95vh] flex items-center overflow-hidden pt-20">
      {/* Clean gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/95 to-primary/85" />
      
      {/* Subtle geometric shapes */}
      <div className="hero-blob-1 absolute top-20 left-10 w-[500px] h-[500px] bg-white/[0.03] rounded-full blur-3xl" />
      <div className="hero-blob-2 absolute bottom-10 right-0 w-[600px] h-[600px] bg-accent/10 rounded-full blur-3xl" />
      
      {/* Minimal grid pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
        backgroundSize: '60px 60px'
      }} />

      <div className="container relative z-10 py-12 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="text-white">
            {/* Badge */}
            <div ref={badgeRef} className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-5 py-2.5 rounded-full mb-8 border border-white/10">
              <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="text-sm font-medium tracking-wide">Travel Minibus Terpercaya</span>
            </div>

            {/* Title */}
            <h1 ref={titleRef} className="font-display text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.1] mb-8">
              Perjalanan Nyaman ke
              <span className="block mt-2 bg-gradient-to-r from-accent via-yellow-300 to-accent bg-clip-text text-transparent">
                Seluruh Jawa & Bali
              </span>
            </h1>

            {/* Subtitle */}
            <p ref={subtitleRef} className="text-lg md:text-xl text-white/70 mb-10 max-w-lg leading-relaxed">
              Layanan travel minibus door-to-door dengan armada modern, 
              jadwal fleksibel, dan harga terjangkau untuk perjalanan Anda.
            </p>

            {/* Stats */}
            <div ref={statsRef} className="flex flex-wrap gap-8">
              <div className="group">
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors duration-300">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <span className="text-2xl font-bold">15+</span>
                </div>
                <span className="text-sm text-white/60 ml-[52px]">Kota Tujuan</span>
              </div>
              <div className="group">
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors duration-300">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <span className="text-2xl font-bold">365</span>
                </div>
                <span className="text-sm text-white/60 ml-[52px]">Hari/Tahun</span>
              </div>
              <div className="group">
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors duration-300">
                    <Star className="w-5 h-5" />
                  </div>
                  <span className="text-2xl font-bold">4.9</span>
                </div>
                <span className="text-sm text-white/60 ml-[52px]">Rating</span>
              </div>
            </div>
          </div>

          {/* Search Card */}
          <div ref={searchRef} className="lg:pl-8">
            <RouteSearch />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
