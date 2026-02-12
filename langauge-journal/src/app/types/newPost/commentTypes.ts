export interface INewComment {
  content: string;
  postId: number;
  comment_id: number;
}

export interface IUpdatedCommentResponse {
  data: INewComment;
  message: string;
  success: boolean;
}

export interface IPostComments {
  comment_id: number;
  post_id: number;
  user_id: number;
  username: string;
  content: string;
  created_at?: Date;
  updated_at?: Date;
  profile_photo_url: string;
}

export interface IUpdatedPostComment {
  postId: number;
  content: string;
  updated_at?: Date;
}

export interface IResponseUpdatedComment {
  message: string;
  success: boolean;
  data: IPostComments;
}

export interface IPostCommentsResponse {
  message: string;
  success: boolean;
  data: IPostComments[];
}

export interface IUpdatedPostCommentResponse {
  data: IUpdatedPostComment[];
  message: string;
  success: boolean;
}
