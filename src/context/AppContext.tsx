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

  // Auth & Roles
  switchUser: (userId: string) => void;
  loginAsRole: (role: Role) => void;
  registerUser: (userData: {
    name: string;
    email: string;
    phone: string;
    role: Role;
    categoryId?: string;
    experienceYears?: number;
    baseArea?: string;
  }) => User;

  // Booking Flow
  createBooking: (bookingInput: {
    serviceCategoryId: string;
    specificIssue: string;
    problemDescription: string;
    buxarArea: string;
    customerAddress: string;
    preferredDate: string;
    preferredTimeSlot: string;
    urgency: 'STANDARD' | 'URGENT';
    paymentMethod: 'CASH_AFTER_SERVICE' | 'UPI_ONLINE';
    photoUrl?: string;
    targetTechnicianId?: string;
  }) => ServiceBooking;

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
  currentTechnicianProfile?: TechnicianProfile;

  // Admin Actions
  updateTechnicianStatus: (technicianId: string, status: TechnicianVerificationStatus) => void;
  toggleCategoryStatus: (categoryId: string) => void;
  updateCategoryPrice: (categoryId: string, basePrice: number) => void;
  addCategory: (category: Omit<ServiceCategory, 'id'>) => void;

  // Notifications
  markAllNotificationsRead: () => void;
  unreadNotificationsCount: number;

  // Toast / System flash
  toastMessage: string | null;
  showToast: (msg: string) => void;
  resetAllDemoData: () => void;
}

