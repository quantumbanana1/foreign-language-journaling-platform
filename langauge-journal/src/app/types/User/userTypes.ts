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
  profile_photo_url: string;
  description: string;
  friends: string[];
}

export interface IUserAttrToFetch {
  username?: boolean;
  email?: boolean;
  password?: boolean;
  created_at?: boolean;
  updated_at?: boolean;
  profile_photo_url?: boolean;
  description?: boolean;
  friends?: boolean;
}

export interface userLogging {
  email: string;
  password: string;
}

export interface IUserProfile extends IUserAttributes {
  user_learns: string[];
  user_speaks: string[];
}
