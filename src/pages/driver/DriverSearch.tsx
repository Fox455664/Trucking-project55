import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Filter, MapPin, Loader2 } from 'lucide-react';
import { saudiCities } from '@/data/mockData';
import { api } from '@/services/api';

const DriverSearch = () => {
  const navigate = useNavigate();
  const [allLoads, setAllLoads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [showOriginDropdown, setShowOriginDropdown] = useState(false);
  const [showDestDropdown, setShowDestDropdown] = useState(false);

  useEffect(() => {
    const fetchLoads = async () => {
      try {
        const data = await api.getLoads();
        setAllLoads(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchLoads();
  }, []);

  const filteredLoads = allLoads.filter((load) => {
    if (origin && !load.origin.includes(origin)) return false;
    if (destination && !load.destination.includes(destination)) return false;
    return true;
  });

  const filteredOriginCities = saudiCities.filter(city => 
    city.includes(origin) && city !== origin
  );
  
  const filteredDestCities = saudiCities.filter(city => 
    city.includes(destination) && city !== destination
  );

  return (
    <div className="mobile-container min-h-screen bg-background">
      <div className="page-header">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/driver/dashboard')} className="icon-btn w-10 h-10">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="text-xl font-bold text-foreground">بحث متقدم</h1>
        </div>
      </div>

      <div className="p-4">
        <div className="brand-card p-4 mb-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <Filter className="w-5 h-5 text-primary" />
            </div>
            <h2 className="font-bold text-foreground">تصفية النتائج</h2>
          </div>

          <div className="relative mb-4">
            <label className="block text-sm font-medium text-muted-foreground mb-2">من (المصدر)</label>
            <div className="relative">
              <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
              <input
                type="text"
                value={origin}
                onChange={(e) => { setOrigin(e.target.value); setShowOriginDropdown(true); }}
                onFocus={() => setShowOriginDropdown(true)}
                placeholder="اختر مدينة المصدر"
                className="input-field pr-10"
              />
            </div>
            {showOriginDropdown && filteredOriginCities.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-card rounded-xl shadow-card-hover border border-border max-h-48 overflow-auto">
                {filteredOriginCities.slice(0, 5).map((city) => (
                  <button key={city} onClick={() => { setOrigin(city); setShowOriginDropdown(false); }} className="w-full px-4 py-3 text-right hover:bg-muted transition-colors">{city}</button>
                ))}
              </div>
            )}
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-muted-foreground mb-2">إلى (الوجهة)</label>
            <div className="relative">
              <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary" />
              <input
                type="text"
                value={destination}
                onChange={(e) => { setDestination(e.target.value); setShowDestDropdown(true); }}
                onFocus={() => setShowDestDropdown(true)}
                placeholder="اختر مدينة الوجهة"
                className="input-field pr-10"
              />
            </div>
            {showDestDropdown && filteredDestCities.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-card rounded-xl shadow-card-hover border border-border max-h-48 overflow-auto">
                {filteredDestCities.slice(0, 5).map((city) => (
                  <button key={city} onClick={() => { setDestination(city); setShowDestDropdown(false); }} className="w-full px-4 py-3 text-right hover:bg-muted transition-colors">{city}</button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-foreground">نتائج البحث</h3>
          <span className="text-muted-foreground">{filteredLoads.length} حمولة</span>
        </div>

        <div className="space-y-3">
          {loading ? <div className="text-center"><Loader2 className="animate-spin inline"/></div> : filteredLoads.map((load) => (
            <button
              key={load.id}
              onClick={() => navigate(`/driver/load/${load.id}`)}
              className="brand-card w-full p-4 text-right"
            >
              <div className="flex items-start justify-between mb-3">
                <span className="badge-active">متاحة</span>
                <p className="font-bold text-primary">{Number(load.price).toLocaleString()} ريال</p>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 rounded-full bg-primary" />
                  <div className="w-0.5 h-6 bg-muted" />
                  <div className="w-3 h-3 rounded-full bg-secondary" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-foreground">{load.origin}</p>
                  <div className="h-4" />
                  <p className="font-semibold text-foreground">{load.destination}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mt-3">
                <span>{load.distance || 0} كم</span>
                <span>•</span>
                <span>{load.estimatedTime || '--'}</span>
              </div>
            </button>
          ))}
        </div>

        {!loading && filteredLoads.length === 0 && (
          <div className="text-center py-12">
            <MapPin className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground">لا توجد حمولات مطابقة</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DriverSearch;
