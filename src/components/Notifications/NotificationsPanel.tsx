import React, { useState, useEffect } from "react";
import { X, Check, Clock, Star, Heart, TrendingUp, Bell } from "lucide-react";

interface Notification {
  id: string;
  type: "info" | "success" | "trending" | "favorite";
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  actionUrl?: string;
}

interface NotificationsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationsPanel: React.FC<NotificationsPanelProps> = ({
  isOpen,
  onClose,
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  useEffect(() => {
    // Load mock notifications
    const mockNotifications: Notification[] = [
      {
        id: "1",
        type: "trending",
        title: "Trending Alert",
        message: "New tech breakthrough is trending in your feed",
        timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 min ago
        isRead: false,
      },
      {
        id: "2",
        type: "success",
        title: "Preferences Updated",
        message: "Your feed preferences have been successfully saved",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        isRead: false,
      },
      {
        id: "3",
        type: "info",
        title: "New Content Available",
        message: "12 new articles matching your interests are now available",
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
        isRead: true,
      },
      {
        id: "4",
        type: "favorite",
        title: "Favorite Content",
        message: "Content similar to your favorites is now available",
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
        isRead: true,
      },
      {
        id: "5",
        type: "trending",
        title: "Popular Movie",
        message: "A new blockbuster movie is trending in entertainment",
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
        isRead: true,
      },
    ];

    setNotifications(mockNotifications);
  }, []);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "trending":
        return <TrendingUp className="w-5 h-5 text-orange-500" />;
      case "success":
        return <Check className="w-5 h-5 text-green-500" />;
      case "favorite":
        return <Heart className="w-5 h-5 text-red-500" />;
      case "info":
      default:
        return <Star className="w-5 h-5 text-blue-500" />;
    }
  };

  const getTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - timestamp.getTime()) / (1000 * 60),
    );

    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === id ? { ...notif, isRead: true } : notif,
      ),
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notif) => ({ ...notif, isRead: true })),
    );
  };

  const clearNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  };

  const filteredNotifications = notifications.filter(
    (notif) => filter === "all" || !notif.isRead,
  );

  const unreadCount = notifications.filter((notif) => !notif.isRead).length;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center pt-16 p-4">
      <div className="bg-card rounded-xl shadow-2xl w-full max-w-md max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center space-x-3">
            <Bell className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">
              Notifications
            </h3>
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-muted rounded transition-colors"
            data-testid="close-notifications"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex border-b border-border">
          <button
            onClick={() => setFilter("all")}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
              filter === "all"
                ? "text-primary border-b-2 border-primary bg-primary/5"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            All ({notifications.length})
          </button>
          <button
            onClick={() => setFilter("unread")}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
              filter === "unread"
                ? "text-primary border-b-2 border-primary bg-primary/5"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Unread ({unreadCount})
          </button>
        </div>

        {/* Actions */}
        {unreadCount > 0 && (
          <div className="p-3 border-b border-border">
            <button
              onClick={markAllAsRead}
              className="text-sm text-primary hover:text-primary/80 transition-colors"
            >
              Mark all as read
            </button>
          </div>
        )}

        {/* Notifications List */}
        <div className="overflow-y-auto max-h-96">
          {filteredNotifications.length === 0 ? (
            <div className="p-8 text-center">
              <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
              <p className="text-muted-foreground">
                {filter === "unread"
                  ? "No unread notifications"
                  : "No notifications yet"}
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-muted/50 transition-colors border-l-4 ${
                    notification.isRead
                      ? "border-l-transparent"
                      : "border-l-primary bg-primary/5"
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-foreground truncate">
                          {notification.title}
                        </h4>
                        <button
                          onClick={() => clearNotification(notification.id)}
                          className="p-1 hover:bg-muted rounded opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {notification.message}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-muted-foreground flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {getTimeAgo(notification.timestamp)}
                        </span>
                        {!notification.isRead && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="text-xs text-primary hover:text-primary/80 transition-colors"
                          >
                            Mark as read
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-border bg-muted/20">
          <div className="text-xs text-muted-foreground text-center">
            Notifications are updated in real-time
          </div>
        </div>
      </div>
    </div>
  );
};
