import React, { useState } from "react";
import { Eye, EyeOff, Loader2, Mail, Lock, User } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { signupUser, clearError } from "../../store/slices/authSlice";

interface SignupProps {
  onSwitchToLogin: () => void;
  onClose: () => void;
}

export const Signup: React.FC<SignupProps> = ({ onSwitchToLogin, onClose }) => {
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const validateForm = () => {
    const errors: string[] = [];

    if (formData.name.trim().length < 2) {
      errors.push("Name must be at least 2 characters long");
    }

    if (!formData.email.includes("@")) {
      errors.push("Please enter a valid email address");
    }

    if (formData.password.length < 6) {
      errors.push("Password must be at least 6 characters long");
    }

    if (formData.password !== formData.confirmPassword) {
      errors.push("Passwords do not match");
    }

    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(clearError());

    if (!validateForm()) {
      return;
    }

    try {
      await dispatch(
        signupUser({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      ).unwrap();
      onClose();
    } catch (error) {
      // Error is handled by Redux
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear validation errors when user starts typing
    if (validationErrors.length > 0) {
      setValidationErrors([]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-foreground">Create Account</h3>
        <p className="text-muted-foreground mt-2">
          Join us to personalize your content experience
        </p>
      </div>

      {(error || validationErrors.length > 0) && (
        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
          {error && <p className="text-destructive text-sm mb-2">{error}</p>}
          {validationErrors.map((err, index) => (
            <p key={index} className="text-destructive text-sm">
              • {err}
            </p>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-foreground mb-2"
          >
            Full Name
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
              placeholder="Enter your full name"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-foreground mb-2"
          >
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
              placeholder="Enter your email"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-foreground mb-2"
          >
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-12 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
              placeholder="Create a password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-foreground mb-2"
          >
            Confirm Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-12 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
              placeholder="Confirm your password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showConfirmPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-primary text-primary-foreground py-2 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Creating account...</span>
            </>
          ) : (
            <span>Create Account</span>
          )}
        </button>
      </form>

      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <button
            onClick={onSwitchToLogin}
            className="text-primary hover:underline font-medium"
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
};
