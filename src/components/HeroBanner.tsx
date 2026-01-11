import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import gsap from 'gsap';

interface Banner {
  id: string;
  title: string;
  subtitle: string | null;
  image_url: string | null;
  link_url: string | null;
  button_text: string | null;
  layout_type: string;
}

// Helper function to convert Google Drive links to direct image URL
const convertGoogleDriveUrl = (url: string | null): string | null => {
  if (!url) return url;
  
  const filePattern = /drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/;
  const fileMatch = url.match(filePattern);
  if (fileMatch) return `https://lh3.googleusercontent.com/d/${fileMatch[1]}`;
  
  const openPattern = /drive\.google\.com\/open\?id=([a-zA-Z0-9_-]+)/;
  const openMatch = url.match(openPattern);
  if (openMatch) return `https://lh3.googleusercontent.com/d/${openMatch[1]}`;
  
  const ucPattern = /drive\.google\.com\/uc\?.*id=([a-zA-Z0-9_-]+)/;
  const ucMatch = url.match(ucPattern);
  if (ucMatch) return `https://lh3.googleusercontent.com/d/${ucMatch[1]}`;
  
  return url;
};

const HeroBanner = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [previousIndex, setPreviousIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [direction, setDirection] = useState<'next' | 'prev'>('next');
  
  const containerRef = useRef<HTMLDivElement>(null);
  const slidesRef = useRef<(HTMLDivElement | null)[]>([]);
  const progressRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    const fetchBanners = async () => {
      const { data, error } = await supabase
        .from('banners')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (!error && data) {
        setBanners(data);
      }
      setIsLoading(false);
    };

    fetchBanners();
  }, []);

  // Animate slide transition
  const animateSlide = useCallback((from: number, to: number, dir: 'next' | 'prev') => {
    if (isAnimating || !slidesRef.current[from] || !slidesRef.current[to]) return;
    
    setIsAnimating(true);
    
    const fromSlide = slidesRef.current[from];
    const toSlide = slidesRef.current[to];
    
    const xFrom = dir === 'next' ? '100%' : '-100%';
    const xTo = dir === 'next' ? '-100%' : '100%';
    
    // Set initial states
    gsap.set(toSlide, { 
      xPercent: dir === 'next' ? 100 : -100, 
      opacity: 1,
      visibility: 'visible',
      zIndex: 2
    });
    gsap.set(fromSlide, { 
      xPercent: 0, 
      zIndex: 1 
    });
    
    // Create timeline for smooth animation
    const tl = gsap.timeline({
      onComplete: () => {
        setIsAnimating(false);
        gsap.set(fromSlide, { visibility: 'hidden', zIndex: 0 });
      }
    });
    
    // Animate both slides
    tl.to(fromSlide, {
      xPercent: dir === 'next' ? -30 : 30,
      opacity: 0.5,
      scale: 0.95,
      duration: 0.8,
      ease: 'power3.inOut'
    }, 0)
    .to(toSlide, {
      xPercent: 0,
      duration: 0.8,
      ease: 'power3.inOut'
    }, 0);
    
    // Animate content inside new slide
    const contentElements = toSlide?.querySelectorAll('.slide-content > *');
    if (contentElements) {
      tl.fromTo(contentElements, 
        { y: 40, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          duration: 0.6, 
          stagger: 0.1,
          ease: 'power3.out'
        },
        0.4
      );
    }
  }, [isAnimating]);

  // Handle navigation
  const goToSlide = useCallback((index: number, dir?: 'next' | 'prev') => {
    if (isAnimating || index === currentIndex) return;
    
    const newDir = dir || (index > currentIndex ? 'next' : 'prev');
    setDirection(newDir);
    setPreviousIndex(currentIndex);
    setCurrentIndex(index);
  }, [currentIndex, isAnimating]);

  const goNext = useCallback(() => {
    const nextIndex = (currentIndex + 1) % banners.length;
    goToSlide(nextIndex, 'next');
  }, [currentIndex, banners.length, goToSlide]);

  const goPrev = useCallback(() => {
    const prevIndex = (currentIndex - 1 + banners.length) % banners.length;
    goToSlide(prevIndex, 'prev');
  }, [currentIndex, banners.length, goToSlide]);

  // Trigger animation when index changes
  useEffect(() => {
    if (banners.length > 1 && previousIndex !== currentIndex) {
      animateSlide(previousIndex, currentIndex, direction);
    }
  }, [currentIndex, previousIndex, direction, animateSlide, banners.length]);

  // Auto-play with progress bar
  useEffect(() => {
    if (banners.length <= 1 || isPaused) return;
    
    // Animate progress bar
    if (progressRef.current) {
      gsap.killTweensOf(progressRef.current);
      gsap.set(progressRef.current, { scaleX: 0 });
      timelineRef.current = gsap.to(progressRef.current, {
        scaleX: 1,
        duration: 5,
        ease: 'none',
        onComplete: goNext
      });
    }
    
    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
    };
  }, [currentIndex, banners.length, isPaused, goNext]);

  // Initialize first slide
  useEffect(() => {
    if (banners.length > 0 && slidesRef.current[0]) {
      gsap.set(slidesRef.current[0], { 
        xPercent: 0, 
        opacity: 1, 
        visibility: 'visible',
        zIndex: 2
      });
      
      // Animate initial content
      const contentElements = slidesRef.current[0]?.querySelectorAll('.slide-content > *');
      if (contentElements) {
        gsap.fromTo(contentElements,
          { y: 60, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: 'power3.out', delay: 0.3 }
        );
      }
    }
  }, [banners.length]);

  if (isLoading || banners.length === 0) return null;

  const renderSlideContent = (banner: Banner, index: number) => {
    const layoutType = banner.layout_type || 'image_caption';
    const hasImage = banner.image_url;
    const imageUrl = convertGoogleDriveUrl(banner.image_url);

    switch (layoutType) {
      case 'image_full':
        return (
          <div className="relative w-full h-full">
            {hasImage ? (
              <img 
                src={imageUrl!}
                alt={banner.title}
                className="w-full h-full object-cover"
                draggable={false}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary via-primary to-primary/80" />
            )}
            {/* Elegant gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
            
            {/* Floating content at bottom */}
            <div className="slide-content absolute bottom-0 left-0 right-0 p-6 md:p-10">
              <div className="max-w-4xl mx-auto text-center md:text-left">
                <h2 className="text-2xl md:text-5xl lg:text-6xl font-bold text-white mb-3 drop-shadow-2xl leading-tight">
                  {banner.title}
                </h2>
                {banner.subtitle && (
                  <p className="text-base md:text-xl text-white/90 mb-6 max-w-2xl drop-shadow-lg leading-relaxed">
                    {banner.subtitle}
                  </p>
                )}
                {banner.link_url && banner.button_text && (
                  <Button
                    asChild
                    size="lg"
                    className="bg-white text-primary hover:bg-white/90 px-8 py-6 text-base font-semibold rounded-2xl shadow-2xl hover:shadow-white/25 transition-all duration-500 hover:-translate-y-1 hover:scale-105"
                  >
                    <a href={banner.link_url}>{banner.button_text}</a>
                  </Button>
                )}
              </div>
            </div>
          </div>
        );

      case 'image_overlay':
        return (
          <div className="relative w-full h-full">
            {hasImage ? (
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${imageUrl})` }}
              />
            ) : null}
            {/* Stylish overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            
            {/* Centered content */}
            <div className="slide-content relative z-10 flex flex-col items-center justify-center text-center h-full p-6 md:p-12">
              <h2 className="text-3xl md:text-6xl lg:text-7xl font-bold text-white mb-4 max-w-4xl leading-tight drop-shadow-2xl">
                {banner.title}
              </h2>
              {banner.subtitle && (
                <p className="text-lg md:text-2xl text-white/90 mb-8 max-w-2xl leading-relaxed drop-shadow-lg">
                  {banner.subtitle}
                </p>
              )}
              {banner.link_url && banner.button_text && (
                <Button
                  asChild
                  size="lg"
                  className="bg-white/10 backdrop-blur-md border-2 border-white/30 text-white hover:bg-white hover:text-primary px-10 py-6 text-lg font-semibold rounded-full shadow-2xl transition-all duration-500 hover:scale-105"
                >
                  <a href={banner.link_url}>{banner.button_text}</a>
                </Button>
              )}
            </div>
          </div>
        );

      case 'image_caption':
        return (
          <div className="relative w-full h-full flex flex-col">
            {hasImage ? (
              <div className="flex-1 relative overflow-hidden">
                <img 
                  src={imageUrl!}
                  alt={banner.title}
                  className="w-full h-full object-cover"
                  draggable={false}
                />
                {/* Subtle gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
            ) : (
              <div className="flex-1 bg-gradient-to-br from-primary via-primary to-primary/80" />
            )}
            
            {/* Modern caption bar */}
            <div className="slide-content bg-gradient-to-r from-primary via-primary to-primary/90 px-6 py-5 md:px-10 md:py-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 max-w-6xl mx-auto">
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl md:text-3xl font-bold text-white truncate">
                    {banner.title}
                  </h2>
                  {banner.subtitle && (
                    <p className="text-sm md:text-lg text-white/80 mt-1 line-clamp-1">
                      {banner.subtitle}
                    </p>
                  )}
                </div>
                {banner.link_url && banner.button_text && (
                  <Button
                    asChild
                    className="bg-white text-primary hover:bg-white/90 px-8 py-3 text-sm font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 shrink-0 w-fit"
                  >
                    <a href={banner.link_url}>{banner.button_text}</a>
                  </Button>
                )}
              </div>
            </div>
          </div>
        );

      case 'text_only':
      default:
        return (
          <div className="relative w-full h-full bg-gradient-to-br from-primary via-primary to-primary/80">
            {/* Decorative elements */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-10 left-10 w-40 h-40 rounded-full bg-white blur-3xl" />
              <div className="absolute bottom-10 right-10 w-60 h-60 rounded-full bg-white blur-3xl" />
            </div>
            
            <div className="slide-content relative z-10 flex flex-col items-center justify-center text-center h-full p-6 md:p-12">
              <h2 className="text-3xl md:text-6xl font-bold text-white mb-4 max-w-4xl leading-tight">
                {banner.title}
              </h2>
              {banner.subtitle && (
                <p className="text-lg md:text-xl text-white/80 mb-8 max-w-2xl leading-relaxed">
                  {banner.subtitle}
                </p>
              )}
              {banner.link_url && banner.button_text && (
                <Button
                  asChild
                  size="lg"
                  className="bg-white text-primary hover:bg-white/90 px-10 py-6 text-lg font-semibold rounded-2xl shadow-2xl transition-all duration-500 hover:-translate-y-1 hover:scale-105"
                >
                  <a href={banner.link_url}>{banner.button_text}</a>
                </Button>
              )}
            </div>
          </div>
        );
    }
  };

  return (
    <section className="py-6 md:py-10 bg-background">
      <div className="container px-4">
        <div 
          ref={containerRef}
          className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[16/9] md:aspect-[21/9] bg-muted"
        >
          {/* Slides */}
          {banners.map((banner, index) => (
            <div
              key={banner.id}
              ref={(el) => (slidesRef.current[index] = el)}
              className="absolute inset-0 will-change-transform"
              style={{ 
                visibility: index === 0 ? 'visible' : 'hidden',
                opacity: index === 0 ? 1 : 0,
                zIndex: index === 0 ? 2 : 0
              }}
            >
              {renderSlideContent(banner, index)}
            </div>
          ))}

          {/* Navigation Arrows - Modern glassmorphism style */}
          {banners.length > 1 && (
            <>
              <button
                onClick={goPrev}
                disabled={isAnimating}
                className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 z-30 w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center text-white bg-white/10 hover:bg-white/25 backdrop-blur-md border border-white/20 transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-6 h-6 md:w-7 md:h-7" />
              </button>
              <button
                onClick={goNext}
                disabled={isAnimating}
                className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 z-30 w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center text-white bg-white/10 hover:bg-white/25 backdrop-blur-md border border-white/20 transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                aria-label="Next slide"
              >
                <ChevronRight className="w-6 h-6 md:w-7 md:h-7" />
              </button>
            </>
          )}

          {/* Bottom controls */}
          {banners.length > 1 && (
            <div className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-4">
              {/* Pause/Play button */}
              <button
                onClick={() => setIsPaused(!isPaused)}
                className="w-10 h-10 rounded-full flex items-center justify-center text-white bg-white/10 hover:bg-white/25 backdrop-blur-md border border-white/20 transition-all duration-300 hover:scale-110"
                aria-label={isPaused ? 'Play' : 'Pause'}
              >
                {isPaused ? (
                  <Play className="w-4 h-4 ml-0.5" />
                ) : (
                  <Pause className="w-4 h-4" />
                )}
              </button>
              
              {/* Modern dot indicators with progress */}
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-full px-4 py-2 border border-white/20">
                {banners.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    disabled={isAnimating}
                    className={`relative h-2 rounded-full transition-all duration-500 overflow-hidden ${
                      index === currentIndex 
                        ? 'w-8 bg-white/30' 
                        : 'w-2 bg-white/40 hover:bg-white/60'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  >
                    {index === currentIndex && (
                      <div
                        ref={index === currentIndex ? progressRef : null}
                        className="absolute inset-0 bg-white rounded-full origin-left"
                        style={{ transform: 'scaleX(0)' }}
                      />
                    )}
                  </button>
                ))}
              </div>
              
              {/* Slide counter */}
              <div className="text-white/80 text-sm font-medium bg-white/10 backdrop-blur-md rounded-full px-3 py-1.5 border border-white/20">
                {String(currentIndex + 1).padStart(2, '0')} / {String(banners.length).padStart(2, '0')}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
