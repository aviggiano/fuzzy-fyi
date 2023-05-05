import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@services/prisma";
import { authOrganization } from "@services/auth";
import { config } from "@config";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const handlers: Record<string, any> = {
    GET,
    POST,
  };
  return handlers[req.method as string](req, res);
}

async function POST(request: NextApiRequest, response: NextApiResponse) {
  await authOrganization(request);
  const { body } = request;
  const amiId = body.amiId || config.aws.ec2.amiId;

  const template = await prisma.template.create({
    data: {
      ...body,
      amiId,
    },
  });

  response.status(200).json(template);
}

async function GET(request: NextApiRequest, response: NextApiResponse) {
  const organization = await authOrganization(request);
  const templates = await prisma.template.findMany({
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
  response.status(200).json(templates);
}
