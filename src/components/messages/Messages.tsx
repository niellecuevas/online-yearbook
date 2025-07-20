"use client";
import React, { useState, useEffect } from "react";
import { db } from "@/lib/firebaseConfig";
import {
  collection,
  getDocs,
  query,
  where,
  setDoc,
  doc,
  getDoc,
  deleteDoc,
  Timestamp,
  addDoc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import emailjs from "emailjs-com";

const Messages = () => {
  const [showModal, setShowModal] = useState(false);
  const [srCode, setSrCode] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [name, setName] = useState("");
  const [enteredOtp, setEnteredOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingDocId, setEditingDocId] = useState("");

  const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

  const handleSRSubmit = async () => {
    if (!srCode) return alert("Enter your SR code");

    try {
      const q = query(collection(db, "students"), where("srCode", "==", srCode));
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        const student = snapshot.docs[0].data();
        const email = student.email;
        const fetchedName = student.name || "Anonymous";

        // Check if this SR code already submitted a message
        const msgQuery = query(collection(db, "messages"), where("srCode", "==", srCode));
        const msgSnapshot = await getDocs(msgQuery);

        if (!msgSnapshot.empty) {
          const existingMsg = msgSnapshot.docs[0];
          const confirmEdit = confirm("You already submitted a message. Do you want to edit it?");
          if (!confirmEdit) {
            return setShowModal(false);
          }
          // prepare edit mode
          setIsEditMode(true);
          setMessage(existingMsg.data().message);
          setEditingDocId(existingMsg.id);
        }

        const generatedOtp = generateOtp();

        await setDoc(doc(db, "otps", srCode), {
          srCode,
          email,
          otp: generatedOtp,
          expiresAt: Timestamp.fromDate(new Date(Date.now() + 5 * 60 * 1000)),
        });

        await emailjs.send(
          "service_j10md7b",
          "template_0o3qx9d",
          {
            otp: generatedOtp,
            to_email: email,
          },
          "e8lUr-O1C9WSXRSOA"
        );

        setStudentEmail(email);
        setName(fetchedName);
        setIsOtpSent(true);
        alert(`OTP sent to: ${email}`);
      } else {
        alert("SR code not found.");
      }
    } catch (err) {
      console.error("Error sending OTP:", err);
      alert("Failed to send OTP.");
    }
  };

  const handleOtpVerify = async () => {
    try {
      const otpDoc = await getDoc(doc(db, "otps", srCode));
      if (!otpDoc.exists()) {
        alert("No OTP found.");
        return;
      }

      const data = otpDoc.data();
      if (enteredOtp !== data.otp) {
        alert("Incorrect OTP.");
      } else if (new Date() > data.expiresAt.toDate()) {
        alert("OTP expired.");
      } else {
        setIsOtpVerified(true);
        await deleteDoc(doc(db, "otps", srCode));
      }
    } catch (err) {
      console.error("OTP verification error:", err);
      alert("OTP verification failed.");
    }
  };

  const handleSubmitMessage = async () => {
    if (!message) return alert("Enter your message!");
    try {
      if (isEditMode) {
        await updateDoc(doc(db, "messages", editingDocId), {
          message,
          updatedAt: Timestamp.now(),
        });
        alert("✅ Message updated!");
      } else {
        await addDoc(collection(db, "messages"), {
          srCode,
          name,
          message,
          createdAt: Timestamp.now(),
        });
        alert("🎉 Message sent!");
      }

      // Reset everything
      setShowModal(false);
      setIsOtpVerified(false);
      setEnteredOtp("");
      setMessage("");
      setName("");
      setIsOtpSent(false);
      setSrCode("");
      setIsEditMode(false);
      setEditingDocId("");
    } catch (err) {
      console.error("Message error:", err);
      alert("Failed to submit message.");
    }
  };

  useEffect(() => {
    const unsub = onSnapshot(
      query(collection(db, "messages")),
      (snapshot) => {
        const msgs = snapshot.docs.map((doc) => doc.data());
        setMessages(msgs.reverse());
      }
    );
    return () => unsub();
  }, []);

  return (
    <div
      className="relative min-h-screen px-4 py-12 bg-cover bg-center text-white"
      style={{ backgroundImage: "url('/images/chalkboard.jpg')" }}
    >  
      <h1 className="text-4xl font-bold text-center mb-6 text-white">🎓 Leave a Message!</h1>
      <button
        className="bg-amber-400 hover:bg-amber-500 text-black font-semibold py-2 px-6 rounded-md mx-auto block shadow-lg"
        onClick={() => setShowModal(true)}
      >
        ✍️ Write on Chalkboard
      </button>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white text-black p-8 rounded-xl shadow-2xl w-full max-w-md space-y-4">
            {!isOtpSent ? (
              <>
                <h2 className="text-xl font-bold">Enter your SR-code</h2>
                <input
                  value={srCode}
                  onChange={(e) => setSrCode(e.target.value)}
                  placeholder="e.g. 21-00001"
                  className="w-full p-2 border rounded"
                />
                <div className="flex justify-end gap-4">
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-500"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSRSubmit}
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                  >
                    Send OTP
                  </button>
                </div>
              </>
            ) : !isOtpVerified ? (
              <>
                <h2 className="text-lg font-semibold">
                  Enter the OTP sent to {studentEmail}
                </h2>
                <input
                  value={enteredOtp}
                  onChange={(e) => setEnteredOtp(e.target.value)}
                  placeholder="6-digit OTP"
                  className="w-full p-2 border rounded"
                />
                <button
                  onClick={handleOtpVerify}
                  className="bg-green-600 text-white px-4 py-2 rounded"
                >
                  Verify OTP
                </button>
              </>
            ) : (
              <>
                <h2 className="font-bold text-xl">
                  {isEditMode ? "Edit your message ✏️" : "Leave your message 🎓"}
                </h2>
                <div className="mb-2">
                  <label className="block text-sm text-gray-600 mb-1">Name</label>
                  <input
                    value={name}
                    readOnly
                    className="w-full p-2 border rounded bg-gray-100 text-gray-600"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Message</label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Your message..."
                    rows={4}
                    className="w-full p-2 border rounded resize-none"
                  />
                </div>
                <button
                  onClick={handleSubmitMessage}
                  className="bg-purple-600 text-white px-4 py-2 rounded"
                >
                  {isEditMode ? "Save Changes" : "Send Message"}
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Messages Grid */}
      <div className="mt-15 m-20 columns-1 sm:columns-2 md:columns-3 gap-4 space-y-4 text-black">
        {messages.map((msg, i) => (
          <div
            key={i}
            className="break-inside-avoid p-4 rounded-xl text-white shadow-md hover:scale-[1.02] transition-transform duration-300"
          >
            <p className="italic">“{msg.message}”</p>
            <p className="text-right text-sm text-amber-600 mt-2">
              — {msg.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Messages;
