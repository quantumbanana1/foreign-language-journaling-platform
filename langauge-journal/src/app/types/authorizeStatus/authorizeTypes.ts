export type Status =
  | 'initial'
  | 'authenticating'
  | 'authenticated'
  | 'fail'
  | 'unauthenticated';

export interface AuthState {
  status: Status;
}
