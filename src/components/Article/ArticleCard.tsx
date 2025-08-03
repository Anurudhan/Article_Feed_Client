import React from 'react';
import { Heart, ThumbsDown, Ban, Eye } from 'lucide-react';
import type { Article } from '../../types/Article';
import { useAuth } from '../../redux/hooks/useAuth';
import { format } from 'date-fns';

interface ArticleCardProps {
  article: Article;
  onCardClick: (article: Article) => void;
  onLike: (articleId: string) => void;
  onDislike: (articleId: string) => void;
  onBlock: (articleId: string) => void;
}

const ArticleCard: React.FC<ArticleCardProps> = ({
  article,
  onCardClick,
  onLike,
  onDislike,
  onBlock,
}) => {
  const user = useAuth();
  const isLiked = article.likes.includes(user?._id as string);
  const isDisliked = article.dislikes.includes(user?._id as string);
  const isBlocked = article.blockedBy.includes(user?._id as string);
  const isViewed = article.views.includes(user?._id as string);

  const handleCardClick = (): void => {
    onCardClick(article);
  };

  const handleLike = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.stopPropagation();
    onLike(article._id);
  };

  const handleDislike = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.stopPropagation();
    onDislike(article._id);
  };

  const handleBlock = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.stopPropagation();
    onBlock(article._id);
  };
  const formattedDate = format(new Date(article.publishedAt as string), 'MMM d, yyyy');
  if (!article.author) return null;

  return (
    <div
      className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer group border border-amber-100"
      onClick={handleCardClick}
    >
      <div className="relative overflow-hidden">
        <img 
          src={article.image} 
          alt={article.title}
          className="w-full h-40 sm:h-48 object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-3 sm:top-4 left-3 sm:left-4">
          <span className="bg-amber-100 bg-opacity-90 text-gray-800 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
            {article.category}
          </span>
        </div>
        <div className="absolute top-3 sm:top-4 right-3 sm:right-4">
          <div className="bg-amber-800 bg-opacity-70 text-white px-2 py-1 rounded text-xs">
            {article.readTime} min
          </div>
        </div>
      </div>
      
      <div className="p-4 sm:p-6 bg-gradient-to-b from-white to-amber-50">
        <h3 className="font-bold text-base sm:text-lg text-gray-900 mb-3 line-clamp-2 group-hover:text-amber-700 transition-colors">
          {article.title}
        </h3>
        
        <div className="flex items-center gap-3 mb-4">
          <img 
            src={article.author.avatar || "https://www.shutterstock.com/shutterstock/videos/3596848245/thumb/6.jpg?ip=x480"} 
            alt={article.author.name}
            className="w-8 h-8 rounded-full object-cover"
          />
          <div>
            <div className="text-sm font-medium text-gray-900">{article.author.name}</div>
            <div className="text-xs text-gray-600">{formattedDate}</div>
          </div>
        </div>
        
        <div className="flex items-center justify-between pt-4 border-t border-amber-100">
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={handleLike}
              className={`flex items-center gap-1 text-sm transition-colors ${
                isLiked ? 'text-red-600' : 'text-gray-600 hover:text-red-600'
              }`}
              type="button"
            >
              <Heart className={`w-5 h-5 sm:w-4 sm:h-4 ${isLiked ? 'fill-current' : ''}`} />
              {article.likes.length}
            </button>
            
            <div className="flex items-center gap-1 text-sm transition-colors">
              <Eye className={`w-5 h-5 sm:w-4 sm:h-4 ${isViewed ? 'fill-current text-blue-600' : 'text-gray-600'}`} />
              {article.views.length}
            </div>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={handleDislike}
              className={`flex items-center gap-1 text-sm transition-colors ${
                isDisliked ? 'text-amber-700' : 'text-gray-400 hover:text-amber-700'
              }`}
              type="button"
            >
              <ThumbsDown className={`w-5 h-5 sm:w-4 sm:h-4 ${isDisliked ? 'fill-current' : ''}`} />
              {article.dislikes.length}
            </button>
            
            <button
              onClick={handleBlock}
              className={`flex items-center gap-1 text-sm transition-colors ${
                isBlocked ? 'text-red-600' : 'text-gray-400 hover:text-red-600'
              }`}
              type="button"
            >
              <Ban className={`w-5 h-5 sm:w-4 sm:h-4 ${isBlocked ? 'fill-current' : ''}`} />
              {article.blockedBy.length}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;