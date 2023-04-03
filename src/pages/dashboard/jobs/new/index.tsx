import Head from "next/head";
import SidebarLayout from "@layouts/SidebarLayout";
import PageHeader from "@content/Dashboard/Jobs/PageHeader";
import PageTitleWrapper from "@components/PageTitleWrapper";
import { Grid, Container } from "@mui/material";
import Footer from "@components/Footer";

import NewJob from "@content/Dashboard/Jobs/NewJob";
import { ReactElement } from "react";
import { GetServerSideProps } from "next";
import { Project, Template } from "@prisma/client";
import prisma from "@services/prisma";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";

function ApplicationsTransactions({
  projects,
  templates,
}: {
  projects: Project[];
  templates: Template[];
}) {
  return (
    <>
      <Head>
        <title>Jobs</title>
      </Head>
      <PageTitleWrapper>
        <PageHeader subtitle="New job" />
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
            <NewJob projects={projects} templates={templates} />
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
  const supabase = createServerSupabaseClient(context);
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const [projects, templates] = await Promise.all([
    prisma.project.findMany({
      where: {
        organization: {
          users: {
            some: {
              authId: session?.user.id!,
            },
          },
        },
      },
    }),
    prisma.template.findMany({
      include: {
        project: true,
      },
      where: {
        project: {
          organization: {
            users: {
              some: {
                authId: session?.user.id!,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    }),
  ]);

  return {
    props: {
      projects: JSON.parse(JSON.stringify(projects)),
      templates: JSON.parse(JSON.stringify(templates)),
    },
  };
};

export default ApplicationsTransactions;
