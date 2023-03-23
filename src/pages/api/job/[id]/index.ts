import { JobStatus } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import * as ec2 from "@services/ec2";
import prisma from "@services/prisma";

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
  const job = await prisma.job.findUniqueOrThrow({
    where: {
      id: query.id?.toString(),
    },
    include: {
      project: true,
    },
  });
  response.status(200).json(job);
}

async function PATCH(request: NextApiRequest, response: NextApiResponse) {
  const { body, query } = request;

  const job = await prisma.job.update({
    data: {
      ...body,
    },
    where: {
      id: query.id?.toString(),
    },
  });
  response.status(200).json(job);
}

async function DELETE(request: NextApiRequest, response: NextApiResponse) {
  const { query } = request;
  const job = await prisma.job.findUniqueOrThrow({
    where: {
      id: query.id?.toString(),
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

  response.status(200).json(updatedJob);
}
