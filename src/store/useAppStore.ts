import { create } from 'zustand';
import { UserRole, TruckType, TrailerType, TruckDimensions, Driver, Load } from '@/types';

// تعريف شكل بيانات المستخدم القادمة من قاعدة البيانات
interface UserProfile {
  id: string;
  full_name: string;
  phone: string;
  role: UserRole;
  country_code: string;
  created_at?: string; // تمت إضافة هذا الحقل لحساب مدة الاشتراك
}

interface AppState {
  currentRole: UserRole | null;
  setCurrentRole: (role: UserRole | null) => void;
  
  countryCode: string;
  setCountryCode: (code: string) => void;
  
  phoneNumber: string;
  setPhoneNumber: (phone: string) => void;
  
  isPhoneVerified: boolean;
  setPhoneVerified: (verified: boolean) => void;
  
  selectedTruckType: TruckType | null;
  setSelectedTruckType: (type: TruckType | null) => void;
  
  selectedTrailerType: TrailerType | null;
  setSelectedTrailerType: (type: TrailerType | null) => void;
  
  selectedDimensions: TruckDimensions | null;
  setSelectedDimensions: (dim: TruckDimensions | null) => void;
  
  isRegistrationComplete: boolean;
  setRegistrationComplete: (complete: boolean) => void;
  
  currentDriver: Driver | null;
  setCurrentDriver: (driver: Driver | null) => void;
  
  selectedLoad: Load | null;
  setSelectedLoad: (load: Load | null) => void;
  
  showFeedbackModal: boolean;
  setShowFeedbackModal: (show: boolean) => void;

  userProfile: UserProfile | null;
  setUserProfile: (profile: UserProfile | null) => void;
  
  reset: () => void;
}

const initialState = {
  currentRole: null,
  countryCode: '+966',
  phoneNumber: '',
  isPhoneVerified: false,
  selectedTruckType: null,
  selectedTrailerType: null,
  selectedDimensions: null,
  isRegistrationComplete: false,
  currentDriver: null,
  selectedLoad: null,
  showFeedbackModal: false,
  userProfile: null,
};

export const useAppStore = create<AppState>((set) => ({
  ...initialState,
  
  setCurrentRole: (role) => set({ currentRole: role }),
  setCountryCode: (code) => set({ countryCode: code }),
  setPhoneNumber: (phone) => set({ phoneNumber: phone }),
  setPhoneVerified: (verified) => set({ isPhoneVerified: verified }),
  setSelectedTruckType: (type) => set({ selectedTruckType: type }),
  setSelectedTrailerType: (type) => set({ selectedTrailerType: type }),
  setSelectedDimensions: (dim) => set({ selectedDimensions: dim }),
  setRegistrationComplete: (complete) => set({ isRegistrationComplete: complete }),
  setCurrentDriver: (driver) => set({ currentDriver: driver }),
  setSelectedLoad: (load) => set({ selectedLoad: load }),
  setShowFeedbackModal: (show) => set({ showFeedbackModal: show }),
  
  // دالة حفظ البروفايل
  setUserProfile: (profile) => set({ userProfile: profile }),
  
  reset: () => set(initialState),
}));
