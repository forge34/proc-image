import { PrismaClient } from "../generated/prisma/client.js";

export const prisma: PrismaClient = new PrismaClient({
  omit: {
    user: {
      password: true,
    },
  },
  // log: [{ emit: "stdout", level: "query" }],
});

