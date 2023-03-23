import { type Prisma } from "@prisma/client";
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
  const body: Prisma.ProjectCreateInput & { organizationId: string } =
    JSON.parse(request.body);

  const project = await prisma.project.create({
    data: {
      name: body.name,
      url: body.url,
      organizationId: body.organizationId,
    },
  });
  return response.status(200).json(project);
}

async function GET(request: NextApiRequest, response: NextApiResponse) {
  const projects = await prisma.project.findMany();
  return response.status(200).json(projects);
}
