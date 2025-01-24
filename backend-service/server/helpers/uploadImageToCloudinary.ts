import { FastifyInstance } from "fastify";
import { MultipartFile } from "@fastify/multipart";
import { pipeline } from "stream/promises";

export default interface cloudinaryResponseImage {
  url?: string;
  id?: string;
}

export async function uploadToCloudinary(
  app: FastifyInstance,
  data: MultipartFile,
): Promise<cloudinaryResponseImage> {
  return new Promise((resolve, reject) => {
    const stream = app.cloudinary.uploader.upload_stream(
      {
        folder: "profile-pictures",
        resource_type: "image",
        use_filename: false,
        unique_filename: false,
        asset_folder: "profile-picture",
        overwrite: true,
        invalidate: true,
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve({
            url: result?.secure_url,
            id: result?.public_id,
          });
        }
      },
    );

    pipeline(data.file, stream);
    return stream;
  });
}
