// types/article.ts

import type { Category } from "./UserEntity";

export interface Author {
  name: string;
  avatar: string;
}
export interface createArticleEntity{
  title: string;
  content: string;
  publishedAt: string;
  category: string;
  image: string;
  tags: string[];
  readTime: number;
  isPublished?:boolean;
}
export interface Article {
  _id: string;
  title: string;
  content: string;
  authorId: string;
  author?: Author;
  publishedAt: string;
  category: string;
  image: string;
  likes: string[];  
  dislikes: string[];
  blockedBy: string[];  
  readTime: number;
  views: number;
  tags: string[];
  isPublished?:boolean;
  isDeleted?: boolean;
}

export const avatars:string[] = [
  "https://play-lh.googleusercontent.com/8idq2n2DjaRLqv9y5pYHbcNbIDfFi1C51vwqKIYF6YCG3tKk9jTCSbkf6LE1xs06Pg=w240-h480-rw",
  "https://img.freepik.com/premium-photo/3d-avatar-cartoon-character_113255-103130.jpg",
  "https://img.freepik.com/premium-photo/3d-illustration-cartoon-business-man-character-avatar-profile_1183071-397.jpg",
  "https://img.freepik.com/premium-photo/business-woman-3d-cartoon-avatar-portrait_839035-520811.jpg?w=360",
  "https://img.freepik.com/free-photo/portrait-man-cartoon-style_23-2151133887.jpg?semt=ais_hybrid&w=740",
  "https://img.freepik.com/premium-photo/stylish-young-woman-with-glasses-looking-away_1282444-271720.jpg"
];


export const CATEGORIES: Category[] = [
  {
    id: 'tech',
    name: 'Technology',
    description: 'Latest in gadgets, apps, and digital trends'
  },
  {
    id: 'health',
    name: 'Health & Wellness',
    description: 'Tips for healthy living and wellbeing'
  },
  {
    id: 'business',
    name: 'Business',
    description: 'Market updates, entrepreneurship, and career advice'
  },
  {
    id: 'science',
    name: 'Science',
    description: 'Discoveries, research, and innovation'
  },
  {
    id: 'entertainment',
    name: 'Entertainment',
    description: 'Movies, music, celebrities, and culture'
  },
  {
    id: 'travel',
    name: 'Travel',
    description: 'Destinations, travel tips, and experiences'
  },
  {
    id: 'food',
    name: 'Food & Cooking',
    description: 'Recipes, restaurant reviews, and culinary trends'
  },
  {
    id: 'sports',
    name: 'Sports',
    description: 'Games, athletes, and sporting events'
  },
  {
    id: 'politics',
    name: 'Politics',
    description: 'Policy updates, elections, and global affairs'
  }
];


export const mockAuthor: Author = {
  name: 'John Doe',
  avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
};


export const DEFAULT_IMAGES: string[] = [
  'https://picsum.photos/seed/responsive/800/400',
  'https://picsum.photos/seed/metaverse/800/400',
  'https://picsum.photos/seed/ai-web/800/400',
  'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop',
  'https://images.unsplash.com/photo-1558655146-d09347e92766?w=800&h=400&fit=crop',
  'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&h=400&fit=crop',
  'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=400&fit=crop',
  'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800&h=400&fit=crop',
  'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=400&fit=crop',
  'https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?w=800&h=400&fit=crop',
  'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800&h=400&fit=crop',
  'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=400&fit=crop',
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=400&fit=crop',
  'https://picsum.photos/seed/technology/800/400',
  'https://picsum.photos/seed/business/800/400',
  'https://picsum.photos/seed/science/800/400',
  'https://picsum.photos/seed/nature/800/400',
  'https://picsum.photos/seed/creative/800/400',
  'https://picsum.photos/seed/modern/800/400',
  'https://picsum.photos/seed/innovation/800/400'
];


export interface ArticlesResponse {
  articles: Article[];
  totalCount: number;
}