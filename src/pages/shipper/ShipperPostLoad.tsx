import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '@/services/api';
import { supabase } from '@/lib/supabase';
import { truckTypes } from '@/data/mockData';
import { ArrowLeft, Weight, DollarSign, Loader2, Route } from 'lucide-react';
import { toast } from 'sonner';
import { SmartLocationSelect } from '@/components/SmartLocationSelect';
import { calculateDistanceOSM } from '@/services/mapService';
import { useTranslation } from 'react-i18next';

export default function ShipperPostLoad() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [formData, setFormData] = useState({ 
    origin: '', 
    originLat: 0, 
    originLng: 0,
    destination: '', 
    destLat: 0,
    destLng: 0,
    weight: '', 
    price: '', 
    description: '', 
    truckType: '' 
  });
  
  const [routeInfo, setRouteInfo] = useState<{distance: string, duration: string} | null>(null);
  const [loading, setLoading] = useState(false);
  const [calculating, setCalculating] = useState(false);

  useEffect(() => {
    const getRoute = async () => {
      if (formData.originLat && formData.destLat) {
        setCalculating(true);
        const info = await calculateDistanceOSM(
          formData.originLat, 
          formData.originLng, 
          formData.destLat, 
          formData.destLng
        );
        if (info) {
          setRouteInfo({ distance: info.distance, duration: info.duration });
        }
        setCalculating(false);
      }
    };

    getRoute();
  }, [formData.originLat, formData.destLat, formData.originLng, formData.destLng]);

  const handleSubmit = async () => {
    if (!formData.origin || !formData.destination || !formData.price) {
      toast.error(t('fill_fields_error'));
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not logged in');

      const distNum = routeInfo ? parseFloat(routeInfo.distance) : 0;

      await api.postLoad({
        origin: formData.origin,
        destination: formData.destination,
        weight: Number(formData.weight),
        price: Number(formData.price),
        description: formData.description,
        truck_type_required: formData.truckType,
        distance: distNum, 
        estimatedTime: routeInfo?.duration || ''
      }, user.id);

      toast.success(t('post_success'));
      navigate('/shipper');
    } catch (e) { toast.error(t('error_generic')); }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="page-header flex gap-4 items-center">
        <button onClick={() => navigate('/shipper')} className="icon-btn w-10 h-10">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <h1 className="text-xl font-bold text-foreground">{t('post_new_load')}</h1>
      </div>

      <div className="p-4 space-y-4">
        <div className="brand-card p-4 space-y-5">
          <h3 className="font-bold mb-2 flex items-center gap-2 text-foreground">
            <Route className="w-5 h-5 text-primary"/>
            {t('route_details')}
          </h3>
          
          <div>
            <label className="text-sm font-medium text-foreground block mb-2">{t('pickup_point')}</label>
            <SmartLocationSelect 
              placeholder={t('choose_city')}
              iconColor="text-primary"
              onSelect={(label, lat, lng) => {
                setFormData(prev => ({ ...prev, origin: label, originLat: lat, originLng: lng }));
              }}
            />
          </div>
          
          <div>
            <label className="text-sm font-medium text-foreground block mb-2">{t('dropoff_point')}</label>
            <SmartLocationSelect 
              placeholder={t('choose_city')}
              iconColor="text-secondary"
              onSelect={(label, lat, lng) => {
                setFormData(prev => ({ ...prev, destination: label, destLat: lat, destLng: lng }));
              }}
            />
          </div>

          {(routeInfo || calculating) && (
            <div className="bg-muted/30 border border-primary/20 p-4 rounded-xl flex items-center justify-between animate-fade-in">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-border">
                  {calculating ? <Loader2 className="w-5 h-5 animate-spin text-primary"/> : <Route className="w-5 h-5 text-primary" />}
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{t('estimated_distance')}</p>
                  <p className="font-bold text-foreground text-lg dir-ltr">
                    {calculating ? '...' : routeInfo?.distance}
                  </p>
                </div>
              </div>
              <div className="text-left border-r border-border/50 pr-4 pl-2">
                <p className="text-xs text-muted-foreground">{t('time_label')}</p>
                <p className="font-bold text-secondary text-sm">
                  {calculating ? '...' : routeInfo?.duration}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="brand-card p-4">
            <label className="text-sm font-medium text-foreground block mb-2 flex items-center gap-1">
              <Weight className="w-4 h-4 text-muted-foreground"/>{t('weight_label')} ({t('kg')})
            </label>
            <input 
              type="number" 
              className="input-field w-full" 
              value={formData.weight} 
              onChange={e => setFormData({...formData, weight: e.target.value})} 
              placeholder="5000" 
            />
          </div>
          <div className="brand-card p-4">
            <label className="text-sm font-medium text-foreground block mb-2 flex items-center gap-1">
              <DollarSign className="w-4 h-4 text-muted-foreground"/>{t('price_label')} ({t('sar')})
            </label>
            <input 
              type="number" 
              className="input-field w-full" 
              value={formData.price} 
              onChange={e => setFormData({...formData, price: e.target.value})} 
              placeholder="1200" 
            />
          </div>
        </div>

        <div className="brand-card p-4">
          <label className="text-sm font-medium text-foreground block mb-3">{t('truck_type_optional')}</label>
          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
            {truckTypes.map(tType => (
              <button 
                key={tType.id} 
                onClick={() => setFormData({...formData, truckType: tType.id})} 
                className={`px-4 py-2 rounded-xl border whitespace-nowrap transition-all flex items-center gap-2 ${
                  formData.truckType === tType.id 
                    ? 'bg-primary text-white border-primary shadow-md' 
                    : 'bg-background hover:bg-muted border-input'
                }`}
              >
                <span>{tType.icon}</span>
                {t(tType.id as any) || tType.nameAr}
              </button>
            ))}
          </div>
        </div>

        <div className="brand-card p-4">
          <label className="text-sm font-medium text-foreground block mb-2">{t('additional_details')}</label>
          <textarea 
            className="input-field w-full h-24 resize-none pt-2" 
            value={formData.description} 
            onChange={e => setFormData({...formData, description: e.target.value})} 
            placeholder={t('desc_placeholder')} 
          />
        </div>
      </div>

      <div className="sticky-bottom max-w-[480px] mx-auto bg-background/80 backdrop-blur-md border-t p-4">
        <button 
          onClick={handleSubmit} 
          disabled={loading || !formData.origin || !formData.price || !formData.destination} 
          className="btn-primary w-full h-12 text-lg shadow-lg shadow-primary/20 disabled:opacity-50 disabled:shadow-none flex items-center justify-center gap-2"
        >
          {loading ? <Loader2 className="animate-spin"/> : t('post_now_btn')}
        </button>
      </div>
    </div>
  );
}
