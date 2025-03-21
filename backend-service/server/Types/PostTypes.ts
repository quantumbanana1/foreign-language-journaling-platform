export interface INewPostRequestPayload {
  basicInfo: {
    title: string;
    language: string;
    interests: {
      interest_id: number;
      name: string;
      type: string;
    }[];
  };
  post_info: {
    data: string;
    image: string;
  };
  postContent: {
    content: {
      changingThisBreaksApplicationSecurity: string;
    };
  };
}
