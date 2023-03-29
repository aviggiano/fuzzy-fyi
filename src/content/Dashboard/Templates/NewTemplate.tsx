import {
  Grid,
  Card,
  CardHeader,
  CardContent,
  Divider,
  MenuItem,
  Button,
} from "@mui/material";
import { Project } from "@prisma/client";

import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import { useRouter } from "next/router";
import { config } from "@config";

function NewTemplate({ projects }: { projects: Project[] }) {
  const router = useRouter();

  const [active, setIsActive] = useState(true);
  const [project, setProject] = useState<Project | undefined>(
    projects ? projects[0] : undefined
  );
  const [cmd, setCmd] = useState<string>();
  const instanceTypes = config.aws.ec2.instanceTypes;
  const [instanceType, setInstanceType] = useState<string>(instanceTypes[0]);

  const onClick = () => {
    setIsActive(false);
    fetch(`${config.backend.url}/api/template`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        projectId: project?.id,
        instanceType,
        cmd,
      }),
    }).then(() => {
      router.push("/dashboard/templates");
    });
  };

  return (
    <>
      <Grid item xs={12}>
        <Card>
          <CardHeader title="New template" />
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
                    {projects.map((project) => (
                      <MenuItem key={project.id} value={project.name}>
                        {project.name}
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
                    fullWidth
                    style={{ width: "420px" }}
                    required
                    id="cmd"
                    label="Command"
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
                  Create template
                </Button>
              </div>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </>
  );
}

export default NewTemplate;
