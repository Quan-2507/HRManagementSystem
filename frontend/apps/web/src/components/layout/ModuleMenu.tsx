import React from 'react';
import { useRouter } from 'next/navigation';
import { 
  Search,
  Users,
  CalendarCheck,
  Briefcase,
  Star,
  Target,
  Umbrella,
  GraduationCap,
  Globe,
  CheckSquare,
  FolderOpen,
  FileText,
  FileSignature,
  CalendarDays,
  FileCode2,
  Box
} from 'lucide-react';
import styles from './ModuleMenu.module.css';

interface ModuleMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ModuleMenu: React.FC<ModuleMenuProps> = ({ isOpen, onClose }) => {
  const router = useRouter();

  const handleNavigate = (path: string) => {
    router.push(path);
    onClose();
  };

  const workplaceApps = [
    { name: 'Mạng nội bộ', icon: Globe, color: '#3b82f6', bg: '#eff6ff', path: '/workplace/social' },
    { name: 'Công việc', icon: CheckSquare, color: '#10b981', bg: '#ecfdf5', path: '/workplace/tasks' },
    { name: 'Dự án', icon: FolderOpen, color: '#f59e0b', bg: '#fffbeb', path: '/workplace/projects' },
    { name: 'Quy trình', icon: Target, color: '#8b5cf6', bg: '#f5f3ff', path: '/workplace/processes' },
    { name: 'Tài liệu', icon: FileText, color: '#f97316', bg: '#fff7ed', path: '/workplace/docs' },
    { name: 'Ký số', icon: FileSignature, color: '#06b6d4', bg: '#ecfeff', path: '/workplace/esign' },
    { name: 'Lịch biểu', icon: CalendarDays, color: '#e11d48', bg: '#fff1f2', path: '/workplace/calendar' },
    { name: 'Văn bản', icon: FileCode2, color: '#f97316', bg: '#fff7ed', path: '/workplace/documents' },
    { name: 'Tài sản', icon: Box, color: '#10b981', bg: '#ecfdf5', path: '/workplace/assets' },
  ];

  const hrmApps = [
    { name: 'Đơn từ', icon: FileText, color: '#3b82f6', bg: '#eff6ff', path: '/leave-requests' },
    { name: 'Tuyển dụng', icon: Users, color: '#f97316', bg: '#fff7ed', path: '/' },
    { name: 'Nhân sự', icon: Users, color: '#10b981', bg: '#ecfdf5', path: '/employees' },
    { name: 'Đánh giá', icon: Star, color: '#f59e0b', bg: '#fffbeb', path: '/performance' },
    { name: 'Đào tạo', icon: GraduationCap, color: '#e11d48', bg: '#fff1f2', path: '/training' },
    { name: 'Chấm công', icon: CalendarCheck, color: '#3b82f6', bg: '#eff6ff', path: '/attendance' },
    { name: 'Bảng lương', icon: Briefcase, color: '#f97316', bg: '#fff7ed', path: '/payroll' },
    { name: 'KPI', icon: Target, color: '#10b981', bg: '#ecfdf5', path: '/kpi' },
    { name: 'OKR', icon: Star, color: '#f59e0b', bg: '#fffbeb', path: '/okr' },
    { name: '1-IVAN', icon: Umbrella, color: '#e11d48', bg: '#fff1f2', path: '/ivan' },
  ];

  return (
    <>
      <div 
        className={`${styles.backdrop} ${isOpen ? styles.open : ''}`} 
        onClick={onClose}
      />
      
      <div className={`${styles.drawer} ${isOpen ? styles.open : ''}`}>
        <div className={styles.header}>
          <div className={styles.logo}>
            <span className={styles.logoHighlight}>1</span>Office
          </div>
          <button className={styles.searchBtn} title="Tìm kiếm chức năng">
            <Search size={18} />
          </button>
        </div>

        <div className={styles.content}>
          <div className={styles.section}>
            <div className={styles.sectionTitle}>WORKPLACE</div>
            <div className={styles.grid}>
              {workplaceApps.map((app) => (
                <div 
                  key={app.name} 
                  className={styles.appItem}
                  onClick={() => handleNavigate(app.path)}
                >
                  <div 
                    className={styles.iconBox} 
                    style={{ '--bg-color': app.bg, '--icon-color': app.color } as React.CSSProperties}
                  >
                    <app.icon size={22} strokeWidth={2} />
                  </div>
                  <span className={styles.appName}>{app.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.section}>
            <div className={styles.sectionTitle}>HRM</div>
            <div className={styles.grid}>
              {hrmApps.map((app) => (
                <div 
                  key={app.name} 
                  className={styles.appItem}
                  onClick={() => handleNavigate(app.path)}
                >
                  <div 
                    className={styles.iconBox} 
                    style={{ '--bg-color': app.bg, '--icon-color': app.color } as React.CSSProperties}
                  >
                    <app.icon size={22} strokeWidth={2} />
                  </div>
                  <span className={styles.appName}>{app.name}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </>
  );
};
