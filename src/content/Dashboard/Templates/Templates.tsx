import { ChangeEvent, useContext, useState } from "react";
import { Template, Project } from "@prisma/client";
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

import BulkActions from "./BulkActions";
import { TemplatesContext } from "@contexts/TemplatesContext";

const applyPagination = (
  templates: Template[],
  page: number,
  limit: number
): Template[] => {
  return templates.slice(page * limit, page * limit + limit);
};

const TemplateSkeleton = () => (
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
  </TableRow>
);

function Templates() {
  const { templates, isLoadingTemplates } = useContext(TemplatesContext);
  const [selectedTemplates, setSelectedTemplates] = useState<string[]>([]);
  const selectedBulkActions = selectedTemplates.length > 0;
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(5);

  const handleSelectAllTemplates = (
    event: ChangeEvent<HTMLInputElement>
  ): void => {
    setSelectedTemplates(
      event.target.checked
        ? templates.map((template: Template) => template.id) || []
        : []
    );
  };

  const handleSelectOneTemplate = (
    _event: ChangeEvent<HTMLInputElement>,
    id: string
  ): void => {
    if (!selectedTemplates.includes(id)) {
      setSelectedTemplates((prevSelected) => [...prevSelected, id]);
    } else {
      setSelectedTemplates((prevSelected) =>
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

  const paginatedTemplates = applyPagination(templates || [], page, limit);
  const selectedSomeTemplates =
    selectedTemplates.length > 0 &&
    selectedTemplates.length < (templates.length || 0);
  const selectedAllTemplates = selectedTemplates.length === templates.length;

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
                    checked={selectedAllTemplates}
                    indeterminate={selectedSomeTemplates}
                    onChange={handleSelectAllTemplates}
                  />
                </TableCell>
                <TableCell>Template ID</TableCell>
                <TableCell>Command</TableCell>
                <TableCell>Instance Type</TableCell>
                <TableCell>Project</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoadingTemplates
                ? Array(limit)
                    .fill(undefined)
                    .map((_, i) => <TemplateSkeleton key={i} />)
                : paginatedTemplates.map((template) => {
                    const isTemplateSelected = selectedTemplates.includes(
                      template.id
                    );
                    return (
                      <TableRow
                        hover
                        key={template.id}
                        selected={isTemplateSelected}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                            color="primary"
                            checked={isTemplateSelected}
                            onChange={(event: ChangeEvent<HTMLInputElement>) =>
                              handleSelectOneTemplate(event, template.id)
                            }
                            value={isTemplateSelected}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography
                            variant="body1"
                            fontWeight="bold"
                            color="text.primary"
                            gutterBottom
                          >
                            {template.id}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography
                            variant="body1"
                            fontWeight="bold"
                            color="text.secondary"
                            gutterBottom
                            maxWidth="220px"
                          >
                            {template.cmd}
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
                            {template.instanceType}
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
                            {((template as any).project as Project).name}
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
            count={templates.length || 0}
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

export default Templates;
