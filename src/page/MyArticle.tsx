import React, { useState, useEffect, useCallback } from 'react';
import { Loader, Search, Filter, RefreshCw, FileText, BookOpen, PenTool } from 'lucide-react';
import type { Article } from '../types/Article';
import { 
  deleteArticle, 
  fetchMyArticles,
  likeArticle, 
  dislikeArticle, 
  blockArticle,
  type PaginatedArticleResponse 
} from '../service/articleService';
import Button from '../components/UI/Button';
import ArticleCard from '../components/Article/ArticleCard';
import Pagination from '../components/utilities/Pagination';
import MyArticleModal from '../components/Article/MyArticleModal';
import { useAuth } from '../redux/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const MyArticle: React.FC = () => {
  const [articleData, setArticleData] = useState<PaginatedArticleResponse>({
    articles: [],
    totalCount: 0,
    totalPages: 0,
    currentPage: 1,
    hasNextPage: false,
    hasPrevPage: false
  });
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'popular'>('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);

  const user = useAuth();
  const currentUserId = user?._id as string;

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const navigate=useNavigate();
  // Modal state
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Debounced search function
  const [searchTimeout, setSearchTimeout] = useState<number | null>(null);

  const loadArticles = useCallback(async (resetPage: boolean = false) => {
    setIsLoading(true);
    try {
      const page = resetPage ? 1 : currentPage;
      const params = {
        page,
        limit: itemsPerPage,
        search: searchTerm || undefined,
        category: categoryFilter || undefined,
        sortBy,
      };

      const data = await fetchMyArticles(params);
      setArticleData(data);
      
      if (resetPage) {
        setCurrentPage(1);
      }

      // Extract unique categories for filter dropdown
      if (data.articles.length > 0) {
        const uniqueCategories = [...new Set(data.articles.map(article => article.category))];
        setCategories(prev => [...new Set([...prev, ...uniqueCategories])]);
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch articles';
      console.error('Failed to fetch articles:', errorMessage);
      setArticleData({
        articles: [],
        totalCount: 0,
        totalPages: 0,
        currentPage: 1,
        hasNextPage: false,
        hasPrevPage: false
      });
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, searchTerm, categoryFilter, sortBy, itemsPerPage]);

  useEffect(() => {
    loadArticles();
  }, [loadArticles]);

  // Handle search with debouncing
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    const timeout = setTimeout(() => {
      setCurrentPage(1);
      loadArticles(true);
    }, 500) as unknown as number; // 500ms debounce

    setSearchTimeout(timeout);
  };

  // Handle filter changes
  useEffect(() => {
    if (categoryFilter !== '' || sortBy !== 'newest') {
      loadArticles(true);
    }
  }, [categoryFilter, sortBy]);

  const handleCardClick = (article: Article) => {
    setSelectedArticle(article);
    setIsModalOpen(true);
  };

  const handleEdit = (article: Article) => {
      navigate(`/edit`, { 
    state: { article } 
  });
  };

  const handleModalDelete = async (articleId: string) => {
    try {
      await deleteArticle(articleId);
      // Refresh the current page after deletion
      loadArticles();
      if (selectedArticle?._id === articleId) {
        setIsModalOpen(false);
        setSelectedArticle(null);
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete article';
      console.error('Failed to delete article:', errorMessage);
    }
  };

  const handleLike = async (articleId: string) => {
    try {
      // Optimistic update
      setArticleData(prev => ({
        ...prev,
        articles: prev.articles.map((article) =>
          article._id === articleId
            ? {
                ...article,
                likes: article.likes.includes(currentUserId)
                  ? article.likes.filter((id) => id !== currentUserId)
                  : [...article.likes, currentUserId],
                dislikes: article.dislikes.includes(currentUserId)
                  ? article.dislikes.filter((id) => id !== currentUserId)
                  : article.dislikes,
              }
            : article
        )
      }));

      // API call
      await likeArticle(articleId);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to like article';
      console.error('Failed to like article:', errorMessage);
      loadArticles(); // Revert on error
    }
  };

  const handleDislike = async (articleId: string) => {
    try {
      // Optimistic update
      setArticleData(prev => ({
        ...prev,
        articles: prev.articles.map((article) =>
          article._id === articleId
            ? {
                ...article,
                dislikes: article.dislikes.includes(currentUserId)
                  ? article.dislikes.filter((id) => id !== currentUserId)
                  : [...article.dislikes, currentUserId],
                likes: article.likes.includes(currentUserId)
                  ? article.likes.filter((id) => id !== currentUserId)
                  : article.likes,
              }
            : article
        )
      }));

      // API call
      await dislikeArticle(articleId);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to dislike article';
      console.error('Failed to dislike article:', errorMessage);
      loadArticles(); // Revert on error
    }
  };

  const handleBlock = async (articleId: string) => {
    try {
      await blockArticle(articleId);
      // Refresh the current page after blocking
      loadArticles();
      if (selectedArticle?._id === articleId) {
        setIsModalOpen(false);
        setSelectedArticle(null);
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to block article';
      console.error('Failed to block article:', errorMessage);
    }
  };

  const handleRefresh = () => {
    loadArticles();
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategoryChange = (category: string) => {
    setCategoryFilter(category);
    setCurrentPage(1);
  };

  const handleSortChange = (sort: 'newest' | 'popular') => {
    setSortBy(sort);
    setCurrentPage(1);
  };

  const clearSearch = () => {
    setSearchTerm('');
    setCurrentPage(1);
    loadArticles(true);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setCategoryFilter('');
    setSortBy('newest');
    setCurrentPage(1);
    loadArticles(true);
  };

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        background:
          'radial-gradient(ellipse at top left, rgba(245, 208, 144, 0.3) 0%, transparent 50%), radial-gradient(ellipse at top right, rgba(218, 165, 32, 0.2) 0%, transparent 50%), radial-gradient(ellipse at bottom, rgba(160, 82, 45, 0.1) 0%, transparent 50%), linear-gradient(135deg, #faf9f7 0%, #f5f2e8 100%)',
      }}
    >
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-10 left-10 opacity-20 animate-pulse">
          <FileText className="w-14 h-14 text-amber-800 transform rotate-12" />
        </div>
        <div
          className="absolute top-32 right-16 opacity-15 animate-bounce"
          style={{ animationDuration: '3s' }}
        >
          <BookOpen className="w-12 h-12 text-amber-700 transform -rotate-45" />
        </div>
        <div
          className="absolute bottom-20 left-20 opacity-20 transform rotate-45 animate-pulse"
          style={{ animationDelay: '1s' }}
        >
          <PenTool className="w-12 h-12 text-amber-600" />
        </div>
        <div className="absolute top-1/3 right-8 opacity-20 transform -rotate-12">
          <FileText className="w-10 h-10 text-amber-700" />
        </div>
        <div
          className="absolute bottom-40 right-40 opacity-20 transform rotate-25 animate-pulse"
          style={{ animationDelay: '2s' }}
        >
          <BookOpen className="w-12 h-12 text-amber-800" />
        </div>
        <div className="absolute top-20 left-1/3 opacity-15 transform -rotate-30">
          <PenTool className="w-8 h-8 text-amber-600" />
        </div>
        <div className="absolute top-1/2 left-8 opacity-15 transform rotate-60">
          <FileText className="w-8 h-8 text-amber-700" />
        </div>
        <div
          className="absolute bottom-10 right-10 opacity-20 animate-pulse"
          style={{ animationDelay: '0.5s' }}
        >
          <BookOpen className="w-6 h-6 text-amber-600" />
        </div>
        <div className="absolute top-16 right-1/4 opacity-15 transform rotate-75">
          <PenTool className="w-6 h-6 text-amber-800" />
        </div>
        <div
          className="absolute bottom-32 left-1/4 opacity-20 animate-pulse"
          style={{ animationDelay: '1.5s' }}
        >
          <FileText className="w-10 h-10 text-amber-600" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-16 relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div className="flex items-center gap-4 mb-4 md:mb-0">
            <h1
              className="text-3xl font-bold text-amber-900"
              style={{ fontFamily: '"Times New Roman", serif' }}
            >
              Your Articles
            </h1>
            {articleData.totalCount > 0 && (
              <span className="text-sm text-amber-700 bg-amber-100 px-3 py-1 rounded-full">
                {articleData.totalCount} article{articleData.totalCount !== 1 ? 's' : ''}
              </span>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-9 pr-4 py-2 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 w-full sm:w-auto bg-white/80 backdrop-blur-sm"
                style={{
                  boxShadow: '0 2px 8px rgba(139, 69, 19, 0.1)',
                }}
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-amber-600" />
            </div>

            <Button
              variant="secondary"
              icon={<Filter className="h-4 w-4" />}
              onClick={() => setShowFilters(!showFilters)}
              className="sm:ml-2"
            >
              Filters
            </Button>

            <Button
              variant="ghost"
              icon={<RefreshCw className="h-4 w-4" />}
              onClick={handleRefresh}
              isLoading={isLoading}
              className="sm:ml-2"
            >
              Refresh
            </Button>
          </div>
        </div>

        {showFilters && (
          <div
            className="p-4 rounded-md mb-6 border animate-fadeIn backdrop-blur-sm"
            style={{
              background: 'linear-gradient(145deg, rgba(248, 246, 240, 0.95) 0%, rgba(245, 242, 232, 0.98) 100%)',
              boxShadow: '0 4px 12px rgba(139, 69, 19, 0.12)',
              border: '1px solid rgba(139, 69, 19, 0.15)',
            }}
          >
            <div className="flex flex-wrap gap-4 items-end">
              <div className="w-full sm:w-auto">
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-amber-800 mb-1"
                  style={{ fontFamily: '"Times New Roman", serif' }}
                >
                  Category
                </label>
                <select
                  id="category"
                  value={categoryFilter}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="w-full sm:w-auto px-3 py-2 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white/90"
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="w-full sm:w-auto">
                <label
                  htmlFor="sortBy"
                  className="block text-sm font-medium text-amber-800 mb-1"
                  style={{ fontFamily: '"Times New Roman", serif' }}
                >
                  Sort By
                </label>
                <select
                  id="sortBy"
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value as 'newest' | 'popular')}
                  className="w-full sm:w-auto px-3 py-2 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white/90"
                >
                  <option value="newest">Newest First</option>
                  <option value="popular">Most Popular</option>
                </select>
              </div>

              <Button
                variant="ghost"
                onClick={clearFilters}
                className="text-amber-700 hover:bg-amber-50"
              >
                Clear All
              </Button>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="flex flex-col items-center space-y-3">
              <Loader className="h-8 w-8 text-amber-600 animate-spin" />
              <p
                className="text-amber-800 font-medium"
                style={{ fontFamily: '"Times New Roman", serif' }}
              >
                Loading your articles...
              </p>
            </div>
          </div>
        ) : articleData.articles.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {articleData.articles.map((article) => (
                <ArticleCard
                  key={article._id}
                  article={article}
                  onCardClick={handleCardClick}
                  onLike={handleLike}
                  onDislike={handleDislike}
                  onBlock={handleBlock}
                />
              ))}
            </div>

            {articleData.totalPages > 1 && (
              <Pagination
                currentPage={articleData.currentPage}
                totalPages={articleData.totalPages}
                onPageChange={handlePageChange}
                itemsPerPage={itemsPerPage}
                totalItems={articleData.totalCount}
              />
            )}
          </>
        ) : (
          <div
            className="rounded-lg p-8 text-center backdrop-blur-sm"
            style={{
              background: 'linear-gradient(145deg, rgba(248, 246, 240, 0.95) 0%, rgba(245, 242, 232, 0.98) 100%)',
              boxShadow: '0 8px 25px rgba(139, 69, 19, 0.15)',
              border: '1px solid rgba(139, 69, 19, 0.1)',
            }}
          >
            <div className="mb-4">
              <BookOpen className="w-16 h-16 text-amber-600 mx-auto mb-3 opacity-60" />
            </div>
            <h3
              className="text-xl font-bold text-amber-900 mb-3"
              style={{ fontFamily: '"Times New Roman", serif' }}
            >
              No articles found
            </h3>
            <p
              className="text-amber-700 mb-6"
              style={{ fontFamily: '"Times New Roman", serif' }}
            >
              {!searchTerm && !categoryFilter && sortBy === 'newest'
                ? "You haven't created any articles yet. Start your writing journey!"
                : "No articles match your current filters. Try adjusting your search."}
            </p>
            {!searchTerm && !categoryFilter && sortBy === 'newest' ? (
              <Button
                onClick={() => (window.location.href = '/create')}
                className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
                style={{
                  fontFamily: '"Times New Roman", serif',
                  boxShadow: '0 4px 15px rgba(139, 69, 19, 0.3)',
                }}
              >
                Create Your First Article
              </Button>
            ) : (
              <div className="flex gap-3 justify-center">
                {searchTerm && (
                  <Button
                    variant="secondary"
                    onClick={clearSearch}
                    className="border-amber-300 text-amber-700 hover:bg-amber-50 px-6 py-2 rounded-lg font-medium transition-all duration-300"
                    style={{ fontFamily: '"Times New Roman", serif' }}
                  >
                    Clear Search
                  </Button>
                )}
                <Button
                  variant="secondary"
                  onClick={clearFilters}
                  className="border-amber-300 text-amber-700 hover:bg-amber-50 px-6 py-2 rounded-lg font-medium transition-all duration-300"
                  style={{ fontFamily: '"Times New Roman", serif' }}
                >
                  Clear All Filters
                </Button>
              </div>
            )}
          </div>
        )}

        {selectedArticle && (
          <MyArticleModal
            article={selectedArticle}
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              setSelectedArticle(null);
            }}
            onEdit={handleEdit}
            onDelete={handleModalDelete}
          />
        )}
      </div>
    </div>
  );
};

export default MyArticle;