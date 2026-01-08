import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Copy, CheckCircle, Building2, User, CreditCard } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

gsap.registerPlugin(ScrollTrigger);

const PaymentInfo = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [copied, setCopied] = useState(false);

  const bankDetails = {
    bank: 'BCA',
    accountNumber: '0613002917',
    accountName: 'Muhammad Nur Huda',
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(bankDetails.accountNumber);
    setCopied(true);
    toast.success('Nomor rekening berhasil disalin!');
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.payment-content', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        },
        x: -50,
        opacity: 0,
        duration: 0.8,
      });

      gsap.from('.payment-card', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        },
        x: 50,
        opacity: 0,
        duration: 0.8,
        delay: 0.2,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const steps = [
    'Lakukan pemesanan melalui form booking',
    'Sistem akan menghasilkan Order ID & total pembayaran',
    'Transfer ke rekening yang tertera',
    'Upload bukti transfer melalui sistem',
    'Admin memverifikasi pembayaran Anda',
    'Status berubah menjadi LUNAS ✓',
  ];

  return (
    <section ref={sectionRef} className="py-20 bg-secondary/30">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="payment-content">
            <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
              Pembayaran Mudah
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
              Cara Pembayaran
            </h2>
            <p className="text-muted-foreground mb-8">
              Proses pembayaran yang simpel dan aman melalui transfer bank. 
              Konfirmasi cepat dalam hitungan menit setelah bukti transfer diterima.
            </p>

            <div className="space-y-4">
              {steps.map((step, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                  <p className="text-foreground pt-1">{step}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="payment-card">
            <div className="elevated-card p-8 relative overflow-hidden">
              {/* Decorative gradient */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-primary/20 to-transparent rounded-bl-full" />
              
              <div className="relative">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-bold text-foreground">
                      Transfer Bank
                    </h3>
                    <p className="text-sm text-muted-foreground">Metode pembayaran</p>
                  </div>
                </div>

                <div className="space-y-5">
                  <div className="flex items-center gap-4 p-4 bg-secondary/50 rounded-xl">
                    <Building2 className="w-5 h-5 text-primary" />
                    <div>
                      <span className="text-sm text-muted-foreground">Bank</span>
                      <p className="font-semibold text-foreground text-lg">{bankDetails.bank}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-secondary/50 rounded-xl">
                    <CreditCard className="w-5 h-5 text-primary" />
                    <div className="flex-1">
                      <span className="text-sm text-muted-foreground">Nomor Rekening</span>
                      <p className="font-mono font-bold text-foreground text-xl tracking-wider">
                        {bankDetails.accountNumber}
                      </p>
                    </div>
                    <button
                      onClick={copyToClipboard}
                      className="p-2 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors"
                      title="Salin nomor rekening"
                    >
                      {copied ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <Copy className="w-5 h-5 text-primary" />
                      )}
                    </button>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-secondary/50 rounded-xl">
                    <User className="w-5 h-5 text-primary" />
                    <div>
                      <span className="text-sm text-muted-foreground">Atas Nama</span>
                      <p className="font-semibold text-foreground text-lg">{bankDetails.accountName}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-accent/10 rounded-xl border border-accent/20">
                  <p className="text-sm text-foreground">
                    <span className="font-semibold text-accent">💡 Tips:</span> Simpan bukti transfer dan upload 
                    segera setelah pembayaran untuk konfirmasi yang lebih cepat.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PaymentInfo;
