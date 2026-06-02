'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  Clock, 
  FileText, 
  Wallet, 
  Briefcase,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import styles from './Sidebar.module.css';

export const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  const menuItems = [
    { name: 'Tổng quan', path: '/', icon: LayoutDashboard },
    { name: 'Nhân sự', path: '/employees', icon: Users },
    { name: 'Chấm công', path: '/attendance', icon: Clock },
    { name: 'Đơn từ', path: '/leave-requests', icon: FileText },
    { name: 'Hợp đồng', path: '/contracts', icon: Briefcase },
    { name: 'Bảng lương', path: '/payroll', icon: Wallet },
  ];

  return (
    <aside className={`${styles.sidebar} ${collapsed ? styles.collapsed : ''}`}>
      <div className={styles.logoArea}>
        {collapsed ? (
          <div className={styles.logoIcon}>HR</div>
        ) : (
          <div className={styles.logoFull}>
            <span className={styles.logoHighlight}>1</span>HRM
          </div>
        )}
      </div>
      
      <ul className={styles.menuList}>
        {menuItems.map((item) => {
          const isActive = pathname === item.path || (item.path !== '/' && pathname.startsWith(item.path));
          const Icon = item.icon;
          return (
            <li key={item.name} className={styles.menuItem}>
              <Link 
                href={item.path} 
                className={`${styles.menuLink} ${isActive ? styles.active : ''}`}
                title={collapsed ? item.name : ''}
              >
                <div className={styles.iconWrapper}>
                  <Icon size={20} className={styles.icon} strokeWidth={isActive ? 2.5 : 2} />
                </div>
                {!collapsed && <span className={styles.label}>{item.name}</span>}
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
        {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
      </button>
    </aside>
  );
};
