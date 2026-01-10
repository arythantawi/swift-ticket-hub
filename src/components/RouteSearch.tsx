import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Users, Search, ArrowRight, ArrowLeftRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const cities = [
  'Surabaya', 'Malang', 'Denpasar', 'Blitar', 'Kediri', 
  'Banyuwangi', 'Trenggalek', 'Ponorogo', 'Madiun', 
  'Jember', 'Lumajang', 'Jakarta', 'Jogja', 'Solo'
];

const RouteSearch = () => {
  const navigate = useNavigate();
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const [passengers, setPassengers] = useState('1');

  const swapCities = () => {
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
  };

  const handleSearch = () => {
    if (!origin || !destination) {
      toast.error('Pilih kota asal dan tujuan');
      return;
    }
    if (!date) {
      toast.error('Pilih tanggal keberangkatan');
      return;
    }
    if (origin === destination) {
      toast.error('Kota asal dan tujuan tidak boleh sama');
      return;
    }
    
    const params = new URLSearchParams({
      from: origin,
      to: destination,
      date: date,
      passengers: passengers,
    });
    navigate(`/search?${params.toString()}`);
  };

  return (
    <div className="bg-card/95 backdrop-blur-xl rounded-3xl p-8 md:p-10 shadow-2xl border border-border/50">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
          <Search className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h3 className="font-display text-xl font-semibold text-foreground">
            Cari Jadwal Perjalanan
          </h3>
          <p className="text-sm text-muted-foreground">Pesan tiket dengan mudah</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Origin & Destination */}
        <div className="relative">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="relative group">
              <label className="block text-sm font-medium text-foreground mb-2">
                Kota Asal
              </label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary transition-colors" />
                <select
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-muted/50 border-2 border-transparent rounded-xl focus:border-primary focus:bg-background transition-all duration-300 appearance-none cursor-pointer text-foreground font-medium"
                >
                  <option value="">Pilih kota asal</option>
                  {cities.map((city) => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Swap button */}
            <button
              onClick={swapCities}
              className="absolute left-1/2 top-[58px] -translate-x-1/2 z-10 w-11 h-11 bg-card border-2 border-primary/20 rounded-full flex items-center justify-center hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300 hidden md:flex shadow-lg"
              title="Tukar kota"
            >
              <ArrowLeftRight className="w-5 h-5" />
            </button>

            <div className="relative group">
              <label className="block text-sm font-medium text-foreground mb-2">
                Kota Tujuan
              </label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-accent transition-colors" />
                <select
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-muted/50 border-2 border-transparent rounded-xl focus:border-primary focus:bg-background transition-all duration-300 appearance-none cursor-pointer text-foreground font-medium"
                >
                  <option value="">Pilih kota tujuan</option>
                  {cities.map((city) => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Date & Passengers */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Tanggal Berangkat
            </label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full pl-12 pr-4 py-4 bg-muted/50 border-2 border-transparent rounded-xl focus:border-primary focus:bg-background transition-all duration-300 text-foreground font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Jumlah Penumpang
            </label>
            <div className="relative">
              <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <select
                value={passengers}
                onChange={(e) => setPassengers(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-muted/50 border-2 border-transparent rounded-xl focus:border-primary focus:bg-background transition-all duration-300 appearance-none cursor-pointer text-foreground font-medium"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                  <option key={num} value={num}>{num} Penumpang</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Search Button */}
        <Button
          onClick={handleSearch}
          className="w-full bg-gradient-to-r from-accent to-yellow-500 hover:from-accent/90 hover:to-yellow-500/90 text-accent-foreground py-7 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 group"
        >
          <Search className="w-5 h-5 mr-2" />
          Cari Jadwal
          <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </div>
  );
};

export default RouteSearch;
