export interface IFollowingUserResponse {
  message: string;
  success: boolean;
  followingStatus: boolean;
}

export interface IUnfollowingUserResponse extends IFollowingUserResponse {}

export interface IisUserFollowingResponse extends IUnfollowingUserResponse {
  isSameUser: boolean;
}
