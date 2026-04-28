import React, { createContext, useContext, useEffect, useState } from "react";
import { rtdb, auth } from "../lib/firebase";
import { ref, onValue } from "firebase/database";
import { onAuthStateChanged } from "firebase/auth";

const FirebaseContext = createContext();

export const FirebaseProvider = ({ children }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Reference to the specific user's dashboard node in the Realtime Database
        const dashboardRef = ref(rtdb, `users/${user.uid}/dashboard`);
        
        // Listen for real-time updates
        const unsubscribeDb = onValue(dashboardRef, (snapshot) => {
          const val = snapshot.val();
          setData(val);
          setLoading(false);
        }, (error) => {
          console.error("Firebase Realtime DB Error:", error);
          setLoading(false);
        });

        // Cleanup DB subscription when auth state changes or unmounts
        return () => unsubscribeDb();
      } else {
        // No user is signed in
        setData(null);
        setLoading(false);
      }
    });

    // Cleanup auth subscription on unmount
    return () => unsubscribeAuth();
  }, []);

  return (
    <FirebaseContext.Provider value={{ data, loading }}>
      {children}
    </FirebaseContext.Provider>
  );
};

export const useFirebaseData = () => {
  return useContext(FirebaseContext);
};
