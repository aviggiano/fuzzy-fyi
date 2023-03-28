import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@services/prisma";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const handlers: Record<string, any> = {
    GET,
    PATCH,
  };
  return handlers[req.method as string](req, res);
}

async function GET(request: NextApiRequest, response: NextApiResponse) {
  const { query } = request;
  const template = await prisma.template.findUniqueOrThrow({
    where: {
      id: query.id?.toString(),
    },
    include: {
      project: true,
    },
  });
  response.status(200).json(template);
}

async function PATCH(request: NextApiRequest, response: NextApiResponse) {
  const { body, query } = request;

  const template = await prisma.template.update({
    data: {
      ...body,
    },
    where: {
      id: query.id?.toString(),
    },
  });
  response.status(200).json(template);
}