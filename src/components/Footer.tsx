import { Bus, MapPin, Phone, Mail, Clock, Instagram, Facebook, MessageCircle } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const routes = [
    'Surabaya - Denpasar',
    'Malang - Denpasar',
    'Surabaya - Jakarta',
    'Surabaya - Jogja',
    'Surabaya - Malang',
    'Surabaya - Banyuwangi',
  ];

  const serviceHours = [
    { day: 'Senin - Jumat', hours: '06:00 - 22:00' },
    { day: 'Sabtu - Minggu', hours: '07:00 - 21:00' },
  ];

  return (
    <footer id="kontak" className="bg-foreground text-background">
      <div className="container py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-5">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <Bus className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="font-display font-bold text-lg text-background">
                Travel Minibus
              </span>
            </div>
            <p className="text-background/70 text-sm mb-6 leading-relaxed">
              Layanan travel minibus profesional untuk perjalanan nyaman dan aman 
              ke berbagai kota di Jawa dan Bali.
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-green-500 transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Popular Routes */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-5">Rute Populer</h4>
            <ul className="space-y-3">
              {routes.map((route) => (
                <li key={route}>
                  <a
                    href="#"
                    className="text-background/70 text-sm hover:text-accent transition-colors flex items-center gap-2"
                  >
                    <MapPin className="w-4 h-4 text-primary" />
                    {route}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Service Hours */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-5">Jam Operasional</h4>
            <div className="space-y-4">
              {serviceHours.map((item) => (
                <div key={item.day} className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-background font-medium text-sm">{item.day}</p>
                    <p className="text-background/60 text-sm">{item.hours}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 bg-background/5 rounded-xl border border-background/10">
              <p className="text-sm text-background/80">
                <span className="text-accent font-semibold">📞 Hotline 24 Jam</span><br />
                Untuk informasi & bantuan darurat
              </p>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-5">Hubungi Kami</h4>
            <div className="space-y-4">
              <a
                href="tel:+6281234567890"
                className="flex items-start gap-3 text-background/70 hover:text-accent transition-colors"
              >
                <Phone className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm">Telepon / WhatsApp</p>
                  <p className="text-background font-medium">0812-3456-7890</p>
                </div>
              </a>
              <a
                href="mailto:info@travelminibus.com"
                className="flex items-start gap-3 text-background/70 hover:text-accent transition-colors"
              >
                <Mail className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm">Email</p>
                  <p className="text-background font-medium">info@travelminibus.com</p>
                </div>
              </a>
              <div className="flex items-start gap-3 text-background/70">
                <MapPin className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm">Kantor Pusat</p>
                  <p className="text-background font-medium text-sm">
                    Jl. Raya Surabaya No. 123<br />
                    Surabaya, Jawa Timur
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-background/10">
        <div className="container py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-background/60 text-sm">
            © {currentYear} Travel Minibus. Semua hak dilindungi.
          </p>
          <div className="flex gap-6 text-sm">
            <a href="#" className="text-background/60 hover:text-accent transition-colors">
              Syarat & Ketentuan
            </a>
            <a href="#" className="text-background/60 hover:text-accent transition-colors">
              Kebijakan Privasi
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
