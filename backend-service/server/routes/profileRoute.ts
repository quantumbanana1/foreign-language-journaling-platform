import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";

interface RegisterBody {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const registerUserSchema = {
  type: "object",
  required: ["username", "password", "confirmPassword", "email"],
  properties: {
    username: { type: "string", minLength: 5, maxLength: 15 },
    email: { type: "string", format: "email" },
    password: {
      type: "string",
      minLength: 8,
      pattern: "(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*#?&^_-]).{8,}",
      writeOnly: true,
    },
    confirmPassword: {
      type: "string",
      minLength: 8,
      pattern: "(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*#?&^_-]).{8,}",
      writeOnly: true,
    },
  },
};

export default async function registerRoute(app: FastifyInstance) {
  //   app.post(
  //     "/register",
  //     registerUser,
  //     async (request: FastifyRequest, reply: FastifyReply) => {
  //       try {
  //         const { username, email, password } = request.body as RegisterBody;
  //
  //         if (!username || !email || !password) {
  //           return reply
  //             .status(400)
  //             .send({ message: "All fields are required." });
  //         }
  //       } catch (error) {
  //         reply.status(500).send({
  //           error: error.message,
  //           message: "registerRoute failed",
  //         });
  //       }
  //     },
  //   );

  async function onRegisterRoute(request: FastifyRequest, reply: FastifyReply) {
    try {
      const bodyValidationFunction =
        request.compileValidationSchema(registerUserSchema);
      // const validationResult = bodyValidationFunction(request.body);
      // console.log(validationResult);
      if (bodyValidationFunction(request.body) !== true) {
        return reply.status(400).send({
          message: "Invalid request body",
          errors: bodyValidationFunction.errors,
        });
      }
      const { username, email, password, confirmPassword } =
        request.body as RegisterBody;

      if (!username || !email || !password) {
        return reply.status(400).send({ message: "All fields are required." });
      }
    } catch (error) {
      reply.status(500).send({
        error: error.message,
        message: "registerRoute failed",
      });
    }
  }

  app.route({
    method: "POST",
    url: "/registration",
    handler: onRegisterRoute,
  });

  // app.get("/register", async (request: FastifyRequest, reply: FastifyReply) => {
  //   try {
  //     reply.send({ message: "Register route working" });
  //   } catch (error) {
  //     reply.status(500).send({
  //       error: error.message,
  //       message: "registerRoute failed",
  //     });
  //   }
  // });
}
