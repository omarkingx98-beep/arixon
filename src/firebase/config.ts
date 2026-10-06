import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
  increment,
  getDocs,
  Timestamp,
  DocumentData,
} from 'firebase/firestore';

// OFFICIAL FIREBASE CONFIGURATION (Provided by project owner)
export const firebaseConfig = {
  apiKey: "AIzaSyDgftdCJQn0fDbJ7JZ3A951EkwWIfW9r8g",
  authDomain: "arixon-d5b4a.firebaseapp.com",
  projectId: "arixon-d5b4a",
  storageBucket: "arixon-d5b4a.firebasestorage.app",
  messagingSenderId: "438925941886",
  appId: "1:438925941886:web:5d4798d2a91b0b73ed4c2f",
  measurementId: "G-ZY134Y0L57",
};

// Initialize Firebase App singleton
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);

// Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// Administrator Email Constant & Authorized Admin Emails
export const ADMIN_EMAIL = 'omarkingx99@gmail.com';
export const ADMIN_EMAILS = [
  'omarkingx99@gmail.com',
  'omarkingx@gmail.com',
  'omarsharrabx99@gmail.com',
  'mark99@gmail.com',
];

export const isAdminEmail = (email?: string | null): boolean => {
  if (!email) return false;
  const clean = email.trim().toLowerCase();
  return ADMIN_EMAILS.some((adm) => adm.toLowerCase() === clean);
};

/**
 * Access Control Rule:
 * Returns true if the user's email matches any of the designated administrator emails,
 * regardless of whether they signed in with Google or Email/Password.
 */
export const isVerifiedGoogleAdmin = (user: any): boolean => {
  if (!user) return false;
  const email = user.email || user.providerData?.[0]?.email;
  return isAdminEmail(email);
};

export const isAdminUser = (user: any): boolean => {
  return isVerifiedGoogleAdmin(user);
};

// Types
export interface AppUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL?: string | null;
  emailVerified?: boolean;
  provider?: string;
  providerData?: Array<{ providerId: string; email?: string | null }>;
}

export interface UserProfile {
  uid: string;
  name: string;
  username?: string;
  email: string;
  photoURL?: string;
  provider?: string;
  country?: string;
  countryCode?: string;
  countryFlag?: string;
  timezone?: string;
  language?: string;
  createdAt: any;
  lastLogin: any;
  lastSeen?: any;
  blocked?: boolean;
  adminNote?: string;
  birthdate?: string;
  age?: number;
  phone?: string;
  phoneDialCode?: string;
  fullPhone?: string;
  password?: string;
  role: 'admin' | 'user';
  profileCompleted: boolean;
}

export interface ChatMessage {
  id: string;
  text: string;
  senderId: string;
  senderRole: 'user' | 'admin';
  senderName?: string;
  createdAt: any;
}

export interface Conversation {
  id: string;
  userId: string;
  userName: string;
  userUsername?: string;
  userEmail: string;
  userPhoto?: string;
  userPhone?: string;
  userCountry?: string;
  userCountryFlag?: string;
  userAge?: number;
  lastMessage: string;
  updatedAt: any;
  unreadByAdmin: number;
  unreadByUser: number;
}

export interface ProjectRequest {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone?: string | null;
  appType: string;
  budgetRange: string;
  timeline: string;
  description: string;
  status: 'new' | 'in_progress' | 'done';
  adminNote?: string;
  createdAt: any;
}

export interface CompanyUpdate {
  id: string;
  titleAR: string;
  titleEN: string;
  bodyAR: string;
  bodyEN: string;
  createdAt: any;
}

export interface AdminState {
  lastSeenNotificationsAt: any;
}

export interface AnnouncementSettings {
  id: string;
  textAR: string;
  textEN: string;
  linkUrl?: string;
  active: boolean;
}

export interface SupportTicket {
  id: string;
  userId: string;
  name: string;
  email: string;
  appId: string;
  issueType: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  description: string;
  status: 'open' | 'in_progress' | 'resolved';
  adminNote?: string;
  createdAt: any;
}

// Lazy Analytics Initializer (invoked strictly upon user consent)
let analyticsInstance: any = null;

export async function initializeAnalyticsIfConsented() {
  if (typeof window === 'undefined') return null;
  if (analyticsInstance) return analyticsInstance;
  try {
    const { getAnalytics, isSupported } = await import('firebase/analytics');
    const supported = await isSupported();
    if (supported) {
      analyticsInstance = getAnalytics(app);
      return analyticsInstance;
    }
  } catch (err) {
    console.warn('Analytics initialization deferred or unsupported:', err);
  }
  return null;
}

