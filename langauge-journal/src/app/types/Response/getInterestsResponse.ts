export interface IGetInterestsResponse {
  data?: IInterest[];
  message: string;
  boolean: true;
}
export enum InterestType {
  Interest = 'interest',
}

export interface IInterest {
  name: string;
  interest_id: number;
  type: 'interest';
}
