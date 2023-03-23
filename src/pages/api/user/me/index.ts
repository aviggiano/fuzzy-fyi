import { supabase } from "@services/supabase";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const token = req.headers.token as string;

  const { data: user, error } = await supabase.auth.getUser(token);

  if (error) return res.status(401).json({ error: error.message });
  return res.status(200).json(user);
}
