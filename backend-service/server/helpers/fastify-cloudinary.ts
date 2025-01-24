import type { ConfigOptions } from "cloudinary";
import type { v2 as Cloudinary } from "cloudinary";

import plugin from "fastify-plugin";
import { v2 as cloudinary } from "cloudinary";
import { FastifyInstance, FastifyPluginOptions } from "fastify";

type FastifyCloudinaryOptions = ConfigOptions;

declare module "fastify" {
  interface FastifyInstance {
    cloudinary: typeof Cloudinary;
  }
}

export const fastifyCloudinaryWithAsync = plugin<FastifyCloudinaryOptions>(
  async (app: FastifyInstance, opts: FastifyPluginOptions) => {
    const cloudinaryObj = {
      cloud_name: opts.cloud_name,
      api_key: opts.api_key,
      api_secret: opts.api_secret,
      ...opts,
    };

    cloudinary.config(cloudinaryObj);
    app.decorate("cloudinary", cloudinary);
  },
  {
    fastify: "5.x",
    name: "fastifyCloudinary",
  },
);
