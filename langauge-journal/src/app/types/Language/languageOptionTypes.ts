export enum LevelLanguage {
  Beginner = 'beginner',
  Intermediate = 'intermediate',
  Advanced = 'advanced',
  Native = 'native',
  Default = 'Select Level',
}

export interface IChooseLanguageWithLevel {
  proficiency: LevelLanguage;
  name: string;
  language_id: number;
  type: 'language';
}

export interface IResponseUserLanguages {
  data: IChooseLanguageWithLevel[];
}

export interface IDeleteLanguageResponse {
  message: string;
  success: boolean;
}
