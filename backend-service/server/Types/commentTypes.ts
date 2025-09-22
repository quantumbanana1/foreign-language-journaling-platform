import { FastifyRequest } from "fastify";

export interface INewComment {
  content: {
    changingThisBreaksApplicationSecurity: string;
  };
  postId: number;
}

export interface IPost {}

export interface IUpdatedPost {
  content: string;
  postId: number;
  comment_id: number;
}

interface IDeleteCommentRequest {
  comment_id: number;
  post_id: number;
}

export type MyRequestDeleteComment = FastifyRequest<{
  Querystring: IDeleteCommentRequest;
}>;
