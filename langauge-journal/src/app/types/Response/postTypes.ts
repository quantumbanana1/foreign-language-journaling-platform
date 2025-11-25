import { IUserLanguage } from '../Language/langaugeResponse';
import { IInterest } from './getInterestsResponse';

export interface IPostObject {
  post_id: number;
  username: string;
  user_id: number;
  image_url: string | null;
  profile_photo_url: string | null;
  time_created: string;
  like_count: number;
  comment_count: number;
  post_content: string;
  title: string;
  interests?: IInterest[];
  language_object: IUserLanguage;
}

export interface PostResponse {
  data: IPostObject;
  message: string;
  success: boolean;
}

export interface IGetAllPostsResponse {
  data: IPostObject[];
  message: string;
  success: boolean;
}

export interface IUserPostsResponse {
  message: string;
  success: string;
}

export interface IUserPost {
  post_id: number;
  title: string | null;
  post_content: string | null;
  time_created: string | null;
  image_url: string | null;
  like_count: number | null;
  comments_count: number | null;
}

export interface IGetUserPostsResponse {
  data: IUserPost[];
  message: string;
  success: boolean;
}

export interface IGetUserPostOptions {
  id?: boolean;
  title?: boolean;
  post_content?: boolean;
  time_created?: boolean;
  image_url?: boolean;
  like_count?: boolean;
  comments_count?: boolean;
  limit?: number;
  offset?: number;
  order?: 'asc' | 'desc';
  status: string;
}
