'use server';

import styles from './page.module.css';
import { STRINGS } from '@/constants/app';
import { getTestData } from './actions';
import TestsTable from './testsTable/testsTable';

const Dashboard = async () => {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>Welcome to {STRINGS.TITLE}</h1>
        <p className={styles.description}>{STRINGS.DESCRIPTION} User: { }</p>
      </main>
      <TestsTable tests={await getTestData()} />
    </div>
  );
};

export default Dashboard;