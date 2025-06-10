import { useEffect, useState, useCallback } from 'react';
import { Star } from 'lucide-react';
import Pagination from '../components/utilities/Pagination';
import ArticleModal from '../components/Article/ArticleModal';
import Banner from '../components/UI/Banner';
import ArticleCard from '../components/Article/ArticleCard';
import { fetchArticles, getCategories, likeArticle, dislikeArticle, blockArticle, type ArticleQueryParams } from '../service/articleService';
import { useAuth } from '../redux/hooks/useAuth';
import type { Article } from '../types/Article';

const Dashboard: React.FC = () => {
  const user  = useAuth(); // Contains userId and articlePreferences
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [totalArticles, setTotalArticles] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const articlesPerPage: number = 8;

  // Fetch user preferences and categories on mount
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const  fetchedCategories = await getCategories()
        setCategories(fetchedCategories);
      } catch (err) {
        setError('Failed to load initial data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  // Fetch articles based on preferences, search, and category
  const fetchArticlesData = useCallback(async () => {
    if (!user?._id) return;

    try {
      setLoading(true);
      setError(null);
      const params: ArticleQueryParams = {
        page: currentPage,
        limit: articlesPerPage,
        userId: user?._id,
        search: searchTerm || undefined,
        category: selectedCategory || undefined,
      };

      const response = await fetchArticles(params);
      setArticles(response.articles);
      setTotalArticles(response.totalCount);
      setTotalPages(response.totalPages);
    } catch (err) {
      setError('Failed to fetch articles');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [user?._id, currentPage, searchTerm, selectedCategory]);

  useEffect(() => {
    fetchArticlesData();
  }, [fetchArticlesData]);

  const handleLike = async (articleId: string): Promise<void> => {
    if (!user?._id) return;

    try {
      await likeArticle(articleId);
      setArticles((prev) =>
        prev.map((article) =>
          article._id === articleId
            ? {
                ...article,
                likes: article.likes.includes(user?._id)
                  ? article.likes.filter((id) => id !== user?._id)
                  : [...article.likes,user?._id],
                dislikes: article.dislikes.includes(user?._id)
                  ? article.dislikes.filter((id) => id !== user?._id)
                  : article.dislikes,
              }
            : article
        )
      );
    } catch (err) {
      console.error('Failed to like article', err);
    }
  };

  const handleDislike = async (articleId: string): Promise<void> => {
    if (!user?._id) return;

    try {
      await dislikeArticle(articleId);
      setArticles((prev) =>
        prev.map((article) =>
          article._id === articleId
            ? {
                ...article,
                dislikes: article.dislikes.includes(user?._id)
                  ? article.dislikes.filter((id) => id !== user?._id)
                  : [...article.dislikes, user?._id],
                likes: article.likes.includes(user?._id)
                  ? article.likes.filter((id) => id !== user?._id)
                  : article.likes,
              }
            : article
        )
      );
    } catch (err) {
      console.error('Failed to dislike article', err);
    }
  };

  const handleBlock = async (articleId: string): Promise<void> => {
    try {
      await blockArticle(articleId);
      setArticles((prev) => prev.filter((article) => article._id !== articleId));
      setIsModalOpen(false);
      setSelectedArticle(null);
    } catch (err) {
      console.error('Failed to block article', err);
    }
  };

  const openArticle = (article: Article): void => {
    setSelectedArticle(article);
    setIsModalOpen(true);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on new search
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
    setCurrentPage(1); // Reset to first page on category change
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#8B4513]/20 via-[#A0522D]/20 to-[#CD853F]/20">
      <Banner />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-6 sm:mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Recommended Articles</h2>
            <p className="text-gray-600 text-sm sm:text-base">Curated content based on your interests</p>
          </div>
          <div className="flex items-center gap-2 text-gray-500 mt-4 sm:mt-0">
            <Star className="w-5 h-5 text-amber-600" />
            <span className="font-medium text-sm sm:text-base">{totalArticles} Articles Available</span>
          </div>
        </div>

        {/* Search and Filter Inputs */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="Search articles..."
            value={searchTerm}
            onChange={handleSearch}
            className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-600 bg-white/80 text-gray-900 placeholder-gray-400"
          />
          <select
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-600 bg-white/80 text-gray-900"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {loading && <p className="text-gray-600 text-center">Loading articles...</p>}
        {error && <p className="text-red-500 text-center">{error}</p>}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {articles.length > 0 ? (
            articles.map((article) => (
              <ArticleCard
                key={article._id}
                article={article}
                onCardClick={openArticle}
                onLike={handleLike}
                onDislike={handleDislike}
                onBlock={handleBlock}
              />
            ))
          ) : (
            <p className="text-gray-600 text-center col-span-full">No articles found.</p>
          )}
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          itemsPerPage={articlesPerPage}
          totalItems={totalArticles}
        />
      </div>

      <ArticleModal
        article={selectedArticle}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onLike={handleLike}
        onDislike={handleDislike}
        onBlock={handleBlock}
      />
    </div>
  );
};

export default Dashboard;