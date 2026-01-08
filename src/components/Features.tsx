import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Shield, Clock, MapPin, Headphones, CreditCard, Users } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    icon: Shield,
    title: 'Aman & Terpercaya',
    description: 'Armada terawat dengan sopir berpengalaman dan asuransi perjalanan.',
  },
  {
    icon: Clock,
    title: 'Jadwal Fleksibel',
    description: 'Berbagai pilihan waktu keberangkatan sesuai kebutuhan Anda.',
  },
  {
    icon: MapPin,
    title: 'Door to Door',
    description: 'Layanan antar jemput dari lokasi Anda langsung ke tujuan.',
  },
  {
    icon: Headphones,
    title: 'Layanan 24 Jam',
    description: 'Tim customer service siap membantu kapan saja Anda butuhkan.',
  },
  {
    icon: CreditCard,
    title: 'Pembayaran Mudah',
    description: 'Transfer bank dengan konfirmasi cepat dan aman.',
  },
  {
    icon: Users,
    title: 'Grup & Keluarga',
    description: 'Harga spesial untuk pemesanan rombongan dan keluarga.',
  },
];

const Features = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.feature-title', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        },
        y: 40,
        opacity: 0,
        duration: 0.8,
      });

      gsap.from('.feature-card', {
        scrollTrigger: {
          trigger: '.feature-grid',
          start: 'top 85%',
        },
        y: 50,
        opacity: 0,
        duration: 0.5,
        stagger: 0.1,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-20 bg-background">
      <div className="container">
        <div className="text-center mb-12 feature-title">
          <span className="inline-block px-4 py-1.5 bg-accent/10 text-accent rounded-full text-sm font-medium mb-4">
            Keunggulan Kami
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Mengapa Memilih Kami?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Komitmen kami adalah memberikan pengalaman perjalanan terbaik untuk setiap pelanggan
          </p>
        </div>

        <div className="feature-grid grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="feature-card group p-6 bg-card rounded-2xl border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-lg"
            >
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                <feature.icon className="w-7 h-7 text-primary group-hover:text-primary-foreground transition-colors" />
              </div>
              <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
