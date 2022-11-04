import { FastifyInstance } from "fastify"
import { string, z } from "zod"
import { prisma } from "../lib/prisma"

export async function authRoutes(fastify: FastifyInstance) {
  const createUserBody = z.object({
    access_token: z.string(),
  })

  fastify.post("/users", async (req) => {
    const { access_token } = createUserBody.parse(req.body)

    const userResponse = await fetch(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    )

    const userData = await userResponse.json()
    const userInfoSchema = z.object({
      id: z.string(),
      email: z.string().email(),
      name: z.string(),
      picture: z.string().url(),
    })

    const userInfo = userInfoSchema.parse(userData)

    return { userInfo }
  })
}
