import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCYFEwwjD0I8Hk52X-dhqeWRCxATPEBlJg",
  authDomain: "online-yearbook-d430b.firebaseapp.com",
  projectId: "online-yearbook-d430b",
  storageBucket: "online-yearbook-d430b.firebasestorage.app",
  messagingSenderId: "55777153724",
  appId: "1:55777153724:web:e84d0631ab9b2816c336b9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export {db};