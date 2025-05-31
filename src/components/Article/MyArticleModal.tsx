import { Edit, Eye, Trash2, X } from "lucide-react";
import Button from "../UI/Button";
import type { Article } from "../../types/Article";

const MyArticleModal: React.FC<{
  article: Article;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (article: Article) => void;
  onDelete: (articleId: number) => void;
}> = ({ article, isOpen, onClose, onEdit, onDelete }) => {
  if (!isOpen) return null;

  const handleEdit = () => {
    onEdit(article);
    onClose();
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this article? This action cannot be undone.')) {
      onDelete(article.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div
        className="rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        style={{
          background: 'linear-gradient(145deg, rgba(248, 246, 240, 0.98) 0%, rgba(245, 242, 232, 1) 100%)',
          boxShadow:
            '0 25px 50px rgba(139, 69, 19, 0.25), 0 10px 25px rgba(160, 82, 45, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.9)',
          border: '1px solid rgba(139, 69, 19, 0.1)',
        }}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-amber-200">
          <h2
            className="text-2xl font-bold text-amber-900"
            style={{ fontFamily: '"Times New Roman", serif' }}
          >
            Article Details
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-amber-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-amber-600" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          {/* Article Header */}
          <div className="mb-6">
            <h1
              className="text-3xl font-bold text-amber-900 mb-4"
              style={{ fontFamily: '"Times New Roman", serif' }}
            >
              {article.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-amber-700 mb-4">
              <span className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                {article.views} views
              </span>
              <span>Published: {new Date(article.publishedAt).toLocaleDateString()}</span>
              <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-medium">
                {article.category}
              </span>
            </div>
            {article.tags && (
              <div className="flex flex-wrap gap-2 mb-4">
                {article.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-amber-50 text-amber-800 rounded-full text-xs border border-amber-200"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Article Content */}
          <div className="prose max-w-none mb-6">
            <div
              className="text-amber-800 leading-relaxed whitespace-pre-wrap"
              style={{ fontFamily: '"Times New Roman", serif' }}
            >
              {article.content}
            </div>
          </div>

          {/* Article Stats */}
          <div
            className="flex items-center gap-6 p-4 rounded-lg mb-6"
            style={{
              background: 'linear-gradient(145deg, rgba(245, 208, 144, 0.2) 0%, rgba(218, 165, 32, 0.1) 100%)',
              border: '1px solid rgba(139, 69, 19, 0.1)',
            }}
          >
            <div className="text-center">
              <div className="text-2xl font-bold text-amber-900">{article.likes}</div>
              <div
                className="text-sm text-amber-700"
                style={{ fontFamily: '"Times New Roman", serif' }}
              >
                Likes
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-amber-900">{article.views}</div>
              <div
                className="text-sm text-amber-700"
                style={{ fontFamily: '"Times New Roman", serif' }}
              >
                Views
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div
          className="flex items-center justify-end gap-3 p-6 border-t border-amber-200"
          style={{
            background: 'linear-gradient(145deg, rgba(245, 208, 144, 0.1) 0%, rgba(218, 165, 32, 0.05) 100%)',
          }}
        >
          <Button
            variant="secondary"
            onClick={onClose}
            className="border-amber-300 text-amber-700 hover:bg-amber-50 px-4 py-2 rounded-lg transition-all duration-300"
            style={{ fontFamily: '"Times New Roman", serif' }}
          >
            Close
          </Button>
          <Button
            variant="secondary"
            icon={<Edit className="h-4 w-4" />}
            onClick={handleEdit}
            className="bg-amber-100 border-amber-300 text-amber-800 hover:bg-amber-200 px-4 py-2 rounded-lg transition-all duration-300"
            style={{ fontFamily: '"Times New Roman", serif' }}
          >
            Edit Article
          </Button>
          <Button
            variant="ghost"
            icon={<Trash2 className="h-4 w-4" />}
            onClick={handleDelete}
            className="bg-red-100 border-red-300 text-red-700 hover:bg-red-200 px-4 py-2 rounded-lg transition-all duration-300"
            style={{ fontFamily: '"Times New Roman", serif' }}
          >
            Delete Article
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MyArticleModal