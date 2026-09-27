export type Role = 'CUSTOMER' | 'TECHNICIAN' | 'ADMIN';

export type BookingStatus =
  | 'REQUESTED'
  | 'ACCEPTED'
  | 'REJECTED'
  | 'CONFIRMED'
  | 'ON_THE_WAY'
  | 'STARTED'
  | 'COMPLETED'
  | 'CANCELLED';

export type TechnicianVerificationStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: Role;
  avatar?: string;
  createdAt: string;
}

export interface CustomerProfile {
  id: string;
  userId: string;
  defaultAddress: string;
  buxarArea: string;
  landmark?: string;
}

export interface TechnicianProfile {
  id: string;
  userId: string;
  name: string;
  phone: string;
  email: string;
  categoryId: string;
  categoryName: string;
  experienceYears: number;
  skills: string[];
  isOnline: boolean;
  verificationStatus: TechnicianVerificationStatus;
  aadhaarNumber: string;
  rating: number;
  reviewCount: number;
  completedJobsCount: number;
  baseArea: string;
  bio: string;
  avatar?: string;
}

export interface ServiceCategory {
  id: string;
  name: string;
  slug: string;
  iconName: string;
  basePrice: number;
  description: string;
  commonProblems: string[];
  image: string;
  active: boolean;
}

export interface BookingStatusUpdate {
  status: BookingStatus;
  timestamp: string;
  note?: string;
}

export interface BookingReview {
  rating: number;
  comment: string;
  createdAt: string;
}

export interface ServiceBooking {
  id: string;
  bookingNumber: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  buxarArea: string;
  serviceCategoryId: string;
  serviceCategoryName: string;
  specificIssue: string;
  problemDescription: string;
  photoUrl?: string;
  preferredDate: string;
  preferredTimeSlot: string;
  urgency: 'STANDARD' | 'URGENT';
  technicianId?: string;
  technicianName?: string;
  technicianPhone?: string;
  status: BookingStatus;
  statusHistory: BookingStatusUpdate[];
  price: number;
  paymentMethod: 'CASH_AFTER_SERVICE' | 'UPI_ONLINE';
  otpCode?: string;
  review?: BookingReview;
  rejectedByTechnicianIds?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface AppNotification {
  id: string;
  targetRole: Role;
  targetUserId: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  bookingId?: string;
}

export type ViewMode = 'MOBILE_APP' | 'WEB_CUSTOMER' | 'ADMIN_PORTAL' | 'CODE_ARCHITECTURE';
export type MobileTabCustomer = 'home' | 'bookings' | 'notifications' | 'profile';
export type MobileTabTechnician = 'requests' | 'active_jobs' | 'history' | 'profile';
export type MobileTabAdmin = 'overview' | 'bookings' | 'technicians' | 'services' | 'more';
