import {
  Grid,
  Card,
  CardContent,
  Container,
  TextField,
  Skeleton,
} from "@mui/material";

import Box from "@mui/material/Box";
import { Project } from "@prisma/client";

function ProjectPage({ project }: { project?: Project }) {
  return (
    <>
      <Container maxWidth="lg">
        {!project ? (
          <Skeleton height={400} />
        ) : (
          <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="stretch"
            spacing={3}
          >
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Box
                    component="form"
                    sx={{
                      "& .MuiTextField-root": { m: 1, width: "25ch" },
                    }}
                    noValidate
                    autoComplete="off"
                  >
                    <TextField
                      label="Name"
                      defaultValue={project.name}
                      disabled
                    />
                    <TextField
                      label="URL"
                      defaultValue={project.url}
                      disabled
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}
      </Container>
    </>
  );
}

export default ProjectPage;
