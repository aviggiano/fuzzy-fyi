import { PrismaClient } from "@prisma/client";
import { type Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const body: Prisma.JobCreateInput & { projectId: string } =
    await request.json();

  const job = await prisma.job.create({
    data: {
      ref: body.ref,
      cmd: body.cmd,
      projectId: body.projectId,
    },
  });
  return new Response(JSON.stringify(job));
}

export async function GET(request: Request) {
  const projects = await prisma.job.findMany();
  return new Response(JSON.stringify(projects));
}
