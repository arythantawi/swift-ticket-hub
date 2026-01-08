import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronDown, Clock, MapPin } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const routeCategories = [
  {
    name: 'Jawa - Bali',
    routes: [
      { from: 'Surabaya', to: 'Denpasar', schedules: ['16.00', '19.00', '20.00'] },
      { from: 'Malang', to: 'Denpasar', schedules: ['16.00', '19.00', '20.00'] },
    ],
  },
  {
    name: 'Jawa Timur',
    routes: [
      { from: 'Malang', to: 'Surabaya', schedules: ['01.00', '05.00', '10.00'] },
      { from: 'Surabaya', to: 'Malang', schedules: ['10.00', '13.00', '16.00', '19.00'] },
      { from: 'Blitar', to: 'Surabaya', schedules: ['01.00', '05.00', '10.00'] },
      { from: 'Surabaya', to: 'Blitar', schedules: ['08.00', '10.00', '13.00', '16.00', '19.00'] },
      { from: 'Kediri', to: 'Surabaya', schedules: ['01.00', '05.00', '08.00', '10.00'] },
      { from: 'Surabaya', to: 'Kediri', schedules: ['08.00', '10.00', '13.00', '16.00', '19.00'] },
      { from: 'Banyuwangi', to: 'Surabaya', schedules: ['17.00', '20.00'] },
      { from: 'Surabaya', to: 'Banyuwangi', schedules: ['16.00', '19.00', '21.00'] },
      { from: 'Trenggalek', to: 'Surabaya', schedules: ['07.00', '10.00'] },
      { from: 'Surabaya', to: 'Trenggalek', schedules: ['10.00', '13.00', '16.00', '19.00', '21.00'] },
      { from: 'Ponorogo', to: 'Surabaya', via: 'Madiun', schedules: ['01.00', '05.00', '08.00', '10.00'] },
      { from: 'Surabaya', to: 'Ponorogo', via: 'Madiun', schedules: ['10.00', '13.00', '16.00', '19.00'] },
      { from: 'Jember', to: 'Surabaya', via: 'Lumajang', schedules: ['20.00', '01.00', '05.00', '10.00'] },
      { from: 'Surabaya', to: 'Jember', via: 'Lumajang', schedules: ['10.00', '13.00', '16.00', '19.00'] },
    ],
  },
  {
    name: 'Jawa - Jakarta',
    routes: [
      { from: 'Jakarta', to: 'Surabaya', schedules: ['16.00', '21.00', '22.00'] },
      { from: 'Surabaya', to: 'Jakarta', schedules: ['18.00', '20.00', '22.00'] },
    ],
  },
  {
    name: 'Jawa Tengah - DIY',
    routes: [
      { from: 'Jogja', to: 'Surabaya', via: 'Solo', schedules: ['18.00', '20.00', '21.00'] },
      { from: 'Surabaya', to: 'Jogja', via: 'Solo', schedules: ['10.00', '13.00', '16.00', '19.00', '20.00'] },
    ],
  },
];

const AllRoutes = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [openCategory, setOpenCategory] = useState<string | null>('Jawa - Bali');

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.routes-title', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        },
        y: 40,
        opacity: 0,
        duration: 0.8,
      });

      gsap.from('.route-category', {
        scrollTrigger: {
          trigger: '.routes-container',
          start: 'top 85%',
        },
        y: 30,
        opacity: 0,
        duration: 0.5,
        stagger: 0.1,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="jadwal" className="py-20 bg-background">
      <div className="container">
        <div className="text-center mb-12 routes-title">
          <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
            Jadwal Lengkap
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Semua Rute & Jadwal
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Lihat jadwal keberangkatan lengkap untuk semua rute yang tersedia
          </p>
        </div>

        <div className="routes-container max-w-4xl mx-auto space-y-4">
          {routeCategories.map((category) => (
            <div
              key={category.name}
              className="route-category elevated-card overflow-hidden"
            >
              <button
                onClick={() => setOpenCategory(openCategory === category.name ? null : category.name)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-secondary/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-foreground">
                      {category.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {category.routes.length} rute tersedia
                    </p>
                  </div>
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-muted-foreground transition-transform duration-300 ${
                    openCategory === category.name ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {openCategory === category.name && (
                <div className="border-t border-border">
                  {category.routes.map((route, idx) => (
                    <div
                      key={idx}
                      className="p-5 border-b border-border/50 last:border-b-0 hover:bg-secondary/20 transition-colors"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <span className="font-semibold text-foreground">{route.from}</span>
                          {route.via && (
                            <>
                              <span className="text-muted-foreground">→</span>
                              <span className="text-sm text-muted-foreground">{route.via}</span>
                            </>
                          )}
                          <span className="text-muted-foreground">→</span>
                          <span className="font-semibold text-foreground">{route.to}</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {route.schedules.map((time) => (
                            <span
                              key={time}
                              className="inline-flex items-center gap-1 px-3 py-1.5 bg-primary/10 text-primary text-sm font-medium rounded-full"
                            >
                              <Clock className="w-3 h-3" />
                              {time}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AllRoutes;
