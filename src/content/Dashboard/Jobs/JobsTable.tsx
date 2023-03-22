import { ChangeEvent, useEffect, useState } from "react";
import { JobStatus, Job, Project } from "@prisma/client";
import {
  Tooltip,
  Divider,
  Box,
  FormControl,
  InputLabel,
  Card,
  Checkbox,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TableContainer,
  Select,
  MenuItem,
  Typography,
  useTheme,
  CardHeader,
} from "@mui/material";

import Label, { LabelProps } from "@components/Label";
import EditTwoToneIcon from "@mui/icons-material/EditTwoTone";
import DeleteTwoToneIcon from "@mui/icons-material/DeleteTwoTone";
import BulkActions from "./BulkActions";
import { formatDistanceToNow } from "date-fns";

interface Filters {
  status?: JobStatus;
}

const getStatusLabel = (jobStatus: JobStatus): JSX.Element => {
  const map: Record<JobStatus, LabelProps["color"]> = {
    PROVISIONED: "warning",
    STARTED: "info",
    RUNNING: "info",
    FINISHED: "success",
    DEPROVISIONED: "success",
  };

  const color: LabelProps["color"] = map[jobStatus];

  return <Label color={color}>{jobStatus}</Label>;
};

const applyFilters = (jobs: Job[], filters: Filters): Job[] => {
  return jobs.filter((job) => {
    let matches = true;

    if (filters.status && job.status !== filters.status) {
      matches = false;
    }

    return matches;
  });
};

const applyPagination = (jobs: Job[], page: number, limit: number): Job[] => {
  return jobs.slice(page * limit, page * limit + limit);
};

function JobsTable() {
  const [jobs, setJobs] = useState<Job[]>([]);
  useEffect(() => {
    fetch("http://localhost:3000/api/job")
      .then((res) => res.json())
      .then(setJobs);
  }, []);

  const [selectedJobs, setSelectedJobs] = useState<string[]>([]);
  const selectedBulkActions = selectedJobs.length > 0;
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(5);
  const [filters, setFilters] = useState<Filters>({
    status: null,
  });

  const statusOptions = Object.keys(JobStatus).map((status) => ({
    id: status,
    name: status,
  }));

  const handleStatusChange = (e: ChangeEvent<HTMLInputElement>): void => {
    let value = null;

    if (e.target.value !== "all") {
      value = e.target.value;
    }

    setFilters((prevFilters) => ({
      ...prevFilters,
      status: value,
    }));
  };

  const handleSelectAllJobs = (event: ChangeEvent<HTMLInputElement>): void => {
    setSelectedJobs(event.target.checked ? jobs.map((job: Job) => job.id) : []);
  };

  const handleSelectOneJob = (
    _event: ChangeEvent<HTMLInputElement>,
    id: string
  ): void => {
    if (!selectedJobs.includes(id)) {
      setSelectedJobs((prevSelected) => [...prevSelected, id]);
    } else {
      setSelectedJobs((prevSelected) => prevSelected.filter((id) => id !== id));
    }
  };

  const handlePageChange = (_event: any, newPage: number): void => {
    setPage(newPage);
  };

  const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setLimit(parseInt(event.target.value));
  };

  const filteredJobs = applyFilters(jobs, filters);
  const paginatedJobs = applyPagination(filteredJobs, page, limit);
  const selectedSomeJobs =
    selectedJobs.length > 0 && selectedJobs.length < jobs.length;
  const selectedAllJobs = selectedJobs.length === jobs.length;
  const theme = useTheme();

  return (
    <Card>
      {selectedBulkActions && (
        <Box flex={1} p={2}>
          <BulkActions />
        </Box>
      )}
      {!selectedBulkActions && (
        <CardHeader
          action={
            <Box width={150}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Status</InputLabel>
                <Select
                  value={filters.status || "all"}
                  onChange={handleStatusChange}
                  label="Status"
                  autoWidth
                >
                  {statusOptions.map((statusOption) => (
                    <MenuItem key={statusOption.id} value={statusOption.id}>
                      {statusOption.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          }
          title="Jobs"
        />
      )}
      <Divider />
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  color="primary"
                  checked={selectedAllJobs}
                  indeterminate={selectedSomeJobs}
                  onChange={handleSelectAllJobs}
                />
              </TableCell>
              <TableCell>Job ID</TableCell>
              <TableCell>Ref</TableCell>
              <TableCell>Command</TableCell>
              <TableCell>Instance ID</TableCell>
              <TableCell>Project</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedJobs.map((job) => {
              const isJobSelected = selectedJobs.includes(job.id);
              return (
                <TableRow hover key={job.id} selected={isJobSelected}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      color="primary"
                      checked={isJobSelected}
                      onChange={(event: ChangeEvent<HTMLInputElement>) =>
                        handleSelectOneJob(event, job.id)
                      }
                      value={isJobSelected}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="text.primary"
                      gutterBottom
                    >
                      {job.id}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {formatDistanceToNow(
                        new Date(job.createdAt)
                      ) + " ago"}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="text.primary"
                      gutterBottom
                      noWrap
                    >
                      {job.ref}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="text.secondary"
                      gutterBottom
                    >
                      {job.cmd}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="text.primary"
                      gutterBottom
                      noWrap
                    >
                      {job.instanceId}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="text.primary"
                      gutterBottom
                      noWrap
                    >
                      {((job as any).project as Project).name}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {getStatusLabel(job.status)}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Edit Job" arrow>
                      <IconButton
                        sx={{
                          "&:hover": {
                            background: theme.colors.primary.lighter,
                          },
                          color: theme.palette.primary.main,
                        }}
                        color="inherit"
                        size="small"
                      >
                        <EditTwoToneIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Job" arrow>
                      <IconButton
                        sx={{
                          "&:hover": { background: theme.colors.error.lighter },
                          color: theme.palette.error.main,
                        }}
                        color="inherit"
                        size="small"
                      >
                        <DeleteTwoToneIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <Box p={2}>
        <TablePagination
          component="div"
          count={filteredJobs.length}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleLimitChange}
          page={page}
          rowsPerPage={limit}
          rowsPerPageOptions={[5, 10, 25, 30]}
        />
      </Box>
    </Card>
  );
}

export default JobsTable;
