import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@services/prisma";
import { getApiKeyOrThrow } from "@services/auth";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const handlers: Record<string, any> = {
    GET,
    POST,
  };
  return handlers[req.method as string](req, res);
}

async function POST(request: NextApiRequest, response: NextApiResponse) {
  await getApiKeyOrThrow(request);
  const { body } = request;

  const project = await prisma.project.create({
    data: {
      ...body,
    },
  });

  response.status(200).json(project);
}

async function GET(request: NextApiRequest, response: NextApiResponse) {
  const apiKey = await getApiKeyOrThrow(request);
  const templates = await prisma.project.findMany({
    where: {
      organization: {
        apiKey,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  response.status(200).json(templates);
}
