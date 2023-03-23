import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { config } from "@config";

const prisma = new PrismaClient();

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const handlers: Record<string, any> = {
    GET,
  };
  return handlers[req.method as string](req, res);
}

async function GET(request: NextApiRequest, response: NextApiResponse) {
  const { query } = request;
  const [job] = await prisma.job.findMany({
    where: {
      instanceId: query.instanceId?.toString(),
    },
    include: {
      project: true,
    },
  });
  response.status(200).json({
    ...job,
    aws: {
      s3: {
        bucket: config.aws.s3.bucket,
      },
    },
  });
}
