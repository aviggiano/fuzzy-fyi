import Head from "next/head";
import SidebarLayout from "@layouts/SidebarLayout";
import PageHeader from "@content/Dashboard/Projects/PageHeader";
import PageTitleWrapper from "@components/PageTitleWrapper";
import { Grid, Container } from "@mui/material";
import Footer from "@components/Footer";

import ProjectPage from "@content/Dashboard/Projects/Project";
import { ReactElement, useContext, useEffect, useState } from "react";
import { GetServerSideProps } from "next";
import { ProjectsContext } from "@contexts/ProjectsContext";
import { Project } from "@prisma/client";

function ApplicationsTransactions({ projectId }: { projectId: string }) {
  const [project, setProject] = useState<Project>();
  const { getProject } = useContext(ProjectsContext);
  useEffect(() => {
    getProject(projectId).then(setProject);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  return (
    <>
      <Head>
        <title>Projects</title>
      </Head>
      <PageTitleWrapper>
        <PageHeader subtitle={`Project ${projectId}`} />
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
            <ProjectPage project={project} />
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
  return {
    props: {
      projectId: context.params?.id?.toString(),
    },
  };
};

export default ApplicationsTransactions;
