import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@services/prisma";
import { JobStatus } from "@prisma/client";
import { colorMap, label } from "@services/jobUtils";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const handlers: Record<string, any> = {
    GET,
  };
  return handlers[req.method as string](req, res);
}

async function GET(request: NextApiRequest, response: NextApiResponse) {
  const { query } = request;

  const job = await prisma.job.findFirst({
    where: {
      projectId: query.projectId?.toString(),
      ...(query.ref
        ? {
            ref: query.ref.toString(),
          }
        : {}),
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const color = colorMap[job!.status];
  const status = label[job!.status];

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="92" height="20" role="img" aria-label="fuzzy: ${status}"><title>fuzzy: ${status}</title><linearGradient id="s" x2="0" y2="100%"><stop offset="0" stop-color="#bbb" stop-opacity=".1"/><stop offset="1" stop-opacity=".1"/></linearGradient><clipPath id="r"><rect width="92" height="20" rx="3" fill="#fff"/></clipPath><g clip-path="url(#r)"><rect width="39" height="20" fill="#555"/><rect x="39" width="53" height="20" fill="${color}"/><rect width="92" height="20" fill="url(#s)"/></g><g fill="#fff" text-anchor="middle" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" text-rendering="geometricPrecision" font-size="110"><text aria-hidden="true" x="205" y="150" fill="#010101" fill-opacity=".3" transform="scale(.1)" textLength="290">fuzzy</text><text x="205" y="140" transform="scale(.1)" fill="#fff" textLength="290">fuzzy</text><text aria-hidden="true" x="645" y="150" fill="#010101" fill-opacity=".3" transform="scale(.1)" textLength="430">${status}</text><text x="645" y="140" transform="scale(.1)" fill="#fff" textLength="430">${status}</text></g></svg>`;

  response.setHeader("Content-Type", "text/html; charset=utf-8");
  response.write(svg);
  response.end();
}
