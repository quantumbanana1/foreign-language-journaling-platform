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
