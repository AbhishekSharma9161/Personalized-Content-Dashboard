import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ContentItem {
  id: string;
  type: 'news' | 'movie' | 'social';
  title: string;
  description: string;
  imageUrl: string;
  url?: string;
  category: string;
  publishedAt: string;
  isFavorite: boolean;
  author?: string;
  rating?: number;
}

interface ContentState {
  feed: ContentItem[];
  favorites: ContentItem[];
  trending: ContentItem[];
  searchResults: ContentItem[];
  loading: boolean;
  error: string | null;
  searchQuery: string;
  hasMore: boolean;
  page: number;
}

const initialState: ContentState = {
  feed: [],
  favorites: [],
  trending: [],
  searchResults: [],
  loading: false,
  error: null,
  searchQuery: '',
  hasMore: true,
  page: 1,
};

const contentSlice = createSlice({
  name: 'content',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setFeed: (state, action: PayloadAction<ContentItem[]>) => {
      state.feed = action.payload;
    },
    appendToFeed: (state, action: PayloadAction<ContentItem[]>) => {
      state.feed = [...state.feed, ...action.payload];
    },
    setTrending: (state, action: PayloadAction<ContentItem[]>) => {
      state.trending = action.payload;
    },
    setSearchResults: (state, action: PayloadAction<ContentItem[]>) => {
      state.searchResults = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    toggleFavorite: (state, action: PayloadAction<string>) => {
      const itemId = action.payload;
      
      // Update in feed
      const feedItem = state.feed.find(item => item.id === itemId);
      if (feedItem) {
        feedItem.isFavorite = !feedItem.isFavorite;
        if (feedItem.isFavorite) {
          state.favorites.push(feedItem);
        } else {
          state.favorites = state.favorites.filter(item => item.id !== itemId);
        }
      }
      
      // Update in trending
      const trendingItem = state.trending.find(item => item.id === itemId);
      if (trendingItem) {
        trendingItem.isFavorite = !trendingItem.isFavorite;
      }
      
      // Update in search results
      const searchItem = state.searchResults.find(item => item.id === itemId);
      if (searchItem) {
        searchItem.isFavorite = !searchItem.isFavorite;
      }
    },
    reorderFeed: (state, action: PayloadAction<{ sourceIndex: number; destinationIndex: number }>) => {
      const { sourceIndex, destinationIndex } = action.payload;
      const [removed] = state.feed.splice(sourceIndex, 1);
      state.feed.splice(destinationIndex, 0, removed);
    },
    setHasMore: (state, action: PayloadAction<boolean>) => {
      state.hasMore = action.payload;
    },
    incrementPage: (state) => {
      state.page += 1;
    },
    resetPage: (state) => {
      state.page = 1;
    },
  },
});

export const {
  setLoading,
  setError,
  setFeed,
  appendToFeed,
  setTrending,
  setSearchResults,
  setSearchQuery,
  toggleFavorite,
  reorderFeed,
  setHasMore,
  incrementPage,
  resetPage,
} = contentSlice.actions;

export default contentSlice.reducer;
