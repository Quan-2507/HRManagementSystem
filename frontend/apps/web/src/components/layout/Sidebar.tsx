'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Briefcase,
  Megaphone,
  CalendarCheck,
  Star,
  Settings,
  LayoutGrid,
  Percent,
  Box,
  PieChart
} from 'lucide-react';
import styles from './Sidebar.module.css';
import { ModuleMenu } from './ModuleMenu';

export const Sidebar = () => {
  const pathname = usePathname();
  const [isModuleMenuOpen, setIsModuleMenuOpen] = useState(false);

  // Menu cho phân hệ Tuyển dụng (Mặc định)
  const recruitmentMenu = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Ứng viên', path: '/employees', icon: Users },
    { name: 'Đề xuất', path: '/leave-requests', icon: FileText },
    { name: 'Chiến dịch', path: '/contracts', icon: Megaphone },
    { name: 'Phỏng vấn', path: '/attendance', icon: CalendarCheck },
    { name: 'Đánh giá', path: '/performance', icon: Star },
    { name: 'Định biên', path: '/departments', icon: Briefcase },
  ];

  // Menu cho phân hệ Tiền lương (Payroll)
  const payrollMenu = [
    { name: 'Dashboard', path: '/payroll/dashboard', icon: LayoutDashboard },
    { name: 'Lương', path: '/payroll/salary', icon: Briefcase },
    { name: 'Bảng lương', path: '/payroll', icon: FileText },
    { name: 'Thuế TNCN', path: '/payroll/tax', icon: Percent },
    { name: 'Sản phẩm', path: '/payroll/products', icon: Box },
    { name: 'Báo cáo', path: '/payroll/reports', icon: PieChart },
  ];

  // Xác định menu hiện tại dựa trên URL
  const isPayrollModule = pathname.startsWith('/payroll');
  const currentMenu = isPayrollModule ? payrollMenu : recruitmentMenu;

  return (
    <>
      <aside className={styles.sidebar}>
        <div 
          className={styles.logoArea} 
          title="Menu Phân hệ"
          onClick={() => setIsModuleMenuOpen(true)}
        >
          <LayoutGrid size={24} />
        </div>
        
        <ul className={styles.menuList}>
          {currentMenu.map((item) => {
            // Logic active chính xác hơn cho nested routes
            const isActive = pathname === item.path || (item.path !== '/' && item.path !== '/payroll' && pathname.startsWith(item.path));
            const Icon = item.icon;
            return (
              <li key={item.name} className={styles.menuItem}>
                <Link 
                  href={item.path} 
                  className={`${styles.menuLink} ${isActive ? styles.active : ''}`}
                  title={item.name}
                >
                  <div className={styles.iconWrapper}>
                    <Icon size={24} strokeWidth={isActive ? 2 : 1.5} />
                  </div>
                  <span className={styles.label}>{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        <div className={styles.bottomMenu}>
          <div className={styles.menuLink} title="Tùy chỉnh">
            <div className={styles.iconWrapper}>
              <Settings size={22} strokeWidth={1.5} />
            </div>
            <span className={styles.label}>Tùy chỉnh</span>
          </div>
        </div>
      </aside>

      <ModuleMenu 
        isOpen={isModuleMenuOpen} 
        onClose={() => setIsModuleMenuOpen(false)} 
      />
    </>
  );
};
