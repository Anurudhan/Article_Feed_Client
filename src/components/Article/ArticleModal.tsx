import React from 'react';
import { Ban, Clock, Eye, Heart, ThumbsDown, X } from "lucide-react";
import type { Article } from "../../types/Article";
import { useAuth } from "../../redux/hooks/useAuth";
import { format } from 'date-fns';

interface ArticleModalProps {
  article: Article | null;
  isOpen: boolean;
  onClose: () => void;
  onLike: (articleId: string) => void;
  onDislike: (articleId: string) => void;
  onBlock: (articleId: string) => void;
}

const ArticleModal: React.FC<ArticleModalProps> = ({ article, isOpen, onClose, onLike, onDislike, onBlock }) => {
  const user = useAuth();
  const isLiked = article?.likes.includes(user?._id as string) || false;
  const isDisliked = article?.dislikes.includes(user?._id as string) || false;
  const isBlocked = article?.blockedBy.includes(user?._id as string) || false;
  const isViewed = article?.views.includes(user?._id as string) || false;

  if (!isOpen || !article) return null;
  if (!article.author) return null;

  const formattedDate = format(new Date(article.publishedAt as string), 'MMM d, yyyy');

  const handleLike = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onLike(article._id); // Backend should toggle: add ID if not liked, remove if already liked
  };

  const handleDislike = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onDislike(article._id); // Backend should toggle: add ID if not disliked, remove if already disliked
  };

  const handleBlock = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onBlock(article._id); // Backend should toggle: add ID if not blocked, remove if already blocked
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-amber-100">
        <div className="relative">
          <img 
            src={article.image} 
            alt={article.title}
            className="w-full h-64 object-cover rounded-t-2xl"
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-amber-800 text-white rounded-full p-2 hover:bg-amber-900 transition-all focus:outline-none focus:ring-2 focus:ring-amber-500"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-8 bg-gradient-to-b from-white to-amber-50">
          <div className="flex items-center gap-4 mb-4">
            <img 
              src={article.author.avatar || "https://www.shutterstock.com/shutterstock/videos/3596848245/thumb/6.jpg?ip=x480"} 
              alt={article.author.name}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <h3 className="font-semibold text-gray-900">{article.author.name}</h3>
              <p className="text-gray-600 text-sm">{formattedDate}</p>
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{article.title}</h1>
          <p className="text-gray-600 mb-6 leading-relaxed">{article.content}</p>
          
          <div className="flex items-center gap-4 mb-6">
            <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-medium">
              {article.category}
            </span>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-gray-600" />
              {article.readTime} min read
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Eye className={`w-4 h-4 ${isViewed ? 'fill-current text-blue-600' : 'text-gray-600'}`} />
              {article.views.length} views
            </div>
          </div>
          
          <div className="flex items-center gap-4 pt-6 border-t border-amber-100">
            <button
              onClick={handleLike}
              disabled={isDisliked}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors ${
                isLiked 
                  ? 'text-red-600 bg-red-100 hover:bg-red-200' 
                  : isDisliked 
                    ? 'text-gray-400 bg-gray-100 cursor-not-allowed' 
                    : 'text-gray-600 bg-amber-100 hover:bg-amber-200'
              }`}
              type="button"
            >
              <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
              Like ({article.likes.length})
            </button>
            
            <button
              onClick={handleDislike}
              disabled={isLiked}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors ${
                isDisliked 
                  ? 'text-amber-700 bg-amber-200 hover:bg-amber-300' 
                  : isLiked 
                    ? 'text-gray-400 bg-gray-100 cursor-not-allowed' 
                    : 'text-gray-600 bg-amber-100 hover:bg-amber-200'
              }`}
              type="button"
            >
              <ThumbsDown className={`w-5 h-5 ${isDisliked ? 'fill-current' : ''}`} />
              Dislike ({article.dislikes.length})
            </button>
            
            <button
              onClick={handleBlock}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors ${
                isBlocked 
                  ? 'text-red-600 bg-red-200 hover:bg-red-300' 
                  : 'text-red-600 bg-red-100 hover:bg-red-200'
              }`}
              type="button"
            >
              <Ban className={`w-5 h-5 ${isBlocked ? 'fill-current' : ''}`} />
              Block Article ({article.blockedBy.length})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleModal;