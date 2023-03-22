import { JobStatus, PrismaClient } from "@prisma/client";
import { type Prisma } from "@prisma/client";
import * as ec2 from "../../services/ec2";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const body: Prisma.JobCreateInput & {
    projectId: string;
    instanceType: string;
  } = await request.json();

  const project = await prisma.project.findUniqueOrThrow({
    where: {
      id: body.projectId,
    },
  });

  const instanceId = await ec2.runInstance({
    instanceType: body.instanceType,
    userData: Buffer.from(
      [
        `#!/usr/bin/env bash`,
        `set -ux`,
        `git clone ${project.url}`,
        `cd ${project.name}`,
        `git checkout ${body.ref}`,
        body.cmd,
        // "sudo shutdown -h now",
      ].join("\n")
    ).toString("base64"),
  });

  const job = await prisma.job.create({
    data: {
      ref: body.ref,
      cmd: body.cmd,
      projectId: body.projectId,
      instanceId: instanceId,
      status: JobStatus.PROVISIONED,
    },
  });

  return new Response(JSON.stringify(job));
}

export async function GET(request: Request) {
  const projects = await prisma.job.findMany({
    include: {
      project: true,
    },
  });
  return new Response(JSON.stringify(projects));
}
