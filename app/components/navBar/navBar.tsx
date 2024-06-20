'use client';

import Link from "next/link";
import styles from "./navBar.module.css";
import { usePathname } from 'next/navigation';
import { STRINGS } from "@/constants/app";
import { useCallback, useMemo } from "react";

const Navbar = () => {
  const pathname = usePathname()

  const navBarPages = useMemo(() => (Object.values(STRINGS.PAGES)
  ), [])

  const addActiveClass = useCallback((path: string) =>
  (
    `${styles.link} ${pathname === path ? styles.active : ''}`
  ), [pathname]
  );

  return (
    <nav className={styles.navbar}>
      {navBarPages.map(({ NAME, PATH }) => (
        <Link key={PATH} className={addActiveClass(PATH)} href={PATH}>{NAME}</Link>
      ))}
    </nav>
  );
};

export default Navbar;