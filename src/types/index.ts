export type UserRole = 'driver' | 'shipper' | 'admin';

export interface Driver {
  id: string;
  name: string;
  phone: string;
  avatar?: string;
  truckType: TruckType;
  trailerType: TrailerType;
  dimensions: TruckDimensions;
  rating: number;
  completedTrips: number;
  isAvailable: boolean;
  currentCity: string;
  registrationDate: string;
}

export interface Load {
  id: string;
  ownerId: string;
  ownerName: string;
  ownerPhone: string;
  origin: string;
  destination: string;
  distance: number;
  estimatedTime: string;
  weight: number;
  description: string;
  price: number;
  truckTypeRequired: TruckType;
  status: LoadStatus;
  createdAt: string;
  expiresAt: string;
}

export type LoadStatus = 'available' | 'pending' | 'in_progress' | 'completed' | 'cancelled';

export type TruckType = 
  | 'trella' 
  | 'lorry' 
  | 'dyna' 
  | 'pickup' 
  | 'refrigerated' 
  | 'tanker'
  | 'flatbed'
  | 'container';

export type TrailerType = 
  | 'flatbed' 
  | 'curtain' 
  | 'box' 
  | 'refrigerated' 
  | 'lowboy' 
  | 'tank';

export type TruckDimensions = 
  | 'small' 
  | 'medium' 
  | 'large' 
  | 'extra_large';

export interface TruckTypeInfo {
  id: TruckType;
  nameAr: string;
  icon: string;
}

export interface TrailerTypeInfo {
  id: TrailerType;
  nameAr: string;
  icon: string;
}

export interface DimensionInfo {
  id: TruckDimensions;
  nameAr: string;
  specs: string;
}

export interface AdminStats {
  totalUsers: number;
  totalDrivers: number;
  totalShippers: number;
  activeLoads: number;
  completedTrips: number;
  pendingLoads: number;
}

export interface FeedbackData {
  loadId: string;
  driverId: string;
  agreed: boolean;
  notes?: string;
}
