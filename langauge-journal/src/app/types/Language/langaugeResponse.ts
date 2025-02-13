export interface ILanguageResponse {
  data: ILanguage[];
}

export interface ILanguage {
  language_id: number;
  name: string;
  code?: string;
}
