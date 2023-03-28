import Head from "next/head";
import SidebarLayout from "@layouts/SidebarLayout";
import PageHeader from "@content/Dashboard/Templates/PageHeader";
import PageTitleWrapper from "@components/PageTitleWrapper";
import { Grid, Container } from "@mui/material";
import Footer from "@components/Footer";

import NewTemplate from "@content/Dashboard/Templates/NewTemplate";
import { ReactElement } from "react";
import { config } from "@config";
import { GetServerSideProps } from "next";
import { Project } from "@prisma/client";

function ApplicationsTransactions({ projects }: { projects: Project[] }) {
  return (
    <>
      <Head>
        <title>Templates</title>
      </Head>
      <PageTitleWrapper>
        <PageHeader subtitle="New template" />
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
            <NewTemplate projects={projects} />
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </>
  );
}

ApplicationsTransactions.getLayout = (page: ReactElement) => (
  <SidebarLayout>{page}</SidebarLayout>
);

export const getServerSideProps: GetServerSideProps = async (context) => {
  const projects = await fetch(`${config.backend.url}/api/project`).then(
    (res) => res.json()
  );
  return {
    props: {
      projects,
    },
  };
};

export default ApplicationsTransactions;
