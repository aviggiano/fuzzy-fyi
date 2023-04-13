import { JobStatus } from "@prisma/client";
import * as ec2 from "@services/ec2";
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@services/prisma";
import * as github from "@services/github";
import { config } from "@config";
import { getJobWithSignedUrls } from "@services/jobUtils";
import { authOrganization } from "@services/auth";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const handlers: Record<string, any> = {
    GET,
    POST,
  };
  return handlers[req.method as string](req, res);
}

async function POST(request: NextApiRequest, response: NextApiResponse) {
  const { body } = request;
  const organization = await authOrganization(request);

  const template = body.templateId
    ? await prisma.template.findFirst({
        where: {
          id: body.templateId.toString(),
        },
      })
    : null;

  const instanceId = await ec2.runInstance({
    instanceType: body.instanceType || template?.instanceType!,
    userData: Buffer.from(
      [
        `#!/usr/bin/env bash`,
        `set -u`,
        `export X_API_KEY=${organization?.apiKey}`,
        `export AWS_ACCESS_KEY_ID=${config.aws.ec2.accessKeyId}`,
        `export AWS_SECRET_ACCESS_KEY=${config.aws.ec2.secretAccessKey}`,
        `set -x`,
        `aws s3 cp s3://${config.aws.s3.bucket}/infrastructure/runner.sh /home/ubuntu/runner.sh`,
        `chmod 755 /home/ubuntu/runner.sh`,
        `sudo -Eu ubuntu bash /home/ubuntu/runner.sh`,
      ].join("\n")
    ).toString("base64"),
  });

  const job = await prisma.job.create({
    data: {
      ref: body.ref,
      cmd: body.cmd || template?.cmd!,
      instanceType: body.instanceType || template?.instanceType!,
      pullRequestNumber: body.pullRequestNumber,
      project: {
        connect: {
          id: body.projectId || template?.projectId!,
        },
      },
      ...(template
        ? {
            template: {
              connect: {
                id: template.id,
              },
            },
          }
        : {}),
      instanceId,
      status: JobStatus.STARTED,
    },
    include: {
      project: true,
    },
  });

  await github.createComment(job);

  response.status(200).json(job);
}

async function GET(request: NextApiRequest, response: NextApiResponse) {
  const organization = await authOrganization(request);
  const jobs = await prisma.job.findMany({
    include: {
      project: true,
    },
    where: {
      project: {
        organization: {
          apiKey: organization?.apiKey,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  const jobsWithLogs = await Promise.all(jobs.map(getJobWithSignedUrls));
  response.status(200).json(jobsWithLogs);
}
