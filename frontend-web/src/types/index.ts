export type UserRole = 'user' | 'worker' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  location?: string;
  createdAt: Date;
}

export interface WorkerService {
  id: string;
  name: string;
  rate: number;
  rateType: 'hourly' | 'fixed';
  description?: string;
}

export interface Worker extends User {
  role: 'worker';
  services: string[];
  workerServices?: WorkerService[];
  hourlyRate: number;
  rating: number;
  reviewCount: number;
  isVerified: boolean;
  availability: string[];
  bio?: string;
  experience?: string;
  completedJobs: number;
  distance?: number;
  totalEarnings?: number;
}

export interface Booking {
  id: string;
  userId: string;
  workerId: string;
  workerName?: string;
  userName?: string;
  userAvatar?: string;
  userPhone?: string;
  service: string;
  date: Date;
  time: string;
  location: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'declined';
  price: number;
  notes?: string;
  duration?: number; // in hours
}

export interface Service {
  id: string;
  name: string;
  icon: string;
  category: string;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  workerId: string;
  rating: number;
  comment: string;
  date: Date;
}

export type SortOption = 'rating-high' | 'rating-low' | 'price-high' | 'price-low' | 'distance';

export interface FilterState {
  category: string | null;
  sortBy: SortOption;
  minRating: number;
  maxPrice: number | null;
}

export interface WorkerStats {
  todayEarnings: number;
  weeklyEarnings: number;
  monthlyEarnings: number;
  totalBookings: number;
  completedBookings: number;
  pendingBookings: number;
  acceptanceRate: number;
  averageRating: number;
}