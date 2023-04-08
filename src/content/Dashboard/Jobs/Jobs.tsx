import { ChangeEvent, useContext, useEffect, useMemo, useState } from "react";
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
  SelectChangeEvent,
  Skeleton,
} from "@mui/material";

import Label from "@components/Label";
import CancelTwoToneIcon from "@mui/icons-material/CancelTwoTone";
import CodeTwoToneIcon from "@mui/icons-material/CodeTwoTone";
import ArticleTwoToneIcon from "@mui/icons-material/ArticleTwoTone";
import BulkActions from "./BulkActions";
import { formatDistanceToNow } from "date-fns";
import { color, formatTimeElapsed, label } from "@services/jobUtils";
import Link from "next/link";
import { JobsContext } from "@contexts/JobsContext";

interface Filters {
  status?: JobStatus;
}

const getStatusLabel = (jobStatus: JobStatus): JSX.Element => {
  return <Label color={color[jobStatus]}>{label[jobStatus]}</Label>;
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

function Interval({ job }: { job: Job }) {
  const [formatted, setFormatted] = useState(formatTimeElapsed(job));

  useEffect(() => {
    const interval = setInterval(() => {
      setFormatted(formatTimeElapsed(job));
    }, 1000);

    return () => clearInterval(interval);
  }, [job]);

  return <>{formatted}</>;
}

const JobSkeleton = () => (
  <TableRow>
    <TableCell>
      <Skeleton />
    </TableCell>
    <TableCell>
      <Skeleton />
    </TableCell>
    <TableCell>
      <Skeleton />
    </TableCell>
    <TableCell>
      <Skeleton />
    </TableCell>
    <TableCell>
      <Skeleton />
    </TableCell>
    <TableCell>
      <Skeleton />
    </TableCell>
    <TableCell>
      <Skeleton />
    </TableCell>
  </TableRow>
);

function Jobs() {
  const { jobs, isLoadingJobs, deleteJob, isDeletingJob } =
    useContext(JobsContext);
  const [selectedJobs, setSelectedJobs] = useState<string[]>([]);
  const selectedBulkActions = selectedJobs.length > 0;
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(5);
  const [filters, setFilters] = useState<Filters>({
    status: undefined,
  });

  const statusOptions = Object.keys(JobStatus).map((status) => ({
    id: status as string,
    name: label[status as JobStatus],
  }));

  const handleStatusChange = (e: SelectChangeEvent): void => {
    const value: JobStatus | undefined =
      e.target.value !== "all" ? (e.target.value as JobStatus) : undefined;

    setFilters((prevFilters) => ({
      ...prevFilters,
      status: value,
    }));
  };

  const handleSelectAllJobs = (event: ChangeEvent<HTMLInputElement>): void => {
    setSelectedJobs(
      event.target.checked ? jobs.map((job: Job) => job.id) || [] : []
    );
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

  const filteredJobs = applyFilters(jobs || [], filters);
  const paginatedJobs = applyPagination(filteredJobs, page, limit);
  const selectedSomeJobs =
    selectedJobs.length > 0 && selectedJobs.length < (jobs.length || 0);
  const selectedAllJobs = selectedJobs.length === jobs.length;
  const theme = useTheme();

  return (
    <Card>
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
            title="Job"
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
                <TableCell>Command</TableCell>
                <TableCell>Instance</TableCell>
                <TableCell>Project</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoadingJobs
                ? Array(limit)
                    .fill(undefined)
                    .map((_, i) => <JobSkeleton key={i} />)
                : paginatedJobs.map((job) => {
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
                            <Link href={`/dashboard/jobs/${job.id}`}>
                              {job.id}
                            </Link>
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            noWrap
                          >
                            {formatDistanceToNow(new Date(job.createdAt)) +
                              " ago"}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography
                            variant="body1"
                            fontWeight="bold"
                            color="text.secondary"
                            gutterBottom
                            maxWidth="260px"
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
                          <Typography
                            variant="body1"
                            fontWeight="bold"
                            color="text.secondary"
                            noWrap
                          >
                            {job.instanceType}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            noWrap
                          >
                            <Interval job={job} />
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
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            noWrap
                          >
                            {getStatusLabel(job.status)}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          {!job.status.startsWith("FINISHED") &&
                          job.status !== "STOPPED" ? (
                            <Tooltip title="Stop Job" arrow>
                              <IconButton
                                sx={{
                                  "&:hover": {
                                    background: theme.colors.error.lighter,
                                  },
                                  color: theme.palette.error.main,
                                }}
                                color="inherit"
                                size="small"
                                onClick={() => deleteJob(job.id)}
                                disabled={isDeletingJob}
                              >
                                <CancelTwoToneIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          ) : (
                            <>
                              {job.coverageUrl ? (
                                <Tooltip title="View Coverage" arrow>
                                  <IconButton
                                    sx={{
                                      "&:hover": {
                                        background: theme.colors.info.lighter,
                                      },
                                      color: theme.palette.info.main,
                                    }}
                                    color="inherit"
                                    size="small"
                                    onClick={() =>
                                      window.open(job.coverageUrl!)
                                    }
                                  >
                                    <CodeTwoToneIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              ) : null}
                              {job.logsUrl ? (
                                <Tooltip title="View Logs" arrow>
                                  <IconButton
                                    sx={{
                                      "&:hover": {
                                        background: theme.colors.info.lighter,
                                      },
                                      color: theme.palette.info.main,
                                    }}
                                    color="inherit"
                                    size="small"
                                    onClick={() => window.open(job.logsUrl!)}
                                  >
                                    <ArticleTwoToneIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              ) : null}
                            </>
                          )}
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
    </Card>
  );
}

export default Jobs;
