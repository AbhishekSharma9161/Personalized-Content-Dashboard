import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { SimpleDashboard } from '../../pages/SimpleDashboard';

// Mock framer-motion
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

// Mock @hello-pangea/dnd
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

describe('SimpleDashboard', () => {
  const defaultProps = {
    activeSection: 'feed' as const,
    searchQuery: '',
    preferences: ['technology', 'sports', 'entertainment'],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  it('should render loading state initially', () => {
    render(<SimpleDashboard {...defaultProps} />);
    
    expect(screen.getByText('Loading your personalized content...')).toBeInTheDocument();
  });

  it('should render content after loading', async () => {
    render(<SimpleDashboard {...defaultProps} />);
    
    await waitFor(() => {
      expect(screen.getByText('Your Personalized Feed')).toBeInTheDocument();
    }, { timeout: 2000 });
    
    expect(screen.getByText('Breaking: Tech Innovation Continues to Grow')).toBeInTheDocument();
    expect(screen.getByText('Popular Movie of the Week')).toBeInTheDocument();
  });

  it('should filter content based on search query', async () => {
    const propsWithSearch = { ...defaultProps, searchQuery: 'tech' };
    render(<SimpleDashboard {...propsWithSearch} />);
    
    await waitFor(() => {
      expect(screen.getByText('Showing results for "tech"')).toBeInTheDocument();
    }, { timeout: 2000 });
  });

  it('should display different content for trending section', async () => {
    const trendingProps = { ...defaultProps, activeSection: 'trending' as const };
    render(<SimpleDashboard {...trendingProps} />);
    
    await waitFor(() => {
      expect(screen.getByText('Trending Content')).toBeInTheDocument();
      expect(screen.getByText('Most popular content with highest ratings')).toBeInTheDocument();
    }, { timeout: 2000 });
  });

  it('should handle favorites correctly', async () => {
    render(<SimpleDashboard {...defaultProps} />);
    
    await waitFor(() => {
      const favoriteButtons = screen.getAllByText('🤍');
      expect(favoriteButtons.length).toBeGreaterThan(0);
    }, { timeout: 2000 });
    
    const favoriteButton = screen.getAllByText('🤍')[0];
    fireEvent.click(favoriteButton);
    
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'favorites',
      expect.any(String)
    );
  });

  it('should show empty state for favorites when no favorites exist', async () => {
    const favoritesProps = { ...defaultProps, activeSection: 'favorites' as const };
    render(<SimpleDashboard {...favoritesProps} />);
    
    await waitFor(() => {
      expect(screen.getByText('No favorites yet')).toBeInTheDocument();
      expect(screen.getByText('Start adding items to your favorites to see them here')).toBeInTheDocument();
    }, { timeout: 2000 });
  });

  it('should filter content based on preferences', async () => {
    const limitedPreferences = { ...defaultProps, preferences: ['technology'] };
    render(<SimpleDashboard {...limitedPreferences} />);
    
    await waitFor(() => {
      // Should only show technology content
      expect(screen.getByText('Breaking: Tech Innovation Continues to Grow')).toBeInTheDocument();
    }, { timeout: 2000 });
  });

  it('should load favorites from localStorage', () => {
    localStorageMock.getItem.mockReturnValue(JSON.stringify(['1', '2']));
    
    render(<SimpleDashboard {...defaultProps} />);
    
    expect(localStorageMock.getItem).toHaveBeenCalledWith('favorites');
  });

  it('should handle load more functionality', async () => {
    render(<SimpleDashboard {...defaultProps} />);
    
    await waitFor(() => {
      const loadMoreButton = screen.getByText('Load More Content');
      expect(loadMoreButton).toBeInTheDocument();
    }, { timeout: 2000 });
    
    const loadMoreButton = screen.getByText('Load More Content');
    fireEvent.click(loadMoreButton);
    
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should show search results count', async () => {
    const searchProps = { ...defaultProps, searchQuery: 'movie' };
    render(<SimpleDashboard {...searchProps} />);
    
    await waitFor(() => {
      expect(screen.getByText(/Showing results for "movie"/)).toBeInTheDocument();
    }, { timeout: 2000 });
  });

  it('should handle category color coding correctly', async () => {
    render(<SimpleDashboard {...defaultProps} />);
    
    await waitFor(() => {
      // Check if category badges are rendered
      expect(screen.getByText('technology')).toBeInTheDocument();
      expect(screen.getByText('entertainment')).toBeInTheDocument();
    }, { timeout: 2000 });
  });

  it('should display rating for content items', async () => {
    render(<SimpleDashboard {...defaultProps} />);
    
    await waitFor(() => {
      // Check if ratings are displayed
      expect(screen.getByText('⭐ 8.5')).toBeInTheDocument();
      expect(screen.getByText('⭐ 9.2')).toBeInTheDocument();
    }, { timeout: 2000 });
  });
});
