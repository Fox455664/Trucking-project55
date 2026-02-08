import { supabase } from '@/lib/supabase';
import { UserRole } from '@/types';

// ... (نفس دوال المصادقة القديمة sendOtp, verifyOtp, loginAdmin, createProfile, saveDriverDetails, getDriverDetails) ...

export const api = {
  // ... الدوال السابقة ...

  // 1. جلب الحمولات المتاحة فقط (التي لم يأخذها أحد)
  async getLoads() {
    const { data, error } = await supabase
      .from('loads')
      .select('*, profiles:owner_id(full_name, phone)')
      .eq('status', 'available') // شرط مهم: المتاحة فقط
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data.map((l: any) => ({
      ...l,
      ownerName: l.profiles?.full_name || 'مستخدم',
      ownerPhone: l.profiles?.phone || ''
    }));
  },

  async getLoadById(loadId: string) {
    const { data, error } = await supabase
      .from('loads')
      .select('*, profiles:owner_id(full_name, phone)')
      .eq('id', loadId)
      .single();

    if (error) throw error;
    return {
      ...data,
      ownerName: data.profiles?.full_name || 'مستخدم',
      ownerPhone: data.profiles?.phone || ''
    };
  },

  // 3. جلب سجل رحلات السائق (المكتملة والجارية)
  async getDriverHistory(driverId: string) {
    const { data, error } = await supabase
      .from('loads')
      .select('*')
      // بنجيب الحمولات اللي السائق ده هو اللي أخدها
      .eq('driver_id', driverId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // ... (دالة getAvailableDrivers زي ما هي) ...

  // 5. نشر حمولة (زي ما هي) ...

  // 6. قبول الحمولة (نعم، اتفقت)
  async acceptLoad(loadId: string, driverId: string) {
    const { error } = await supabase
      .from('loads')
      .update({ 
        status: 'completed', // أو 'in_progress' لواقعية أكثر
        driver_id: driverId 
      })
      .eq('id', loadId);

    if (error) throw error;
  },

  // 7. إلغاء الحمولة (إرجاعها للسوق)
  async cancelLoad(loadId: string) {
    const { error } = await supabase
      .from('loads')
      .update({ 
        status: 'available', // ترجع متاحة
        driver_id: null      // نفك الارتباط بالسائق
      })
      .eq('id', loadId);

    if (error) throw error;
  }
};
