import { type Prisma } from "@prisma/client";
import prisma from "@services/prisma";

export async function POST(request: Request) {
  const body: Prisma.UserCreateInput & { organizationId: string } =
    await request.json();

  const user = await prisma.user.create({
    data: {
      email: body.email,
      name: body.name,
      organizationId: body.organizationId,
    },
  });
  return new Response(JSON.stringify(user));
}

export async function GET(request: Request) {
  const users = await prisma.user.findMany({
    include: {
      organization: true,
    },
  });
  return new Response(JSON.stringify(users));
}