const STORAGE_KEY = 'buxar_home_services_storage_v2';

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load persisted state or fallback
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

  // Sync to local storage
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
    categoryId,
    experienceYears,
    baseArea,
  }: {
    name: string;
    email: string;
    phone: string;
    role: Role;
    categoryId?: string;
    experienceYears?: number;
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
      avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200`,
    };

    setUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);

    if (role === 'TECHNICIAN' && categoryId) {
      const selectedCat = categories.find((c) => c.id === categoryId);
      const newTech: TechnicianProfile = {
        id: `tech_${Date.now()}`,
        userId: newUserId,
        name,
        phone,
        email,
        categoryId,
        categoryName: selectedCat?.name || 'General Service',
        experienceYears: experienceYears || 3,
        skills: selectedCat?.commonProblems.slice(0, 3) || ['Maintenance', 'Diagnostics'],
        isOnline: true,
        verificationStatus: 'PENDING', // requires admin approval
        aadhaarNumber: 'XXXX-XXXX-9921',
        rating: 0,
        reviewCount: 0,
        completedJobsCount: 0,
        baseArea: baseArea || 'Buxar Main',
        bio: `Professional ${selectedCat?.name || 'technician'} serving Buxar local households.`,
      };
      setTechnicians((prev) => [...prev, newTech]);
      showToast(`Technician profile created! Awaiting Admin verification.`);
    } else {
      showToast(`Welcome to Buxar Home Services, ${name}!`);
    }

    return newUser;
  };

  // Current technician profile if currentUser is TECHNICIAN
  const currentTechnicianProfile = technicians.find((t) => t.userId === currentUser.id);

  // Customer creates booking
  const createBooking = (bookingInput: {
    serviceCategoryId: string;
    specificIssue: string;
    problemDescription: string;
    buxarArea: string;
    customerAddress: string;
    preferredDate: string;
    preferredTimeSlot: string;
    urgency: 'STANDARD' | 'URGENT';
    paymentMethod: 'CASH_AFTER_SERVICE' | 'UPI_ONLINE';
    photoUrl?: string;
    targetTechnicianId?: string;
  }) => {
    const cat = categories.find((c) => c.id === bookingInput.serviceCategoryId);
    const bookingNumber = `BXR-2026-${Math.floor(100 + Math.random() * 900)}`;
    const randomOtp = Math.floor(1000 + Math.random() * 9000).toString();
    const newBookingId = `bkg_${Date.now()}`;

    // Target tech or general dispatch
    let assignedTech = bookingInput.targetTechnicianId
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
      photoUrl: bookingInput.photoUrl || cat?.image,
      preferredDate: bookingInput.preferredDate,
      preferredTimeSlot: bookingInput.preferredTimeSlot,
      urgency: bookingInput.urgency,
      technicianId: assignedTech?.id,
      technicianName: assignedTech?.name,
      technicianPhone: assignedTech?.phone,
      status: 'REQUESTED',
      statusHistory: [
        {
          status: 'REQUESTED',
          timestamp: new Date().toISOString(),
          note: `Request generated by ${currentUser.name} for ${bookingInput.buxarArea}. Dispatched to local technicians.`,
        },
      ],
      price: cat?.basePrice || 199,
      paymentMethod: bookingInput.paymentMethod,
      otpCode: randomOtp,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setBookings((prev) => [newBooking, ...prev]);

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
    soundFx.playChime();
    showToast(`Request ${bookingNumber} sent! Plumber/Technicians notified in Buxar.`);

    return newBooking;
  };

  const cancelBooking = (bookingId: string, reason?: string) => {
    setBookings((prev) =>
      prev.map((b) => {
        if (b.id !== bookingId) return b;
        return {
          ...b,
          status: 'CANCELLED',
          statusHistory: [
            ...b.statusHistory,
            {
              status: 'CANCELLED',
              timestamp: new Date().toISOString(),
              note: reason || 'Booking cancelled by customer.',
            },
          ],
          updatedAt: new Date().toISOString(),
        };
      })
    );
    showToast(`Booking cancelled successfully.`);
  };

  const confirmBooking = (bookingId: string) => {
    setBookings((prev) =>
      prev.map((b) => {
        if (b.id !== bookingId) return b;
        return {
          ...b,
          status: 'CONFIRMED',
          statusHistory: [
            ...b.statusHistory,
            {
              status: 'CONFIRMED',
              timestamp: new Date().toISOString(),
              note: 'Customer confirmed the appointment time.',
            },
          ],
          updatedAt: new Date().toISOString(),
        };
      })
    );
    showToast(`Appointment confirmed! Technician will arrive on schedule.`);
  };

  const submitReview = (bookingId: string, rating: number, comment: string) => {
    const targetBooking = bookings.find((b) => b.id === bookingId);
    if (!targetBooking) return;

    setBookings((prev) =>
      prev.map((b) => {
        if (b.id !== bookingId) return b;
        return {
          ...b,
          review: {
            rating,
            comment,
            createdAt: new Date().toISOString(),
          },
          updatedAt: new Date().toISOString(),
        };
      })
    );

    // Update technician aggregate rating
    if (targetBooking.technicianId) {
      setTechnicians((prev) =>
        prev.map((t) => {
          if (t.id !== targetBooking.technicianId) return t;
          const newCount = t.reviewCount + 1;
          const currentTotal = t.rating * t.reviewCount;
          const newRating = Number(((currentTotal + rating) / newCount).toFixed(1));
          return {
            ...t,
            reviewCount: newCount,
            rating: newRating,
          };
        })
      );
    }

    showToast(`Thank you! Review submitted for ${targetBooking.technicianName || 'service'}.`);
  };

  // Technician: Accept
  const acceptBooking = (bookingId: string) => {
    const tech = currentTechnicianProfile || technicians[0];
    setBookings((prev) =>
      prev.map((b) => {
        if (b.id !== bookingId) return b;
        return {
          ...b,
          status: 'ACCEPTED',
          technicianId: tech.id,
          technicianName: tech.name,
          technicianPhone: tech.phone,
          statusHistory: [
            ...b.statusHistory,
            {
              status: 'ACCEPTED',
              timestamp: new Date().toISOString(),
              note: `Accepted by ${tech.name}. Preparing tools.`,
            },
            {
              status: 'CONFIRMED',
              timestamp: new Date().toISOString(),
              note: `Auto-confirmed schedule for ${b.preferredDate} (${b.preferredTimeSlot}).`,
            },
          ],
          updatedAt: new Date().toISOString(),
        };
      })
    );

    const bkg = bookings.find((b) => b.id === bookingId);
    if (bkg) {
      setNotifications((prev) => [
        {
          id: `notif_${Date.now()}`,
          targetRole: 'CUSTOMER',
          targetUserId: bkg.customerId,
          title: `✅ Request Accepted!`,
          message: `${tech.name} has accepted your ${bkg.serviceCategoryName} request. Expected arrival at ${bkg.preferredTimeSlot}.`,
          timestamp: new Date().toISOString(),
          read: false,
          bookingId,
        },
        ...prev,
      ]);
    }

    soundFx.playSuccess();
    showToast(`Accepted! Request is now confirmed.`);
  };

  // Technician: Reject
  const rejectBooking = (bookingId: string, reason?: string) => {
    setBookings((prev) =>
      prev.map((b) => {
        if (b.id !== bookingId) return b;
        return {
          ...b,
          status: 'REJECTED',
          statusHistory: [
            ...b.statusHistory,
            {
              status: 'REJECTED',
              timestamp: new Date().toISOString(),
              note: reason || 'Technician was unavailable for this time slot.',
            },
          ],
          updatedAt: new Date().toISOString(),
        };
      })
    );
    showToast(`Request rejected. Customer notified.`);
  };

  // Technician: On the way
  const markOnTheWay = (bookingId: string) => {
    const tech = currentTechnicianProfile || technicians[0];
    setBookings((prev) =>
      prev.map((b) => {
        if (b.id !== bookingId) return b;
        return {
          ...b,
          status: 'ON_THE_WAY',
          statusHistory: [
            ...b.statusHistory,
            {
              status: 'ON_THE_WAY',
              timestamp: new Date().toISOString(),
              note: `${tech.name} has departed and is on the way to ${b.buxarArea}.`,
            },
          ],
          updatedAt: new Date().toISOString(),
        };
      })
    );

    const bkg = bookings.find((b) => b.id === bookingId);
    if (bkg) {
      setNotifications((prev) => [
        {
          id: `notif_${Date.now()}`,
          targetRole: 'CUSTOMER',
          targetUserId: bkg.customerId,
          title: `🛵 Technician is on the way!`,
          message: `${tech.name} has started towards ${bkg.buxarArea}. Please share OTP ${bkg.otpCode} when they arrive.`,
          timestamp: new Date().toISOString(),
          read: false,
          bookingId,
        },
        ...prev,
      ]);
    }

    showToast(`Status updated: ON THE WAY`);
  };

  // Technician: Start job
  const startJob = (bookingId: string) => {
    setBookings((prev) =>
      prev.map((b) => {
        if (b.id !== bookingId) return b;
        return {
          ...b,
          status: 'STARTED',
          statusHistory: [
            ...b.statusHistory,
            {
              status: 'STARTED',
              timestamp: new Date().toISOString(),
              note: `Service work commenced at customer address.`,
            },
          ],
          updatedAt: new Date().toISOString(),
        };
      })
    );
    showToast(`Service started. Good luck with the job!`);
  };

  // Technician: Complete job
  const completeJob = (bookingId: string) => {
    const bkg = bookings.find((b) => b.id === bookingId);
    setBookings((prev) =>
      prev.map((b) => {
        if (b.id !== bookingId) return b;
        return {
          ...b,
          status: 'COMPLETED',
          statusHistory: [
            ...b.statusHistory,
            {
              status: 'COMPLETED',
              timestamp: new Date().toISOString(),
              note: `Service completed successfully. Customer invoice ready.`,
            },
          ],
          updatedAt: new Date().toISOString(),
        };
      })
    );

    if (bkg?.technicianId) {
      setTechnicians((prev) =>
        prev.map((t) => {
          if (t.id !== bkg.technicianId) return t;
          return {
            ...t,
            completedJobsCount: t.completedJobsCount + 1,
          };
        })
      );
    }

    if (bkg) {
      setNotifications((prev) => [
        {
          id: `notif_${Date.now()}`,
          targetRole: 'CUSTOMER',
          targetUserId: bkg.customerId,
          title: `🎉 Service Completed!`,
          message: `Your ${bkg.serviceCategoryName} service is done. Please leave a review for ${bkg.technicianName}.`,
          timestamp: new Date().toISOString(),
          read: false,
          bookingId,
        },
        ...prev,
      ]);
    }

    soundFx.playSuccess();
    showToast(`Service marked COMPLETED! Invoice generated.`);
  };

  // Technician: toggle availability
  const toggleAvailability = (technicianId: string) => {
    setTechnicians((prev) =>
      prev.map((t) => {
        if (t.id !== technicianId) return t;
        const nextState = !t.isOnline;
        showToast(`${t.name} is now ${nextState ? 'ONLINE (Ready for requests)' : 'OFFLINE'}`);
        return { ...t, isOnline: nextState };
      })
    );
  };

  // Admin: verify technician
  const updateTechnicianStatus = (technicianId: string, status: TechnicianVerificationStatus) => {
    setTechnicians((prev) =>
      prev.map((t) => {
        if (t.id !== technicianId) return t;
        return { ...t, verificationStatus: status };
      })
    );
    showToast(`Technician status updated to ${status}`);
  };

  // Admin: toggle category
  const toggleCategoryStatus = (categoryId: string) => {
    setCategories((prev) =>
      prev.map((c) => {
        if (c.id !== categoryId) return c;
        return { ...c, active: !c.active };
      })
    );
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
    showToast(`Category base price updated to ₹${basePrice}`);
  };

  // Admin: add category
  const addCategory = (cat: Omit<ServiceCategory, 'id'>) => {
    const newCat: ServiceCategory = {
      ...cat,
      id: `cat_${Date.now()}`,
    };
    setCategories((prev) => [...prev, newCat]);
    showToast(`New category "${newCat.name}" added to Buxar catalogue.`);
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const unreadNotificationsCount = notifications.filter(
    (n) => n.targetRole === currentUser.role && !n.read
  ).length;

  const resetAllDemoData = () => {
    localStorage.removeItem(`${STORAGE_KEY}_users`);
    localStorage.removeItem(`${STORAGE_KEY}_current_user`);
    localStorage.removeItem(`${STORAGE_KEY}_technicians`);
    localStorage.removeItem(`${STORAGE_KEY}_categories`);
    localStorage.removeItem(`${STORAGE_KEY}_bookings`);
    localStorage.removeItem(`${STORAGE_KEY}_notifications`);
    setUsers(INITIAL_USERS);
    setCurrentUser(INITIAL_USERS[0]);
    setTechnicians(INITIAL_TECHNICIANS);
    setCategories(INITIAL_SERVICE_CATEGORIES);
    setBookings(INITIAL_BOOKINGS);
    setNotifications(INITIAL_NOTIFICATIONS);
    showToast(`Demo data reset to fresh default states.`);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        activeRole: currentUser.role,
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
        currentTechnicianProfile,
        updateTechnicianStatus,
        toggleCategoryStatus,
        updateCategoryPrice,
        addCategory,
        markAllNotificationsRead,
        unreadNotificationsCount,
        toastMessage,
        showToast,
        resetAllDemoData,
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
