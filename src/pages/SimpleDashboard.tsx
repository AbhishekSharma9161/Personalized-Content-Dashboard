import React, { useState, useEffect, useMemo } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, AlertCircle, RefreshCw } from "lucide-react";

interface ContentItem {
  id: string;
  type: "news" | "movie" | "social";
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  isFavorite: boolean;
  rating?: number;
  timestamp: Date;
}

interface SimpleDashboardProps {
  activeSection: "feed" | "trending" | "favorites";
  searchQuery: string;
  preferences: string[];
}

export const SimpleDashboard: React.FC<SimpleDashboardProps> = ({
  activeSection,
  searchQuery,
  preferences,
}) => {
  const [allContent, setAllContent] = useState<ContentItem[]>([]);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [displayCount, setDisplayCount] = useState(6);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);

  // Initialize content with loading simulation
  useEffect(() => {
    const loadInitialContent = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Simulate API loading delay
        await new Promise((resolve) => setTimeout(resolve, 1500));

        const initialContent: ContentItem[] = [
          {
            id: "1",
            type: "news",
            title: "Breaking: Tech Innovation Continues to Grow",
            description:
              "Latest developments in technology show promising trends for the future.",
            imageUrl: "https://picsum.photos/400/300?random=1",
            category: "technology",
            isFavorite: false,
            rating: 8.5,
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          },
          {
            id: "2",
            type: "movie",
            title: "Popular Movie of the Week",
            description:
              "A thrilling adventure that has captured audiences worldwide.",
            imageUrl: "https://picsum.photos/400/300?random=2",
            category: "entertainment",
            isFavorite: false,
            rating: 9.2,
            timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
          },
          {
            id: "3",
            type: "social",
            title: "Trending Social Media Post",
            description:
              "An engaging post that has gone viral across multiple platforms.",
            imageUrl: "https://picsum.photos/400/300?random=3",
            category: "social",
            isFavorite: false,
            rating: 7.8,
            timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
          },
          {
            id: "4",
            type: "news",
            title: "Business Update: Market Analysis",
            description:
              "Current market trends and business insights for investors.",
            imageUrl: "https://picsum.photos/400/300?random=4",
            category: "business",
            isFavorite: false,
            rating: 7.5,
            timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
          },
          {
            id: "5",
            type: "news",
            title: "Sports Highlights of the Day",
            description:
              "Major sports events and highlights from around the world.",
            imageUrl: "https://picsum.photos/400/300?random=5",
            category: "sports",
            isFavorite: false,
            rating: 8.0,
            timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
          },
          {
            id: "6",
            type: "movie",
            title: "New Movie Releases This Month",
            description:
              "Must-watch movies that are hitting theaters this month.",
            imageUrl: "https://picsum.photos/400/300?random=6",
            category: "entertainment",
            isFavorite: false,
            rating: 8.7,
            timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
          },
        ];

        setAllContent(initialContent);
      } catch (err) {
        setError("Failed to load content. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialContent();

    // Load favorites from localStorage
    const savedFavorites = localStorage.getItem("favorites");
    if (savedFavorites) {
      setFavorites(new Set(JSON.parse(savedFavorites)));
    }
  }, []);

  // Filter content based on active section and search query
  const filteredContent = useMemo(() => {
    let content: ContentItem[] = [];

    switch (activeSection) {
      case "feed":
        content = allContent
          .filter(
            (item) =>
              preferences.length === 0 || preferences.includes(item.category),
          )
          .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
        break;
      case "trending":
        content = allContent
          .slice()
          .sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "favorites":
        content = allContent.filter((item) => favorites.has(item.id));
        break;
    }

    if (searchQuery.trim()) {
      content = content.filter(
        (item) =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.category.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    return content.slice(0, displayCount);
  }, [
    allContent,
    activeSection,
    searchQuery,
    displayCount,
    favorites,
    preferences,
  ]);

  const handleDragStart = (start: any) => {
    setDraggedItem(start.draggableId);
  };

  const handleDragEnd = (result: DropResult) => {
    setDraggedItem(null);

    if (!result.destination) {
      return;
    }

    const items = Array.from(allContent);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setAllContent(items);
  };

  const toggleFavorite = (itemId: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(itemId)) {
      newFavorites.delete(itemId);
    } else {
      newFavorites.add(itemId);
    }

    setFavorites(newFavorites);
    localStorage.setItem("favorites", JSON.stringify(Array.from(newFavorites)));

    setAllContent((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? { ...item, isFavorite: newFavorites.has(itemId) }
          : item,
      ),
    );
  };

  const loadMoreContent = async () => {
    setIsLoadingMore(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const newContent: ContentItem[] = Array.from({ length: 3 }, (_, i) => {
        const id = `new-${Date.now()}-${i}`;
        const types: ("news" | "movie" | "social")[] = [
          "news",
          "movie",
          "social",
        ];
        const categories = [
          "technology",
          "entertainment",
          "business",
          "sports",
          "social",
        ];
        const type = types[Math.floor(Math.random() * types.length)];
        const category =
          categories[Math.floor(Math.random() * categories.length)];

        return {
          id,
          type,
          title: `New ${type} content ${displayCount + i + 1}`,
          description: `This is newly loaded ${type} content about ${category}. It provides interesting insights and updates.`,
          imageUrl: `https://picsum.photos/400/300?random=${Date.now() + i}`,
          category,
          isFavorite: false,
          rating: Math.round((Math.random() * 4 + 6) * 10) / 10,
          timestamp: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000),
        };
      });

      setAllContent((prev) => [...prev, ...newContent]);
      setDisplayCount((prev) => prev + 3);
    } catch (err) {
      setError("Failed to load more content");
    } finally {
      setIsLoadingMore(false);
    }
  };

  const retryLoad = () => {
    setError(null);
    setIsLoading(true);
    // Trigger reload
    window.location.reload();
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "news":
        return "📰";
      case "movie":
        return "🎬";
      case "social":
        return "💬";
      default:
        return "📄";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "technology":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "entertainment":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      case "business":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "sports":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
      case "social":
        return "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const getTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - timestamp.getTime()) / (1000 * 60 * 60),
    );

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const getSectionTitle = () => {
    switch (activeSection) {
      case "trending":
        return "Trending Content";
      case "favorites":
        return "Your Favorites";
      default:
        return "Your Personalized Feed";
    }
  };

  const getSectionDescription = () => {
    switch (activeSection) {
      case "trending":
        return "Most popular content with highest ratings";
      case "favorites":
        return "Content you've saved for later";
      default:
        return "Curated content based on your preferences";
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-primary" />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-muted-foreground"
          >
            Loading your personalized content...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-16"
      >
        <AlertCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-foreground mb-2">
          Something went wrong
        </h3>
        <p className="text-muted-foreground mb-6">{error}</p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={retryLoad}
          className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center space-x-2 mx-auto"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Try Again</span>
        </motion.button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
      data-testid="dashboard-content"
    >
      {/* Header with animation */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-foreground mb-2">
          {getSectionTitle()}
        </h1>
        <p className="text-muted-foreground">{getSectionDescription()}</p>
        {searchQuery && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="text-sm text-muted-foreground mt-2"
          >
            Showing results for "{searchQuery}" ({filteredContent.length} items)
          </motion.p>
        )}
      </motion.div>

      {/* Content Grid with Drag and Drop */}
      {filteredContent.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center py-16"
        >
          <div className="text-6xl mb-4">
            {activeSection === "favorites" ? "❤️" : "🔍"}
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">
            {activeSection === "favorites"
              ? "No favorites yet"
              : "No content found"}
          </h3>
          <p className="text-muted-foreground">
            {activeSection === "favorites"
              ? "Start adding items to your favorites to see them here"
              : searchQuery
                ? "Try adjusting your search terms"
                : "Check back later for new content"}
          </p>
        </motion.div>
      ) : (
        <DragDropContext
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <Droppable droppableId="content-grid">
            {(provided, snapshot) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-colors duration-200 ${
                  snapshot.isDraggingOver ? "bg-primary/5 rounded-lg p-4" : ""
                }`}
              >
                <AnimatePresence>
                  {filteredContent.map((item, index) => (
                    <Draggable
                      key={item.id}
                      draggableId={item.id}
                      index={index}
                      isDragDisabled={activeSection !== "feed"} // Only allow drag in feed
                    >
                      {(provided, snapshot) => (
                        <motion.div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          layout
                          initial={{ opacity: 0, scale: 0.8, y: 20 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.8, y: -20 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          whileHover={{
                            y: -8,
                            scale: 1.02,
                            transition: { duration: 0.2 },
                          }}
                          className={`bg-card rounded-lg border border-border overflow-hidden cursor-pointer group ${
                            snapshot.isDragging
                              ? "shadow-2xl rotate-3 scale-105 z-50"
                              : "shadow-lg hover:shadow-xl"
                          } transition-all duration-300`}
                          data-testid="content-card"
                          style={{
                            ...provided.draggableProps.style,
                          }}
                        >
                          {/* Drag indicator */}
                          {activeSection === "feed" && (
                            <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                              <div className="w-6 h-6 bg-black/20 rounded-full flex items-center justify-center">
                                <div className="w-3 h-3 grid grid-cols-2 gap-0.5">
                                  {[...Array(4)].map((_, i) => (
                                    <div
                                      key={i}
                                      className="w-1 h-1 bg-white rounded-full"
                                    />
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Image */}
                          <div className="relative h-48 overflow-hidden">
                            <motion.img
                              src={item.imageUrl}
                              alt={item.title}
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                              loading="lazy"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent group-hover:from-black/40 transition-all duration-300" />

                            <div className="absolute top-3 left-3">
                              <motion.span
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                                className={`px-2 py-1 rounded text-xs font-medium ${getCategoryColor(item.category)}`}
                              >
                                {getTypeIcon(item.type)} {item.type}
                              </motion.span>
                            </div>

                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleFavorite(item.id);
                              }}
                              className="absolute top-3 right-3 p-2 bg-black/20 rounded-full hover:bg-black/60 transition-all duration-200"
                              data-testid="favorite-button"
                            >
                              <motion.span
                                animate={{
                                  scale: favorites.has(item.id)
                                    ? [1, 1.2, 1]
                                    : 1,
                                }}
                                transition={{ duration: 0.3 }}
                                className="text-white text-lg"
                              >
                                {favorites.has(item.id) ? "❤️" : "🤍"}
                              </motion.span>
                            </motion.button>

                            {item.rating && (
                              <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="absolute bottom-3 right-3"
                              >
                                <span className="px-2 py-1 bg-black/60 text-white rounded text-xs font-medium">
                                  ⭐ {item.rating}
                                </span>
                              </motion.div>
                            )}
                          </div>

                          {/* Content */}
                          <div className="p-4">
                            <motion.h3
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.1 }}
                              className="font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors"
                            >
                              {item.title}
                            </motion.h3>
                            <motion.p
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.2 }}
                              className="text-sm text-muted-foreground line-clamp-3 mb-4"
                            >
                              {item.description}
                            </motion.p>
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.3 }}
                              className="flex items-center justify-between"
                            >
                              <span
                                className={`px-2 py-1 rounded text-xs font-medium ${getCategoryColor(item.category)}`}
                              >
                                {item.category}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {getTimeAgo(item.timestamp)}
                              </span>
                            </motion.div>
                          </div>
                        </motion.div>
                      )}
                    </Draggable>
                  ))}
                </AnimatePresence>
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}

      {/* Load More Button */}
      {activeSection === "feed" &&
        filteredContent.length > 0 &&
        !searchQuery && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-center pt-8"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={loadMoreContent}
              disabled={isLoadingMore}
              className="px-8 py-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 mx-auto"
            >
              {isLoadingMore ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Loading...</span>
                </>
              ) : (
                <span>Load More Content</span>
              )}
            </motion.button>
          </motion.div>
        )}

      {/* Drag instruction */}
      {activeSection === "feed" && filteredContent.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center text-sm text-muted-foreground"
        >
          💡 Drag and drop cards to reorder your feed
        </motion.div>
      )}
    </motion.div>
  );
};
