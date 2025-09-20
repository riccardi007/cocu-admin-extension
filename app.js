import './index.css';
import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

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
  const [error, setError] = useState('');
  const mapDivRef = useRef(null);

  useEffect(() => {
    // Just listen for the auth state change
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  // Initialize the map once the user is logged in and the map div is available
  useEffect(() => {
    if (user && mapDivRef.current && !mapDivRef.current.hasChildNodes() && window.google?.maps) {
      try {
        new window.google.maps.Map(mapDivRef.current, {
          center: { lat: 34.0522, lng: -118.2437 },
          zoom: 12,
        });
        console.log("Map initialized directly in the component!");
      } catch (e) {
        console.error("Error initializing Google Map:", e);
        setError("Could not initialize the map.");
      }
    }
  }, [user]); // Rerun this effect when the user state changes

  const handleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      setError('');
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Authentication failed:", error);
      setError(`Authentication failed: ${error.message}`);
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <p className="text-lg font-bold">Loading...</p>
      </div>
    );
  }

  // If there's no user, show the sign-in button
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <h1 className="text-2xl font-bold mb-4">COCU Admin</h1>
        <button onClick={handleSignIn} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Sign in with Google
        </button>
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
    );
  }

  // If there is a user, show the map
  return (
    <div className="flex flex-col h-screen">
      <header className="p-4 bg-gray-800 text-white">
        Welcome, {user.displayName || user.email}!
      </header>
      <div ref={mapDivRef} style={{ flex: 1 }} title="Map" />
    </div>
  );
};

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);