import Head from "next/head";
import SidebarLayout from "@layouts/SidebarLayout";
import PageHeader from "@content/Dashboard/Jobs/PageHeader";
import PageTitleWrapper from "@components/PageTitleWrapper";
import { Grid, Container } from "@mui/material";
import Footer from "@components/Footer";

import Job from "@content/Dashboard/Jobs/Job";
import { ReactElement } from "react";
import { config } from "@config";
import { GetServerSideProps } from "next";

function ApplicationsTransactions({
  job,
}: {
  job: Job & { coverage?: string; logs?: string };
}) {
  return (
    <>
      <Head>
        <title>Jobs</title>
      </Head>
      <PageTitleWrapper>
        <PageHeader subtitle={`Job ${job.id}`} />
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
            <Job job={job} />
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
  const job = await fetch(
    `${config.backend.url}/api/job/${context.params!.id}`
  ).then((res) => res.json());
  const coverage = job.coverageUrl
    ? await fetch(job.coverageUrl).then((res) => res.text())
    : undefined;
  const logs = job.logsUrl
    ? await fetch(job.logsUrl).then((res) => res.text())
    : undefined;

  return {
    props: {
      job: {
        ...job,
        logs,
        coverage,
      },
    },
  };
};

export default ApplicationsTransactions;
