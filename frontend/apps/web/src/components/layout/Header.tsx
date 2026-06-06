'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Bell, Search, Menu, LogOut, User } from 'lucide-react';
import styles from './Header.module.css';

export const Header = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<{ email: string; fullName: string } | null>(null);
  
  // Interactive states
  const [searchQuery, setSearchQuery] = useState('');
  const [isStarred, setIsStarred] = useState(false);
  const [notificationsCount, setNotificationsCount] = useState(12);
  const [messagesCount, setMessagesCount] = useState(6);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [activeTab, setActiveTab] = useState('Thông tin chung');

  // Close dropdowns on outside click can be added later if needed, simple toggle for now
  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    setShowMessages(false);
    setShowUserMenu(false);
    setShowSearchDropdown(false);
  };

  const toggleMessages = () => {
    setShowMessages(!showMessages);
    setShowNotifications(false);
    setShowUserMenu(false);
    setShowSearchDropdown(false);
  };

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
    setShowNotifications(false);
    setShowMessages(false);
    setShowSearchDropdown(false);
  };

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

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setShowSearchDropdown(true);
    }
  };

  const markAllNotificationsAsRead = () => {
    setNotificationsCount(0);
  };

  const markAllMessagesAsRead = () => {
    setMessagesCount(0);
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
          <div className={styles.searchContainer}>
            <div className={styles.searchBar}>
              <Search size={16} className={styles.searchIcon} />
              <input 
                type="text" 
                placeholder="Tìm kiếm..." 
                className={styles.searchInput} 
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (e.target.value.length > 0) {
                    setShowSearchDropdown(true);
                  } else {
                    setShowSearchDropdown(false);
                  }
                }}
                onKeyDown={handleSearch}
              />
            </div>
            
            {showSearchDropdown && searchQuery && (
              <div className={`${styles.dropdownMenu} ${styles.dropdownMenuLeft}`}>
                <div className={styles.dropdownHeader}>
                  Kết quả tìm kiếm cho "{searchQuery}"
                </div>
                <div className={styles.dropdownBody}>
                  <div className={styles.dropdownItem}>
                    <div className={styles.itemAvatar} style={{ backgroundColor: '#10b981' }}>HS</div>
                    <div className={styles.itemContent}>
                      <div className={styles.itemTitle}>Hồ sơ nhân sự: Nguyễn Văn A</div>
                      <div className={styles.itemDesc}>Phòng Kinh doanh • NV Chính thức</div>
                    </div>
                  </div>
                  <div className={styles.dropdownItem}>
                    <div className={styles.itemAvatar} style={{ backgroundColor: '#3b82f6' }}>BL</div>
                    <div className={styles.itemContent}>
                      <div className={styles.itemTitle}>Bảng lương tháng 5/2026</div>
                      <div className={styles.itemDesc}>Đã chốt • 24 nhân sự</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <button className={styles.iconBtn} onClick={() => setIsStarred(!isStarred)} title="Yêu thích">
            <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill={isStarred ? "currentColor" : "none"} strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg>
          </button>

          <div style={{ position: 'relative' }}>
            <button className={styles.iconBtn} onClick={toggleNotifications} title="Thông báo">
              <Bell size={20} />
              {notificationsCount > 0 && <span className={styles.badge}>{notificationsCount}</span>}
            </button>
            
            {showNotifications && (
              <div className={styles.dropdownMenu}>
                <div className={styles.dropdownHeader}>
                  <span>Thông báo</span>
                  <span className={styles.dropdownAction} onClick={markAllNotificationsAsRead}>Đánh dấu đã đọc</span>
                </div>
                <div className={styles.dropdownBody}>
                  <div className={`${styles.dropdownItem} ${notificationsCount > 0 ? styles.unread : ''}`}>
                    <div className={styles.itemAvatar}>HR</div>
                    <div className={styles.itemContent}>
                      <div className={styles.itemTitle}>Bảng lương tháng 6/2026</div>
                      <div className={styles.itemDesc}>Trần Minh Quân vừa cập nhật bảng lương mới. Yêu cầu xem xét.</div>
                      <div className={styles.itemTime}>10 phút trước</div>
                    </div>
                    {notificationsCount > 0 && <div className={styles.unreadDot}></div>}
                  </div>
                  <div className={styles.dropdownItem}>
                    <div className={styles.itemAvatar} style={{ backgroundColor: '#f59e0b' }}>sys</div>
                    <div className={styles.itemContent}>
                      <div className={styles.itemTitle}>Hệ thống bảo trì</div>
                      <div className={styles.itemDesc}>Hệ thống sẽ bảo trì vào lúc 00:00 ngày 10/06/2026.</div>
                      <div className={styles.itemTime}>2 ngày trước</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div style={{ position: 'relative' }}>
            <button className={styles.iconBtn} onClick={toggleMessages} title="Tin nhắn">
              <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
              {messagesCount > 0 && <span className={styles.badge}>{messagesCount}</span>}
            </button>
            
            {showMessages && (
              <div className={styles.dropdownMenu}>
                <div className={styles.dropdownHeader}>
                  <span>Tin nhắn</span>
                  <span className={styles.dropdownAction} onClick={markAllMessagesAsRead}>Đã đọc tất cả</span>
                </div>
                <div className={styles.dropdownBody}>
                  <div className={`${styles.dropdownItem} ${messagesCount > 0 ? styles.unread : ''}`}>
                    <div className={styles.itemAvatar} style={{ backgroundColor: '#10b981' }}>L</div>
                    <div className={styles.itemContent}>
                      <div className={styles.itemTitle}>Lê Thị B</div>
                      <div className={styles.itemDesc}>Anh kiểm tra giúp em phụ cấp đi lại của tháng này nhé. Hình như bị thiếu...</div>
                      <div className={styles.itemTime}>Vừa xong</div>
                    </div>
                    {messagesCount > 0 && <div className={styles.unreadDot}></div>}
                  </div>
                  <div className={styles.dropdownItem}>
                    <div className={styles.itemAvatar} style={{ backgroundColor: '#8b5cf6' }}>K</div>
                    <div className={styles.itemContent}>
                      <div className={styles.itemTitle}>Phòng Kế toán</div>
                      <div className={styles.itemDesc}>Đã nhận được lệnh chi lương MB Bank. Đang tiến hành duyệt...</div>
                      <div className={styles.itemTime}>1 giờ trước</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className={styles.divider}></div>

          <div className={styles.userInfo} style={{ position: 'relative' }}>
            <div 
              className={styles.avatar} 
              onClick={toggleUserMenu}
              style={{ cursor: 'pointer' }}
              title="Tài khoản"
            >
              {getInitials(user?.fullName || user?.email || 'User')}
            </div>
            
            {showUserMenu && (
              <div className={`${styles.dropdownMenu} ${styles.userDropdownMenu}`}>
                <div className={styles.dropdownItem} onClick={() => alert("Chức năng cập nhật hồ sơ cá nhân đang phát triển.")}>
                  Hồ sơ cá nhân
                </div>
                <div className={styles.dropdownItem} onClick={() => alert("Chức năng đổi mật khẩu đang phát triển.")}>
                  Đổi mật khẩu
                </div>
                <div className={styles.dropdownDivider}></div>
                <div className={styles.dropdownItem} style={{ color: 'var(--color-error)' }} onClick={handleLogout}>
                  Đăng xuất
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className={styles.bottomRow}>
        <div className={styles.tabs}>
          <button 
            className={`${styles.tab} ${activeTab === 'Thông tin chung' ? styles.active : ''}`}
            onClick={() => setActiveTab('Thông tin chung')}
          >
            Thông tin chung
          </button>
          <button 
            className={`${styles.tab} ${activeTab === 'Ứng viên (12)' ? styles.active : ''}`}
            onClick={() => setActiveTab('Ứng viên (12)')}
          >
            Ứng viên (12)
          </button>
          <button 
            className={`${styles.tab} ${activeTab === 'Báo cáo' ? styles.active : ''}`}
            onClick={() => setActiveTab('Báo cáo')}
          >
            Báo cáo
          </button>
        </div>
      </div>
    </header>
  );
};
