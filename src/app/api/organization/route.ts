import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function GET(request: Request) {
  const organizations = await prisma.organization.findMany();
  return new Response(JSON.stringify(organizations));
}
