import fp from "fastify-plugin";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { MultipartFile } from "@fastify/multipart";
import cloudinaryResponseImage, {
  uploadToCloudinary,
} from "../helpers/uploadImageToCloudinary";
import { updateUserProfilePhoto } from "../helpers/updateProfileUrl";

export default fp(async function uploadPostImage(app: FastifyInstance) {
  async function onUploadPostImage(
    request: FastifyRequest,
    reply: FastifyReply,
  ) {
    const data: MultipartFile = await request.file();

    try {
      const image: cloudinaryResponseImage = await uploadToCloudinary(
        app,
        data,
        "post-images",
      );

      return reply.status(200).send({
        url: image.url,
        message: "image upload successfully",
        success: true,
      });
    } catch (error) {
      console.error(error);
      reply.status(500).send({
        message: "Error uploading files",
      });
    }
  }

  app.decorate("uploadPostImagePlugin", onUploadPostImage);
});
