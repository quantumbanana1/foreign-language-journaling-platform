import { IInterest } from '../Response/getInterestsResponse';

export interface INewPostRequest {
  basicInfo: {
    title: string;
    language: string;
    interests: {
      interest_id: number;
      name: string;
      type: string;
    }[];
  };
  post_info: {
    data: string;
    image: string;
  };
  postContent: {
    content: {
      changingThisBreaksApplicationSecurity: string;
    };
  };
}

interface langaugePost {
  language_id: number;
  name: string;
  code: string;
  proficiency: string;
}

interface Post {
  post_id: number;
  language: langaugePost;
  post_content: string;
  title: string;
  data: string;
}

interface User {
  username: string;
}

export interface NewPostResponse {
  post: Post;
  interests: IInterest[];
  user: User;
}

export interface INewPostResponse extends INewPostRequest {}
