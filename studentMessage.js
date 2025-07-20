import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import fs from "fs";
import csv from "csv-parser";

// Firebase config
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

// Upload CSV to Firestore
const studentsCollection = collection(db, "students");

fs.createReadStream("studentMessage.csv")
  .pipe(csv())
  .on("data", async (row) => {
    const name = row["NAME"];
    const email = row["EMAIL"];
    const srCode = row["SR-CODE"];

    try {
      await addDoc(studentsCollection, {
        name,
        email,
        srCode
      });
      console.log(`Added: ${name}`);
    } catch (error) {
      console.error(`Error adding ${name}:`, error);
    }
  })
  .on("end", () => {
    console.log("CSV upload complete.");
  });
