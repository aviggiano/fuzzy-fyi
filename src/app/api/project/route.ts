import { PrismaClient } from "@prisma/client";
import { type Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const body: Prisma.ProjectCreateInput & { organizationId: string } =
    await request.json();

  const project = await prisma.project.create({
    data: {
      name: body.name,
      url: body.url,
      organizationId: body.organizationId,
    },
  });
  return new Response(JSON.stringify(project));
}

export async function GET(request: Request) {
  const projects = await prisma.project.findMany();
  return new Response(JSON.stringify(projects));
}
