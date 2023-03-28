import { config } from "@config";
import { Octokit } from "@octokit/rest";
import { Job, Project } from "@prisma/client";
import { formatTimeElapsed, label } from "./jobUtils";

function template(job: Job): string {
  const code = (x: string) => "```" + x + "```";
  return [
    `| | |`,
    `| --- | --- |`,
    `| Job ID | [${job.id}](${config.backend.url}/dashboard/jobs/${job.id}) | `,
    `| Command | ${code(job.cmd)} |`,
    `| Instance Type | ${code(job.instanceType)} |`,
    `| Status | ${label[job.status]} |`,
    `| Elapsed | ${formatTimeElapsed(job)} |`,
  ].join("\n");
}

const octokit = new Octokit({
  auth: config.github.auth.token,
});

export async function createComment(
  job: Job & { project: Project },
  issueNumber: number | string
) {
  const [, owner, repo] = job.project.url.match(
    /.*\.com\/(.*)\/(.*).*/
  ) as RegExpMatchArray;
  return octokit.rest.issues.createComment({
    owner,
    repo,
    issue_number: Number(issueNumber),
    body: template(job),
  });
}
