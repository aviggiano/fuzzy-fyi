import { JobStatus } from "@prisma/client";
import { type Prisma } from "@prisma/client";
import * as ec2 from "@services/ec2";
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@services/prisma";
import * as s3 from "@services/s3";
import { config } from "@config";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const handlers: Record<string, any> = {
    GET,
    POST,
  };
  return handlers[req.method as string](req, res);
}

async function POST(request: NextApiRequest, response: NextApiResponse) {
  const body: Prisma.JobCreateInput & {
    projectId?: string;
    templateId?: string;
    instanceType: string;
  } = JSON.parse(request.body);

  const template = body.templateId
    ? await prisma.template.findFirst({
        where: {
          id: body.templateId.toString(),
        },
      })
    : null;

  const instanceId = await ec2.runInstance({
    instanceType: body.instanceType,
    userData: Buffer.from(
      [
        `#!/usr/bin/env bash`,
        `set -ux`,
        `aws s3 cp s3://${config.aws.s3.bucket}/runner/runner.sh /home/ubuntu/runner.sh`,
        `sudo su ubuntu -s /home/ubuntu/runner.sh`,
      ].join("\n")
    ).toString("base64"),
  });

  const job = await prisma.job.create({
    data: {
      ref: body.ref,
      cmd: body.cmd || template?.cmd!,
      instanceType: body.instanceType || template?.instanceType!,
      project: {
        connect: {
          id: body.projectId || template?.projectId!,
        },
      },
      instanceId: instanceId,
      status: JobStatus.STARTED,
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
  const jobsWithLogs = await Promise.all(
    jobs.map(async (job) => {
      if (job.status.startsWith("FINISHED")) {
        const keys = await s3.listObjects(`job/${job.id}/`);
        const coverage = keys.find((e) => e.endsWith(".html")) as string;
        const logs = keys.find((e) => e.endsWith("logs.txt")) as string;
        return {
          ...job,
          coverage: coverage ? await s3.getSignedUrl(coverage) : undefined,
          logs: logs ? await s3.getSignedUrl(logs) : undefined,
        };
      } else {
        return job;
      }
    })
  );
  response.status(200).json(jobsWithLogs);
}
