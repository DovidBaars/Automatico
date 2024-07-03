'use client';

import Link from 'next/link';
import React from 'react';
import styles from './testsTable.module.css';
import { Test } from '@prisma/client';
import { deleteTest, runTest } from '@/services/testService';

const TestsTable = ({ tests }: { tests: Test[] }) => {
  return (
    <table border={1} className={styles.table}>
      <thead>
        <tr>
          {['Type', 'Name', 'Edit', 'Run', 'Delete'].map((column, index) => (<th key={index}>{column}</th>))}
        </tr>
      </thead>
      <tbody>
        {tests.map((test, index) => (
          <tr key={index}>
            <td>Web Test</td>
            <td>{test.name}</td>
            <td>
              <Link href={
                {
                  pathname: '/webTemplates/editTest',
                  query: { testName: test.name }
                }
              }>
                <button type='button' className={styles.editBtn}>Edit</button>
              </Link>
            </td>
            <td>
              <button type='button' className={styles.runBtn} onClick={() => runTest(test.name)}>Run</button>
            </td>
            <td>
              <button type='button' className={styles.deleteBtn} onClick={() => deleteTest(test.name)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TestsTable;
