import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  Role,
  ServiceCategory,
  TechnicianProfile,
  ServiceBooking,
  AppNotification,
  ViewMode,
  MobileTabCustomer,
  MobileTabTechnician,
  MobileTabAdmin,
  BookingStatus,
  TechnicianVerificationStatus,
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_TECHNICIANS,
  INITIAL_SERVICE_CATEGORIES,
  INITIAL_BOOKINGS,
  INITIAL_NOTIFICATIONS,
} from '../data/mockData';
import { soundFx } from '../utils/audio';
import {
  seedInitialFirestoreData,
  subscribeToBookings,
  subscribeToTechnicians,
  subscribeToCategories,
  subscribeToUsers,
  subscribeToNotifications,
  saveBookingToCloud,
  updateBookingInCloud,
  saveTechnicianToCloud,
  updateTechnicianInCloud,
  saveCategoryToCloud,
  updateCategoryInCloud,
  saveUserToCloud,
  saveNotificationToCloud,
} from '../firebase/firestoreService';

interface AppContextType {
  currentUser: User;
  users: User[];
  activeRole: Role;
  technicians: TechnicianProfile[];
  categories: ServiceCategory[];
  bookings: ServiceBooking[];
  notifications: AppNotification[];
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  mobileCustomerTab: MobileTabCustomer;
  setMobileCustomerTab: (tab: MobileTabCustomer) => void;
  mobileTechnicianTab: MobileTabTechnician;
  setMobileTechnicianTab: (tab: MobileTabTechnician) => void;
  mobileAdminTab: MobileTabAdmin;
  setMobileAdminTab: (tab: MobileTabAdmin) => void;
  showPhoneBezel: boolean;
  setShowPhoneBezel: (show: boolean) => void;
  isCloudConnected: boolean;

  // Auth & Roles
  switchUser: (userId: string) => void;
  loginAsRole: (role: Role) => void;
  registerUser: (userData: {
    name: string;
    email: string;
    phone: string;
    role: Role;
    category?: string;
    categoryId?: string;
    experienceYears?: number;
    aadhaarNumber?: string;
    baseArea?: string;
  }) => void;

  // Booking Flow Actions
  createBooking: (bookingInput: {
    serviceCategoryId: string;
    specificIssue: string;
    problemDescription: string;
    photoUrl?: string;
    preferredDate: string;
    preferredTimeSlot: string;
    urgency: 'STANDARD' | 'URGENT';
    buxarArea: string;
    customerAddress: string;
    paymentMethod: 'CASH_AFTER_SERVICE' | 'UPI_ONLINE';
    targetTechnicianId?: string;
  }) => Promise<ServiceBooking>;

  cancelBooking: (bookingId: string, reason?: string) => void;
  confirmBooking: (bookingId: string) => void;
  submitReview: (bookingId: string, rating: number, comment: string) => void;

  // Technician Actions
  acceptBooking: (bookingId: string) => void;
  rejectBooking: (bookingId: string, reason?: string) => void;
  markOnTheWay: (bookingId: string) => void;
  startJob: (bookingId: string) => void;
  completeJob: (bookingId: string) => void;
  toggleAvailability: (technicianId: string) => void;

  // Admin Actions
  updateTechnicianStatus: (technicianId: string, status: TechnicianVerificationStatus) => void;
  toggleCategoryStatus: (categoryId: string) => void;
  updateCategoryPrice: (categoryId: string, basePrice: number) => void;
  addCategory: (category: Omit<ServiceCategory, 'id'>) => void;

  // Notification Actions
  markNotificationAsRead: (notificationId: string) => void;
  markAllNotificationsRead: () => void;
  clearAllNotifications: () => void;
  unreadNotificationsCount: number;
  resetAllDemoData: () => void;

  // Toast System
  showToast: (message: string) => void;
  toastMessage: string | null;

