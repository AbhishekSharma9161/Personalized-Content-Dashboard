import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { SimpleDashboard } from '../../../pages/SimpleDashboard';

// Mock framer-motion and react-beautiful-dnd
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
    img: ({ children, ...props }: any) => <img {...props}>{children}</img>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
    h3: ({ children, ...props }: any) => <h3 {...props}>{children}</h3>,
    span: ({ children, ...props }: any) => <span {...props}>{children}</span>,
  },
  AnimatePresence: ({ children }: any) => children,
}));

jest.mock('@hello-pangea/dnd', () => ({
  DragDropContext: ({ children }: any) => children,
  Droppable: ({ children }: any) => children({
    innerRef: jest.fn(),
    droppableProps: {},
    placeholder: null,
  }, { isDraggingOver: false }),
  Draggable: ({ children }: any) => children({
    innerRef: jest.fn(),
    draggableProps: {},
    dragHandleProps: {},
  }, { isDragging: false }),
}));

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock as any;

describe('Content Flow Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  describe('Content Loading and Rendering', () => {
    it('should load and render content properly after API simulation', async () => {
      const props = {
        activeSection: 'feed' as const,
        searchQuery: '',
        preferences: ['technology', 'sports', 'entertainment'],
      };

      render(<SimpleDashboard {...props} />);

      // Should show loading state initially
      expect(screen.getByText('Loading your personalized content...')).toBeInTheDocument();

      // Wait for content to load
      await waitFor(() => {
        expect(screen.getByText('Your Personalized Feed')).toBeInTheDocument();
      }, { timeout: 2000 });

      // Check that content cards are rendered
      expect(screen.getByText('Breaking: Tech Innovation Continues to Grow')).toBeInTheDocument();
      expect(screen.getByText('Popular Movie of the Week')).toBeInTheDocument();
      expect(screen.getByText('Sports Highlights of the Day')).toBeInTheDocument();
    });

    it('should handle empty content state correctly', async () => {
      const props = {
        activeSection: 'favorites' as const,
        searchQuery: '',
        preferences: [],
      };

      render(<SimpleDashboard {...props} />);

      await waitFor(() => {
        expect(screen.getByText('Your Favorites')).toBeInTheDocument();
      }, { timeout: 2000 });

      // Should show empty state for favorites
      expect(screen.getByText('No favorites yet')).toBeInTheDocument();
      expect(screen.getByText('Start adding items to your favorites to see them here')).toBeInTheDocument();
    });

    it('should filter content based on search and preferences', async () => {
      const props = {
        activeSection: 'feed' as const,
        searchQuery: 'tech',
        preferences: ['technology'],
      };

      render(<SimpleDashboard {...props} />);

      await waitFor(() => {
        expect(screen.getByText(/Showing results for "tech"/)).toBeInTheDocument();
      }, { timeout: 2000 });

      // Should only show tech-related content
      expect(screen.getByText('Breaking: Tech Innovation Continues to Grow')).toBeInTheDocument();
    });
  });

  describe('User Interactions', () => {
    it('should handle favorites functionality end-to-end', async () => {
      const props = {
        activeSection: 'feed' as const,
        searchQuery: '',
        preferences: ['technology', 'sports', 'entertainment'],
      };

      render(<SimpleDashboard {...props} />);

      await waitFor(() => {
        expect(screen.getByText('Your Personalized Feed')).toBeInTheDocument();
      }, { timeout: 2000 });

      // Find and click a favorite button
      const favoriteButtons = screen.getAllByText('🤍');
      expect(favoriteButtons.length).toBeGreaterThan(0);

      fireEvent.click(favoriteButtons[0]);

      // Should save to localStorage
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'favorites',
        expect.any(String)
      );
    });

    it('should handle load more functionality', async () => {
      const props = {
        activeSection: 'feed' as const,
        searchQuery: '',
        preferences: ['technology', 'sports', 'entertainment'],
      };

      render(<SimpleDashboard {...props} />);

      await waitFor(() => {
        expect(screen.getByText('Load More Content')).toBeInTheDocument();
      }, { timeout: 2000 });

      // Click load more button
      const loadMoreButton = screen.getByText('Load More Content');
      fireEvent.click(loadMoreButton);

      // Should show loading state
      expect(screen.getByText('Loading...')).toBeInTheDocument();

      // Wait for new content to load
      await waitFor(() => {
        expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
      }, { timeout: 2000 });
    });
  });

  describe('Section Switching', () => {
    it('should handle switching between feed, trending, and favorites', async () => {
      let props = {
        activeSection: 'feed' as const,
        searchQuery: '',
        preferences: ['technology', 'sports', 'entertainment'],
      };

      const { rerender } = render(<SimpleDashboard {...props} />);

      // Wait for feed to load
      await waitFor(() => {
        expect(screen.getByText('Your Personalized Feed')).toBeInTheDocument();
      }, { timeout: 2000 });

      // Switch to trending
      props = { ...props, activeSection: 'trending' };
      rerender(<SimpleDashboard {...props} />);

      expect(screen.getByText('Trending Content')).toBeInTheDocument();
      expect(screen.getByText('Most popular content with highest ratings')).toBeInTheDocument();

      // Switch to favorites
      props = { ...props, activeSection: 'favorites' };
      rerender(<SimpleDashboard {...props} />);

      expect(screen.getByText('Your Favorites')).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('should handle localStorage errors gracefully', async () => {
      // Mock localStorage to throw error
      localStorageMock.setItem.mockImplementation(() => {
        throw new Error('Storage quota exceeded');
      });

      const props = {
        activeSection: 'feed' as const,
        searchQuery: '',
        preferences: ['technology'],
      };

      render(<SimpleDashboard {...props} />);

      await waitFor(() => {
        expect(screen.getByText('Your Personalized Feed')).toBeInTheDocument();
      }, { timeout: 2000 });

      // Try to favorite an item - should not crash
      const favoriteButtons = screen.getAllByText('🤍');
      fireEvent.click(favoriteButtons[0]);

      // App should still be functional
      expect(screen.getByText('Your Personalized Feed')).toBeInTheDocument();
    });
  });

  describe('Performance and Optimization', () => {
    it('should render large number of items efficiently', async () => {
      const props = {
        activeSection: 'feed' as const,
        searchQuery: '',
        preferences: ['technology', 'sports', 'entertainment', 'business', 'social'],
      };

      const startTime = Date.now();
      render(<SimpleDashboard {...props} />);

      await waitFor(() => {
        expect(screen.getByText('Your Personalized Feed')).toBeInTheDocument();
      }, { timeout: 2000 });

      const endTime = Date.now();
      const renderTime = endTime - startTime;

      // Should render within reasonable time (less than 3 seconds including simulated loading)
      expect(renderTime).toBeLessThan(3000);
    });

    it('should handle rapid section switching without issues', async () => {
      let props = {
        activeSection: 'feed' as const,
        searchQuery: '',
        preferences: ['technology'],
      };

      const { rerender } = render(<SimpleDashboard {...props} />);

      await waitFor(() => {
        expect(screen.getByText('Your Personalized Feed')).toBeInTheDocument();
      }, { timeout: 2000 });

      // Rapidly switch sections
      const sections: ('feed' | 'trending' | 'favorites')[] = ['trending', 'favorites', 'feed', 'trending'];
      
      for (const section of sections) {
        props = { ...props, activeSection: section };
        rerender(<SimpleDashboard {...props} />);
      }

      // Should end up on trending without crashes
      expect(screen.getByText('Trending Content')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels and roles', async () => {
      const props = {
        activeSection: 'feed' as const,
        searchQuery: '',
        preferences: ['technology'],
      };

      render(<SimpleDashboard {...props} />);

      await waitFor(() => {
        expect(screen.getByText('Your Personalized Feed')).toBeInTheDocument();
      }, { timeout: 2000 });

      // Check for proper heading structure
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
      
      // Check for images with alt text
      const images = screen.getAllByRole('img');
      images.forEach(img => {
        expect(img).toHaveAttribute('alt');
      });
    });
  });
});
