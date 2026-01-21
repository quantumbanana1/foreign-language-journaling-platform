import { IInterest } from './Response/getInterestsResponse';
import { ILanguage } from './Language/langaugeResponse';

export interface PostSearchParams {
  searchResult?: string;
  followedAuthors: boolean;
  needsFeedback: boolean;
  myLanguages: boolean;
  commentedPosts: boolean;
  savedPosts: boolean;
  clearFilters: boolean;
  status: string;
  interests: IInterest[];
  languages: ILanguage[];
}
