import {
  Grid,
  Card,
  CardHeader,
  CardContent,
  Divider,
  MenuItem,
  Button,
  Container,
  TextField,
} from "@mui/material";
import { Job } from "@prisma/client";

import Box from "@mui/material/Box";
import { formatTimeElapsed, label } from "@services/jobUtils";

const style = `
code {
  background-color: rgb(34, 36, 38) !important;
}
.neutral {
  background-color: rgb(34, 36, 38) !important;
}
.executed {
  background-color: rgb(26, 102, 0) !important;
}
.reverted {
  background-color: rgb(77, 77, 0) !important;
}
.unexecuted {
  background-color: rgb(102, 0, 0) !important;
}
`;

function Job({ job }: { job: Job & { coverage?: string; logs?: string } }) {
  return (
    <>
      <Container maxWidth="lg">
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
                    label="Status"
                    defaultValue={label[job.status]}
                    disabled
                  />
                  <TextField
                    label="Instance ID"
                    defaultValue={job.instanceId}
                    disabled
                  />
                  <TextField
                    label="Instance Type"
                    defaultValue={job.instanceType}
                    disabled
                  />
                  <TextField
                    label="Elapsed"
                    defaultValue={formatTimeElapsed(job)}
                    disabled
                  />
                  <TextField
                    fullWidth
                    style={{ width: "420px" }}
                    required
                    label="Command"
                    value={job.cmd}
                    multiline
                    disabled
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {job.logs ? (
            <Grid item xs={12}>
              <Card>
                <CardHeader title="Logs" />
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
                    <div>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: `<pre>${job.logs}</pre>`,
                        }}
                      />
                    </div>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ) : null}

          {job.coverage ? (
            <Grid item xs={12}>
              <Card>
                <CardHeader title="Coverage" />
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
                    <div>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: `<style>${style}</style>${job.coverage}`,
                        }}
                      />
                    </div>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ) : null}
        </Grid>
      </Container>
    </>
  );
}

export default Job;
