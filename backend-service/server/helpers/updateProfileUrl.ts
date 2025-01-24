import { FastifyInstance } from "fastify";

interface dbResponse {
  profile_photo_url: string;
}

export async function updateUserProfilePhoto(
  app: FastifyInstance,
  userId: number,
  url: string,
): Promise<dbResponse> {
  const client = await app.pg.connect();
  try {
    const query =
      "UPDATE Users SET profile_photo_url = $1 WHERE id = $2 RETURNING profile_photo_url";
    const values = [url, userId];
    const result = await client.query(query, values);
    client.release();
    return result.rows[0];
  } catch (error) {
    return error;
  }
}
