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
      id: "1",
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
    },
    {
      id: "2",
      title: "Sustainable Design Principles for Modern UX",
      content: "In an era of climate consciousness, sustainable design has become more than just a trend—it's a responsibility. This article explores how UX designers can create digital experiences that are not only user-friendly but also environmentally conscious. We'll examine techniques for reducing digital carbon footprints, optimizing performance for energy efficiency, and designing interfaces that promote sustainable behaviors. Learn about the principles of green UX design, tools for measuring environmental impact, and case studies from companies leading the charge in sustainable digital design.",
      author: {
        name: "Marcus Rivera",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
      },
      publishedAt: "5 hours ago",
      category: "Design",
      image: "https://images.unsplash.com/photo-1558655146-d09347e92766?w=800&h=400&fit=crop",
      likes: 89,
      readTime: 6,
      views: 890,
      isLiked: true,
      isDisliked: false
    },
    {
      id: "3",
      title: "Quantum Computing: Breaking Through Classical Limitations",
      content: "Quantum computing represents one of the most significant technological leaps of our time. This in-depth exploration covers the fundamental principles of quantum mechanics as applied to computing, the current state of quantum hardware, and the revolutionary applications on the horizon. From cryptography and drug discovery to financial modeling and artificial intelligence, quantum computers promise to solve problems that are intractable for classical computers. We'll also discuss the challenges facing quantum computing, including error correction, scalability, and the race between tech giants to achieve quantum supremacy.",
      author: {
        name: "Dr. Emily Watson",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
      },
      publishedAt: "1 day ago",
      category: "Science",
      image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&h=400&fit=crop",
      likes: 256,
      readTime: 12,
      views: 2100,
      isLiked: false,
      isDisliked: false
    },
    {
      id: "4",
      title: "Building Resilient React Applications",
      content: "Modern React applications need to be robust, scalable, and maintainable. This comprehensive guide covers advanced patterns and best practices for building resilient React applications that can handle real-world complexity. We'll explore error boundaries, performance optimization techniques, state management strategies, and testing methodologies. Learn how to implement proper error handling, optimize bundle sizes, manage complex state with Redux Toolkit, and create comprehensive test suites. This article also covers accessibility considerations, security best practices, and deployment strategies for production-ready React applications.",
      author: {
        name: "James Park",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
      },
      publishedAt: "2 days ago",
      category: "Technology",
      image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=400&fit=crop",
      likes: 178,
      readTime: 10,
      views: 1650,
      isLiked: false,
      isDisliked: false
    },
    {
      id: "5",
      title: "The Psychology of Color in Digital Interfaces",
      content: "Color is one of the most powerful tools in a designer's arsenal, capable of evoking emotions, guiding user behavior, and creating memorable experiences. This article delves into the psychological aspects of color theory as applied to digital interface design. We'll explore how different colors affect user perception, the cultural significance of color choices, and practical strategies for creating effective color palettes. Learn about accessibility considerations for color-blind users, the impact of color on conversion rates, and how to use color to establish brand identity and hierarchy in your designs.",
      author: {
        name: "Lisa Thompson",
        avatar: "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=150&h=150&fit=crop&crop=face"
      },
      publishedAt: "3 days ago",
      category: "Design",
      image: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800&h=400&fit=crop",
      likes: 145,
      readTime: 7,
      views: 1200,
      isLiked: false,
      isDisliked: false
    },
    {
      id: "6",
      title: "CRISPR Gene Editing: Rewriting the Code of Life",
      content: "CRISPR-Cas9 technology has revolutionized genetic engineering, offering unprecedented precision in editing DNA. This comprehensive overview covers the science behind CRISPR, its current applications, and the ethical considerations surrounding genetic modification. We'll explore how CRISPR is being used to treat genetic diseases, improve crop yields, and advance scientific research. The article also addresses the ongoing debates about human genetic enhancement, the potential risks of gene drives, and the regulatory frameworks being developed worldwide. Learn about the latest breakthroughs in CRISPR technology and what the future holds for genetic engineering.",
      author: {
        name: "Dr. Michael Chang",
        avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face"
      },
      publishedAt: "4 days ago",
      category: "Science",
      image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=400&fit=crop",
      likes: 201,
      readTime: 11,
      views: 1800,
      isLiked: true,
      isDisliked: false
    },
    {
      id: "7",
      title: "Microservices Architecture: Best Practices and Pitfalls",
      content: "Microservices architecture has become the gold standard for building scalable, maintainable applications. This detailed guide covers the principles of microservices design, implementation strategies, and common pitfalls to avoid. We'll explore service decomposition strategies, inter-service communication patterns, data management in distributed systems, and monitoring and observability practices. Learn about containerization with Docker, orchestration with Kubernetes, and how to implement circuit breakers, service mesh, and distributed tracing. This article also covers migration strategies from monolithic to microservices architecture.",
      author: {
        name: "David Rodriguez",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face"
      },
      publishedAt: "5 days ago",
      category: "Technology",
      image: "https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?w=800&h=400&fit=crop",
      likes: 167,
      readTime: 9,
      views: 1400,
      isLiked: false,
      isDisliked: false
    },
    {
      id: "8",
      title: "Creating Inclusive Design Systems",
      content: "Inclusive design is about creating products that work for everyone, regardless of their abilities, background, or circumstances. This comprehensive guide explores how to build design systems that prioritize accessibility and inclusion from the ground up. We'll cover WCAG guidelines, inclusive color palettes, typography considerations for readability, and interaction patterns that work for users with diverse needs. Learn about conducting inclusive user research, testing with assistive technologies, and creating documentation that promotes inclusive practices across your design team.",
      author: {
        name: "Rachel Adams",
        avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face"
      },
      publishedAt: "6 days ago",
      category: "Design",
      image: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800&h=400&fit=crop",
      likes: 193,
      readTime: 8,
      views: 1550,
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
      article.id === articleId 
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
      article.id === articleId 
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
    setArticles(prev => prev.filter(article => article.id !== articleId));
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
              key={article.id}
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