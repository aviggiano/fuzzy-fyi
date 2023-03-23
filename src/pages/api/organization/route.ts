import { type Prisma } from "@prisma/client";
import prisma from "@services/prisma";

export async function POST(request: Request) {
  const body: Prisma.OrganizationCreateInput = await request.json();

  const organization = await prisma.organization.create({
    data: {
      name: body.name,
    },
  });
  return new Response(JSON.stringify(organization));
}

export async function GET(request: Request) {
  const organizations = await prisma.organization.findMany();
  return new Response(JSON.stringify(organizations));
}
