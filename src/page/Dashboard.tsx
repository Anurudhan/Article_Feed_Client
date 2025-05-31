import { useState } from 'react';
import { Star } from 'lucide-react';
import Pagination from '../components/utilities/Pagination';
import ArticleModal from '../components/Article/ArticleModal';
import Banner from '../components/UI/Banner';
import ArticleCard from '../components/Article/ArticleCard';
import type { Article } from '../types/Article';


const Dashboard: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([
    {
      _id: "1",
      title: "The Future of Artificial Intelligence in Web Development",
      content: "Artificial Intelligence is revolutionizing the way we approach web development. From automated code generation to intelligent debugging, AI tools are becoming indispensable for modern developers. This comprehensive guide explores the latest AI technologies that are transforming the development landscape, including GPT-powered code assistants, automated testing frameworks, and intelligent design systems. We'll dive deep into practical implementations, discuss the benefits and challenges, and provide insights into what the future holds for AI-driven development workflows.",
      author: {
        name: "Sarah Chen",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
      },
      publishedAt: "2 hours ago",
      category: "Technology",
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop",
      likes: 124,
      readTime: 8,
      views: 1250,
      isLiked: false,
      isDisliked: false
    }
  ]);

  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const articlesPerPage: number = 8;
  const totalPages: number = Math.ceil(articles.length / articlesPerPage);
  const currentArticles: Article[] = articles.slice(
    (currentPage - 1) * articlesPerPage,
    currentPage * articlesPerPage
  );

  const handleLike = (articleId: string): void => {
    setArticles(prev => prev.map(article => 
      article._id === articleId 
        ? { 
            ...article, 
            isLiked: !article.isLiked,
            isDisliked: false,
            likes: article.isLiked ? article.likes - 1 : article.likes + 1
          }
        : article
    ));
  };

  const handleDislike = (articleId: string): void => {
    setArticles(prev => prev.map(article => 
      article._id === articleId 
        ? { 
            ...article, 
            isDisliked: !article.isDisliked,
            isLiked: false,
            likes: article.isLiked ? article.likes - 1 : article.likes
          }
        : article
    ));
  };

  const handleBlock = (articleId: string): void => {
    setArticles(prev => prev.filter(article => article._id !== articleId));
    setIsModalOpen(false);
    setSelectedArticle(null);
  };

  const openArticle = (article: Article): void => {
    setSelectedArticle(article);
    setIsModalOpen(true);
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
            <span className="font-medium text-sm sm:text-base">{articles.length} Articles Available</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {currentArticles.map((article) => (
            <ArticleCard
              key={article._id}
              article={article}
              onCardClick={openArticle}
              onLike={handleLike}
              onDislike={handleDislike}
              onBlock={handleBlock}
            />
          ))}
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          itemsPerPage={articlesPerPage}
          totalItems={articles.length}
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