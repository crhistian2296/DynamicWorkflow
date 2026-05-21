import { PrismaClient } from "@prisma/client";

const createPrismaClient = () => new PrismaClient();

type PrismaClientSingleton = ReturnType<typeof createPrismaClient>;

declare const globalThis: {
  prismaGlobal: PrismaClientSingleton;
} & typeof global;

const getClient = (): PrismaClientSingleton => {
  if (!globalThis.prismaGlobal) {
    globalThis.prismaGlobal = createPrismaClient();
  }
  return globalThis.prismaGlobal;
};

const prisma = new Proxy({} as PrismaClientSingleton, {
  get(_, prop) {
    return (getClient() as unknown as Record<string | symbol, unknown>)[prop];
  },
});

export default prisma;
