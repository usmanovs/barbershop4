export interface Service {
  id: string;
  name: string;
  duration: number; // in minutes
  price: number;
  category: 'haircuts' | 'shaves' | 'treatment';
  description: string;
}

export interface Stylist {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
  specialties: string[];
  rating: number;
  reviewsCount: number;
  availableDays: number[]; // 0 for Sunday, 1 Monday, etc.
}

export interface Booking {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  stylistId: string;
  serviceIds: string[];
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  notes?: string;
  totalAmount: number;
  totalDuration: number;
  createdAt: string;
}
