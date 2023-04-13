import Head from "next/head";
import SidebarLayout from "@layouts/SidebarLayout";
import PageHeader from "@content/Dashboard/Jobs/PageHeader";
import PageTitleWrapper from "@components/PageTitleWrapper";
import { Grid, Container } from "@mui/material";
import Footer from "@components/Footer";

import Job from "@content/Dashboard/Jobs/Job";
import { ReactElement, useContext, useEffect, useState } from "react";
import { GetServerSideProps } from "next";
import { JobOutput, JobsContext } from "@contexts/JobsContext";

function ApplicationsTransactions({ jobId }: { jobId: string }) {
  const [job, setJob] = useState<JobOutput>();
  const { getJob } = useContext(JobsContext);
  useEffect(() => {
    getJob(jobId).then(setJob);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobId]);

  return (
    <>
      <Head>
        <title>Jobs</title>
      </Head>
      <PageTitleWrapper>
        <PageHeader subtitle={`Job ${jobId}`} />
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
  return {
    props: {
      jobId: context.params?.id?.toString(),
    },
  };
};

export default ApplicationsTransactions;
