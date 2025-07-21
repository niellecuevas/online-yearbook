"use client";
import React, { useState, useEffect, useRef } from "react";
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
  DocumentData,
} from "firebase/firestore";
import emailjs from "emailjs-com";

// Types
interface Message {
  srCode: string;
  name: string;
  message: string;
  createdAt: Timestamp;
  updatedAt?: Timestamp;
}

interface Student {
  srCode: string;
  email: string;
  name?: string;
}

interface StatusMessage {
  type: "success" | "error" | "info" | "warning";
  message: string;
  isVisible: boolean;
}

// Unified PopUp Component
interface PopUpProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const PopUp: React.FC<PopUpProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
      <div className="bg-white text-black rounded-xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100">
        {children}
      </div>
    </div>
  );
};

// Status Component for feedback messages
interface StatusMessageProps {
  type: StatusMessage["type"];
  message: string;
  isVisible: boolean;
}

const StatusMessageComponent: React.FC<StatusMessageProps> = ({
  type,
  message,
  isVisible,
}) => {
  if (!isVisible) return null;

  const getStatusStyles = (): string => {
    switch (type) {
      case "success":
        return "bg-green-100 border-green-400 text-green-700";
      case "error":
        return "bg-red-100 border-red-400 text-red-700";
      case "info":
        return "bg-amber-100 border-amber-400 text-amber-700";
      case "warning":
        return "bg-yellow-100 border-yellow-400 text-yellow-700";
      default:
        return "bg-gray-100 border-gray-400 text-gray-700";
    }
  };

  const getIcon = (): string => {
    switch (type) {
      case "success":
        return "✅";
      case "error":
        return "❌";
      case "info":
        return "ℹ️";
      case "warning":
        return "⚠️";
      default:
        return "📝";
    }
  };

  return (
    <div className={`border-l-4 p-3 mb-4 rounded ${getStatusStyles()}`}>
      <div className="flex items-center">
        <span className="mr-2">{getIcon()}</span>
        <span className="text-sm font-medium">{message}</span>
      </div>
    </div>
  );
};

// Loading Animation Component
const LoadingSpinner: React.FC<{ size?: "sm" | "md" | "lg" }> = ({
  size = "md",
}) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  return (
    <div
      className={`${sizeClasses[size]} border-2 border-amber-200 border-t-amber-600 rounded-full animate-spin`}
    ></div>
  );
};

