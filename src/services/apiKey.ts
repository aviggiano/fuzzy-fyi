import crypto from "crypto";
import prisma from "./prisma";
import { NextApiRequest } from "next";

export default function create(): string {
  return crypto.randomBytes(32).toString("hex");
}

export async function getOrThrow(request: NextApiRequest): Promise<string> {
  const apiKey = request.headers["x-api-key"] as string;
  if (await prisma.organization.findFirstOrThrow({ where: { apiKey } })) {
    return apiKey;
  } else {
    return "";
  }
}
