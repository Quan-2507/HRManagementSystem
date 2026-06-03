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
      <div className={styles.topRow}>
        <div className={styles.left}>
          <div className={styles.pageInfo}>
            <div className={styles.plusIcon}>+</div>
            <h1 className={styles.pageTitle}>{getPageTitle()}</h1>
          </div>
        </div>
        
        <div className={styles.right}>
          <div className={styles.searchBar}>
            <Search size={16} className={styles.searchIcon} />
            <input type="text" placeholder="Tìm kiếm..." className={styles.searchInput} />
          </div>
          
          <button className={styles.iconBtn}>
            <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg>
          </button>

          <button className={styles.iconBtn}>
            <Bell size={20} />
            <span className={styles.badge}>12</span>
          </button>

          <button className={styles.iconBtn}>
            <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
            <span className={styles.badge}>6</span>
          </button>

          <div className={styles.divider}></div>

          <div className={styles.userInfo}>
            <div className={styles.avatar}>
              {getInitials(user?.fullName || user?.email || 'User')}
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
      </div>
      <div className={styles.bottomRow}>
        <div className={styles.tabs}>
          <button className={`${styles.tab} ${styles.active}`}>Thông tin chung</button>
          <button className={styles.tab}>Ứng viên (12)</button>
          <button className={styles.tab}>Báo cáo</button>
        </div>
      </div>
    </header>
  );
};
