import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Check, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';

const WelcomePage = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [selectedLang, setSelectedLang] = useState(i18n.language?.split('-')[0] || 'en');

  useEffect(() => {
    const dir = selectedLang === 'ar' || selectedLang === 'ur' ? 'rtl' : 'ltr';
    document.documentElement.dir = dir;
    document.documentElement.lang = selectedLang;
    
    if (selectedLang === 'ur') {
      document.body.style.fontFamily = "'Noto Nastaliq Urdu', serif";
    } else if (selectedLang === 'ar') {
      document.body.style.fontFamily = "'Cairo', sans-serif";
    } else {
      document.body.style.fontFamily = "inherit";
    }
  }, [selectedLang]);

  const handleLanguageChange = (lang: string) => {
    setSelectedLang(lang);
    i18n.changeLanguage(lang);
  };

  const handleContinue = () => {
    navigate('/login');
  };

  const languages = [
    { code: 'ar', label: 'العربية', flag: '🇸🇦', fontClass: 'font-cairo' },
    { code: 'ur', label: 'اردو', flag: '🇵🇰', fontClass: 'font-nastaliq' },
    { code: 'en', label: 'English', flag: '🇺🇸', fontClass: 'font-sans' },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      
      {/* خلفية بتصميم العلامة التجارية (أزرق وأحمر) */}
      <div className="absolute top-0 left-0 w-full h-[60%] bg-gradient-to-b from-primary/5 to-transparent -z-10" />
      {/* دوائر تزيينية بألوان الشعار */}
      <div className="absolute -top-20 -right-20 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute top-1/3 -left-20 w-60 h-60 bg-secondary/10 rounded-full blur-3xl" />

      <div className="flex-1 flex flex-col items-center justify-center p-6 w-full max-w-md mx-auto z-10">
        
        {/* قسم الشعار */}
        <div className="mb-12 flex flex-col items-center animate-fade-in w-full">
          <div className="w-full max-w-[200px] mb-8 relative">
            {/* الشعار الرسمي */}
            {/* تأكد من وضع صورة الشعار باسم logo.png في مجلد public */}
            <img 
              src="/logo.png" 
              alt="SAS Transport" 
              className="w-full h-auto drop-shadow-xl object-contain"
              onError={(e) => {
                // Fallback if image not found (Text Logo)
                e.currentTarget.style.display = 'none';
                document.getElementById('fallback-logo')!.style.display = 'flex';
              }}
            />
            {/* Fallback Logo (يظهر فقط إذا لم توجد الصورة) */}
            <div id="fallback-logo" className="hidden w-32 h-32 bg-white rounded-3xl shadow-lg border-2 border-primary/20 items-center justify-center mx-auto">
               <span className="text-4xl font-black text-primary tracking-tighter">SAS</span>
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-primary mb-2 text-center">
            {t('welcome')}
          </h1>
          <p className="text-muted-foreground text-lg text-center font-medium">
            {t('slogan')}
          </p>
        </div>

        {/* قسم اختيار اللغة */}
        <div className="w-full space-y-6 mb-12">
          <div className="flex items-center gap-2 px-2">
            <Globe className="w-4 h-4 text-secondary" />
            <span className="text-sm font-bold text-foreground/70 uppercase tracking-wider">
              {t('language_select')}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={cn(
                  "relative flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-300 group",
                  selectedLang === lang.code 
                    ? "border-primary bg-primary/5 shadow-md scale-[1.02]" 
                    : "border-muted bg-card hover:border-primary/30 hover:bg-muted/30"
                )}
              >
                <div className="flex items-center gap-4">
                  <span className="text-2xl shadow-sm rounded-full bg-white w-10 h-10 flex items-center justify-center border border-muted">
                    {lang.flag}
                  </span>
                  <span className={cn("text-lg font-bold text-foreground", lang.fontClass)}>
                    {lang.label}
                  </span>
                </div>
                
                <div className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300",
                  selectedLang === lang.code ? "bg-primary text-white" : "bg-transparent border-2 border-muted-foreground/30"
                )}>
                  {selectedLang === lang.code && <Check className="w-4 h-4" strokeWidth={3} />}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* زر الاستمرار */}
        <button
          onClick={handleContinue}
          className="w-full bg-primary hover:bg-primary/90 text-white font-bold text-xl py-4 rounded-2xl shadow-lg shadow-primary/30 transition-all duration-300 hover:-translate-y-1 active:translate-y-0 active:scale-95 flex items-center justify-center gap-3 group border-b-4 border-primary/50 active:border-b-0 active:mt-1"
        >
          <span>{t('continue')}</span>
          <svg 
            className={cn(
              "w-6 h-6 transition-transform duration-300",
              selectedLang === 'ar' || selectedLang === 'ur' ? "rotate-180 group-hover:-translate-x-1" : "group-hover:translate-x-1"
            )} 
            fill="none" viewBox="0 0 24 24" stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>

        {/* الحقوق */}
        <p className="mt-8 text-xs text-muted-foreground/60 text-center font-medium">
          {t('rights')}
        </p>
      </div>
    </div>
  );
};

export default WelcomePage;
