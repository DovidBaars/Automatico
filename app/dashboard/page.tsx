'use server';

import styles from './page.module.css';
import { STRINGS } from '@/constants/app';
import { TestsTable, getTestData, Test } from '@/components/testsTable';

const getTestsTableTests = async () => {
  let tests: Test[];
  tests = await getTestData();
  return tests;
};

const Dashboard = async () => {
  const tests = await getTestsTableTests();
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>Welcome to {STRINGS.TITLE}</h1>
        <p className={styles.description}>{STRINGS.DESCRIPTION} User: { }</p>
      </main>
      <TestsTable tests={tests} />
    </div>
  );
};

export default Dashboard;