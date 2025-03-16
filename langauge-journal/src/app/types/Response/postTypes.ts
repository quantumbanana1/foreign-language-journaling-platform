import { IUserLanguage } from '../Language/langaugeResponse';
import { IInterest } from './getInterestsResponse';

export interface IPostObject {
  post_id: number;
  username: string;
  image_url: string | null;
  time_created: string;
  like_count: number;
  post_content: string;
  title: string;
  interests: IInterest[];
  language_object: IUserLanguage;
}

export interface PostResponse {
  data: IPostObject;
  message: string;
}
