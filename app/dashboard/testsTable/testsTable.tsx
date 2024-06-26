'use client';

import Link from 'next/link';
import React from 'react';
import styles from './testsTable.module.css';
import { runTest, deleteTest } from '../actions';
import { Test } from '../interface';

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
            <td>{test.testName}</td>
            <td>
              <Link href={
                {
                  pathname: '/webTemplates/editTest',
                  query: { testName: test.testName }
                }
              }>
                <button type='button' className={styles.editBtn}>Edit</button>
              </Link>
            </td>
            <td>
              <button type='button' className={styles.runBtn} onClick={() => runTest(test.testName)}>Run</button>
            </td>
            <td>
              <button type='button' className={styles.deleteBtn} onClick={() => deleteTest(test.testName)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TestsTable;
