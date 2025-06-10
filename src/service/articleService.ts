
import type { CustomResponse } from '../components/utilities/AxiosInstance';
import axiosInstance from '../components/utilities/AxiosInstance';
import type { Article, createArticleEntity } from '../types/Article';


export interface PaginatedArticleResponse {
  articles: Article[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}


export interface ArticleQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  sortBy?: string;
  userId?: string;
}

export const fetchArticles = async (params: ArticleQueryParams = {}): Promise<PaginatedArticleResponse> => {
  try {
    // Build query string from parameters
    const queryParams = new URLSearchParams();

    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.search) queryParams.append('search', params.search);
    if (params.category) queryParams.append('category', params.category);
    if (params.sortBy) queryParams.append('sortBy', params.sortBy);
    const queryString = queryParams.toString();
    const url = queryString ? `/articles/preferred?${queryString}` : '/articles/preferred';

    const response = await axiosInstance.get<CustomResponse<PaginatedArticleResponse>>(url);
    return response.data.data || {
      articles: [],
      totalCount: 0,
      totalPages: 0,
      currentPage: 1,
      hasNextPage: false,
      hasPrevPage: false,
    };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch articles';
    console.error('Error fetching articles:', errorMessage);
    throw new Error(errorMessage);
  }
};
// Separate function for fetching user's own articles
export const fetchMyArticles = async (params: Omit<ArticleQueryParams, 'userId'> = {}): Promise<PaginatedArticleResponse> => {
  try {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.search) queryParams.append('search', params.search);
    if (params.category) queryParams.append('category', params.category);
    if (params.sortBy) queryParams.append('sortBy', params.sortBy);

    const queryString = queryParams.toString();
    const url = queryString ? `/article/my-articles?${queryString}` : '/article/my-articles';
    
    const response = await axiosInstance.get<CustomResponse<PaginatedArticleResponse>>(url);
    return response.data.data || {
      articles: [],
      totalCount: 0,
      totalPages: 0,
      currentPage: 1,
      hasNextPage: false,
      hasPrevPage: false
    };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch my articles';
    console.error('Error fetching my articles:', errorMessage);
    throw new Error(errorMessage);
  }
};
export const getUserPreferences = async (): Promise<string[]> => {
  try {
    const response = await axiosInstance.get<CustomResponse<{ preferences: string[] }>>('/user/preferences');
    return response.data.data?.preferences || [];
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch user preferences';
    console.error('Error fetching preferences:', errorMessage);
    return []; // Return empty array if preferences can't be fetched
  }
};

// Update user preferences
export const updateUserPreferences = async (preferences: string[]): Promise<void> => {
  try {
    await axiosInstance.patch<CustomResponse>('/user/preferences', { preferences });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to update user preferences';
    console.error('Error updating preferences:', errorMessage);
    throw new Error(errorMessage);
  }
};

export const getCategories = async (): Promise<string[]> => {
  try {
    const response = await axiosInstance.get<CustomResponse<{ categories: string[] }>>('/articles/categories');
    return response.data.data?.categories || [];
  } catch (error: unknown) {
    console.error('Error fetching categories:', error);
    return ['Technology', 'Science','Health & Wellness','Business','Entertainment','Travel','Food & Cooking','Sports','Politics']; // Default categories as fallback
  }
};

// Delete an article by ID
export const deleteArticle = async (articleId: string): Promise<void> => {
  try {
    await axiosInstance.delete<CustomResponse>(`/articles/${articleId}`);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to delete article';
    console.error('Error deleting article:', errorMessage);
    throw new Error(errorMessage);
  }
};

// Like an article
export const likeArticle = async (articleId: string): Promise<void> => {
  try {
    await axiosInstance.patch<CustomResponse>(`/article/like/${articleId}`);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to like article';
    console.error('Error liking article:', errorMessage);
    throw new Error(errorMessage);
  }
};

// Dislike an article
export const dislikeArticle = async (articleId: string): Promise<void> => {
  try {
    await axiosInstance.patch<CustomResponse>(`/article/dislike/${articleId}`);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to dislike article';
    console.error('Error disliking article:', errorMessage);
    throw new Error(errorMessage);
  }
};

// Get a single article by ID
export const getArticleById = async (articleId: string): Promise<Article> => {
  try {
    const response = await axiosInstance.get<CustomResponse<Article>>(`/articles/${articleId}`);
    return response.data.data;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch article';
    console.error('Error fetching article:', errorMessage);
    throw new Error(errorMessage);
  }
};

// Create a new article
export const createArticle = async (articleData:createArticleEntity): Promise<Article> => {
  try {
    const response = await axiosInstance.post<CustomResponse<Article>>('/article', articleData);
    return response.data.data;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to create article';
    console.error('Error creating article:', errorMessage);
    throw new Error(errorMessage);
  }
};

// Update an existing article
export const updateArticle = async (articleId: string, articleData: Partial<Article>): Promise<Article> => {
  try {
    const response = await axiosInstance.put<CustomResponse<Article>>(`/articles/${articleId}`, articleData);
    return response.data.data;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to update article';
    console.error('Error updating article:', errorMessage);
    throw new Error(errorMessage);
  }
};

// Block/Hide an article (alternative to delete if you want to keep it but hide it)
export const blockArticle = async (articleId: string): Promise<void> => {
  try {
    await axiosInstance.patch<CustomResponse>(`/article/block/${articleId}`);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to block article';
    console.error('Error blocking article:', errorMessage);
    throw new Error(errorMessage);
  }
};