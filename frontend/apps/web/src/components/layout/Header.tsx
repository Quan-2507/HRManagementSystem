'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Bell, Search, Menu, LogOut, User } from 'lucide-react';
import styles from './Header.module.css';

export const Header = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<{ email: string; fullName: string } | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:5205/api/auth/logout', { 
        method: 'POST',
        credentials: 'include'
      });
    } catch (e) {
      console.error(e);
    }
    localStorage.removeItem('user');
    router.push('/login');
  };

  const getInitials = (name: string) => {
    if (!name) return 'U';
    const parts = name.split(' ');
    if (parts.length > 1) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  // Map path to title
  const getPageTitle = () => {
    if (pathname === '/') return 'Tổng hợp';
    if (pathname.startsWith('/employees')) return 'Nhân sự';
    if (pathname.startsWith('/attendance')) return 'Chấm công';
    if (pathname.startsWith('/departments')) return 'Phòng ban';
    if (pathname.startsWith('/leave-requests')) return 'Đơn từ';
    if (pathname.startsWith('/contracts')) return 'Hợp đồng';
    if (pathname.startsWith('/payroll')) return 'Bảng lương';
    return 'Dashboard';
  };

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <div className={styles.pageInfo}>
          <h1 className={styles.pageTitle}>{getPageTitle()}</h1>
          <div className={styles.tabs}>
            <button className={`${styles.tab} ${styles.active}`}>Tổng hợp</button>
            <button className={styles.tab}>Tổng quan</button>
          </div>
        </div>
      </div>
      
      <div className={styles.right}>
        <div className={styles.searchBar}>
          <Search size={18} className={styles.searchIcon} />
          <input type="text" placeholder="Tìm kiếm..." className={styles.searchInput} />
        </div>
        
        <button className={styles.iconBtn}>
          <Bell size={20} />
          <span className={styles.badge}>3</span>
        </button>

        <button className={styles.iconBtn}>
          <Menu size={20} />
        </button>

        <div className={styles.divider}></div>

        <div className={styles.userInfo}>
          <div className={styles.avatar}>
            {getInitials(user?.fullName || user?.email || 'User')}
          </div>
          <div className={styles.userDetails}>
            <span className={styles.userName}>{user?.fullName || 'Administrator'}</span>
            <span className={styles.userRole}>Quản trị viên</span>
          </div>
        </div>

        <button 
          className={styles.logoutBtn}
          onClick={handleLogout}
          title="Đăng xuất"
        >
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
};
