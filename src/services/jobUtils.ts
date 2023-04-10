import { LabelProps } from "@components/Label";
import { Job, JobStatus, Project } from "@prisma/client";
import { intervalToDuration } from "date-fns";
import * as s3 from "@services/s3";
import { config } from "@config";

export async function getJobWithSignedUrls(
  job: Job & { project: Project }
): Promise<Job & { project: Project }> {
  if (job.status.startsWith("FINISHED")) {
    const coverageUrl = await s3.getSignedUrl(
      job.coverageUrl!.replace(`${config.backend.outputUrl}/`, "")
    );
    const logsUrl = await s3.getSignedUrl(
      job.logsUrl!.replace(`${config.backend.outputUrl}/`, "")
    );
    return {
      ...job,
      coverageUrl,
      logsUrl,
    };
  } else {
    return job;
  }
}

export function formatTimeElapsed(job: Job): string {
  const end =
    job.status.startsWith("FINISHED") || job.status === "STOPPED"
      ? new Date(job.updatedAt)
      : new Date();
  const start = new Date(job.createdAt);
  const ms = end.getTime() - start.getTime();
  const duration = intervalToDuration({ start: 0, end: ms });

  const zeroPad = (num: number | undefined) => String(num).padStart(2, "0");

  const formatted = [
    `${zeroPad(duration.hours || 0)}:`,
    `${zeroPad(duration.minutes || 0)}:`,
    `${zeroPad(duration.seconds || 0)}`,
  ]
    .filter(Boolean)
    .join("");

  return formatted;
}

export function getEC2Cost(job: Job): string {
  const end =
    job.status.startsWith("FINISHED") || job.status === "STOPPED"
      ? new Date(job.updatedAt)
      : new Date();
  const start = new Date(job.createdAt);
  const ms = end.getTime() - start.getTime();

  const index = config.aws.ec2.instanceTypes.indexOf(job.instanceType);
  const hourlyCost = Number(config.aws.ec2.instanceHourlyCosts[index]);

  const totalCost = (ms * hourlyCost) / (1000 * 60 * 60);
  const totalCostRoundUp = +(Math.ceil(Number(`${totalCost}e+2`)) + "e-2");

  return `$${totalCostRoundUp}`;
}

export const color: Record<JobStatus, LabelProps["color"]> = {
  STARTED: "info",
  RUNNING: "info",
  FINISHED_SUCCESS: "success",
  FINISHED_ERROR: "error",
  STOPPED: "warning",
};

export const colorMap: Record<JobStatus, string> = {
  STARTED: "#007ec6",
  RUNNING: "#007ec6",
  FINISHED_SUCCESS: "#97ca00",
  FINISHED_ERROR: "#e05d44",
  STOPPED: "#dfb317",
};

export const label: Record<JobStatus, string> = {
  STARTED: "Started",
  RUNNING: "Running",
  FINISHED_SUCCESS: "Success",
  FINISHED_ERROR: "Error",
  STOPPED: "Stopped",
};
