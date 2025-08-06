import React from 'react';
import { motion } from 'framer-motion';
import { Heart, ExternalLink, Play, BookOpen, Calendar, User, Star } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardFooter, CardHeader } from '../ui/card';
import { ContentItem } from '../../store/slices/contentSlice';
import { useAppDispatch } from '../../store/hooks';
import { toggleFavorite } from '../../store/slices/contentSlice';

interface ContentCardProps {
  item: ContentItem;
  layout?: 'grid' | 'list';
  isDragging?: boolean;
}

export const ContentCard: React.FC<ContentCardProps> = ({ 
  item, 
  layout = 'grid',
  isDragging = false 
}) => {
  const dispatch = useAppDispatch();

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(toggleFavorite(item.id));
  };

  const handleCardClick = () => {
    if (item.url) {
      window.open(item.url, '_blank');
    }
  };

  const getTypeIcon = () => {
    switch (item.type) {
      case 'news':
        return <BookOpen className="w-4 h-4" />;
      case 'movie':
        return <Play className="w-4 h-4" />;
      case 'social':
        return <User className="w-4 h-4" />;
      default:
        return <BookOpen className="w-4 h-4" />;
    }
  };

  const getTypeColor = () => {
    switch (item.type) {
      case 'news':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'movie':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'social':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (layout === 'list') {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -2 }}
        transition={{ duration: 0.2 }}
        className={`${isDragging ? 'opacity-50' : ''}`}
      >
        <Card 
          className="cursor-pointer hover:shadow-md transition-shadow duration-200 overflow-hidden"
          onClick={handleCardClick}
        >
          <div className="flex">
            {/* Image */}
            <div className="flex-shrink-0 w-32 h-24 relative overflow-hidden">
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = `https://picsum.photos/200/150?random=${item.id}`;
                }}
              />
              <div className="absolute top-2 left-2">
                <Badge className={`${getTypeColor()} text-xs px-2 py-1`}>
                  <span className="flex items-center space-x-1">
                    {getTypeIcon()}
                    <span className="capitalize">{item.type}</span>
                  </span>
                </Badge>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-foreground line-clamp-2 flex-1 pr-2">
                  {item.title}
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleToggleFavorite}
                  className="p-1 flex-shrink-0"
                >
                  <Heart
                    className={`w-4 h-4 ${
                      item.isFavorite
                        ? 'fill-red-500 text-red-500'
                        : 'text-muted-foreground hover:text-red-500'
                    }`}
                  />
                </Button>
              </div>

              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                {item.description}
              </p>

              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center space-x-4">
                  {item.author && (
                    <span className="flex items-center space-x-1">
                      <User className="w-3 h-3" />
                      <span>{item.author}</span>
                    </span>
                  )}
                  <span className="flex items-center space-x-1">
                    <Calendar className="w-3 h-3" />
                    <span>{formatDate(item.publishedAt)}</span>
                  </span>
                  {item.rating && (
                    <span className="flex items-center space-x-1">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span>{item.rating}</span>
                    </span>
                  )}
                </div>
                {item.url && (
                  <ExternalLink className="w-3 h-3" />
                )}
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className={`${isDragging ? 'opacity-50' : ''}`}
    >
      <Card 
        className="cursor-pointer hover:shadow-lg transition-all duration-200 overflow-hidden group"
        onClick={handleCardClick}
      >
        <CardHeader className="p-0 relative">
          <div className="relative h-48 overflow-hidden">
            <img
              src={item.imageUrl}
              alt={item.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                e.currentTarget.src = `https://picsum.photos/400/300?random=${item.id}`;
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            
            {/* Type Badge */}
            <div className="absolute top-3 left-3">
              <Badge className={`${getTypeColor()} text-xs`}>
                <span className="flex items-center space-x-1">
                  {getTypeIcon()}
                  <span className="capitalize">{item.type}</span>
                </span>
              </Badge>
            </div>

            {/* Favorite Button */}
            <div className="absolute top-3 right-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleToggleFavorite}
                className="p-2 bg-black/20 backdrop-blur-sm hover:bg-black/40 text-white"
              >
                <Heart
                  className={`w-4 h-4 ${
                    item.isFavorite
                      ? 'fill-red-500 text-red-500'
                      : 'text-white hover:text-red-400'
                  }`}
                />
              </Button>
            </div>

            {/* Rating for movies */}
            {item.rating && (
              <div className="absolute bottom-3 right-3">
                <Badge variant="secondary" className="bg-black/40 text-white backdrop-blur-sm">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400 mr-1" />
                  {item.rating}
                </Badge>
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-4">
          <h3 className="font-semibold text-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors">
            {item.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-3">
            {item.description}
          </p>
        </CardContent>

        <CardFooter className="px-4 pb-4 pt-0">
          <div className="flex items-center justify-between w-full text-xs text-muted-foreground">
            <div className="flex items-center space-x-2">
              {item.author && (
                <span className="flex items-center space-x-1">
                  <User className="w-3 h-3" />
                  <span className="truncate max-w-24">{item.author}</span>
                </span>
              )}
              <span className="flex items-center space-x-1">
                <Calendar className="w-3 h-3" />
                <span>{formatDate(item.publishedAt)}</span>
              </span>
            </div>
            {item.url && (
              <ExternalLink className="w-3 h-3 opacity-60 group-hover:opacity-100 transition-opacity" />
            )}
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};