  // Helpers
  currentTechnicianProfile?: TechnicianProfile;
  currentCustomerBookings: ServiceBooking[];
  currentTechnicianRequests: ServiceBooking[];
  currentTechnicianActiveJobs: ServiceBooking[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY = 'buxar_home_services_v2';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_users`);
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_current_user`);
    if (saved) return JSON.parse(saved);
    return INITIAL_USERS[0]; // Default Amarjeet (Customer)
  });

  const [technicians, setTechnicians] = useState<TechnicianProfile[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_technicians`);
    return saved ? JSON.parse(saved) : INITIAL_TECHNICIANS;
  });

  const [categories, setCategories] = useState<ServiceCategory[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_categories`);
    return saved ? JSON.parse(saved) : INITIAL_SERVICE_CATEGORIES;
  });

  const [bookings, setBookings] = useState<ServiceBooking[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_bookings`);
    return saved ? JSON.parse(saved) : INITIAL_BOOKINGS;
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_notifications`);
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [viewMode, setViewMode] = useState<ViewMode>('MOBILE_APP');
  const [mobileCustomerTab, setMobileCustomerTab] = useState<MobileTabCustomer>('home');
  const [mobileTechnicianTab, setMobileTechnicianTab] = useState<MobileTabTechnician>('requests');
  const [mobileAdminTab, setMobileAdminTab] = useState<MobileTabAdmin>('overview');
  const [showPhoneBezel, setShowPhoneBezel] = useState<boolean>(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isCloudConnected, setIsCloudConnected] = useState<boolean>(false);

  // Firestore Real-Time Cloud Synchronization
  useEffect(() => {
    // 1. Seed cloud data if collection is fresh
    seedInitialFirestoreData().then(() => {
      setIsCloudConnected(true);
    });

    // 2. Real-time subscriptions
    const unsubBookings = subscribeToBookings((cloudBookings) => {
      if (cloudBookings.length > 0) {
        setBookings(cloudBookings);
        setIsCloudConnected(true);
      }
    });

    const unsubTechs = subscribeToTechnicians((cloudTechs) => {
      if (cloudTechs.length > 0) {
        setTechnicians(cloudTechs);
        setIsCloudConnected(true);
      }
    });

    const unsubCats = subscribeToCategories((cloudCats) => {
      if (cloudCats.length > 0) {
        setCategories(cloudCats);
        setIsCloudConnected(true);
      }
    });

    const unsubUsers = subscribeToUsers((cloudUsers) => {
      if (cloudUsers.length > 0) {
        setUsers(cloudUsers);
        setIsCloudConnected(true);
      }
    });

    const unsubNotifs = subscribeToNotifications((cloudNotifs) => {
      if (cloudNotifs.length > 0) {
        setNotifications(cloudNotifs);
        setIsCloudConnected(true);
      }
    });

    return () => {
      unsubBookings();
      unsubTechs();
      unsubCats();
      unsubUsers();
      unsubNotifs();
    };
  }, []);

  // Sync to local storage for offline resilience
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_users`, JSON.stringify(users));
    localStorage.setItem(`${STORAGE_KEY}_current_user`, JSON.stringify(currentUser));
    localStorage.setItem(`${STORAGE_KEY}_technicians`, JSON.stringify(technicians));
    localStorage.setItem(`${STORAGE_KEY}_categories`, JSON.stringify(categories));
    localStorage.setItem(`${STORAGE_KEY}_bookings`, JSON.stringify(bookings));
    localStorage.setItem(`${STORAGE_KEY}_notifications`, JSON.stringify(notifications));
  }, [users, currentUser, technicians, categories, bookings, notifications]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3800);
  };

  const switchUser = (userId: string) => {
    const found = users.find((u) => u.id === userId);
    if (found) {
      setCurrentUser(found);
      showToast(`Switched account to ${found.name} (${found.role})`);
    }
  };

  const loginAsRole = (role: Role) => {
    const target = users.find((u) => u.role === role);
    if (target) {
      setCurrentUser(target);
      showToast(`Logged in as ${target.name} [${role}]`);
    }
  };

  const registerUser = ({
    name,
    email,
    phone,
    role,
    category,
    categoryId,
    experienceYears = 2,
    aadhaarNumber = 'XXXX-XXXX-XXXX',
    baseArea = 'Station Road, Buxar',
  }: {
    name: string;
    email: string;
    phone: string;
    role: Role;
    category?: string;
    categoryId?: string;
    experienceYears?: number;
    aadhaarNumber?: string;
    baseArea?: string;
  }) => {
    const newUserId = `usr_${Date.now()}`;
    const newUser: User = {
      id: newUserId,
      name,
      email,
      phone,
      role,
      createdAt: new Date().toISOString(),
    };

    setUsers((prev) => [...prev, newUser]);
    saveUserToCloud(newUser).catch(console.error);

    if (role === 'TECHNICIAN') {
      const selectedCategory =
        categories.find((c) => c.id === categoryId || c.slug === category || c.id === category) ||
        categories[0];
      const newTech: TechnicianProfile = {
        id: `tech_${Date.now()}`,
        userId: newUserId,
        name,
        phone,
        email,
        categoryId: selectedCategory.id,
        categoryName: selectedCategory.name,
        experienceYears,
        skills: selectedCategory.commonProblems.slice(0, 3),
        isOnline: true,
        verificationStatus: 'PENDING',
        aadhaarNumber,
        rating: 5.0,
        reviewCount: 0,
        completedJobsCount: 0,
        baseArea,
        bio: `Professional ${selectedCategory.name} technician serving ${baseArea} and nearby Buxar wards.`,
      };
      setTechnicians((prev) => [...prev, newTech]);
      saveTechnicianToCloud(newTech).catch(console.error);

      // Notification for admin
      const adminNotif: AppNotification = {
        id: `notif_${Date.now()}_admin`,
        targetRole: 'ADMIN',
        targetUserId: 'usr_admin_1',
        title: `🛡️ New Partner Verification: ${name}`,
        message: `${name} has registered for ${selectedCategory.name} in ${baseArea}. Pending Aadhaar approval.`,
        timestamp: new Date().toISOString(),
        read: false,
      };
      setNotifications((prev) => [adminNotif, ...prev]);
      saveNotificationToCloud(adminNotif).catch(console.error);
    }

    setCurrentUser(newUser);
    showToast(`Welcome ${name}! Your account has been registered.`);
  };

  // Helper getters
  const activeRole = currentUser.role;

  const currentTechnicianProfile = technicians.find(
    (t) => t.userId === currentUser.id
  );

  const currentCustomerBookings = bookings.filter(
    (b) => b.customerId === currentUser.id
  );

  const currentTechnicianRequests = bookings.filter((b) => {
    if (!currentTechnicianProfile) return false;
    return (
      b.status === 'REQUESTED' &&
      b.serviceCategoryId === currentTechnicianProfile.categoryId &&
      currentTechnicianProfile.isOnline
    );
  });

  const currentTechnicianActiveJobs = bookings.filter((b) => {
    if (!currentTechnicianProfile) return false;
    return (
      b.technicianId === currentTechnicianProfile.id &&
      ['ACCEPTED', 'CONFIRMED', 'ON_THE_WAY', 'STARTED'].includes(b.status)
    );
  });

  // Flow: Customer creates booking
  const createBooking = async (bookingInput: {
    serviceCategoryId: string;
    specificIssue: string;
    problemDescription: string;
    photoUrl?: string;
    preferredDate: string;
    preferredTimeSlot: string;
    urgency: 'STANDARD' | 'URGENT';
    buxarArea: string;
    customerAddress: string;
    paymentMethod: 'CASH_AFTER_SERVICE' | 'UPI_ONLINE';
    targetTechnicianId?: string;
  }): Promise<ServiceBooking> => {
    const cat = categories.find((c) => c.id === bookingInput.serviceCategoryId);
    const newBookingId = `bkg_${Date.now()}`;
    const bookingNumber = `BXR-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
    const otpCode = Math.floor(1000 + Math.random() * 9000).toString();

    const targetedTech = bookingInput.targetTechnicianId
      ? technicians.find((t) => t.id === bookingInput.targetTechnicianId)
      : undefined;

    const newBooking: ServiceBooking = {
      id: newBookingId,
      bookingNumber,
      customerId: currentUser.id,
      customerName: currentUser.name,
      customerPhone: currentUser.phone,
      customerAddress: bookingInput.customerAddress,
      buxarArea: bookingInput.buxarArea,
      serviceCategoryId: bookingInput.serviceCategoryId,
      serviceCategoryName: cat?.name || 'Home Service',
      specificIssue: bookingInput.specificIssue,
      problemDescription: bookingInput.problemDescription,
      photoUrl: bookingInput.photoUrl,
      preferredDate: bookingInput.preferredDate,
      preferredTimeSlot: bookingInput.preferredTimeSlot,
      urgency: bookingInput.urgency,
      technicianId: targetedTech?.id,
      technicianName: targetedTech?.name,
      technicianPhone: targetedTech?.phone,
      status: 'REQUESTED',
      statusHistory: [
        {
          status: 'REQUESTED',
          timestamp: new Date().toISOString(),
          note: `Booking created for ${cat?.name} in ${bookingInput.buxarArea}.`,
        },
      ],
      price: (cat?.basePrice || 199) + (bookingInput.urgency === 'URGENT' ? 100 : 0),
      paymentMethod: bookingInput.paymentMethod,
      otpCode,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setBookings((prev) => [newBooking, ...prev]);

    // Send to Cloud Firestore
    saveBookingToCloud(newBooking).catch(console.error);

    // Send notification to technicians in this category
    const matchingTechs = technicians.filter(
      (t) => t.categoryId === bookingInput.serviceCategoryId && t.verificationStatus === 'APPROVED'
    );

    const newNotifs: AppNotification[] = matchingTechs.map((tech) => ({
      id: `notif_${Date.now()}_${tech.id}`,
      targetRole: 'TECHNICIAN',
      targetUserId: tech.userId,
      title: `🔔 New Request: ${cat?.name}!`,
      message: `${currentUser.name} in ${bookingInput.buxarArea} needs help with: "${bookingInput.specificIssue}"`,
      timestamp: new Date().toISOString(),
      read: false,
      bookingId: newBookingId,
    }));

    setNotifications((prev) => [...newNotifs, ...prev]);
    newNotifs.forEach((n) => saveNotificationToCloud(n).catch(console.error));

    soundFx.playChime();
    showToast(`Request ${bookingNumber} sent! Plumber/Technicians notified in Buxar.`);

    return newBooking;
  };

  const cancelBooking = (bookingId: string, reason?: string) => {
    const updatedHistory = {
      status: 'CANCELLED' as BookingStatus,
      timestamp: new Date().toISOString(),
      note: reason || 'Booking cancelled by customer.',
    };

    setBookings((prev) =>
      prev.map((b) => {
        if (b.id !== bookingId) return b;
        return {
          ...b,
          status: 'CANCELLED',
          statusHistory: [...b.statusHistory, updatedHistory],
          updatedAt: new Date().toISOString(),
        };
      })
    );

    updateBookingInCloud(bookingId, {
      status: 'CANCELLED',
      updatedAt: new Date().toISOString(),
    }).catch(console.error);

    showToast(`Booking cancelled successfully.`);
  };

  const confirmBooking = (bookingId: string) => {
    const updatedHistory = {
      status: 'CONFIRMED' as BookingStatus,
      timestamp: new Date().toISOString(),
      note: 'Customer confirmed the appointment time.',
    };

    setBookings((prev) =>
      prev.map((b) => {
        if (b.id !== bookingId) return b;
        return {
          ...b,
          status: 'CONFIRMED',
          statusHistory: [...b.statusHistory, updatedHistory],
          updatedAt: new Date().toISOString(),
        };
      })
    );

    updateBookingInCloud(bookingId, {
      status: 'CONFIRMED',
      updatedAt: new Date().toISOString(),
    }).catch(console.error);

    showToast(`Appointment confirmed! Technician will arrive on schedule.`);
  };

  const submitReview = (bookingId: string, rating: number, comment: string) => {
    const targetBooking = bookings.find((b) => b.id === bookingId);
    if (!targetBooking) return;

    const reviewObj = {
      rating,
      comment,
      createdAt: new Date().toISOString(),
    };

    setBookings((prev) =>
      prev.map((b) => {
        if (b.id !== bookingId) return b;
        return {
          ...b,
          review: reviewObj,
          updatedAt: new Date().toISOString(),
        };
      })
    );

    updateBookingInCloud(bookingId, {
      review: reviewObj,
      updatedAt: new Date().toISOString(),
    }).catch(console.error);

    // Update technician aggregate rating
    if (targetBooking.technicianId) {
      const techToUpdate = technicians.find((t) => t.id === targetBooking.technicianId);
      if (techToUpdate) {
        const newCount = techToUpdate.reviewCount + 1;
        const currentTotal = techToUpdate.rating * techToUpdate.reviewCount;
        const newRating = Number(((currentTotal + rating) / newCount).toFixed(1));

        setTechnicians((prev) =>
          prev.map((t) => {
            if (t.id !== targetBooking.technicianId) return t;
            return {
              ...t,
              reviewCount: newCount,
              rating: newRating,
            };
          })
        );

        updateTechnicianInCloud(targetBooking.technicianId, {
          reviewCount: newCount,
          rating: newRating,
        }).catch(console.error);
      }
    }

    showToast(`Thank you! Review submitted for ${targetBooking.technicianName || 'service'}.`);
  };

  // Technician: Accept
  const acceptBooking = (bookingId: string) => {
    const tech = currentTechnicianProfile || technicians[0];
    const bkg = bookings.find((b) => b.id === bookingId);
    const nowIso = new Date().toISOString();

    const newHistory = [
      ...(bkg?.statusHistory || []),
      {
        status: 'ACCEPTED' as BookingStatus,
        timestamp: nowIso,
        note: `Accepted by ${tech.name}. Preparing tools.`,
      },
      {
        status: 'CONFIRMED' as BookingStatus,
        timestamp: nowIso,
        note: `Auto-confirmed schedule for ${bkg?.preferredDate} (${bkg?.preferredTimeSlot}).`,
      },
    ];

    setBookings((prev) =>
      prev.map((b) => {
        if (b.id !== bookingId) return b;
        return {
          ...b,
          status: 'ACCEPTED',
          technicianId: tech.id,
          technicianName: tech.name,
          technicianPhone: tech.phone,
          statusHistory: newHistory,
          updatedAt: nowIso,
        };
      })
    );

    updateBookingInCloud(bookingId, {
      status: 'ACCEPTED',
      technicianId: tech.id,
      technicianName: tech.name,
      technicianPhone: tech.phone,
      statusHistory: newHistory,
      updatedAt: nowIso,
    }).catch(console.error);

    if (bkg) {
      const custNotif: AppNotification = {
        id: `notif_${Date.now()}`,
        targetRole: 'CUSTOMER',
        targetUserId: bkg.customerId,
        title: `✅ Request Accepted!`,
        message: `${tech.name} has accepted your ${bkg.serviceCategoryName} request. Expected arrival at ${bkg.preferredTimeSlot}.`,
        timestamp: nowIso,
        read: false,
        bookingId,
      };
      setNotifications((prev) => [custNotif, ...prev]);
      saveNotificationToCloud(custNotif).catch(console.error);
    }

    soundFx.playSuccess();
    showToast(`Accepted! Request is now confirmed.`);
  };

  // Technician: Reject
  const rejectBooking = (bookingId: string, reason?: string) => {
    const updatedHistory = {
      status: 'REJECTED' as BookingStatus,
      timestamp: new Date().toISOString(),
      note: reason || 'Technician was unavailable for this time slot.',
    };

    setBookings((prev) =>
      prev.map((b) => {
        if (b.id !== bookingId) return b;
        return {
          ...b,
          status: 'REJECTED',
          statusHistory: [...b.statusHistory, updatedHistory],
          updatedAt: new Date().toISOString(),
        };
      })
    );

    updateBookingInCloud(bookingId, {
      status: 'REJECTED',
      updatedAt: new Date().toISOString(),
    }).catch(console.error);

    showToast(`Request rejected. Customer notified.`);
  };

  // Technician: On the way
  const markOnTheWay = (bookingId: string) => {
    const tech = currentTechnicianProfile || technicians[0];
    const bkg = bookings.find((b) => b.id === bookingId);
    const nowIso = new Date().toISOString();

    const newHistory = [
      ...(bkg?.statusHistory || []),
      {
        status: 'ON_THE_WAY' as BookingStatus,
        timestamp: nowIso,
        note: `${tech.name} has departed and is on the way to ${bkg?.buxarArea}.`,
      },
    ];

    setBookings((prev) =>
      prev.map((b) => {
        if (b.id !== bookingId) return b;
        return {
          ...b,
          status: 'ON_THE_WAY',
          statusHistory: newHistory,
          updatedAt: nowIso,
        };
      })
    );

    updateBookingInCloud(bookingId, {
      status: 'ON_THE_WAY',
      statusHistory: newHistory,
      updatedAt: nowIso,
    }).catch(console.error);

    if (bkg) {
      const custNotif: AppNotification = {
        id: `notif_${Date.now()}`,
        targetRole: 'CUSTOMER',
        targetUserId: bkg.customerId,
        title: `🛵 Technician is on the way!`,
        message: `${tech.name} has started towards ${bkg.buxarArea}. Please share OTP ${bkg.otpCode} when they arrive.`,
        timestamp: nowIso,
        read: false,
        bookingId,
      };
      setNotifications((prev) => [custNotif, ...prev]);
      saveNotificationToCloud(custNotif).catch(console.error);
    }

    showToast(`Status updated: ON THE WAY`);
  };

  // Technician: Start job
  const startJob = (bookingId: string) => {
    const bkg = bookings.find((b) => b.id === bookingId);
    const nowIso = new Date().toISOString();

    const newHistory = [
      ...(bkg?.statusHistory || []),
      {
        status: 'STARTED' as BookingStatus,
        timestamp: nowIso,
        note: `Service work commenced at customer address.`,
      },
    ];

    setBookings((prev) =>
      prev.map((b) => {
        if (b.id !== bookingId) return b;
        return {
          ...b,
          status: 'STARTED',
          statusHistory: newHistory,
          updatedAt: nowIso,
        };
      })
    );

    updateBookingInCloud(bookingId, {
      status: 'STARTED',
      statusHistory: newHistory,
      updatedAt: nowIso,
    }).catch(console.error);

    showToast(`Service started. Good luck with the job!`);
  };

  // Technician: Complete job
  const completeJob = (bookingId: string) => {
    const bkg = bookings.find((b) => b.id === bookingId);
    const nowIso = new Date().toISOString();

    const newHistory = [
      ...(bkg?.statusHistory || []),
      {
        status: 'COMPLETED' as BookingStatus,
        timestamp: nowIso,
        note: `Service completed successfully. Customer invoice ready.`,
      },
    ];

    setBookings((prev) =>
      prev.map((b) => {
        if (b.id !== bookingId) return b;
        return {
          ...b,
          status: 'COMPLETED',
          statusHistory: newHistory,
          updatedAt: nowIso,
        };
      })
    );

    updateBookingInCloud(bookingId, {
      status: 'COMPLETED',
      statusHistory: newHistory,
      updatedAt: nowIso,
    }).catch(console.error);

    if (bkg?.technicianId) {
      const techToUpdate = technicians.find((t) => t.id === bkg.technicianId);
      if (techToUpdate) {
        setTechnicians((prev) =>
          prev.map((t) => {
            if (t.id !== bkg.technicianId) return t;
            return {
              ...t,
              completedJobsCount: t.completedJobsCount + 1,
            };
          })
        );

        updateTechnicianInCloud(bkg.technicianId, {
          completedJobsCount: techToUpdate.completedJobsCount + 1,
        }).catch(console.error);
      }
    }

    if (bkg) {
      const compNotif: AppNotification = {
        id: `notif_${Date.now()}`,
        targetRole: 'CUSTOMER',
        targetUserId: bkg.customerId,
        title: `🎉 Service Completed!`,
        message: `Your ${bkg.serviceCategoryName} service is done. Please leave a review for ${bkg.technicianName}.`,
        timestamp: nowIso,
        read: false,
        bookingId,
      };
      setNotifications((prev) => [compNotif, ...prev]);
      saveNotificationToCloud(compNotif).catch(console.error);
    }

    soundFx.playSuccess();
    showToast(`Service marked COMPLETED! Invoice generated.`);
  };

  // Technician: toggle availability
  const toggleAvailability = (technicianId: string) => {
    let nextState = true;
    setTechnicians((prev) =>
      prev.map((t) => {
        if (t.id !== technicianId) return t;
        nextState = !t.isOnline;
        showToast(`${t.name} is now ${nextState ? 'ONLINE (Ready for requests)' : 'OFFLINE'}`);
        return { ...t, isOnline: nextState };
      })
    );

    updateTechnicianInCloud(technicianId, { isOnline: nextState }).catch(console.error);
  };

  // Admin: verify technician
  const updateTechnicianStatus = (technicianId: string, status: TechnicianVerificationStatus) => {
    setTechnicians((prev) =>
      prev.map((t) => {
        if (t.id !== technicianId) return t;
        return { ...t, verificationStatus: status };
      })
    );

    updateTechnicianInCloud(technicianId, { verificationStatus: status }).catch(console.error);
    showToast(`Technician status updated to ${status}`);
  };

  // Admin: toggle category
  const toggleCategoryStatus = (categoryId: string) => {
    let nextState = true;
    setCategories((prev) =>
      prev.map((c) => {
        if (c.id !== categoryId) return c;
        nextState = !c.active;
        return { ...c, active: nextState };
      })
    );

    updateCategoryInCloud(categoryId, { active: nextState }).catch(console.error);
    showToast(`Category visibility toggled.`);
  };

  // Admin: update price
  const updateCategoryPrice = (categoryId: string, basePrice: number) => {
    setCategories((prev) =>
      prev.map((c) => {
        if (c.id !== categoryId) return c;
        return { ...c, basePrice };
      })
    );

    updateCategoryInCloud(categoryId, { basePrice }).catch(console.error);
    showToast(`Category base price updated to ₹${basePrice}`);
  };

  // Admin: add category
  const addCategory = (cat: Omit<ServiceCategory, 'id'>) => {
    const newCat: ServiceCategory = {
      ...cat,
      id: `cat_${Date.now()}`,
    };
    setCategories((prev) => [...prev, newCat]);
    saveCategoryToCloud(newCat).catch(console.error);
    showToast(`Service "${cat.name}" added to Buxar catalog!`);
  };

  const markNotificationAsRead = (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((n) => {
        if (n.id !== notificationId) return n;
        return { ...n, read: true };
      })
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, read: true }))
    );
    showToast(`All notifications marked as read.`);
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    showToast(`Notifications cleared.`);
  };

  const resetAllDemoData = () => {
    localStorage.clear();
    setUsers(INITIAL_USERS);
    setCurrentUser(INITIAL_USERS[0]);
    setTechnicians(INITIAL_TECHNICIANS);
    setCategories(INITIAL_SERVICE_CATEGORIES);
    setBookings(INITIAL_BOOKINGS);
    setNotifications(INITIAL_NOTIFICATIONS);
    showToast('Platform demo state refreshed.');
  };

  const unreadNotificationsCount = notifications.filter(
    (n) => n.targetRole === currentUser.role && !n.read
  ).length;

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        activeRole,
        technicians,
        categories,
        bookings,
        notifications,
        viewMode,
        setViewMode,
        mobileCustomerTab,
        setMobileCustomerTab,
        mobileTechnicianTab,
        setMobileTechnicianTab,
        mobileAdminTab,
        setMobileAdminTab,
        showPhoneBezel,
        setShowPhoneBezel,
        isCloudConnected,
        switchUser,
        loginAsRole,
        registerUser,
        createBooking,
        cancelBooking,
        confirmBooking,
        submitReview,
        acceptBooking,
        rejectBooking,
        markOnTheWay,
        startJob,
        completeJob,
        toggleAvailability,
        updateTechnicianStatus,
        toggleCategoryStatus,
        updateCategoryPrice,
        addCategory,
        markNotificationAsRead,
        markAllNotificationsRead,
        clearAllNotifications,
        unreadNotificationsCount,
        resetAllDemoData,
        showToast,
        toastMessage,
        currentTechnicianProfile,
        currentCustomerBookings,
        currentTechnicianRequests,
        currentTechnicianActiveJobs,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
