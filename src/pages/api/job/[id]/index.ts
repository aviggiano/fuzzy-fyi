import type { NextApiRequest, NextApiResponse } from "next";
import * as ec2 from "@services/ec2";
import * as github from "@services/github";
import prisma from "@services/prisma";
import { getJobWithSignedUrls } from "@services/jobUtils";
import { getApiKeyOrThrow } from "@services/auth";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const handlers: Record<string, any> = {
    GET,
    PATCH,
    DELETE,
  };
  return handlers[req.method as string](req, res);
}

async function GET(request: NextApiRequest, response: NextApiResponse) {
  const { query } = request;
  await getApiKeyOrThrow(request);

  const job = await prisma.job.findUniqueOrThrow({
    where: {
      id: query.id?.toString(),
    },
    include: {
      project: true,
    },
  });

  const jobWithLogs = await getJobWithSignedUrls(job);
  response.status(200).json(jobWithLogs);
}

async function PATCH(request: NextApiRequest, response: NextApiResponse) {
  const { query, body } = request;
  await getApiKeyOrThrow(request);

  const job = await prisma.job.update({
    data: {
      ...body,
    },
    where: {
      id: query.id?.toString(),
    },
    include: {
      project: true,
    },
  });
  await github.createComment(job);
  response.status(200).json(job);
}

async function DELETE(request: NextApiRequest, response: NextApiResponse) {
  const { query } = request;
  await getApiKeyOrThrow(request);

  let job = await prisma.job.findUniqueOrThrow({
    where: {
      id: query.id?.toString(),
    },
    include: {
      project: true,
    },
  });

  await ec2.terminateInstance({
    instanceId: job.instanceId,
  });

  if (!job.status.startsWith("FINISHED")) {
    job = await prisma.job.update({
      data: {
        status: "STOPPED",
      },
      where: {
        id: query.id?.toString(),
      },
      include: {
        project: true,
      },
    });
    await github.createComment(job);
  }

  response.status(200).json(job);
}
