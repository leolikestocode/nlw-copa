import { FastifyInstance } from "fastify"
import { z } from "zod"
import ShortUniqueId from "short-unique-id"

import { prisma } from "../lib/prisma"

export async function poolRoutes(fastify: FastifyInstance) {
  fastify.get("/pools/count", async () => {
    return await prisma.pool.count()
  })

  fastify.post("/pools", async (req, res) => {
    const createPoolBody = z.object({
      title: z.string(),
    })

    const { title } = createPoolBody.parse(req.body)
    const generate = new ShortUniqueId({ length: 6 })
    const code = String(generate()).toUpperCase()

    await prisma.pool.create({
      data: {
        title,
        code,
      },
    })

    return res.status(201).send({ code })
  })
}
