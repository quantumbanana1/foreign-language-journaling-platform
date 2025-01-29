export interface uploadImageResponse extends failedUploadImageResponse {
  url: string;
}

export interface failedUploadImageResponse {
  message: string;
}
