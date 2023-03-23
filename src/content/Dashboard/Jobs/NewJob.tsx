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
import { useEffect, useState } from "react";

function NewJob() {
  const [project, setProject] = useState<Project>();
  const [projects, setProjects] = useState<Project[]>([]);
  const [ref, setRef] = useState<string>("main");
  const [cmd, setCmd] = useState<string>();
  const instanceTypes = ["c5.large", "c5.xlarge", "c5.2xlarge"];
  const [instanceType, setInstanceType] = useState<string>(instanceTypes[0]);
  useEffect(() => {
    fetch("/api/project")
      .then((res) => res.json())
      .then((projects) => {
        setProjects(projects);
        setProject(projects[0]);
      });
  }, []);

  const onClick = () => {
    fetch("/api/job", {
      method: "POST",
      body: JSON.stringify({
        projectId: project?.id,
        instanceType,
        ref,
        cmd,
      }),
    }).then(() => (window.location.href = "/dashboard/jobs"));
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
                        projects.find((p) => p.name === e.target.value)
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
                    onChange={(e) => setCmd(e.target.value)}
                    multiline
                  />
                </div>
                <Button
                  sx={{ mt: { xs: 2, md: 0 } }}
                  variant="contained"
                  style={{
                    marginLeft: "auto",
                    marginRight: "9px",
                  }}
                  onClick={onClick}
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
