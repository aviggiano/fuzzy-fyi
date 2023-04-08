import { useState, ReactNode, createContext, useEffect } from "react";
import { Project, Template } from "@prisma/client";
import { config } from "@config";
import { useSession } from "@supabase/auth-helpers-react";

interface ProjectsContext {
  isLoadingProjects: boolean;
  projects: Project[];
}

export const ProjectsContext = createContext<ProjectsContext>(
  {} as ProjectsContext
);

type Props = {
  children: ReactNode;
};

export function ProjectsProvider({ children }: Props) {
  const [isLoadingProjects, setIsLoadingProjects] = useState(false);
  const [projects, setProjects] = useState([]);
  const session = useSession();

  useEffect(() => {
    if (!session?.access_token) return;

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
      });
  }, [session?.access_token]);

  return (
    <ProjectsContext.Provider
      value={{
        projects,
        isLoadingProjects,
      }}
    >
      {children}
    </ProjectsContext.Provider>
  );
}
