export interface INewComment {
  content: string;
  postId: number;
}

export interface IPostComments {
  id: number;
  post_id: number;
  user_id: number;
  username: string;
  content: string;
  created_at?: Date;
  updated_at?: Date;
  profile_photo_url: string;
}

export interface IPostCommentsResponse {
  message: string;
  success: boolean;
  data: IPostComments[];
}
