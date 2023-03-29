import Head from "next/head";
import SidebarLayout from "@layouts/SidebarLayout";
import PageHeader from "@content/Dashboard/Templates/PageHeader";
import PageTitleWrapper from "@components/PageTitleWrapper";
import { Grid, Container } from "@mui/material";
import Footer from "@components/Footer";

import Templates from "@content/Dashboard/Templates/Templates";
import { ReactElement } from "react";
import { GetServerSideProps } from "next";
import { Template } from "@prisma/client";
import prisma from "@services/prisma";

function ApplicationsTemplates({ templates }: { templates: Template[] }) {
  return (
    <>
      <Head>
        <title>Templates</title>
      </Head>
      <PageTitleWrapper>
        <PageHeader subtitle="Recent templates" />
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
            <Templates templates={templates} />
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </>
  );
}

ApplicationsTemplates.getLayout = (page: ReactElement) => (
  <SidebarLayout>{page}</SidebarLayout>
);

export const getServerSideProps: GetServerSideProps = async (context) => {
  const templates = await prisma.template.findMany({
    include: {
      project: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return {
    props: {
      templates: JSON.parse(JSON.stringify(templates)),
    },
  };
};

export default ApplicationsTemplates;
