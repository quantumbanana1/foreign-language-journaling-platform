export interface IRUser {
  id: number;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface INewUser {
  username: string;
  email: string;
  password: string;
  unique_key: string;
}

export interface IUserAttributes {
  username?: string;
  email?: string;
  profile_photo_url?: string;
  description?: string;
  city?: string;
  country?: string;
  name?: string;
}
