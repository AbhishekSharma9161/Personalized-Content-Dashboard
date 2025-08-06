import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { ContentItem } from '../slices/contentSlice';

export interface NewsApiResponse {
  status: string;
  totalResults: number;
  articles: Array<{
    source: { id: string; name: string };
    author: string;
    title: string;
    description: string;
    url: string;
    urlToImage: string;
    publishedAt: string;
    content: string;
  }>;
}

export interface TMDBResponse {
  page: number;
  results: Array<{
    id: number;
    title: string;
    overview: string;
    poster_path: string;
    backdrop_path: string;
    release_date: string;
    vote_average: number;
    genre_ids: number[];
  }>;
  total_pages: number;
  total_results: number;
}

// Mock social media data generator
const generateMockSocialPosts = (count: number = 10): ContentItem[] => {
  const topics = ['technology', 'sports', 'entertainment', 'business', 'science'];
  const authors = ['@techguru', '@sportsworld', '@newstoday', '@businessinsider', '@sciencedaily'];
  
  return Array.from({ length: count }, (_, i) => ({
    id: `social-${i}-${Date.now()}`,
    type: 'social' as const,
    title: `Trending post about ${topics[i % topics.length]}`,
    description: `This is an engaging social media post about ${topics[i % topics.length]} that has been getting a lot of attention. #${topics[i % topics.length]} #trending`,
    imageUrl: `https://picsum.photos/400/300?random=${i + Date.now()}`,
    category: topics[i % topics.length],
    publishedAt: new Date(Date.now() - Math.random() * 86400000 * 7).toISOString(),
    isFavorite: false,
    author: authors[i % authors.length],
    url: `https://example.com/post/${i}`,
  }));
};

export const contentApi = createApi({
  reducerPath: 'contentApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/',
  }),
  tagTypes: ['News', 'Movies', 'Social'],
  endpoints: (builder) => ({
    getNews: builder.query<ContentItem[], { categories: string[]; page: number; pageSize: number }>({
      queryFn: async ({ categories, page, pageSize }) => {
        try {
          // Using NewsAPI - you'll need to add your API key
          const apiKey = 'demo'; // Replace with actual API key
          const category = categories[0] || 'general';
          
          const response = await fetch(
            `https://newsapi.org/v2/top-headlines?category=${category}&page=${page}&pageSize=${pageSize}&apiKey=${apiKey}`
          );
          
          if (!response.ok) {
            throw new Error('Failed to fetch news');
          }
          
          const data: NewsApiResponse = await response.json();
          
          const articles: ContentItem[] = data.articles.map((article, index) => ({
            id: `news-${page}-${index}`,
            type: 'news',
            title: article.title,
            description: article.description || '',
            imageUrl: article.urlToImage || `https://picsum.photos/400/300?random=${index}`,
            url: article.url,
            category: category,
            publishedAt: article.publishedAt,
            isFavorite: false,
            author: article.author,
          }));
          
          return { data: articles };
        } catch (error) {
          // Fallback to mock data if API fails
          const mockNews: ContentItem[] = Array.from({ length: pageSize }, (_, i) => ({
            id: `news-${page}-${i}`,
            type: 'news',
            title: `Breaking News Story ${(page - 1) * pageSize + i + 1}`,
            description: `This is a comprehensive news article about ${categories[0] || 'general'} developments that you should know about.`,
            imageUrl: `https://picsum.photos/400/300?random=${(page - 1) * pageSize + i}`,
            category: categories[0] || 'general',
            publishedAt: new Date(Date.now() - Math.random() * 86400000 * 3).toISOString(),
            isFavorite: false,
            author: 'News Reporter',
            url: `https://example.com/news/${i}`,
          }));
          
          return { data: mockNews };
        }
      },
      providesTags: ['News'],
    }),

    getMovies: builder.query<ContentItem[], { page: number; pageSize: number }>({
      queryFn: async ({ page, pageSize }) => {
        try {
          // Using TMDB API - you'll need to add your API key
          const apiKey = 'demo'; // Replace with actual API key
          
          const response = await fetch(
            `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&page=${page}`
          );
          
          if (!response.ok) {
            throw new Error('Failed to fetch movies');
          }
          
          const data: TMDBResponse = await response.json();
          
          const movies: ContentItem[] = data.results.slice(0, pageSize).map((movie) => ({
            id: `movie-${movie.id}`,
            type: 'movie',
            title: movie.title,
            description: movie.overview,
            imageUrl: movie.poster_path 
              ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
              : `https://picsum.photos/400/600?random=${movie.id}`,
            category: 'entertainment',
            publishedAt: movie.release_date,
            isFavorite: false,
            rating: movie.vote_average,
          }));
          
          return { data: movies };
        } catch (error) {
          // Fallback to mock data if API fails
          const mockMovies: ContentItem[] = Array.from({ length: pageSize }, (_, i) => ({
            id: `movie-${page}-${i}`,
            type: 'movie',
            title: `Popular Movie ${(page - 1) * pageSize + i + 1}`,
            description: `An exciting movie that has been trending and getting great reviews from audiences worldwide.`,
            imageUrl: `https://picsum.photos/400/600?random=${(page - 1) * pageSize + i + 100}`,
            category: 'entertainment',
            publishedAt: new Date(Date.now() - Math.random() * 86400000 * 30).toISOString(),
            isFavorite: false,
            rating: Math.round((Math.random() * 4 + 6) * 10) / 10,
          }));
          
          return { data: mockMovies };
        }
      },
      providesTags: ['Movies'],
    }),

    getSocialPosts: builder.query<ContentItem[], { hashtags: string[]; page: number; pageSize: number }>({
      queryFn: async ({ hashtags, page, pageSize }) => {
        // Mock social media data since we can't access real APIs easily
        const posts = generateMockSocialPosts(pageSize);
        return { data: posts };
      },
      providesTags: ['Social'],
    }),

    searchContent: builder.query<ContentItem[], { query: string; type?: 'all' | 'news' | 'movie' | 'social' }>({
      queryFn: async ({ query, type = 'all' }) => {
        // Mock search functionality
        const mockResults: ContentItem[] = Array.from({ length: 8 }, (_, i) => ({
          id: `search-${i}-${Date.now()}`,
          type: type === 'all' ? (['news', 'movie', 'social'][i % 3] as 'news' | 'movie' | 'social') : type,
          title: `Search result for "${query}" - Item ${i + 1}`,
          description: `This content matches your search query "${query}" and provides relevant information.`,
          imageUrl: `https://picsum.photos/400/300?random=${i + 200}`,
          category: 'search',
          publishedAt: new Date(Date.now() - Math.random() * 86400000).toISOString(),
          isFavorite: false,
          url: `https://example.com/search/${i}`,
        }));
        
        return { data: mockResults };
      },
    }),
  }),
});

export const {
  useGetNewsQuery,
  useGetMoviesQuery,
  useGetSocialPostsQuery,
  useSearchContentQuery,
} = contentApi;
