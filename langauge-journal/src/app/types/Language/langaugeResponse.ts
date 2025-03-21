export interface ILanguageResponse {
  data: ILanguage[];
}

export interface ILanguage {
  language_id: number;
  name: string;
  code?: string;
}

export interface IUserLanguage {
  language_id: number;
  name: string;
  proficiency: string;
  type?: string;
  code?: string;
}
