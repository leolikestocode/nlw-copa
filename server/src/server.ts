import Fastify from "fastify"
import cors from "@fastify/cors"
import { poolRoutes } from "./routes/pool"
import { authRoutes } from "./routes/auth"
import { gameRoutes } from "./routes/game"
import { guessRoutes } from "./routes/guess"
import { userRoutes } from "./routes/user"
import fastifyJwt from "@fastify/jwt"

async function bootstrap() {
  const fastify = Fastify({
    logger: true,
  })

  await fastify.register(cors, {
    origin: true,
  })

  // In production, this has to be an environment variable
  await fastify.register(fastifyJwt, {
    secret: "nlw-copa",
  })

  await fastify.register(authRoutes)
  await fastify.register(gameRoutes)
  await fastify.register(guessRoutes)
  await fastify.register(poolRoutes)
  await fastify.register(userRoutes)

  await fastify.listen({ port: 3333, host: "0.0.0.0" })
}

bootstrap()
