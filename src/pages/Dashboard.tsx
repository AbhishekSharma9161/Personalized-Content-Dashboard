import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Loader2, AlertCircle, Grid, List } from 'lucide-react';
import { ContentCard } from '../components/Content/ContentCard';
import { Button } from '../components/ui/button';
import { Alert, AlertDescription } from '../components/ui/alert';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { useGetNewsQuery, useGetMoviesQuery, useGetSocialPostsQuery } from '../store/api/contentApi';
import { setFeed, appendToFeed, reorderFeed, setTrending, setLoading, setError } from '../store/slices/contentSlice';
import { setActiveSection } from '../store/slices/uiSlice';

export const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { activeSection } = useAppSelector((state) => state.ui);
  const { categories, layout } = useAppSelector((state) => state.userPreferences);
  const { feed, favorites, trending, loading, error, hasMore, page } = useAppSelector((state) => state.content);
  const [loadingMore, setLoadingMore] = useState(false);

  // API queries
  const { 
    data: newsData, 
    isLoading: newsLoading, 
    error: newsError 
  } = useGetNewsQuery({ 
    categories, 
    page: 1, 
    pageSize: 6 
  });

  const { 
    data: moviesData, 
    isLoading: moviesLoading, 
    error: moviesError 
  } = useGetMoviesQuery({ 
    page: 1, 
    pageSize: 6 
  });

  const { 
    data: socialData, 
    isLoading: socialLoading, 
    error: socialError 
  } = useGetSocialPostsQuery({ 
    hashtags: categories, 
    page: 1, 
    pageSize: 6 
  });

  // Combine all content when data is loaded
  useEffect(() => {
    if (newsData || moviesData || socialData) {
      const combinedContent = [
        ...(newsData || []),
        ...(moviesData || []),
        ...(socialData || [])
      ].sort(() => Math.random() - 0.5); // Shuffle for variety

      dispatch(setFeed(combinedContent));
      
      // Set trending content (top rated/recent items)
      const trendingContent = combinedContent
        .filter(item => item.rating ? item.rating > 7 : true)
        .slice(0, 8);
      dispatch(setTrending(trendingContent));
    }
  }, [newsData, moviesData, socialData, dispatch]);

  // Handle loading states
  useEffect(() => {
    const isLoading = newsLoading || moviesLoading || socialLoading;
    dispatch(setLoading(isLoading));
  }, [newsLoading, moviesLoading, socialLoading, dispatch]);

  // Handle errors
  useEffect(() => {
    const errors = [newsError, moviesError, socialError].filter(Boolean);
    if (errors.length > 0) {
      dispatch(setError('Failed to load some content. Please try again.'));
    } else {
      dispatch(setError(null));
    }
  }, [newsError, moviesError, socialError, dispatch]);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    dispatch(reorderFeed({
      sourceIndex: result.source.index,
      destinationIndex: result.destination.index,
    }));
  };

  const loadMoreContent = async () => {
    if (loadingMore || !hasMore) return;
    
    setLoadingMore(true);
    // Simulate loading more content
    setTimeout(() => {
      const mockContent = Array.from({ length: 6 }, (_, i) => ({
        id: `mock-${Date.now()}-${i}`,
        type: 'news' as const,
        title: `Additional Content Item ${i + 1}`,
        description: 'This is additional content loaded through infinite scroll.',
        imageUrl: `https://picsum.photos/400/300?random=${Date.now() + i}`,
        category: categories[0] || 'general',
        publishedAt: new Date().toISOString(),
        isFavorite: false,
        author: 'Content Creator',
      }));
      
      dispatch(appendToFeed(mockContent));
      setLoadingMore(false);
    }, 1000);
  };

  const getCurrentContent = () => {
    switch (activeSection) {
      case 'trending':
        return trending;
      case 'favorites':
        return favorites;
      default:
        return feed;
    }
  };

  const getSectionTitle = () => {
    switch (activeSection) {
      case 'trending':
        return 'Trending Content';
      case 'favorites':
        return 'Your Favorites';
      default:
        return 'Your Personalized Feed';
    }
  };

  const getSectionDescription = () => {
    switch (activeSection) {
      case 'trending':
        return 'Discover what\'s popular across all categories';
      case 'favorites':
        return 'Content you\'ve saved for later';
      default:
        return 'Curated content based on your preferences';
    }
  };

  const currentContent = getCurrentContent();

  if (loading && feed.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading your personalized content...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {getSectionTitle()}
          </h1>
          <p className="text-muted-foreground">
            {getSectionDescription()}
          </p>
        </div>
        <div className="flex items-center space-x-2 mt-4 md:mt-0">
          <span className="text-sm text-muted-foreground">
            {currentContent.length} items
          </span>
        </div>
      </motion.div>

      {/* Error Alert */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content Grid/List */}
      {currentContent.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <div className="text-muted-foreground">
            <p className="text-lg mb-2">No content available</p>
            <p className="text-sm">
              {activeSection === 'favorites' 
                ? 'Start adding items to your favorites to see them here'
                : 'Try adjusting your preferences or check back later'
              }
            </p>
          </div>
        </motion.div>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="content-feed">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className={
                  layout === 'grid'
                    ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                    : 'space-y-4'
                }
              >
                <AnimatePresence>
                  {currentContent.map((item, index) => (
                    <Draggable key={item.id} draggableId={item.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <ContentCard
                            item={item}
                            layout={layout}
                            isDragging={snapshot.isDragging}
                          />
                        </div>
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
      {activeSection === 'feed' && hasMore && currentContent.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-center pt-8"
        >
          <Button
            onClick={loadMoreContent}
            disabled={loadingMore}
            variant="outline"
            size="lg"
          >
            {loadingMore ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Loading...
              </>
            ) : (
              'Load More Content'
            )}
          </Button>
        </motion.div>
      )}
    </div>
  );
};
