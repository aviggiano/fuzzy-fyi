import { JobStatus } from "@prisma/client";
import { type Prisma } from "@prisma/client";
import * as ec2 from "@services/ec2";
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@services/prisma";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const handlers: Record<string, any> = {
    GET,
    POST,
  };
  return handlers[req.method as string](req, res);
}

async function POST(request: NextApiRequest, response: NextApiResponse) {
  const body: Prisma.JobCreateInput & {
    projectId: string;
    instanceType: string;
  } = JSON.parse(request.body);

  const instanceId = await ec2.runInstance({
    instanceType: body.instanceType,
    userData: Buffer.from(
      [
        `#!/usr/bin/env bash`,
        `set -ux`,
        `sudo su ubuntu -s /home/ubuntu/runner.sh`,
      ].join("\n")
    ).toString("base64"),
  });

  const job = await prisma.job.create({
    data: {
      ref: body.ref,
      cmd: body.cmd,
      instanceType: body.instanceType,
      project: {
        connect: {
          id: body.projectId,
        },
      },
      instanceId: instanceId,
      status: JobStatus.PROVISIONED,
    },
  });

  response.status(200).json(job);
}

async function GET(request: NextApiRequest, response: NextApiResponse) {
  const jobs = await prisma.job.findMany({
    include: {
      project: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  response.status(200).json(jobs);
}
