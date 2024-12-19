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
