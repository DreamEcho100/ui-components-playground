import { PrismaClient } from "@prisma/client";

const globalForPrisma =
  /** @type {{ prisma: import("@prisma/client").PrismaClient | undefined; }} */ (
    /** @type {unknown} */ (globalThis)
  );

const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export { prisma };
