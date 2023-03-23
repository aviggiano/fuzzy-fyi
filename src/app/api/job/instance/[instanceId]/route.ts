import { JobStatus, PrismaClient } from "@prisma/client";
import { type Prisma } from "@prisma/client";
import * as ec2 from "@app/services/ec2";
import { config } from "@app/config";

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: Prisma.JobSelect }
) {
  const [job] = await prisma.job.findMany({
    where: {
      instanceId: params.instanceId?.toString(),
    },
    include: {
      project: true,
    },
  });
  return new Response(
    JSON.stringify({
      ...job,
      aws: {
        s3: {
          bucket: config.aws.s3.bucket,
        },
      },
    })
  );
}
