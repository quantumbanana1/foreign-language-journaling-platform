export default interface IRUser {
  id: number;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ILUser {
  email: string;
  password: string;
}

export interface IUserAttributes {
  username: string;
  email: string;
  created_at?: Date;
  updated_at?: Date;
  profile_photo_url?: string;
  description?: string;
  city?: string;
  country?: string;
  name?: string;
}

export interface IUserAttrToFetch {
  username?: boolean;
  email?: boolean;
  password?: boolean;
  created_at?: boolean;
  profile_photo_url?: boolean;
  description?: boolean;
  city?: boolean;
  country?: boolean;
  name?: boolean;
}

export interface userLogging {
  email: string;
  password: string;
}

export interface IUserProfile extends IUserAttributes {
  user_learns: string;
  user_speaks: string;
  user_likes: string;
}

export interface IUserAttributesResponse {
  data: IUserAttributes;
  message: string;
  success: boolean;
}
