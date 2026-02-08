import { useState, useEffect, useRef } from 'react';
import { MapPin, Loader2 } from 'lucide-react';
import { Input } from './ui/input';
import { searchPlaces } from '@/services/mapService';

interface LocationInputProps {
  placeholder?: string;
  onPlaceSelected: (address: string, lat: number, lon: number) => void;
  iconColor?: string;
}

export const LocationInputOSM = ({ placeholder, onPlaceSelected, iconColor = "text-primary" }: LocationInputProps) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // البحث لما المستخدم يكتب (مع تأخير بسيط عشان الأداء)
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (query.length >= 3) {
        setLoading(true);
        const results = await searchPlaces(query);
        setSuggestions(results);
        setLoading(false);
        setShowSuggestions(true);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 1000); // يستنى ثانية بعد الكتابة

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  // إخفاء القائمة لما نضغط بره
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);

  const handleSelect = (item: any) => {
    setQuery(item.label.split(',')[0]); // ناخذ الاسم الأول بس عشان الشكل
    onPlaceSelected(item.label, parseFloat(item.lat), parseFloat(item.lon));
    setShowSuggestions(false);
  };

  return (
    <div className="relative" ref={wrapperRef}>
      <MapPin className={`absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 ${iconColor} z-10 pointer-events-none`} />
      <Input
        type="text"
        placeholder={placeholder}
        className="pr-10 h-12 bg-white/50 border-muted-foreground/20 focus:border-primary transition-all text-right"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => query.length >= 3 && setShowSuggestions(true)}
      />
      
      {/* Loading Indicator */}
      {loading && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2">
          <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
        </div>
      )}

      {/* Suggestions List */}
      {showSuggestions && suggestions.length > 0 && (
        <ul className="absolute z-50 w-full mt-1 bg-white border border-border rounded-xl shadow-xl max-h-60 overflow-auto animate-fade-in">
          {suggestions.map((item, index) => (
            <li 
              key={index}
              onClick={() => handleSelect(item)}
              className="px-4 py-3 hover:bg-muted cursor-pointer text-sm text-right border-b border-border/50 last:border-0 transition-colors"
            >
              {item.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
