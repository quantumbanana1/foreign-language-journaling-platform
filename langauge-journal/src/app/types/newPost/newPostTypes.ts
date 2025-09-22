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
  profile_photo_url: string;
}

export interface NewPostResponse {
  data: iPostUploadResponse;
  success: boolean;
  message: string;
}

export interface iPostUploadResponse {
  comment_id: number;
  post_id: number;
  user_id: number;
  content: string;
  username: string;
  profile_photo_url: string;
}

export interface INewPostResponse extends INewPostRequest {}
