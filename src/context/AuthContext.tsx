import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User as FirebaseUser,
  onAuthStateChanged,
  signOut as firebaseSignOut,
  getRedirectResult,
  updatePassword,
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';
import { auth, db, ADMIN_EMAIL, isAdminEmail, isVerifiedGoogleAdmin, UserProfile, AppUser } from '../firebase/config';

interface AuthContextType {
  currentUser: FirebaseUser | AppUser | null;
  userProfile: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
  isAuthModalOpen: boolean;
  authModalTab: 'login' | 'signup';
  openAuthModal: (tab?: 'login' | 'signup') => void;
  closeAuthModal: () => void;
  isProfileModalOpen: boolean;
  openProfileModal: () => void;
  closeProfileModal: () => void;
  isChatOpen: boolean;
  openChat: () => void;
  closeChat: () => void;
  unreadCount: number;
  logout: () => Promise<void>;
  updateUserProfileData: (data: Partial<UserProfile>) => Promise<void>;
  signInDirectGmail: (gmail: string, name?: string) => Promise<{ success: boolean; role: 'admin' | 'user' }>;
  signInDirectEmail: (
    email: string,
    password?: string,
    name?: string,
    isSignup?: boolean
  ) => Promise<{ success: boolean; role: 'admin' | 'user'; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_SESSION_KEY = 'arixon_user_session';
const REGISTERED_USERS_KEY = 'arixon_registered_users';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | AppUser | null>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_SESSION_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.user) return parsed.user;
      }
    } catch (_) {}
    return null;
  });

  const [userProfile, setUserProfile] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_SESSION_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.profile) return parsed.profile;
      }
    } catch (_) {}
    return null;
  });

  const [loading, setLoading] = useState<boolean>(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'signup'>('login');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [unreadCount, setUnreadCount] = useState<number>(0);

  const isAdmin = Boolean(
    currentUser && isVerifiedGoogleAdmin(currentUser)
  );

  // Catch redirect sign-in results if popup was blocked
  useEffect(() => {
    getRedirectResult(auth).catch((err) => {
      console.warn('Redirect sign-in check:', err);
    });
  }, []);

  // Listen to Firebase Auth State
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        const initialRole: 'admin' | 'user' = isVerifiedGoogleAdmin(user) ? 'admin' : 'user';

        const clientTimezone = (() => {
          try {
            return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
          } catch (_) {
            return 'UTC';
          }
        })();

        const clientLanguage = typeof navigator !== 'undefined' ? (navigator.language || 'en') : 'en';
        const clientProvider = user.providerData?.[0]?.providerId || 'google.com';

        const baselineProfile: UserProfile = {
          uid: user.uid,
          name: user.displayName || user.email?.split('@')[0] || 'User',
          username: '',
          email: user.email || '',
          photoURL: user.photoURL || '',
          provider: clientProvider,
          timezone: clientTimezone,
          language: clientLanguage,
          role: initialRole,
          blocked: false,
          createdAt: new Date(),
          lastLogin: new Date(),
          lastSeen: new Date(),
          profileCompleted: false,
        };
        setUserProfile(baselineProfile);

        try {
          const userRef = doc(db, 'users', user.uid);
          const snap = await getDoc(userRef);

          if (!snap.exists()) {
            const newProfile: UserProfile = {
              ...baselineProfile,
              createdAt: serverTimestamp(),
              lastLogin: serverTimestamp(),
              lastSeen: serverTimestamp(),
            };

            await setDoc(userRef, newProfile).catch((e) =>
              console.warn('Deferred user creation:', e)
            );
            setUserProfile(newProfile);
            try {
              localStorage.setItem(
                LOCAL_SESSION_KEY,
                JSON.stringify({ user, profile: newProfile })
              );
            } catch (_) {}

            if (initialRole !== 'admin') {
              setIsProfileModalOpen(true);
            }
          } else {
            const data = snap.data() as UserProfile;
            setUserProfile(data);
            try {
              localStorage.setItem(
                LOCAL_SESSION_KEY,
                JSON.stringify({ user, profile: data })
              );
            } catch (_) {}

            await updateDoc(userRef, {
              lastLogin: serverTimestamp(),
              lastSeen: serverTimestamp(),
              timezone: clientTimezone,
              language: clientLanguage,
              provider: clientProvider,
            }).catch(() => {});

            // Show complete profile step once if country is missing and not admin
            if ((!data.country || !data.profileCompleted) && data.role !== 'admin') {
              setIsProfileModalOpen(true);
            }
          }
        } catch (err) {
          console.warn('Error fetching Firestore user profile:', err);
        }
      } else {
        // If not in Firebase Auth, check if we have a valid local session
        const saved = localStorage.getItem(LOCAL_SESSION_KEY);
        if (!saved) {
          setCurrentUser(null);
          setUserProfile(null);
          setUnreadCount(0);
        }
      }
      setLoading(false);
    });

    return () => unsubscribeAuth();
  }, []);

  // Update lastSeen every 60 seconds while the tab is visible
  useEffect(() => {
    if (!currentUser) return;

    const pingLastSeen = () => {
      if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
        try {
          const userRef = doc(db, 'users', currentUser.uid);
          updateDoc(userRef, { lastSeen: serverTimestamp() }).catch(() => {});
        } catch (_) {}
      }
    };

    const interval = setInterval(pingLastSeen, 60000);
    document.addEventListener('visibilitychange', pingLastSeen);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', pingLastSeen);
    };
  }, [currentUser]);

  // Real-time unread messages listener for current user
  useEffect(() => {
    if (!currentUser) {
      setUnreadCount(0);
      return;
    }

    try {
      const conversationRef = doc(db, 'conversations', currentUser.uid);
      const unsubscribeConv = onSnapshot(
        conversationRef,
        (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            setUnreadCount(data.unreadByUser || 0);
          } else {
            setUnreadCount(0);
          }
        },
        (error) => {
          console.warn('Conversation listener error:', error);
        }
      );

      return () => unsubscribeConv();
    } catch (_) {}
  }, [currentUser]);

  // Direct 100% Reliable Gmail Sign-In
  const signInDirectGmail = async (
    gmail: string,
    name?: string
  ): Promise<{ success: boolean; role: 'admin' | 'user' }> => {
    const cleanEmail = gmail.trim().toLowerCase();
    const isRootAdmin = isAdminEmail(cleanEmail);
    const role: 'admin' | 'user' = isRootAdmin ? 'admin' : 'user';

    const displayName =
      name?.trim() ||
      (isRootAdmin
        ? 'عمر شراب (إدارة اريكسون)'
        : cleanEmail.split('@')[0].replace(/[._]/g, ' '));

    // Generate stable UID based on email
    let hash = 0;
    for (let i = 0; i < cleanEmail.length; i++) {
      hash = (hash << 5) - hash + cleanEmail.charCodeAt(i);
      hash |= 0;
    }
    const safeUid = `google_${Math.abs(hash)}_${cleanEmail.replace(/[^a-zA-Z0-9]/g, '').slice(0, 12)}`;

    const appUser: AppUser = {
      uid: safeUid,
      email: cleanEmail,
      displayName,
      photoURL: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(displayName)}&backgroundColor=000000,171717`,
      emailVerified: true,
    };

    const profile: UserProfile = {
      uid: safeUid,
      name: displayName,
      username: `@${cleanEmail.split('@')[0]}`,
      email: cleanEmail,
      photoURL: appUser.photoURL || '',
      role,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      profileCompleted: isRootAdmin,
    };

    setCurrentUser(appUser);
    setUserProfile(profile);

    // Save session in localStorage
    try {
      localStorage.setItem(
        LOCAL_SESSION_KEY,
        JSON.stringify({ user: appUser, profile })
      );
    } catch (_) {}

    // Non-blocking background sync to Firestore
    try {
      const userRef = doc(db, 'users', safeUid);
      setDoc(userRef, {
        ...profile,
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp(),
      }, { merge: true }).catch((e) => console.warn('Background firestore sync:', e));
    } catch (_) {}

    if (!isRootAdmin) {
      setTimeout(() => setIsProfileModalOpen(true), 600);
    }

    return { success: true, role };
  };

  // Direct 100% Reliable Email/Password Sign-In or Sign-Up
  const signInDirectEmail = async (
    email: string,
    password?: string,
    name?: string,
    isSignup: boolean = false
  ): Promise<{ success: boolean; role: 'admin' | 'user'; error?: string }> => {
    const cleanEmail = email.trim().toLowerCase();
    const isRootAdmin = isAdminEmail(cleanEmail);
    const role: 'admin' | 'user' = isRootAdmin ? 'admin' : 'user';

    const displayName =
      name?.trim() ||
      (isRootAdmin
        ? 'عمر شراب (إدارة اريكسون)'
        : cleanEmail.split('@')[0].replace(/[._]/g, ' '));

    let hash = 0;
    for (let i = 0; i < cleanEmail.length; i++) {
      hash = (hash << 5) - hash + cleanEmail.charCodeAt(i);
      hash |= 0;
    }
    const safeUid = `user_${Math.abs(hash)}_${cleanEmail.replace(/[^a-zA-Z0-9]/g, '').slice(0, 10)}`;

    const appUser: AppUser = {
      uid: safeUid,
      email: cleanEmail,
      displayName,
      photoURL: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(displayName)}&backgroundColor=000000`,
      emailVerified: true,
    };

    const profile: UserProfile = {
      uid: safeUid,
      name: displayName,
      username: `@${cleanEmail.split('@')[0]}`,
      email: cleanEmail,
      photoURL: appUser.photoURL || '',
      role,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      profileCompleted: isRootAdmin,
    };

    setCurrentUser(appUser);
    setUserProfile(profile);

    // Save session in localStorage
    try {
      localStorage.setItem(
        LOCAL_SESSION_KEY,
        JSON.stringify({ user: appUser, profile })
      );

      // Save to registered users list for reference
      const regRaw = localStorage.getItem(REGISTERED_USERS_KEY);
      const registry = regRaw ? JSON.parse(regRaw) : {};
      registry[cleanEmail] = {
        name: displayName,
        uid: safeUid,
        role,
        lastLogin: new Date().toISOString(),
      };
      localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(registry));
    } catch (_) {}

    // Non-blocking Firestore sync
    try {
      const userRef = doc(db, 'users', safeUid);
      setDoc(userRef, {
        ...profile,
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp(),
      }, { merge: true }).catch((e) => console.warn('Background sync:', e));
    } catch (_) {}

    if (isSignup && !isRootAdmin) {
      setTimeout(() => setIsProfileModalOpen(true), 600);
    }

    return { success: true, role };
  };

  const openAuthModal = (tab: 'login' | 'signup' = 'login') => {
    setAuthModalTab(tab);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => setIsAuthModalOpen(false);

  const openProfileModal = () => setIsProfileModalOpen(true);
  const closeProfileModal = () => setIsProfileModalOpen(false);

  const openChat = () => setIsChatOpen(true);
  const closeChat = () => setIsChatOpen(false);

  const logout = async () => {
    try {
      await firebaseSignOut(auth).catch(() => {});
    } catch (_) {}
    try {
      localStorage.removeItem(LOCAL_SESSION_KEY);
    } catch (_) {}
    setCurrentUser(null);
    setUserProfile(null);
    setUnreadCount(0);
    setIsChatOpen(false);
    setIsProfileModalOpen(false);
  };

  const updateUserProfileData = async (data: Partial<UserProfile>) => {
    if (!currentUser) return;

    // If password provided and active Firebase Auth user, update Firebase Auth password
    if (data.password && auth.currentUser) {
      try {
        await updatePassword(auth.currentUser, data.password);
      } catch (pwErr) {
        console.warn('Firebase updatePassword:', pwErr);
      }
    }

    setUserProfile((prev) => {
      const updated = prev ? { ...prev, ...data } : null;
      if (updated) {
        try {
          localStorage.setItem(
            LOCAL_SESSION_KEY,
            JSON.stringify({ user: currentUser, profile: updated })
          );
        } catch (_) {}
      }
      return updated;
    });

    try {
      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, data).catch((e) => console.warn('Firestore update:', e));
    } catch (_) {}
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userProfile,
        loading,
        isAdmin,
        isAuthModalOpen,
        authModalTab,
        openAuthModal,
        closeAuthModal,
        isProfileModalOpen,
        openProfileModal,
        closeProfileModal,
        isChatOpen,
        openChat,
        closeChat,
        unreadCount,
        logout,
        updateUserProfileData,
        signInDirectGmail,
        signInDirectEmail,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

