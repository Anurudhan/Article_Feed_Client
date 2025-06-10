import { Ban, Clock, Eye, Heart, ThumbsDown } from "lucide-react";
import type { Article } from "../../types/Article";
import { useAuth } from "../../redux/hooks/useAuth";



interface ArticleModalProps {
  article: Article | null;
  isOpen: boolean;
  onClose: () => void;
  onLike: (articleId: string) => void;
  onDislike: (articleId: string) => void;
  onBlock: (articleId: string) => void;
}

const ArticleModal: React.FC<ArticleModalProps> = ({ article, isOpen, onClose, onLike, onDislike, onBlock }) => {
   const user = useAuth()
    const isLiked=article?.likes.includes(user?._id as string);
    const isDisliked=article?.dislikes.includes(user?._id as string);
  if (!isOpen || !article) return null;
  if(!article.author) return null;
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
            className="absolute top-4 right-4 bg-amber-800 bg-opacity-70 text-white rounded-full p-2 hover:bg-opacity-90 transition-all"
          >
            ×
          </button>
        </div>
        
        <div className="p-8 bg-gradient-to-b from-white to-amber-50">
          <div className="flex items-center gap-4 mb-4">
            <img 
              src={article.author.avatar||"https://www.shutterstock.com/shutterstock/videos/3596848245/thumb/6.jpg?ip=x480" } 
              alt={article.author.name}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <h3 className="font-semibold text-gray-900">{article.author.name}</h3>
              <p className="text-gray-600 text-sm">{article.publishedAt}</p>
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{article.title}</h1>
          <p className="text-gray-600 mb-6 leading-relaxed">{article.content}</p>
          
          <div className="flex items-center gap-4 mb-6">
            <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-medium">
              {article.category}
            </span>
            <div className="flex items-center gap-2 text-gray-600 text-sm">
              <Clock className="w-4 h-4" />
              {article.readTime} min read
            </div>
            <div className="flex items-center gap-2 text-gray-600 text-sm">
              <Eye className="w-4 h-4" />
              {article.views} views
            </div>
          </div>
          
          <div className="flex items-center gap-4 pt-6 border-t border-amber-100">
            <button
              onClick={() => onLike(article._id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                isLiked 
                  ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                  : 'bg-amber-100 text-gray-600 hover:bg-amber-200'
              }`}
            >
              <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
              Like ({article.likes.length})
            </button>
            
            <button
              onClick={() => onDislike(article._id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                isDisliked 
                  ? 'bg-amber-200 text-amber-700 hover:bg-amber-300' 
                  : 'bg-amber-100 text-gray-600 hover:bg-amber-200'
              }`}
            >
              <ThumbsDown className={`w-5 h-5 ${isDisliked ? 'fill-current' : ''}`} />
              Dislike
            </button>
            
            <button
              onClick={() => onBlock(article._id)}
              className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-all"
            >
              <Ban className="w-5 h-5" />
              Block Article
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleModal;