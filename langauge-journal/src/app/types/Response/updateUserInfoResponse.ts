import { IUserAttributes } from '../User/userTypes';

export interface IUserUpdateResponse {
  message: string;
  response: IUserAttributes;
}

export interface IUserFailedUpdateResponse {
  message: string;
}
