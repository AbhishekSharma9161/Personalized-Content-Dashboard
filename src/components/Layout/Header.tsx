import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Search, Settings, Menu, Moon, Sun, Bell, User } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { toggleSidebar, toggleSettings, setTheme } from '../../store/slices/uiSlice';
import { setSearchQuery, setSearchResults } from '../../store/slices/contentSlice';
import { useSearchContentQuery } from '../../store/api/contentApi';
import { debounce } from 'lodash';

export const Header: React.FC = () => {
  const dispatch = useAppDispatch();
  const { theme, notifications } = useAppSelector((state) => state.ui);
  const { searchQuery } = useAppSelector((state) => state.content);
  const [localSearchQuery, setLocalSearchQuery] = useState('');

  // Debounced search
  const debouncedSearch = useCallback(
    debounce((query: string) => {
      dispatch(setSearchQuery(query));
    }, 300),
    [dispatch]
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalSearchQuery(value);
    debouncedSearch(value);
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    dispatch(setTheme(newTheme));
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-card border-b border-border px-6 py-4"
    >
      <div className="flex items-center justify-between">
        {/* Left side - Menu and Search */}
        <div className="flex items-center space-x-4 flex-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => dispatch(toggleSidebar())}
            className="p-2"
          >
            <Menu className="w-5 h-5" />
          </Button>

          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search news, movies, posts..."
              value={localSearchQuery}
              onChange={handleSearchChange}
              className="pl-10 bg-background"
            />
          </div>
        </div>

        {/* Center - Brand */}
        <div className="hidden md:flex">
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
          >
            ContentHub
          </motion.h1>
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center space-x-2">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            className="p-2"
          >
            {theme === 'light' ? (
              <Moon className="w-5 h-5" />
            ) : (
              <Sun className="w-5 h-5" />
            )}
          </Button>

          {/* Notifications */}
          <Button variant="ghost" size="sm" className="p-2 relative">
            <Bell className="w-5 h-5" />
            {notifications.length > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs"
              >
                {notifications.length}
              </Badge>
            )}
          </Button>

          {/* Settings */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => dispatch(toggleSettings())}
            className="p-2"
          >
            <Settings className="w-5 h-5" />
          </Button>

          {/* User Avatar */}
          <Button variant="ghost" size="sm" className="p-2">
            <User className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </motion.header>
  );
};
