import crypto from "crypto";
import prisma from "./prisma";
import { NextApiRequest } from "next";
import { supabase } from "./supabase";

export default function create(): string {
  return crypto.randomBytes(32).toString("hex");
}

export async function getApiKeyOrThrow(
  request: NextApiRequest
): Promise<string> {
  const apiKey = request.headers["x-api-key"] as string | undefined;
  const authorization = request.headers["authorization"] as string | undefined;
  if (apiKey) {
    await prisma.organization.findFirst({ where: { apiKey } });
    return apiKey;
  } else if (authorization) {
    const accessToken = authorization.split("Bearer ")[1];
    const { data } = await supabase.auth.getUser(accessToken);
    const organization = await prisma.organization.findFirst({
      where: {
        users: {
          some: {
            authId: data.user?.id,
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
