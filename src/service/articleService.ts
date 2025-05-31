
import type { CustomResponse } from '../components/utilities/AxiosInstance';
import axiosInstance from '../components/utilities/AxiosInstance';
import type { Article } from '../types/Article';

// Fetch all articles for the current user
export const fetchArticles = async (): Promise<Article[]> => {
  try {
    const response = await axiosInstance.get<CustomResponse<Article[]>>('/articles/my-articles');
    return response.data.data || [];
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch articles';
    console.error('Error fetching articles:', errorMessage);
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
    return ['Technology', 'Design', 'Science']; // Default categories as fallback
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
    await axiosInstance.patch<CustomResponse>(`/articles/${articleId}/like`);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to like article';
    console.error('Error liking article:', errorMessage);
    throw new Error(errorMessage);
  }
};

// Dislike an article
export const dislikeArticle = async (articleId: string): Promise<void> => {
  try {
    await axiosInstance.patch<CustomResponse>(`/articles/${articleId}/dislike`);
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
export const createArticle = async (articleData: Omit<Article, '_id' | 'publishedAt' | 'views' | 'likes' | 'isLiked' | 'isDisliked'>): Promise<Article> => {
  try {
    const response = await axiosInstance.post<CustomResponse<Article>>('/articles', articleData);
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
    await axiosInstance.patch<CustomResponse>(`/articles/${articleId}/block`);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to block article';
    console.error('Error blocking article:', errorMessage);
    throw new Error(errorMessage);
  }
};