// OTP Waiting Animation Component
const OTPWaitingAnimation: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-8 space-y-4">
      <div className="relative">
        {/* Pulsing envelope icon */}
        <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center animate-pulse">
          <div className="text-2xl">📧</div>
        </div>
        {/* Animated dots around the envelope */}
        <div className="absolute -inset-2">
          <div className="w-20 h-20 border-2 border-amber-300 rounded-full animate-ping opacity-20"></div>
        </div>
        <div className="absolute -inset-1">
          <div className="w-18 h-18 border border-amber-400 rounded-full animate-ping opacity-40 animation-delay-75"></div>
        </div>
      </div>

      {/* Loading text with animated dots */}
      <div className="text-center">
        <p className="text-lg font-semibold text-amber-700 mb-1">Sending OTP</p>
        <div className="flex items-center justify-center space-x-1">
          <span className="text-gray-600">Please wait</span>
          <div className="flex space-x-1">
            <div className="w-1 h-1 bg-amber-500 rounded-full animate-bounce"></div>
            <div
              className="w-1 h-1 bg-amber-500 rounded-full animate-bounce"
              style={{ animationDelay: "0.1s" }}
            ></div>
            <div
              className="w-1 h-1 bg-amber-500 rounded-full animate-bounce"
              style={{ animationDelay: "0.2s" }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Messages: React.FC = () => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [srCode, setSrCode] = useState<string>("");
  const [studentEmail, setStudentEmail] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [enteredOtp, setEnteredOtp] = useState<string>("");
  const [isOtpSent, setIsOtpSent] = useState<boolean>(false);
  const [isOtpVerified, setIsOtpVerified] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [editingDocId, setEditingDocId] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSendingOtp, setIsSendingOtp] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<StatusMessage>({
    type: "info",
    message: "",
    isVisible: false,
  });
  const [showConfirmDialog, setShowConfirmDialog] = useState<boolean>(false);
  const [confirmCallback, setConfirmCallback] = useState<(() => void) | null>(
    null
  );
  const [currentPage, setCurrentPage] = useState<number>(0); // New state for pagination

  const generateOtp = (): string =>
    Math.floor(100000 + Math.random() * 900000).toString();
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Calculate pagination variables
  const messagesPerPage = 9;
  const pageCount = Math.ceil(messages.length / messagesPerPage);
  const paginatedMessages = messages.slice(
    currentPage * messagesPerPage,
    (currentPage + 1) * messagesPerPage
  );

  const showStatus = (
    type: StatusMessage["type"],
    message: string,
    duration: number = 3000
  ): void => {
    setStatusMessage({ type, message, isVisible: true });
    setTimeout(() => {
      setStatusMessage((prev) => ({ ...prev, isVisible: false }));
    }, duration);
  };

  const showConfirmation = (message: string, callback: () => void): void => {
    setStatusMessage({ type: "warning", message, isVisible: true });
    setShowConfirmDialog(true);
    setConfirmCallback(() => callback);
  };

  const handleConfirm = (): void => {
    if (confirmCallback) {
      confirmCallback();
    }
    setShowConfirmDialog(false);
    setConfirmCallback(null);
    setStatusMessage((prev) => ({ ...prev, isVisible: false }));
  };

  const handleCancel = (): void => {
    setShowConfirmDialog(false);
    setConfirmCallback(null);
    setStatusMessage((prev) => ({ ...prev, isVisible: false }));
  };

  const resetModal = (): void => {
    setShowModal(false);
    setIsOtpVerified(false);
    setEnteredOtp("");
    setMessage("");
    setName("");
    setIsOtpSent(false);
    setSrCode("");
    setIsEditMode(false);
    setEditingDocId("");
    setIsLoading(false);
    setIsSendingOtp(false);
    setStatusMessage({ type: "info", message: "", isVisible: false });
  };

  const handleSRSubmit = async (): Promise<void> => {
    if (!srCode.trim()) {
      showStatus("error", "Please enter your SR code");
      return;
    }

    setIsLoading(true);

    try {
      const q = query(
        collection(db, "students"),
        where("srCode", "==", srCode)
      );
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        const student = snapshot.docs[0].data() as Student;
        const email = student.email;
        const fetchedName = student.name || "Anonymous";

        // Check if this SR code already submitted a message
        const msgQuery = query(
          collection(db, "messages"),
          where("srCode", "==", srCode)
        );
        const msgSnapshot = await getDocs(msgQuery);

        if (!msgSnapshot.empty) {
          const existingMsg = msgSnapshot.docs[0];
          const existingMsgData = existingMsg.data() as Message;

          showConfirmation(
            "You already submitted a message. Do you want to edit it nanaman?",
            () => {
              setIsEditMode(true);
              setMessage(existingMsgData.message);
              setEditingDocId(existingMsg.id);
              setName(fetchedName);
              setStudentEmail(email);
              proceedWithOTP(email, fetchedName);
            }
          );
          setIsLoading(false);
          return;
        }

        await proceedWithOTP(email, fetchedName);
      } else {
        showStatus("error", "SR code not found.bkadikapasa");
      }
    } catch (err) {
      console.error("Error sending OTP:", err);
      showStatus("error", "Failed to send OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const proceedWithOTP = async (
    email: string,
    fetchedName: string
  ): Promise<void> => {
    setIsSendingOtp(true);

    try {
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
      showStatus("success", `OTP sent to: ${email}`);
    } catch (error) {
      console.error("Error sending OTP:", error);
      showStatus("error", "Failed to send OTP. Please try again.");
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleOtpVerify = async (): Promise<void> => {
    if (!enteredOtp.trim()) {
      showStatus("error", "Please enter the OTP");
      return;
    }

    setIsLoading(true);

    try {
      const otpDoc = await getDoc(doc(db, "otps", srCode));
      if (!otpDoc.exists()) {
        showStatus("error", "No OTP found. Please request a new one.");
        setIsLoading(false);
        return;
      }

      const data = otpDoc.data();
      if (enteredOtp !== data.otp) {
        showStatus("error", "Incorrect OTP. Please check and try again.");
      } else if (new Date() > data.expiresAt.toDate()) {
        showStatus("error", "OTP expired. Please request a new one.");
      } else {
        setIsOtpVerified(true);
        await deleteDoc(doc(db, "otps", srCode));
        showStatus("success", "OTP verified successfully!");
      }
    } catch (err) {
      console.error("OTP verification error:", err);
      showStatus("error", "OTP verification failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitMessage = async (): Promise<void> => {
    if (!message.trim()) {
      showStatus("error", "Please enter your message!");
      return;
    }

    setIsLoading(true);

    try {
      if (isEditMode) {
        await updateDoc(doc(db, "messages", editingDocId), {
          message,
          updatedAt: Timestamp.now(),
        });
        showStatus("success", "Message updated successfully!");
      } else {
        await addDoc(collection(db, "messages"), {
          srCode,
          name,
          message,
          createdAt: Timestamp.now(),
        });
        showStatus("success", "Message sent successfully! 🎉");
      }

      // Reset everything after a short delay to show success message
      setTimeout(() => {
        resetModal();
      }, 1500);
    } catch (err) {
      console.error("Message error:", err);
      showStatus("error", "Failed to submit message. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleModalClose = (): void => {
    if (isOtpSent || isOtpVerified || message.trim()) {
      showConfirmation(
        "Are you sure you want to close? Your progress will be lost.",
        resetModal
      );
    } else {
      resetModal();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent, action: () => void): void => {
    if (e.key === "Enter" && !isLoading && !isSendingOtp) {
      action();
    }
  };

  // Pagination handlers
  const goToPage = (page: number): void => {
    setCurrentPage(page);
  };

  const goToNextPage = (): void => {
    setCurrentPage((prev) => Math.min(prev + 1, pageCount - 1));
  };

  const goToPrevPage = (): void => {
    setCurrentPage((prev) => Math.max(prev - 1, 0));
  };

  useEffect(() => {
    const unsub = onSnapshot(query(collection(db, "messages")), (snapshot) => {
      const msgs = snapshot.docs.map((doc) => {
        const data = doc.data() as DocumentData;
        return {
          srCode: data.srCode,
          name: data.name,
          message: data.message,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
        } as Message;
      });
      setMessages(msgs.reverse());
    });
    return () => unsub();
  }, []);

  return (
    <div
      id="messages"
      className="relative w-full min-h-screen px-10 py-12 bg-cover bg-center text-white font-[CreamyChalk]"
      style={{ backgroundImage: "url('/images/chalkboard.jpg')" }}
    >
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-6xl font-bold text-center pt-5 mb-10 text-white">
          Echoes of 02
        </h1>
        <button
          className="bg-amber-400 hover:bg-amber-500 text-black font-semibold py-2 px-6 rounded-md mx-auto block shadow-lg transition-all duration-200 hover:shadow-xl cursor-pointer"
          onClick={() => setShowModal(true)}
        >
          ✍️ Write on Chalkboard
        </button>
      </div>

      {/* Messages Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 px-4 mb-16">
        {paginatedMessages.map((msg, i) => (
          <div
            key={i}
            className="break-inside-avoid p-4 px-10 rounded-xl text-white shadow-md hover:scale-[1.02] transition-transform duration-300"
          >
            <div className="italic max-h-40 overflow-y-auto pr-1 text-[#FAF3E0] scrollbar-hidden">
              "{msg.message}"
            </div>
            <div className="text-right text-sm text-amber-500 mt-2">
              — {msg.name}
            </div>
          </div>
        ))}

        {/* Fill empty slots */}
        {paginatedMessages.length < messagesPerPage &&
          Array.from({
            length: messagesPerPage - paginatedMessages.length,
          }).map((_, i) => (
            <div
              key={`empty-${i}`}
              className="p-3 rounded-lg border border-dashed border-white/5"
            ></div>
          ))}
      </div>

      {/* Pagination - Fixed at Bottom */}
      <div className="left-0 right-0 bg-black/80 py-3 backdrop-blur-sm">
        <div className="flex justify-center items-center gap-2">
          <button
            onClick={goToPrevPage}
            disabled={currentPage === 0}
            className="p-1.5 disabled:opacity-30 cursor-pointer"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <div className="flex gap-1">
            {Array.from({ length: Math.min(5, pageCount) }).map((_, i) => {
              const pageNum =
                pageCount <= 5
                  ? i
                  : currentPage < 2
                  ? i
                  : currentPage > pageCount - 3
                  ? pageCount - 5 + i
                  : currentPage - 2 + i;

              return (
                <button
                  key={pageNum}
                  onClick={() => goToPage(pageNum)}
                  className={`w-7 h-7 text-xs rounded ${
                    currentPage === pageNum
                      ? "bg-amber-400 text-black"
                      : "text-amber-100 hover:bg-white/10"
                  }`}
                >
                  {pageNum + 1}
                </button>
              );
            })}
          </div>

          <button
            onClick={goToNextPage}
            disabled={currentPage === pageCount - 1}
            className="p-1.5 disabled:opacity-30 cursor-pointer"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Unified Modal */}
      <PopUp isOpen={showModal} onClose={handleModalClose}>
        <div className="p-6 space-y-4">
          {/* Status Message */}
          <StatusMessageComponent
            type={statusMessage.type}
            message={statusMessage.message}
            isVisible={statusMessage.isVisible}
          />

          {/* Confirmation Dialog */}
          {showConfirmDialog && (
            <div className="flex gap-3 justify-end">
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className="px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700 transition-colors cursor-pointer"
              >
                Confirm
              </button>
            </div>
          )}

          {/* OTP Sending Animation */}
          {isSendingOtp && <OTPWaitingAnimation />}

          {!showConfirmDialog && !isSendingOtp && (
            <>
              {!isOtpSent ? (
                <>
                  <h2 className="text-xl font-bold">Enter your SR-code</h2>
                  <input
                    value={srCode}
                    onChange={(e) => setSrCode(e.target.value)}
                    placeholder="e.g. 21-00001"
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#008d69] focus:border-[#008d69] outline-none transition-all"
                    disabled={isLoading}
                    onKeyPress={(e) => handleKeyPress(e, handleSRSubmit)}
                  />
                  <div className="flex justify-end gap-4 pt-2">
                    <button
                      onClick={handleModalClose}
                      className="text-gray-500 hover:text-gray-700 px-4 py-2 transition-colors cursor-pointer"
                      disabled={isLoading}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSRSubmit}
                      disabled={isLoading}
                      className="bg-amber-500 text-white px-6 py-2 rounded-lg hover:bg-amber-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
                    >
                      {isLoading && <LoadingSpinner size="sm" />}
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
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all text-center text-lg font-mono"
                    maxLength={6}
                    disabled={isLoading}
                    onKeyPress={(e) => handleKeyPress(e, handleOtpVerify)}
                  />
                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => {
                        setIsOtpSent(false);
                        setEnteredOtp("");
                      }}
                      className="text-gray-500 hover:text-gray-700 px-4 py-2 transition-colors"
                      disabled={isLoading}
                    >
                      Back
                    </button>
                    <button
                      onClick={handleOtpVerify}
                      disabled={isLoading}
                      className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 ml-auto cursor-pointer"
                    >
                      {isLoading && <LoadingSpinner size="sm" />}
                      Verify OTP
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h2 className="font-bold text-xl">
                    {isEditMode
                      ? "Edit your message ✏️"
                      : "Leave your message 🎓"}
                  </h2>
                  <div className="mb-4">
                    <label className="block text-sm text-gray-600 mb-2 font-medium">
                      Name
                    </label>
                    <input
                      value={name}
                      readOnly
                      className="w-full p-3 border rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-2 font-medium">
                      Message
                    </label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Write your message here..."
                      rows={4}
                      className="w-full p-3 border rounded-lg resize-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
                      disabled={isLoading}
                    />
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => {
                        setIsOtpVerified(false);
                        setEnteredOtp("");
                      }}
                      className="text-gray-500 hover:text-gray-700 px-4 py-2 transition-colors cursor-pointer"
                      disabled={isLoading}
                    >
                      Back
                    </button>
                    <button
                      onClick={handleSubmitMessage}
                      disabled={isLoading}
                      className="bg-[#008d69] text-white px-6 py-2 rounded-lg hover:bg-[#005a43] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 ml-auto cursor-pointer"
                    >
                      {isLoading && <LoadingSpinner size="sm" />}
                      {isEditMode ? "Save Changes" : "Send Message"}
                    </button>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </PopUp>
    </div>
  );
};

export default Messages;
