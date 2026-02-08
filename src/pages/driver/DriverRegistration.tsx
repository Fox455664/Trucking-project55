import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppStore } from '@/store/useAppStore';
import { api } from '@/services/api';
import { supabase } from '@/lib/supabase';
import { truckTypes, trailerTypes, truckDimensions } from '@/data/mockData'; // هنستخدم دول بس كقوائم ثابتة
import { ArrowLeft, Check, Truck, Box, Ruler, User, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function DriverRegistration() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const role = state?.role || 'driver';
  
  const { phoneNumber, countryCode, selectedTruckType, setSelectedTruckType, selectedTrailerType, setSelectedTrailerType, selectedDimensions, setSelectedDimensions } = useAppStore();
  
  const [step, setStep] = useState('profile');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFinish = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user");

      // 1. حفظ البروفايل
      await api.createProfile(user.id, name, role, phoneNumber, countryCode);

      // 2. لو سائق، حفظ بيانات العربية
      if (role === 'driver') {
        await api.saveDriverDetails(user.id, {
          truck_type: selectedTruckType,
          trailer_type: selectedTrailerType,
          dimensions: selectedDimensions
        });
      }

      toast.success('تم التسجيل بنجاح');
      navigate(role === 'driver' ? '/driver/dashboard' : '/shipper');
    } catch (e) {
      toast.error('حدث خطأ في الحفظ');
      console.error(e);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background pb-20 p-4">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate(-1)}><ArrowLeft /></button>
        <h1 className="text-xl font-bold">إكمال البيانات</h1>
      </div>

      {step === 'profile' && (
        <div className="space-y-4">
          <Label>الاسم بالكامل</Label>
          <Input value={name} onChange={e => setName(e.target.value)} className="text-lg" placeholder="اسمك الثلاثي" />
          <div className="opacity-50 mt-4">
            <Label>رقم الموبايل</Label>
            <Input value={`${countryCode} ${phoneNumber}`} disabled className="bg-muted text-left" dir="ltr" />
          </div>
          <Button 
            className="w-full mt-8 h-12 text-lg" 
            onClick={() => role === 'driver' ? setStep('truck') : handleFinish()}
            disabled={!name || loading}
          >
            {role === 'driver' ? 'التالي' : (loading ? <Loader2 className="animate-spin"/> : 'حفظ')}
          </Button>
        </div>
      )}

      {/* باقي خطوات السائق: الشاحنة والمقطورة */}
      {step !== 'profile' && role === 'driver' && (
        <div className="space-y-6">
          {step === 'truck' && (
            <div className="grid grid-cols-2 gap-4">
              {truckTypes.map(t => (
                <div key={t.id} onClick={() => setSelectedTruckType(t.id)} className={`border-2 rounded-xl p-4 text-center cursor-pointer ${selectedTruckType === t.id ? 'border-primary bg-primary/5' : ''}`}>
                  <div className="text-3xl mb-2">{t.icon}</div>
                  <div>{t.nameAr}</div>
                </div>
              ))}
              <Button className="col-span-2 mt-4" onClick={() => setStep('trailer')} disabled={!selectedTruckType}>التالي</Button>
            </div>
          )}

          {step === 'trailer' && (
            <div className="grid grid-cols-2 gap-4">
              {trailerTypes.map(t => (
                <div key={t.id} onClick={() => setSelectedTrailerType(t.id)} className={`border-2 rounded-xl p-4 text-center cursor-pointer ${selectedTrailerType === t.id ? 'border-primary bg-primary/5' : ''}`}>
                  <div className="text-3xl mb-2">{t.icon}</div>
                  <div>{t.nameAr}</div>
                </div>
              ))}
              <Button className="col-span-2 mt-4" onClick={() => setStep('dimensions')} disabled={!selectedTrailerType}>التالي</Button>
            </div>
          )}

          {step === 'dimensions' && (
            <div className="space-y-3">
              {truckDimensions.map(d => (
                <div key={d.id} onClick={() => setSelectedDimensions(d.id)} className={`border-2 rounded-xl p-4 flex justify-between items-center cursor-pointer ${selectedDimensions === d.id ? 'border-primary bg-primary/5' : ''}`}>
                  <div>
                    <div className="font-bold">{d.nameAr}</div>
                    <div className="text-sm text-muted-foreground">{d.specs}</div>
                  </div>
                  {selectedDimensions === d.id && <Check className="text-primary" />}
                </div>
              ))}
              <Button className="w-full mt-8" onClick={handleFinish} disabled={!selectedDimensions || loading}>
                {loading ? <Loader2 className="animate-spin"/> : 'إتمام التسجيل'}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
