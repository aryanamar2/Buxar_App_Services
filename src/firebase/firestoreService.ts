import {
  collection,
  doc,
  setDoc,
  updateDoc,
  getDocs,
  onSnapshot,
  query,
  orderBy,
} from 'firebase/firestore';
import { db } from './config';
import {
  ServiceCategory,
  TechnicianProfile,
  User,
  ServiceBooking,
  AppNotification,
} from '../types';
import {
  INITIAL_SERVICE_CATEGORIES,
  INITIAL_USERS,
  INITIAL_TECHNICIANS,
  INITIAL_BOOKINGS,
  INITIAL_NOTIFICATIONS,
} from '../data/mockData';

// Collection references
export const COLLECTIONS = {
  USERS: 'users',
  TECHNICIANS: 'technicians',
  CATEGORIES: 'service_categories',
  BOOKINGS: 'bookings',
  NOTIFICATIONS: 'notifications',
};

// Seed initial Firestore database if empty
export async function seedInitialFirestoreData(): Promise<void> {
  try {
    const categoriesSnapshot = await getDocs(collection(db, COLLECTIONS.CATEGORIES));
    if (categoriesSnapshot.empty) {
      console.log('Seeding initial categories to Firestore...');
      for (const cat of INITIAL_SERVICE_CATEGORIES) {
        await setDoc(doc(db, COLLECTIONS.CATEGORIES, cat.id), cat);
      }
    }

    const usersSnapshot = await getDocs(collection(db, COLLECTIONS.USERS));
    if (usersSnapshot.empty) {
      console.log('Seeding initial users to Firestore...');
      for (const u of INITIAL_USERS) {
        await setDoc(doc(db, COLLECTIONS.USERS, u.id), u);
      }
    }

    const techSnapshot = await getDocs(collection(db, COLLECTIONS.TECHNICIANS));
    if (techSnapshot.empty) {
      console.log('Seeding initial technicians to Firestore...');
      for (const tech of INITIAL_TECHNICIANS) {
        await setDoc(doc(db, COLLECTIONS.TECHNICIANS, tech.id), tech);
      }
    }

    const bookingsSnapshot = await getDocs(collection(db, COLLECTIONS.BOOKINGS));
    if (bookingsSnapshot.empty) {
      console.log('Seeding initial bookings to Firestore...');
      for (const b of INITIAL_BOOKINGS) {
        await setDoc(doc(db, COLLECTIONS.BOOKINGS, b.id), b);
      }
    }

    const notifsSnapshot = await getDocs(collection(db, COLLECTIONS.NOTIFICATIONS));
    if (notifsSnapshot.empty) {
      console.log('Seeding initial notifications to Firestore...');
      for (const n of INITIAL_NOTIFICATIONS) {
        await setDoc(doc(db, COLLECTIONS.NOTIFICATIONS, n.id), n);
      }
    }
  } catch (error) {
    console.warn('Firestore initial seeding note:', error);
  }
}

// ----------------- Real-time Subscriptions -----------------

export function subscribeToBookings(callback: (bookings: ServiceBooking[]) => void) {
  const q = query(collection(db, COLLECTIONS.BOOKINGS));
  return onSnapshot(
    q,
    (snapshot) => {
      const list: ServiceBooking[] = [];
      snapshot.forEach((d) => {
        list.push(d.data() as ServiceBooking);
      });
      // Sort newest first
      list.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      callback(list);
    },
    (error) => {
      console.error('Error listening to bookings:', error);
    }
  );
}

export function subscribeToTechnicians(callback: (technicians: TechnicianProfile[]) => void) {
  return onSnapshot(
    collection(db, COLLECTIONS.TECHNICIANS),
    (snapshot) => {
      const list: TechnicianProfile[] = [];
      snapshot.forEach((d) => {
        list.push(d.data() as TechnicianProfile);
      });
      callback(list);
    },
    (error) => {
      console.error('Error listening to technicians:', error);
    }
  );
}

export function subscribeToCategories(callback: (categories: ServiceCategory[]) => void) {
  return onSnapshot(
    collection(db, COLLECTIONS.CATEGORIES),
    (snapshot) => {
      const list: ServiceCategory[] = [];
      snapshot.forEach((d) => {
        list.push(d.data() as ServiceCategory);
      });
      callback(list);
    },
    (error) => {
      console.error('Error listening to categories:', error);
    }
  );
}

export function subscribeToUsers(callback: (users: User[]) => void) {
  return onSnapshot(
    collection(db, COLLECTIONS.USERS),
    (snapshot) => {
      const list: User[] = [];
      snapshot.forEach((d) => {
        list.push(d.data() as User);
      });
      callback(list);
    },
    (error) => {
      console.error('Error listening to users:', error);
    }
  );
}

export function subscribeToNotifications(callback: (notifs: AppNotification[]) => void) {
  return onSnapshot(
    collection(db, COLLECTIONS.NOTIFICATIONS),
    (snapshot) => {
      const list: AppNotification[] = [];
      snapshot.forEach((d) => {
        list.push(d.data() as AppNotification);
      });
      list.sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
      callback(list);
    },
    (error) => {
      console.error('Error listening to notifications:', error);
    }
  );
}

// ----------------- Mutations -----------------

export async function saveBookingToCloud(booking: ServiceBooking): Promise<void> {
  const ref = doc(db, COLLECTIONS.BOOKINGS, booking.id);
  await setDoc(ref, booking);
}

export async function updateBookingInCloud(
  bookingId: string,
  data: Partial<ServiceBooking>
): Promise<void> {
  const ref = doc(db, COLLECTIONS.BOOKINGS, bookingId);
  await updateDoc(ref, data);
}

export async function saveTechnicianToCloud(tech: TechnicianProfile): Promise<void> {
  const ref = doc(db, COLLECTIONS.TECHNICIANS, tech.id);
  await setDoc(ref, tech);
}

export async function updateTechnicianInCloud(
  techId: string,
  data: Partial<TechnicianProfile>
): Promise<void> {
  const ref = doc(db, COLLECTIONS.TECHNICIANS, techId);
  await updateDoc(ref, data);
}

export async function saveCategoryToCloud(category: ServiceCategory): Promise<void> {
  const ref = doc(db, COLLECTIONS.CATEGORIES, category.id);
  await setDoc(ref, category);
}

export async function updateCategoryInCloud(
  categoryId: string,
  data: Partial<ServiceCategory>
): Promise<void> {
  const ref = doc(db, COLLECTIONS.CATEGORIES, categoryId);
  await updateDoc(ref, data);
}

export async function saveUserToCloud(user: User): Promise<void> {
  const ref = doc(db, COLLECTIONS.USERS, user.id);
  await setDoc(ref, user);
}

export async function saveNotificationToCloud(notif: AppNotification): Promise<void> {
  const ref = doc(db, COLLECTIONS.NOTIFICATIONS, notif.id);
  await setDoc(ref, notif);
}
