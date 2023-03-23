import { JobStatus, PrismaClient } from "@prisma/client";
import { type Prisma } from "@prisma/client";
import * as ec2 from "../../services/ec2";
import { config } from "@app/config";

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
        `sudo su ubuntu -s /tmp/runner.sh`,
      ].join("\n")
    ).toString("base64"),
  });

  const job = await prisma.job.create({
    data: {
      ref: body.ref,
      cmd: body.cmd,
      project: {
        connect: {
          id: body.projectId,
        },
      },
      instanceId: instanceId,
      status: JobStatus.PROVISIONED,
    },
  });

  return new Response(JSON.stringify(job));
}

export async function GET(request: Request) {
  const jobs = await prisma.job.findMany({
    include: {
      project: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return new Response(JSON.stringify(jobs));
}
