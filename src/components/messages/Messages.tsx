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
  font?: string; // Added font property
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

interface FontOption {
  name: string;
  value: string;
  className: string;
  preview: string;
}

// Font options array
const FONT_OPTIONS: FontOption[] = [
  {
    name: "Chalk Script",
    value: "chalk",
    className: "font-[CreamyChalk]",
    preview: "Nostalgic chalk writing"
  },
  {
    name: "Better Sweet",
    value: "handwriting",
    className: "font-[BetterSweet]",
    preview: "Personal handwritten style"
  },
  {
    name: "Bright Chalk",
    value: "script",
    className: "font-[BrightChalk]",
    preview: "Bright Handwriting"
  },
  {
    name: "Chalk Clouds",
    value: "mono",
    className: "font-[ChalkClouds]",
    preview: "Cursive Personal Handwriting"
  },
  {
    name: "Cute Chalk",
    value: "sans",
    className: "font-[CuteChalk]",
    preview: "Cute Handwriting Stuff"
  },
  {
    name: "Capital Chalky",
    value: "serif",
    className: "font-[EraserDust]",
    preview: "Capital chalky font"
  }
];

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
      <div className="bg-white text-black rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-100">
        {children}
      </div>
    </div>
  );
};

// Font Selector Component
interface FontSelectorProps {
  selectedFont: string;
  onFontChange: (font: string) => void;
  previewText: string;
}

const FontSelector: React.FC<FontSelectorProps> = ({ 
  selectedFont, 
  onFontChange, 
  previewText 
}) => {
  return (
    <div className="mb-4">
      <label className="block text-sm text-gray-600 mb-2 font-medium">
        Choose Font Style ✨
      </label>
      <div className="space-y-2 max-h-48 overflow-y-auto border rounded-lg p-2">
        {FONT_OPTIONS.map((font) => (
          <label
            key={font.value}
            className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors hover:bg-gray-50 ${
              selectedFont === font.value ? 'bg-blue-50 border-blue-200' : 'border border-gray-200'
            }`}
          >
            <input
              type="radio"
              name="font"
              value={font.value}
              checked={selectedFont === font.value}
              onChange={(e) => onFontChange(e.target.value)}
              className="mr-3"
            />
            <div className="flex-1">
              <div className="font-medium text-sm text-gray-800">
                {font.name}
              </div>
              <div className={`text-gray-600 text-sm mt-1 ${font.className}`}>
                {previewText || font.preview}
              </div>
            </div>
          </label>
        ))}
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
  const [selectedFont, setSelectedFont] = useState<string>("chalk"); // Default font
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
  const [currentPage, setCurrentPage] = useState<number>(0);

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

  // Helper function to get font class from font value
  const getFontClassName = (fontValue: string): string => {
    const fontOption = FONT_OPTIONS.find(f => f.value === fontValue);
    return fontOption?.className || "font-[CreamyChalk]";
  };

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
    setSelectedFont("chalk"); // Reset font selection
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
            "I still have your last message. Would you like to edit it?",
            () => {
              setIsEditMode(true);
              setMessage(existingMsgData.message);
              setSelectedFont(existingMsgData.font || "chalk"); // Load existing font
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
        showStatus("error", "Code not recognized. For our section buddies only! 💛");
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
          font: selectedFont, // Save selected font
          updatedAt: Timestamp.now(),
        });
        showStatus("success", "Message updated successfully!");
      } else {
        await addDoc(collection(db, "messages"), {
          srCode,
          name,
          message,
          font: selectedFont, // Save selected font
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
      showConfirmation("I'll lose your progress if you leave now.", resetModal);
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
          font: data.font || "chalk", // Default to chalk if no font saved
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
        } as Message;
      });
      setMessages(msgs.reverse());
    });
    return () => unsub();
  }, []);

  // Function to distribute messages evenly across columns based on content length
const distributeMessages = (messages: Message[])  => {
  const columns = [[], [], []];
  const columnHeights = [0, 0, 0];
  
  messages.forEach((msg) => {
    // Estimate message height based on content length
    const estimatedHeight = Math.max(100, msg.message.length * 0.8 + msg.name.length * 0.5 + 80);
    
    // Find the column with the least total height
    const shortestColumnIndex = columnHeights.indexOf(Math.min(...columnHeights));
    
    // Add message to the shortest column
    columns[shortestColumnIndex].push(msg);
    columnHeights[shortestColumnIndex] += estimatedHeight;
  });
  
  return columns;
};

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

    {/* Balanced Content Grid - 3 Columns */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 px-4 mb-16 max-h-[70vh] overflow-y-auto scrollbar-thin scrollbar-thumb-[#FAF3E0]/30 scrollbar-track-transparent">
      {distributeMessages(messages).map((columnMessages, columnIndex) => (
        <div key={columnIndex} className="space-y-4">
          {columnMessages.map((msg, i) => (
            <div
              key={`col-${columnIndex}-msg-${i}`}
              className="p-4 px-6 rounded-xl text-white shadow-md hover:scale-[1.02] transition-transform duration-300 bg-black/10"
            >
              <div className={`italic text-[#FAF3E0] leading-relaxed ${getFontClassName(msg.font || "chalk")}`}>
                "{msg.message}"
              </div>
              <div className={`text-right text-sm text-amber-500 mt-3 ${getFontClassName(msg.font || "chalk")}`}>
                — {msg.name}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>

    
    {isLoading && (
      <div className="text-center py-8">
        <div className="text-[#FAF3E0] text-lg">Loading more messages...</div>
      </div>
    )}


    {messages.length > 0 && !isLoading && (
      <div className="text-center py-8">
        <div className="text-[#FAF3E0]/60 text-sm italic">
          ~ End of chalkboard memories ~
        </div>
      </div>
    )}
  
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
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-600 focus:border-none outline-none transition-all"
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
                      className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
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
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-600 outline-none transition-all text-center text-lg font-mono"
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
                      className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 ml-auto cursor-pointer"
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
                      className="w-full p-3 border rounded-lg resize-none focus:ring-2 focus:ring-[#005a43] focus:border-[#008d69] outline-none transition-all font-sans"
                      disabled={isLoading}
                    />
                  </div>

                  {/* Font Selector */}
                  <FontSelector 
                    selectedFont={selectedFont}
                    onFontChange={setSelectedFont}
                    previewText={message || "Your message will look like this"}
                  />

                  <div>
                    <label className="block text-sm text-gray-600 mb-2 font-medium">
                      Message Preview
                    </label>
                    <div className={`w-full p-3 border rounded-lg bg-gray-50 min-h-[100px] text-gray-800 ${getFontClassName(selectedFont)}`}>
                      {message || "Start typing to see your message in the selected font..."}
                    </div>
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