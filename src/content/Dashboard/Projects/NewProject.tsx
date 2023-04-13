import {
  Grid,
  Card,
  CardHeader,
  CardContent,
  Divider,
  Button,
} from "@mui/material";

import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { useContext, useState } from "react";
import { ProjectsContext } from "@contexts/ProjectsContext";

function NewProject() {
  const { isLoadingProjects } = useContext(ProjectsContext);
  const { createProject, isCreatingProject } = useContext(ProjectsContext);

  const [name, setName] = useState<string>();
  const [url, setUrl] = useState<string>();

  const onClick = () => {
    createProject({ name: name!, url: url! });
  };

  return (
    <>
      <Grid item xs={12}>
        <Card>
          <CardHeader title="New project" />
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
                    fullWidth
                    style={{ width: "420px" }}
                    required
                    id="name"
                    label="Name"
                    onChange={(e) => setName(e.target.value)}
                  />
                  <TextField
                    fullWidth
                    style={{ width: "420px" }}
                    required
                    id="url"
                    label="URL"
                    onChange={(e) => setUrl(e.target.value)}
                  />
                </div>
                <Button
                  sx={{ mt: { xs: 2, md: 0 } }}
                  variant={isCreatingProject ? "outlined" : "contained"}
                  style={{
                    marginLeft: "auto",
                    marginRight: "9px",
                  }}
                  onClick={onClick}
                  disabled={isCreatingProject || isLoadingProjects}
                >
                  Create project
                </Button>
              </div>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </>
  );
}

export default NewProject;
