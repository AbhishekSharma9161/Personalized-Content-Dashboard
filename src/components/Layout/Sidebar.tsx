import React from 'react';
import { motion } from 'framer-motion';
import { Home, TrendingUp, Heart, Settings, Grid, List, Filter } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setActiveSection } from '../../store/slices/uiSlice';
import { setLayout } from '../../store/slices/userPreferencesSlice';

const navigationItems = [
  { id: 'feed', label: 'Feed', icon: Home, description: 'Your personalized content' },
  { id: 'trending', label: 'Trending', icon: TrendingUp, description: 'What\'s popular now' },
  { id: 'favorites', label: 'Favorites', icon: Heart, description: 'Your saved content' },
];

const categories = [
  { id: 'technology', label: 'Technology', color: 'bg-blue-500' },
  { id: 'business', label: 'Business', color: 'bg-green-500' },
  { id: 'sports', label: 'Sports', color: 'bg-orange-500' },
  { id: 'entertainment', label: 'Entertainment', color: 'bg-purple-500' },
  { id: 'science', label: 'Science', color: 'bg-teal-500' },
  { id: 'health', label: 'Health', color: 'bg-pink-500' },
];

export const Sidebar: React.FC = () => {
  const dispatch = useAppDispatch();
  const { activeSection } = useAppSelector((state) => state.ui);
  const { categories: userCategories, layout } = useAppSelector((state) => state.userPreferences);
  const { favorites } = useAppSelector((state) => state.content);

  const handleSectionChange = (section: typeof activeSection) => {
    dispatch(setActiveSection(section));
  };

  const handleLayoutToggle = () => {
    dispatch(setLayout(layout === 'grid' ? 'list' : 'grid'));
  };

  return (
    <motion.div
      initial={{ x: -280 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="w-full h-full bg-card border-r border-border flex flex-col"
    >
      <div className="p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center space-x-3 mb-8"
        >
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">C</span>
          </div>
          <div>
            <h2 className="font-semibold text-foreground">ContentHub</h2>
            <p className="text-xs text-muted-foreground">Your personal dashboard</p>
          </div>
        </motion.div>

        {/* Navigation */}
        <nav className="space-y-2 mb-6">
          {navigationItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
            >
              <Button
                variant={activeSection === item.id ? 'default' : 'ghost'}
                className="w-full justify-start h-auto p-3"
                onClick={() => handleSectionChange(item.id as typeof activeSection)}
              >
                <item.icon className="w-5 h-5 mr-3" />
                <div className="flex-1 text-left">
                  <div className="font-medium">{item.label}</div>
                  <div className="text-xs text-muted-foreground">{item.description}</div>
                </div>
                {item.id === 'favorites' && favorites.length > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {favorites.length}
                  </Badge>
                )}
              </Button>
            </motion.div>
          ))}
        </nav>

        <Separator className="my-4" />

        {/* Layout Toggle */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">View</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLayoutToggle}
              className="p-2"
            >
              {layout === 'grid' ? <List className="w-4 h-4" /> : <Grid className="w-4 h-4" />}
            </Button>
          </div>
        </motion.div>

        <Separator className="my-4" />

        {/* Categories */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center space-x-2 mb-3">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">Categories</span>
          </div>
          <div className="space-y-1">
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.03 }}
                className="flex items-center space-x-3 py-1"
              >
                <div className={`w-2 h-2 rounded-full ${category.color}`} />
                <span className="text-sm text-muted-foreground flex-1">{category.label}</span>
                {userCategories.includes(category.id) && (
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom Actions */}
      <div className="mt-auto p-6 border-t border-border">
        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={() => dispatch(setActiveSection('feed'))}
        >
          <Settings className="w-4 h-4 mr-3" />
          Preferences
        </Button>
      </div>
    </motion.div>
  );
};
