import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UserPreferences {
  categories: string[];
  language: string;
  darkMode: boolean;
  layout: 'grid' | 'list';
  articlesPerPage: number;
}

const initialState: UserPreferences = {
  categories: ['technology', 'business', 'sports'],
  language: 'en',
  darkMode: false,
  layout: 'grid',
  articlesPerPage: 12,
};

const userPreferencesSlice = createSlice({
  name: 'userPreferences',
  initialState,
  reducers: {
    setCategories: (state, action: PayloadAction<string[]>) => {
      state.categories = action.payload;
    },
    addCategory: (state, action: PayloadAction<string>) => {
      if (!state.categories.includes(action.payload)) {
        state.categories.push(action.payload);
      }
    },
    removeCategory: (state, action: PayloadAction<string>) => {
      state.categories = state.categories.filter(cat => cat !== action.payload);
    },
    setLanguage: (state, action: PayloadAction<string>) => {
      state.language = action.payload;
    },
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
    },
    setLayout: (state, action: PayloadAction<'grid' | 'list'>) => {
      state.layout = action.payload;
    },
    setArticlesPerPage: (state, action: PayloadAction<number>) => {
      state.articlesPerPage = action.payload;
    },
    loadPreferences: (state, action: PayloadAction<Partial<UserPreferences>>) => {
      return { ...state, ...action.payload };
    },
  },
});

export const {
  setCategories,
  addCategory,
  removeCategory,
  setLanguage,
  toggleDarkMode,
  setLayout,
  setArticlesPerPage,
  loadPreferences,
} = userPreferencesSlice.actions;

export default userPreferencesSlice.reducer;
