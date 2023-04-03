import {
  Grid,
  Card,
  CardHeader,
  CardContent,
  Divider,
  MenuItem,
  Button,
} from "@mui/material";
import { Project, Template } from "@prisma/client";

import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { ChangeEvent, useState } from "react";
import { useRouter } from "next/router";
import { config } from "@config";
import { useSession, useUser } from "@supabase/auth-helpers-react";

function NewJob({
  projects,
  templates,
}: {
  projects?: Project[];
  templates?: Template[];
}) {
  const router = useRouter();

  const [active, setIsActive] = useState(true);
  const [project, setProject] = useState<Project | undefined>(
    projects ? projects[0] : undefined
  );
  const [template, setTemplate] = useState<Template | undefined>();
  const [ref, setRef] = useState<string>("main");
  const [cmd, setCmd] = useState<string>();
  const instanceTypes = config.aws.ec2.instanceTypes;
  const [instanceType, setInstanceType] = useState<string>(instanceTypes[0]);
  const session = useSession();
  const user = useUser();

  const onClick = () => {
    setIsActive(false);
    (async () => {
      await fetch(`${config.backend.url}/api/job`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          AuthId: user?.id!,
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
      setIsActive(true);
    })();
  };

  const onChangeTemplate = (e: ChangeEvent<HTMLInputElement>) => {
    const template = templates?.find((t) => t.id === e.target.value)!;
    const project = projects?.find((p) => p.id === template.projectId)!;
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
                        projects?.find((p) => p.name === e.target.value)!
                      )
                    }
                  >
                    {projects?.map((project) => (
                      <MenuItem key={project.id} value={project.name}>
                        {project.name}
                      </MenuItem>
                    ))}
                  </TextField>
                  <TextField
                    id="outlined-select-template"
                    select
                    label="Template"
                    value={template?.id}
                    onChange={onChangeTemplate}
                  >
                    {templates?.map((template) => (
                      <MenuItem key={template.id} value={template.id}>
                        {template.id}
                      </MenuItem>
                    ))}
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
                  variant={active ? "contained" : "outlined"}
                  style={{
                    marginLeft: "auto",
                    marginRight: "9px",
                  }}
                  onClick={onClick}
                  disabled={!active}
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
