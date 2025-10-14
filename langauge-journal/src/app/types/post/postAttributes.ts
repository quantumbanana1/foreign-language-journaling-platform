import { IPostComments } from '../newPost/commentTypes';

export interface IResponseUserPostCounts {
  message: string;
  success: boolean;
  data: {
    post_count: number;
    likes_count: number;
  };
}
