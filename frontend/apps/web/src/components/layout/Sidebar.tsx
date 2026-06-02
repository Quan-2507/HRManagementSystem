'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Sidebar.module.css';

export const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  const menuItems = [
    { name: 'Tổng quan', path: '/', icon: '📊' },
    { name: 'Nhân sự', path: '/employees', icon: '👥' },
    { name: 'Chấm công', path: '#', icon: '⏱️' },
    { name: 'Cài đặt', path: '#', icon: '⚙️' },
  ];

  return (
    <aside className={`${styles.sidebar} ${collapsed ? styles.collapsed : ''}`}>
      <div className={styles.logoArea}>
        {collapsed ? 'HR' : 'HR Management'}
      </div>
      
      <ul className={styles.menuList}>
        <li>
          <Link 
            href="/departments" 
            className={`${styles.navLink} ${pathname === '/departments' ? styles.active : ''}`}
          >
            🏢 Phòng ban
          </Link>
        </li>
        <li>
          <Link 
            href="/attendance" 
            className={`${styles.navLink} ${pathname === '/attendance' ? styles.active : ''}`}
          >
            📍 Chấm công
          </Link>
        </li>
        <li>
          <Link 
            href="/leave-requests" 
            className={`${styles.navLink} ${pathname === '/leave-requests' ? styles.active : ''}`}
          >
            📝 Đơn từ
          </Link>
        </li>
        <li>
          <Link 
            href="/contracts" 
            className={`${styles.navLink} ${pathname === '/contracts' ? styles.active : ''}`}
          >
            📜 Hợp đồng
          </Link>
        </li>
        <li>
          <Link 
            href="/payroll" 
            className={`${styles.navLink} ${pathname === '/payroll' ? styles.active : ''}`}
          >
            💰 Bảng lương
          </Link>
        </li>
        {menuItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <li key={item.name} className={styles.menuItem}>
              <Link 
                href={item.path} 
                className={`${styles.menuLink} ${isActive ? styles.active : ''}`}
                title={collapsed ? item.name : ''}
              >
                <span className={styles.icon}>{item.icon}</span>
                <span className={styles.label}>{item.name}</span>
              </Link>
            </li>
          );
        })}
      </ul>

      <button 
        className={styles.toggleBtn} 
        onClick={() => setCollapsed(!collapsed)}
        title={collapsed ? "Mở rộng" : "Thu gọn"}
      >
        {collapsed ? '▶' : '◀'}
      </button>
    </aside>
  );
};
