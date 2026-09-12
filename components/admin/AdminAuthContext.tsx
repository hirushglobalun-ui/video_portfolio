"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  User,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase/client";

interface AdminAuthContextType {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType>({
  user: null,
  isAdmin: false,
  loading: true,
  login: async () => {},
  logout: async () => {},
});

export const AdminAuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Check and bootstrap user record in Firestore
        if (db) {
          try {
            const userRef = doc(db, "users", currentUser.uid);
            const userDoc = await getDoc(userRef);
            if (userDoc.exists()) {
              const data = userDoc.data();
              setIsAdmin(data.role === "admin" && data.active !== false);
            } else {
              // Automatically bootstrap the admin user profile in Firestore
              await setDoc(
                userRef,
                {
                  uid: currentUser.uid,
                  email: currentUser.email,
                  role: "admin",
                  active: true,
                  createdAt: new Date().toISOString(),
                },
                { merge: true }
              );
              setIsAdmin(true);
            }
          } catch (err) {
            console.warn("User role verification defaulting to authenticated session:", err);
            setIsAdmin(true);
          }
        } else {
          setIsAdmin(true);
        }
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, pass: string) => {
    if (!auth) {
      throw new Error("Firebase Auth is not initialized. Please verify your .env configuration.");
    }
    await signInWithEmailAndPassword(auth, email, pass);
  };

  const logout = async () => {
    if (!auth) return;
    await signOut(auth);
  };

  return (
    <AdminAuthContext.Provider value={{ user, isAdmin, loading, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => useContext(AdminAuthContext);
