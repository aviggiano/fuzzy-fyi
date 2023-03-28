import { JobStatus } from "@prisma/client";
import { type Prisma } from "@prisma/client";
import * as ec2 from "@services/ec2";
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@services/prisma";
import * as s3 from "@services/s3";
import * as github from "@services/github";
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
  } = request.body;

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
        `aws s3 cp s3://${config.aws.s3.bucket}/infrastructure/runner.sh /home/ubuntu/runner.sh`,
        `chmod 755 /home/ubuntu/runner.sh`,
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
      ...(template
        ? {
            template: {
              connect: {
                id: body.templateId,
              },
            },
          }
        : {}),
      instanceId: instanceId,
      status: JobStatus.STARTED,
    },
    include: {
      project: true,
    },
  });

  if (job.pullRequestNumber) {
    await github.createComment(job, job.pullRequestNumber);
  }

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
        const coverageUrl = await s3.getSignedUrl(
          job.coverageUrl!.replace(`${config.backend.outputUrl}/`, "")
        );
        const logsUrl = await s3.getSignedUrl(
          job.logsUrl!.replace(`${config.backend.outputUrl}/`, "")
        );
        return {
          ...job,
          coverageUrl,
          logsUrl,
        };
      } else {
        return job;
      }
    })
  );
  response.status(200).json(jobsWithLogs);
}
