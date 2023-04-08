import { useState, ReactNode, createContext, useEffect } from "react";
import { Job, Project, Template } from "@prisma/client";
import { config } from "@config";
import { useSession } from "@supabase/auth-helpers-react";
import router from "next/router";

interface JobsContext {
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
    setIsCreatingJob(false);
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
      setIsCreatingJob(true);
    })();
  };

  return (
    <JobsContext.Provider
      value={{
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
