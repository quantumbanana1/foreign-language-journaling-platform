import fp from "fastify-plugin";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { MultipartFile } from "@fastify/multipart";
import cloudinaryResponseImage, {
  uploadToCloudinary,
} from "../helpers/uploadImageToCloudinary";
import { updateUserProfilePhoto } from "../helpers/updateProfileUrl";

export default fp(async function uploadProfileImage(app: FastifyInstance) {
  async function onUploadProfileImage(
    request: FastifyRequest,
    reply: FastifyReply,
  ) {
    const data: MultipartFile = await request.file();

    try {
      const image: cloudinaryResponseImage = await uploadToCloudinary(
        app,
        data,
      );

      const dbresult = await updateUserProfilePhoto(
        app,
        request.session.userId,
        image.url,
      );

      return reply.status(200).send({
        url: dbresult.profile_photo_url,
      });
    } catch (error) {
      console.error(error);
      reply.status(500).send({
        message: "Error uploading files",
        uploadSuccess: false,
      });
    }
  }

  app.decorate("uploadProfileImagePlugin", onUploadProfileImage);
});
