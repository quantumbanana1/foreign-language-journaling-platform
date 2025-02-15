export interface IGetInterestsResponse {
  data?: IInterest[];
  message: string;
}

export interface IInterest {
  name: string;
  interest_id: number;
}
