import React, { createContext, useContext, useEffect, useState } from "react";
import { rtdb, auth, db } from "../lib/firebase";
import { ref, onValue } from "firebase/database";
import { onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot, collection, query, where } from "firebase/firestore";

const FirebaseContext = createContext();

export const FirebaseProvider = ({ children }) => {
  const [dashboardData, setDashboardData] = useState({ data: null, loading: true });
  const [userData, setUserData] = useState({ data: null, loading: true });
  const [docsData, setDocsData] = useState({ data: [], loading: true });

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        // 1. Realtime DB for Dashboard
        const dashboardRef = ref(rtdb, `users/${user.uid}/dashboard`);
        const unsubscribeDashboard = onValue(dashboardRef, (snapshot) => {
          setDashboardData({ data: snapshot.val(), loading: false });
        }, (error) => {
          console.error("Firebase Realtime DB Error:", error);
          setDashboardData({ data: null, loading: false });
        });

        // 2. Firestore for User Profile
        const userRef = doc(db, "users", user.uid);
        const unsubscribeUser = onSnapshot(userRef, (docSnap) => {
          if (docSnap.exists()) {
            setUserData({ data: docSnap.data(), loading: false });
          } else {
            setUserData({ data: null, loading: false });
          }
        }, (error) => {
          console.error("Firestore User Error:", error);
          setUserData({ data: null, loading: false });
        });

        // 3. Firestore for Uploaded Docs
        const docsQuery = query(collection(db, "uploaded_docs"), where("userId", "==", user.uid));
        const unsubscribeDocs = onSnapshot(docsQuery, (querySnapshot) => {
          const docs = [];
          querySnapshot.forEach((doc) => {
            docs.push({ id: doc.id, ...doc.data() });
          });
          setDocsData({ data: docs, loading: false });
        }, (error) => {
          console.error("Firestore Docs Error:", error);
          setDocsData({ data: [], loading: false });
        });

        // Cleanup subscriptions when auth state changes or unmounts
        return () => {
          unsubscribeDashboard();
          unsubscribeUser();
          unsubscribeDocs();
        };
      } else {
        // No user is signed in
        setDashboardData({ data: null, loading: false });
        setUserData({ data: null, loading: false });
        setDocsData({ data: [], loading: false });
      }
    });

    // Cleanup auth subscription on unmount
    return () => unsubscribeAuth();
  }, []);

  return (
    <FirebaseContext.Provider value={{ dashboard: dashboardData, user: userData, docs: docsData }}>
      {children}
    </FirebaseContext.Provider>
  );
};

export const useFirebaseData = () => {
  const context = useContext(FirebaseContext);
  return context ? context.dashboard : { data: null, loading: true };
};

export const useUserData = () => {
  const context = useContext(FirebaseContext);
  return context ? context.user : { data: null, loading: true };
};

export const useUploadDocs = () => {
  const context = useContext(FirebaseContext);
  return context ? context.docs : { data: [], loading: true };
};
