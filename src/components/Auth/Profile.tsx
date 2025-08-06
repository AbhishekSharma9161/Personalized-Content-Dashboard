import React, { useState } from "react";
import { User, Mail, Edit3, Save, X, Camera, Loader2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  updateUserProfile,
  logout,
  updateUserLocal,
} from "../../store/slices/authSlice";

interface ProfileProps {
  onClose: () => void;
}

export const Profile: React.FC<ProfileProps> = ({ onClose }) => {
  const dispatch = useAppDispatch();
  const { user, isLoading } = useAppSelector((state) => state.auth);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    bio: user?.bio || "",
    preferences: {
      newsletter: user?.preferences.newsletter || false,
      notifications: user?.preferences.notifications || false,
      language: user?.preferences.language || "en",
    },
  });

  if (!user) return null;

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;

    if (name.startsWith("preferences.")) {
      const prefKey = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        preferences: {
          ...prev.preferences,
          [prefKey]:
            type === "checkbox"
              ? (e.target as HTMLInputElement).checked
              : value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSave = async () => {
    try {
      await dispatch(updateUserProfile(formData)).unwrap();
      setIsEditing(false);
    } catch (error) {
      // Error is handled by Redux
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user.name,
      bio: user.bio || "",
      preferences: {
        newsletter: user.preferences.newsletter,
        notifications: user.preferences.notifications,
        language: user.preferences.language,
      },
    });
    setIsEditing(false);
  };

  const handleLogout = () => {
    dispatch(logout());
    onClose();
  };

  const generateNewAvatar = () => {
    const newAvatar = `https://api.dicebear.com/7.x/initials/svg?seed=${user.email}-${Date.now()}`;
    dispatch(updateUserLocal({ avatar: newAvatar }));
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-foreground">Profile Settings</h3>
        <p className="text-muted-foreground mt-2">
          Manage your account and preferences
        </p>
      </div>

      {/* Avatar Section */}
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-24 h-24 rounded-full border-4 border-primary/20"
          />
          <button
            onClick={generateNewAvatar}
            className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground p-2 rounded-full hover:bg-primary/90 transition-colors"
            title="Generate new avatar"
          >
            <Camera className="w-4 h-4" />
          </button>
        </div>
        <div className="text-center">
          <h4 className="font-semibold text-foreground">{user.name}</h4>
          <p className="text-sm text-muted-foreground">{user.email}</p>
          <p className="text-xs text-muted-foreground mt-1">
            Member since {new Date(user.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Profile Form */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h4 className="font-semibold text-foreground">
            Personal Information
          </h4>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center space-x-1 text-primary hover:text-primary/80 transition-colors"
            >
              <Edit3 className="w-4 h-4" />
              <span className="text-sm">Edit</span>
            </button>
          ) : (
            <div className="flex space-x-2">
              <button
                onClick={handleSave}
                disabled={isLoading}
                className="flex items-center space-x-1 bg-primary text-primary-foreground px-3 py-1 rounded text-sm hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                <span>Save</span>
              </button>
              <button
                onClick={handleCancel}
                className="flex items-center space-x-1 text-muted-foreground hover:text-foreground px-3 py-1 rounded text-sm transition-colors"
              >
                <X className="w-4 h-4" />
                <span>Cancel</span>
              </button>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-foreground mb-2"
            >
              Display Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed"
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
                value={user.email}
                disabled
                className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-lg opacity-50 cursor-not-allowed"
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Email cannot be changed
            </p>
          </div>

          <div>
            <label
              htmlFor="bio"
              className="block text-sm font-medium text-foreground mb-2"
            >
              Bio
            </label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              disabled={!isEditing}
              rows={3}
              className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed resize-none"
              placeholder="Tell us about yourself..."
            />
          </div>
        </div>
      </div>

      {/* Preferences */}
      <div className="space-y-4">
        <h4 className="font-semibold text-foreground">Preferences</h4>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div>
              <div className="font-medium text-sm">Email Newsletter</div>
              <div className="text-xs text-muted-foreground">
                Receive weekly content recommendations
              </div>
            </div>
            <input
              type="checkbox"
              name="preferences.newsletter"
              checked={formData.preferences.newsletter}
              onChange={handleChange}
              disabled={!isEditing}
              className="rounded border-border text-primary focus:ring-primary disabled:opacity-50"
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div>
              <div className="font-medium text-sm">Push Notifications</div>
              <div className="text-xs text-muted-foreground">
                Get notified about new content
              </div>
            </div>
            <input
              type="checkbox"
              name="preferences.notifications"
              checked={formData.preferences.notifications}
              onChange={handleChange}
              disabled={!isEditing}
              className="rounded border-border text-primary focus:ring-primary disabled:opacity-50"
            />
          </div>

          <div className="p-3 bg-muted/50 rounded-lg">
            <div className="font-medium text-sm mb-2">Language</div>
            <select
              name="preferences.language"
              value={formData.preferences.language}
              onChange={handleChange}
              disabled={!isEditing}
              className="w-full p-2 bg-background border border-border rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary disabled:opacity-50"
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
            </select>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex space-x-3 pt-4 border-t border-border">
        <button
          onClick={handleLogout}
          className="flex-1 bg-destructive text-destructive-foreground py-2 rounded-lg hover:bg-destructive/90 transition-colors"
        >
          Logout
        </button>
        <button
          onClick={onClose}
          className="flex-1 bg-muted text-muted-foreground py-2 rounded-lg hover:bg-muted/80 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
};
