import { useState, ReactNode, createContext, useEffect } from "react";
import { Job, Project, Template } from "@prisma/client";
import { config } from "@config";
import { useSession } from "@supabase/auth-helpers-react";
import router from "next/router";

interface JobsContext {
  getJob: (
    jobId: string
  ) => Promise<Job & { coverage?: string; logs?: string }>;
  isLoadingJob: boolean;
  isLoadingJobs: boolean;
  jobs: Job[];
  isDeletingJob: boolean;
  deleteJob: (jobId: string) => void;
  isCreatingJob: boolean;
  createJob: (params: {
    project: Project;
    instanceType: string;
    ref: string;
    cmd: string;
    template?: Template;
  }) => void;
}

export const JobsContext = createContext<JobsContext>({} as JobsContext);

type Props = {
  children: ReactNode;
};

export function JobsProvider({ children }: Props) {
  const [isLoadingJob, setIsLoadingJob] = useState(false);
  const [isLoadingJobs, setIsLoadingJobs] = useState(false);
  const [isDeletingJob, setIsDeletingJob] = useState(false);
  const [isCreatingJob, setIsCreatingJob] = useState(false);
  const [jobs, setJobs] = useState([]);
  const session = useSession();

  useEffect(() => {
    if (!session?.access_token) return;

    setIsLoadingJobs(true);
    fetch(`${config.backend.url}/api/job`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + session?.access_token,
      },
    })
      .then((res) => res.json())
      .then((j) => {
        setJobs(j);
        setIsLoadingJobs(false);
      });
  }, [session?.access_token]);

  const deleteJob = (jobId: string): void => {
    setIsDeletingJob(true);
    fetch(`${config.backend.url}/api/job/${jobId}`, {
      method: "DELETE",
    }).then(() => {
      setIsDeletingJob(false);
      router.push("/dashboard/jobs");
    });
  };

  const createJob = (params: {
    project: Project;
    instanceType: string;
    ref: string;
    cmd: string;
    template?: Template;
  }) => {
    const { project, instanceType, ref, cmd, template } = params;
    setIsCreatingJob(true);
    (async () => {
      await fetch(`${config.backend.url}/api/job`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + session?.access_token,
        },
        body: JSON.stringify({
          projectId: project?.id,
          templateId: template?.id,
          instanceType,
          ref,
          cmd,
        }),
      });
      router.push("/dashboard/jobs");
      setIsCreatingJob(false);
    })();
  };

  const getJob = async (
    jobId: string
  ): Promise<Job & { coverage?: string; logs?: string }> => {
    setIsLoadingJob(true);
    const j = await fetch(`${config.backend.url}/api/job/${jobId}`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + session?.access_token,
      },
    }).then((res) => res.json());

    const [coverage, logs] = await Promise.all([
      j.coverageUrl
        ? fetch(j.coverageUrl).then((res) => res.text())
        : undefined,
      j.logsUrl ? fetch(j.logsUrl).then((res) => res.text()) : undefined,
    ]);

    setIsLoadingJob(false);
    return {
      ...j,
      coverage,
      logs,
    };
  };

  return (
    <JobsContext.Provider
      value={{
        getJob,
        isLoadingJob,
        jobs,
        isLoadingJobs,
        deleteJob,
        isDeletingJob,
        createJob,
        isCreatingJob,
      }}
    >
      {children}
    </JobsContext.Provider>
  );
}
