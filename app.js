import React, { useState, useEffect } from 'react';
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
import { createRoot } from 'react-dom/client';
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signInAnonymously } from 'firebase/auth';
import { getFirestore, collection, onSnapshot, doc, setDoc, query, where, getDocs, addDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDXMKnsqEM8iMt5a49dizI0gh-3VGxE1bE",
  authDomain: "community-cleanup-cocu.firebaseapp.com",
  projectId: "community-cleanup-cocu",
  storageBucket: "community-cleanup-cocu.firebasestorage.app",
  messagingSenderId: "798262708990",
  appId: "1:798262708990:web:249020c2a12e605e4cf3af",
  measurementId: "G-00T59TV5WJ"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Use useEffect to initialize the map after the component renders
  useEffect(() => {
    // Check if the Google Maps API is loaded and the map div exists
    if (window.google && window.google.maps && document.getElementById('map')) {
      new google.maps.Map(document.getElementById('map'), {
        center: { lat: 34.0522, lng: -118.2437 },
        zoom: 12,
      });
      console.log("Map initialized!");
    }
  }, []);

  useEffect(() => {
    const initializeAuth = async () => {
      onAuthStateChanged(auth, async (currentUser) => {
        if (currentUser) {
          setUser(currentUser);
          setLoading(false);
          if (currentUser.isAnonymous) {
            const provider = new GoogleAuthProvider();
            try {
              await signInWithPopup(auth, provider);
            } catch (error) {
              console.error("Authentication failed during upgrade:", error);
            }
          }
        } else {
          await signInAnonymously(auth);
        }
      });
    };
    initializeAuth();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <p className="text-lg font-bold">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      <div id="map" style={{ flex: 1 }}></div>
    </div>
  );
};

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);