"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { updateUserAction } from "@/actions/auth";

interface User {
  id?: string;
  name: string;
  mobile: string;
  email?: string;
  image?: string;
  newsletterSubscribed?: boolean;
  addresses?: any;
  cart?: any;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoginModalOpen: boolean;
  login: (userData: User) => void;
  logout: () => void;
  openLoginModal: () => void;
  closeLoginModal: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = "minaliya-auth";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch (e) {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setMounted(true);
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
    setIsLoginModalOpen(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
    router.push("/");
  };

  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);

  const updateUser = async (userData: Partial<User>) => {
    if (!user) {
      // If no user is logged in (guest mode), we can temporarily initialize one
      const newUser = {
        name: userData.name || "Guest User",
        mobile: userData.mobile || "9876543210",
        email: userData.email || "user@example.com",
        image: userData.image,
        newsletterSubscribed: userData.newsletterSubscribed !== undefined ? userData.newsletterSubscribed : true,
        addresses: userData.addresses || [],
        cart: userData.cart || [],
      };
      setUser(newUser);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
      return;
    }

    const updatedUser = { ...user, ...userData };
    
    // Optimistic Update: Save to local storage and state immediately to keep UI fast & responsive
    setUser(updatedUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));

    // Persist to Postgres database asynchronously in the background
    try {
      const response = await updateUserAction(user.mobile, {
        name: userData.name,
        email: userData.email,
        mobile: userData.mobile,
        image: userData.image,
        newsletterSubscribed: userData.newsletterSubscribed,
        addresses: userData.addresses,
        cart: userData.cart,
      });

      if (response.success && response.user) {
        // Sync local state with actual verified details returned from Prisma
        const finalUser = {
          name: response.user.name || updatedUser.name,
          mobile: response.user.mobile || updatedUser.mobile,
          email: response.user.email || updatedUser.email || undefined,
          image: response.user.image || updatedUser.image || undefined,
          newsletterSubscribed: response.user.newsletterSubscribed !== undefined ? response.user.newsletterSubscribed : updatedUser.newsletterSubscribed,
          addresses: response.user.addresses || updatedUser.addresses || [],
          cart: response.user.cart || updatedUser.cart || [],
        };
        setUser(finalUser);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(finalUser));
      } else {
        console.error("[Auth Context] Database profile update failed:", response.error);
      }
    } catch (error) {
      console.error("[Auth Context] Database profile update exception:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoginModalOpen,
        login,
        logout,
        openLoginModal,
        closeLoginModal,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
