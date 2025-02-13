export interface ILanguage {
  name: string;
  language_id: number;
  proficiency: string;
  type: string;
}

export interface IUploadLanguageRequest {
  data: ILanguage[];
}
