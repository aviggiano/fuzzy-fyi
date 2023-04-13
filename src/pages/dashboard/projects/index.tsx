import Head from "next/head";
import SidebarLayout from "@layouts/SidebarLayout";
import PageHeader from "@content/Dashboard/Projects/PageHeader";
import PageTitleWrapper from "@components/PageTitleWrapper";
import { Grid, Container } from "@mui/material";
import Footer from "@components/Footer";

import Projects from "@content/Dashboard/Projects/Projects";
import { ReactElement } from "react";

function ApplicationsProjects() {
  return (
    <>
      <Head>
        <title>Projects</title>
      </Head>
      <PageTitleWrapper>
        <PageHeader subtitle="Recent projects" />
      </PageTitleWrapper>
      <Container maxWidth="lg">
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="stretch"
          spacing={3}
        >
          <Grid item xs={12}>
            <Projects />
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </>
  );
}

ApplicationsProjects.getLayout = (page: ReactElement) => (
  <SidebarLayout>{page}</SidebarLayout>
);

export default ApplicationsProjects;
