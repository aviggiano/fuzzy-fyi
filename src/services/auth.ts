import crypto from "crypto";
import prisma from "./prisma";
import { NextApiRequest } from "next";

export default function create(): string {
  return crypto.randomBytes(32).toString("hex");
}

export async function getApiKeyOrThrow(
  request: NextApiRequest
): Promise<string> {
  const apiKey = request.headers["x-api-key"] as string | undefined;
  const authId = request.headers["authid"] as string | undefined;
  if (apiKey) {
    await prisma.organization.findFirst({ where: { apiKey } });
    return apiKey;
  } else if (authId) {
    const organization = await prisma.organization.findFirst({
      where: {
        users: {
          some: {
            authId,
          },
        },
      },
    });
    if (organization) {
      return organization.apiKey;
    } else {
      throw new Error("Not found");
    }
  } else {
    throw new Error("Unauthorized");
  }
}
