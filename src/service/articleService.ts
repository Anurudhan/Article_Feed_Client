import { mockArticles, mockAuthor, type Article } from "../types/Article";


// Simulate loading data from storage
const getArticles = (): Article[] => {
  const storedArticles = localStorage.getItem('articles');
  return storedArticles ? JSON.parse(storedArticles) : mockArticles;
};

// Simulate saving data to storage
const saveArticles = (articles: Article[]): void => {
  localStorage.setItem('articles', JSON.stringify(articles));
};

export const fetchArticles = (): Promise<Article[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(getArticles());
    }, 500);
  });
};

export const fetchArticleById = (id: string): Promise<Article | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const articles = getArticles();
      const article = articles.find(a => a.id === id);
      resolve(article);
    }, 300);
  });
};

export const createArticle = (articleData: Partial<Article>): Promise<Article> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const articles = getArticles();
      const newId = articles.length > 0 
        ? Math.max(...articles.map(a => Number(a.id))) + 1 +""
        :"1";
      
      const newArticle: Article = {
        id: newId,
        title: articleData.title || '',
        content: articleData.content || '',
        author: mockAuthor,
        publishedAt: new Date().toISOString(),
        category: articleData.category || 'uncategorized',
        image: articleData.image || '',
        likes: 0,
        readTime: Math.ceil((articleData.content?.length || 0) / 1000) || 1, // Rough estimate
        views: 0,
        isLiked: false,
        isDisliked: false,
        tags: articleData.tags || [],
      };
      
      const updatedArticles = [...articles, newArticle];
      saveArticles(updatedArticles);
      
      resolve(newArticle);
    }, 800);
  });
};

export const updateArticle = (id: string, articleData: Partial<Article>): Promise<Article> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const articles = getArticles();
      const index = articles.findIndex(a => a.id === id);
      
      if (index === -1) {
        reject(new Error('Article not found'));
        return;
      }
      
      const updatedArticle = {
        ...articles[index],
        ...articleData,
        publishedAt: articles[index].publishedAt, // Preserve original publish date
        author: articles[index].author, // Preserve original author
      };
      
      const updatedArticles = [...articles];
      updatedArticles[index] = updatedArticle;
      
      saveArticles(updatedArticles);
      resolve(updatedArticle);
    }, 800);
  });
};

export const deleteArticle = (id: string): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const articles = getArticles();
      const updatedArticles = articles.filter(a => a.id !== id);
      saveArticles(updatedArticles);
      resolve();
    }, 500);
  });
};

export const toggleLike = (id: string): Promise<Article> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const articles = getArticles();
      const index = articles.findIndex(a => a.id === id);
      
      if (index === -1) {
        reject(new Error('Article not found'));
        return;
      }
      
      const article = articles[index];
      const updatedArticle: Article = {
        ...article,
        isLiked: !article.isLiked,
        isDisliked: article.isDisliked && !article.isLiked ? false : article.isDisliked,
        likes: article.isLiked 
          ? article.likes - 1 
          : article.likes + (article.isDisliked ? 2 : 1)
      };
      
      const updatedArticles = [...articles];
      updatedArticles[index] = updatedArticle;
      
      saveArticles(updatedArticles);
      resolve(updatedArticle);
    }, 300);
  });
};