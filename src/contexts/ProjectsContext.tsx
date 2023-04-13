import {
  useState,
  ReactNode,
  createContext,
  useEffect,
  useCallback,
} from "react";
import { Project, Template } from "@prisma/client";
import { config } from "@config";
import { useSession } from "@supabase/auth-helpers-react";
import router from "next/router";

interface ProjectsContext {
  isLoadingProject: boolean;
  getProject: (projectId: string) => Promise<Project>;
  isLoadingProjects: boolean;
  projects: Project[];
  createProject: (params: { name: string; url: string }) => void;
  isCreatingProject: boolean;
}

export const ProjectsContext = createContext<ProjectsContext>(
  {} as ProjectsContext
);

type Props = {
  children: ReactNode;
};

export function ProjectsProvider({ children }: Props) {
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [isLoadingProject, setIsLoadingProject] = useState(false);
  const [isLoadingProjects, setIsLoadingProjects] = useState(false);
  const [projects, setProjects] = useState([]);
  const session = useSession();

  const getProject = async (projectId: string): Promise<Project> => {
    setIsLoadingProject(true);
    const project = await fetch(
      `${config.backend.url}/api/project/${projectId}`,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + session?.access_token,
        },
      }
    ).then((res) => res.json());

    setIsLoadingProject(false);
    return project;
  };

  const getProjects = useCallback(
    (callback?: () => void) => {
      setIsLoadingProjects(true);
      fetch(`${config.backend.url}/api/project`, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + session?.access_token,
        },
      })
        .then((res) => res.json())
        .then((j) => {
          setProjects(j);
          setIsLoadingProjects(false);
          if (callback) callback();
        });
    },
    [session?.access_token]
  );

  useEffect(() => {
    if (!session?.access_token) return;

    getProjects();
  }, [session?.access_token, getProjects]);

  const createProject = (params: { name: string; url: string }) => {
    const { name, url } = params;

    setIsCreatingProject(true);
    (async () => {
      await fetch(`${config.backend.url}/api/project`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + session?.access_token,
        },
        body: JSON.stringify({
          name,
          url,
        }),
      });
      setIsCreatingProject(false);
      getProjects(() => router.push("/dashboard/templates"));
    })();
  };

  return (
    <ProjectsContext.Provider
      value={{
        getProject,
        isLoadingProject,
        projects,
        isLoadingProjects,
        createProject,
        isCreatingProject,
      }}
    >
      {children}
    </ProjectsContext.Provider>
  );
}
