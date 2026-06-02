'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './Header.module.css';

export const Header = () => {
  const router = useRouter();
  const [user, setUser] = useState<{ email: string; fullName: string } | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  const getInitials = (name: string) => {
    if (!name) return 'U';
    return name.charAt(0).toUpperCase();
  };

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <div className={styles.breadcrumb}>
          Hệ thống / <span style={{color: 'var(--color-text-main)', fontWeight: 500}}>Bảng điều khiển</span>
        </div>
      </div>
      <div className={styles.right}>
        <div className={styles.userInfo}>
          <div className={styles.avatar}>
            {getInitials(user?.fullName || user?.email || 'User')}
          </div>
          <span className={styles.userName}>{user?.fullName || user?.email}</span>
        </div>
        <button 
          onClick={handleLogout}
          style={{
            background: 'none', border: 'none', cursor: 'pointer', 
            color: 'var(--color-error)', fontSize: '0.875rem'
          }}
        >
          Đăng xuất
        </button>
      </div>
    </header>
  );
};
