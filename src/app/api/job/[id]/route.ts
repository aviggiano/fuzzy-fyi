import { JobStatus, PrismaClient } from "@prisma/client";
import { type Prisma } from "@prisma/client";
import * as ec2 from "@app/services/ec2";

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: Prisma.JobSelect }
) {
  const projects = await prisma.job.findUniqueOrThrow({
    where: {
      id: params.id?.toString(),
    },
  });
  return new Response(JSON.stringify(projects));
}

export async function DELETE(
  request: Request,
  { params }: { params: Prisma.JobSelect }
) {
  const job = await prisma.job.findUniqueOrThrow({
    where: {
      id: params.id?.toString(),
    },
  });

  await ec2.terminateInstance({
    instanceId: job.instanceId,
  });

  const updatedJob = await prisma.job.update({
    where: {
      id: job.id,
    },
    data: {
      status: JobStatus.DEPROVISIONED,
    },
  });

  return new Response(JSON.stringify(updatedJob));
}
