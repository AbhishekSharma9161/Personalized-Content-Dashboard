import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Plus, Trash2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Slider } from '../ui/slider';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { 
  setCategories, 
  addCategory, 
  removeCategory, 
  setLanguage, 
  toggleDarkMode, 
  setLayout, 
  setArticlesPerPage 
} from '../../store/slices/userPreferencesSlice';
import { toggleSettings } from '../../store/slices/uiSlice';

const availableCategories = [
  'technology', 'business', 'sports', 'entertainment', 
  'science', 'health', 'politics', 'world'
];

const languages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
];

export const PreferencesPanel: React.FC = () => {
  const dispatch = useAppDispatch();
  const { settingsOpen } = useAppSelector((state) => state.ui);
  const preferences = useAppSelector((state) => state.userPreferences);

  const handleCategoryToggle = (category: string) => {
    if (preferences.categories.includes(category)) {
      dispatch(removeCategory(category));
    } else {
      dispatch(addCategory(category));
    }
  };

  const handleArticlesPerPageChange = (value: number[]) => {
    dispatch(setArticlesPerPage(value[0]));
  };

  if (!settingsOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={() => dispatch(toggleSettings())}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Preferences</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => dispatch(toggleSettings())}
              >
                <X className="w-4 h-4" />
              </Button>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Categories */}
              <div>
                <Label className="text-base font-medium">Content Categories</Label>
                <p className="text-sm text-muted-foreground mb-3">
                  Choose the topics you're interested in
                </p>
                <div className="flex flex-wrap gap-2">
                  {availableCategories.map((category) => (
                    <Badge
                      key={category}
                      variant={preferences.categories.includes(category) ? "default" : "outline"}
                      className="cursor-pointer hover:scale-105 transition-transform capitalize"
                      onClick={() => handleCategoryToggle(category)}
                    >
                      {category}
                      {preferences.categories.includes(category) && (
                        <Check className="w-3 h-3 ml-1" />
                      )}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Language */}
              <div>
                <Label className="text-base font-medium">Language</Label>
                <p className="text-sm text-muted-foreground mb-3">
                  Select your preferred language for content
                </p>
                <Select
                  value={preferences.language}
                  onValueChange={(value) => dispatch(setLanguage(value))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((lang) => (
                      <SelectItem key={lang.code} value={lang.code}>
                        {lang.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Dark Mode */}
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">Dark Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Switch between light and dark themes
                  </p>
                </div>
                <Switch
                  checked={preferences.darkMode}
                  onCheckedChange={() => dispatch(toggleDarkMode())}
                />
              </div>

              {/* Layout */}
              <div>
                <Label className="text-base font-medium">Content Layout</Label>
                <p className="text-sm text-muted-foreground mb-3">
                  Choose how content is displayed
                </p>
                <div className="flex space-x-2">
                  <Button
                    variant={preferences.layout === 'grid' ? 'default' : 'outline'}
                    onClick={() => dispatch(setLayout('grid'))}
                    className="flex-1"
                  >
                    Grid View
                  </Button>
                  <Button
                    variant={preferences.layout === 'list' ? 'default' : 'outline'}
                    onClick={() => dispatch(setLayout('list'))}
                    className="flex-1"
                  >
                    List View
                  </Button>
                </div>
              </div>

              {/* Articles Per Page */}
              <div>
                <Label className="text-base font-medium">
                  Articles Per Page: {preferences.articlesPerPage}
                </Label>
                <p className="text-sm text-muted-foreground mb-3">
                  Number of articles to load at once
                </p>
                <Slider
                  value={[preferences.articlesPerPage]}
                  onValueChange={handleArticlesPerPageChange}
                  min={6}
                  max={24}
                  step={6}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>6</span>
                  <span>24</span>
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-end space-x-2 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => dispatch(toggleSettings())}
                >
                  Cancel
                </Button>
                <Button onClick={() => dispatch(toggleSettings())}>
                  <Check className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
