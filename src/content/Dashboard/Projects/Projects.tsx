import { ChangeEvent, useContext, useState } from "react";
import { Project } from "@prisma/client";
import {
  Divider,
  Box,
  FormControl,
  InputLabel,
  Card,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TableContainer,
  Typography,
  CardHeader,
  Skeleton,
} from "@mui/material";

import BulkActions from "../Projects/BulkActions";
import { ProjectsContext } from "@contexts/ProjectsContext";

const applyPagination = (
  projects: Project[],
  page: number,
  limit: number
): Project[] => {
  return projects.slice(page * limit, page * limit + limit);
};

const ProjectSkeleton = () => (
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
  </TableRow>
);

function Projects() {
  const { projects, isLoadingProjects } = useContext(ProjectsContext);
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const selectedBulkActions = selectedProjects.length > 0;
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(5);

  const handleSelectAllProjects = (
    event: ChangeEvent<HTMLInputElement>
  ): void => {
    setSelectedProjects(
      event.target.checked
        ? projects.map((project: Project) => project.id) || []
        : []
    );
  };

  const handleSelectOneProject = (
    _event: ChangeEvent<HTMLInputElement>,
    id: string
  ): void => {
    if (!selectedProjects.includes(id)) {
      setSelectedProjects((prevSelected) => [...prevSelected, id]);
    } else {
      setSelectedProjects((prevSelected) =>
        prevSelected.filter((id) => id !== id)
      );
    }
  };

  const handlePageChange = (_event: any, newPage: number): void => {
    setPage(newPage);
  };

  const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setLimit(parseInt(event.target.value));
  };

  const paginatedProjects = applyPagination(projects || [], page, limit);
  const selectedSomeProjects =
    selectedProjects.length > 0 &&
    selectedProjects.length < (projects.length || 0);
  const selectedAllProjects = selectedProjects.length === projects.length;

  return (
    <Card>
      <Card>
        {selectedBulkActions && (
          <Box flex={1} p={2}>
            <BulkActions />
          </Box>
        )}
        <Divider />
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    color="primary"
                    checked={selectedAllProjects}
                    indeterminate={selectedSomeProjects}
                    onChange={handleSelectAllProjects}
                  />
                </TableCell>
                <TableCell>Project ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>URL</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoadingProjects
                ? Array(limit)
                    .fill(undefined)
                    .map((_, i) => <ProjectSkeleton key={i} />)
                : paginatedProjects.map((project) => {
                    const isProjectSelected = selectedProjects.includes(
                      project.id
                    );
                    return (
                      <TableRow
                        hover
                        key={project.id}
                        selected={isProjectSelected}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                            color="primary"
                            checked={isProjectSelected}
                            onChange={(event: ChangeEvent<HTMLInputElement>) =>
                              handleSelectOneProject(event, project.id)
                            }
                            value={isProjectSelected}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography
                            variant="body1"
                            fontWeight="bold"
                            color="text.primary"
                            gutterBottom
                          >
                            {project.id}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography
                            variant="body1"
                            fontWeight="bold"
                            color="text.primary"
                            gutterBottom
                          >
                            {project.name}
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
                            <a href={project.url} target="_blank">
                              {project.url}
                            </a>
                          </Typography>
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
            count={projects.length || 0}
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

export default Projects;
