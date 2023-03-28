import { Typography, Button, Grid } from "@mui/material";

import AddTwoToneIcon from "@mui/icons-material/AddTwoTone";
import Link from "next/link";

interface Props {
  subtitle: string;
}

function PageHeader({ subtitle }: Props) {
  return (
    <Grid container justifyContent="space-between" alignItems="center">
      <Grid item>
        <Typography variant="h3" component="h3" gutterBottom>
          Templates
        </Typography>
        <Typography variant="subtitle2">{subtitle}</Typography>
      </Grid>
      <Grid item>
        <Link
          style={{ textDecoration: "none" }}
          href="/dashboard/templates/new"
        >
          <Button
            sx={{ mt: { xs: 2, md: 0 } }}
            variant="contained"
            startIcon={<AddTwoToneIcon fontSize="small" />}
          >
            New template
          </Button>
        </Link>
      </Grid>
    </Grid>
  );
}

export default PageHeader;
