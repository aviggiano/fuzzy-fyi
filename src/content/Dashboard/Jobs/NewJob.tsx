import {
  Grid,
  Card,
  CardHeader,
  CardContent,
  Divider,
  MenuItem,
  Button,
  Skeleton,
} from "@mui/material";
import { Project, Template } from "@prisma/client";

import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { ChangeEvent, useContext, useState } from "react";
import { config } from "@config";
import { JobsContext } from "@contexts/JobsContext";
import { ProjectsContext } from "@contexts/ProjectsContext";
import { TemplatesContext } from "@contexts/TemplatesContext";

function NewJob() {
  const { projects, isLoadingProjects } = useContext(ProjectsContext);
  const { templates, isLoadingTemplates } = useContext(TemplatesContext);
  const { createJob, isCreatingJob } = useContext(JobsContext);

  const [project, setProject] = useState<Project | undefined>(projects[0]);
  const [template, setTemplate] = useState<Template | undefined>();
  const [ref, setRef] = useState<string>("main");
  const [cmd, setCmd] = useState<string>();
  const instanceTypes = config.aws.ec2.instanceTypes;
  const [instanceType, setInstanceType] = useState<string>(instanceTypes[0]);

  const onClick = () =>
    createJob({
      project: project!,
      instanceType,
      ref,
      cmd: cmd!,
      template,
    });

  const onChangeTemplate = (e: ChangeEvent<HTMLInputElement>) => {
    const template = templates.find((t) => t.id === e.target.value)!;
    const project = projects.find((p) => p.id === template.projectId)!;
    setTemplate(template);
    setCmd(template.cmd);
    setInstanceType(template.instanceType);
    setProject(project);
  };

  return (
    <>
      <Grid item xs={12}>
        <Card>
          <CardHeader title="New job" />
          <Divider />
          <CardContent>
            <Box
              component="form"
              sx={{
                "& .MuiTextField-root": { m: 1, width: "25ch" },
              }}
              noValidate
              autoComplete="off"
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <TextField
                    id="outlined-select-project"
                    select
                    label="Project"
                    value={project?.name}
                    onChange={(e) =>
                      setProject(
                        projects.find((p) => p.name === e.target.value)!
                      )
                    }
                  >
                    {isLoadingProjects ? (
                      <MenuItem>
                        <Skeleton />
                      </MenuItem>
                    ) : (
                      projects.map((project) => (
                        <MenuItem key={project.id} value={project.name}>
                          {project.name}
                        </MenuItem>
                      ))
                    )}
                  </TextField>
                  <TextField
                    id="outlined-select-template"
                    select
                    label="Template"
                    value={template?.id}
                    onChange={onChangeTemplate}
                  >
                    {isLoadingTemplates ? (
                      <MenuItem>
                        <Skeleton />
                      </MenuItem>
                    ) : (
                      templates.map((template) => (
                        <MenuItem key={template.id} value={template.id}>
                          {template.id}
                        </MenuItem>
                      ))
                    )}
                  </TextField>
                  <TextField
                    id="outlined-select-instance-type"
                    select
                    label="Instance Type"
                    value={instanceType}
                    onChange={(e) => setInstanceType(e.target.value)}
                  >
                    {instanceTypes.map((instanceType) => (
                      <MenuItem key={instanceType} value={instanceType}>
                        {instanceType}
                      </MenuItem>
                    ))}
                  </TextField>
                  <TextField
                    required
                    id="ref"
                    label="Ref"
                    defaultValue={ref}
                    onChange={(e) => setRef(e.target.value)}
                  />
                  <TextField
                    fullWidth
                    style={{ width: "420px" }}
                    required
                    id="cmd"
                    label="Command"
                    value={cmd}
                    onChange={(e) => setCmd(e.target.value)}
                    multiline
                  />
                </div>
                <Button
                  sx={{ mt: { xs: 2, md: 0 } }}
                  variant={isCreatingJob ? "outlined" : "contained"}
                  style={{
                    marginLeft: "auto",
                    marginRight: "9px",
                  }}
                  onClick={onClick}
                  disabled={
                    isCreatingJob || isLoadingProjects || isLoadingTemplates
                  }
                >
                  Create job
                </Button>
              </div>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </>
  );
}

export default NewJob;
