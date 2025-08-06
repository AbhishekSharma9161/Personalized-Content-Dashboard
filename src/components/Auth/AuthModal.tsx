import React, { useState } from "react";
import { X } from "lucide-react";
import { Login } from "./Login";
import { Signup } from "./Signup";
import { Profile } from "./Profile";
import { useAppSelector } from "../../store/hooks";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: "login" | "signup" | "profile";
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = "login",
}) => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [mode, setMode] = useState<"login" | "signup" | "profile">(
    isAuthenticated ? "profile" : initialMode,
  );

  if (!isOpen) return null;

  // If user is authenticated, always show profile
  const currentMode = isAuthenticated ? "profile" : mode;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-bold text-foreground">
            {currentMode === "login" && "Sign In"}
            {currentMode === "signup" && "Create Account"}
            {currentMode === "profile" && "My Profile"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-8rem)]">
          {currentMode === "login" && (
            <Login
              onSwitchToSignup={() => setMode("signup")}
              onClose={onClose}
            />
          )}
          {currentMode === "signup" && (
            <Signup
              onSwitchToLogin={() => setMode("login")}
              onClose={onClose}
            />
          )}
          {currentMode === "profile" && <Profile onClose={onClose} />}
        </div>
      </div>
    </div>
  );
};
