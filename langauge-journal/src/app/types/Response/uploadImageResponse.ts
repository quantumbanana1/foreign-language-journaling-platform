export interface uploadImageResponse extends failedUploadImageResponse {
  url: string;
  message: string;
  success: boolean;
}

export interface failedUploadImageResponse {
  message: string;
}
