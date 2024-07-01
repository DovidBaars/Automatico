'use client';

import { STRINGS } from '@/constants/app';
import TestsTable from './testsTable/testsTable';
import MagicMenu from '@/components/magicMenu/magicMenu';
import { useEffect, useState } from 'react';
import useDraggable from '@/components/useDraggable/useDraggable';
import { getAllTests } from '@/services/testService';
import { Test } from '@prisma/client';
import styles from './page.module.css';


const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | unknown>(null);
  const [tests, setTests] = useState<Test[]>([]);

  const { element: DraggableMagicMenu } = useDraggable({
    child: <MagicMenu triggerText={"Add Test"} renderComponent={undefined} />,
    bottom: '20%',
    right: '20%'
  });


  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching tests...');
        const data = await getAllTests();
        setTests(data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    console.log('loading: ', loading, 'error: ', error, 'tests: ', tests.length)
  }, [loading, error, tests]);


  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>Welcome to {STRINGS.TITLE}</h1>
        <p className={styles.description}>{STRINGS.DESCRIPTION}</p>
      </main>
      {DraggableMagicMenu}
      <TestsTable tests={tests} />
    </div>
  );
};

export default Dashboard;