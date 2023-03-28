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
  const { body } = request;

  const template = await prisma.template.create({
    data: {
      ...body,
    },
  });

  response.status(200).json(template);
}

async function GET(request: NextApiRequest, response: NextApiResponse) {
  const templates = await prisma.template.findMany({
    include: {
      project: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  response.status(200).json(templates);
}
