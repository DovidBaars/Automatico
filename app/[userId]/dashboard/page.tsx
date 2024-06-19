'use server';

import styles from './page.module.css';
import { STRINGS } from '@/constants/app';
import { TestsTable, getTestData, Test } from '@/components/testsTable';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';

export const getServerSideProps = (async () => {
  let tests: Test[];
  tests = await getTestData();
  return { props: { tests } }
}) satisfies GetServerSideProps<{ tests: Test[] }>

const Dashboard = async ({ tests }: InferGetServerSidePropsType<typeof getServerSideProps>, { params: { userId } }: { params: { userId: number } }) => {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>Welcome to {STRINGS.TITLE}</h1>
        <p className={styles.description}>{STRINGS.DESCRIPTION}</p>
      </main>
      <TestsTable tests={tests} />
    </div>
  );
};

export default Dashboard;