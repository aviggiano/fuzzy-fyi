import Head from "next/head";
import SidebarLayout from "@layouts/SidebarLayout";
import PageHeader from "@content/Dashboard/Jobs/PageHeader";
import PageTitleWrapper from "@components/PageTitleWrapper";
import { Grid, Container } from "@mui/material";
import Footer from "@components/Footer";

import Jobs from "@content/Dashboard/Jobs/Jobs";
import { ReactElement } from "react";
import { GetServerSideProps } from "next";
import { Job } from "@prisma/client";
import prisma from "@services/prisma";
import { getJobWithSignedUrls } from "@services/jobUtils";

function ApplicationsJobs({ jobs }: { jobs: Job[] }) {
  return (
    <>
      <Head>
        <title>Jobs</title>
      </Head>
      <PageTitleWrapper>
        <PageHeader subtitle="Recent jobs" />
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
            <Jobs jobs={jobs} />
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </>
  );
}

ApplicationsJobs.getLayout = (page: ReactElement) => (
  <SidebarLayout>{page}</SidebarLayout>
);

export const getServerSideProps: GetServerSideProps = async (context) => {
  const jobs = await prisma.job.findMany({
    include: {
      project: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  const jobsWithLogs = await Promise.all(jobs.map(getJobWithSignedUrls));

  return {
    props: {
      jobs: JSON.parse(JSON.stringify(jobsWithLogs)),
    },
  };
};

export default ApplicationsJobs;
