import { useState, ReactNode, createContext, useEffect } from "react";
import { Template, Project } from "@prisma/client";
import { config } from "@config";
import { useSession } from "@supabase/auth-helpers-react";
import router from "next/router";

interface TemplatesContext {
  isLoadingTemplates: boolean;
  templates: Template[];
  isCreatingTemplate: boolean;
  createTemplate: (params: {
    project: Project;
    instanceType: string;
    cmd: string;
  }) => void;
}

export const TemplatesContext = createContext<TemplatesContext>(
  {} as TemplatesContext
);

type Props = {
  children: ReactNode;
};

export function TemplatesProvider({ children }: Props) {
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(false);
  const [isCreatingTemplate, setIsCreatingTemplate] = useState(false);
  const [templates, setTemplates] = useState([]);
  const session = useSession();

  useEffect(() => {
    if (!session?.access_token) return;

    setIsLoadingTemplates(true);
    fetch(`${config.backend.url}/api/template`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + session?.access_token,
      },
    })
      .then((res) => res.json())
      .then((j) => {
        setTemplates(j);
        setIsLoadingTemplates(false);
      });
  }, [session?.access_token]);

  const createTemplate = (params: {
    project: Project;
    instanceType: string;
    cmd: string;
  }) => {
    const { project, instanceType, cmd } = params;

    setIsCreatingTemplate(true);
    (async () => {
      await fetch(`${config.backend.url}/api/template`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + session?.access_token,
        },
        body: JSON.stringify({
          projectId: project.id,
          instanceType,
          cmd,
        }),
      });
      router.push("/dashboard/templates");
      setIsCreatingTemplate(false);
    })();
  };

  return (
    <TemplatesContext.Provider
      value={{
        templates,
        isLoadingTemplates,
        createTemplate,
        isCreatingTemplate,
      }}
    >
      {children}
    </TemplatesContext.Provider>
  );
}
