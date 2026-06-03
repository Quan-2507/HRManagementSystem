import React from 'react';
import { Download, SlidersHorizontal, TrendingUp, Users, Activity, BarChart2 } from 'lucide-react';
import styles from './Dashboard.module.css';

export default function PayrollDashboard() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleArea}>
          <div className={styles.orangeSquare}>+</div>
          <h1 className={styles.pageTitle}>Dashboard Bảng lương</h1>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.actionBtn}>
            <Download size={16} /> Export
          </button>
          <button className={styles.actionBtn}>
            <SlidersHorizontal size={16} /> Cài đặt
          </button>
        </div>
      </div>

      <div className={styles.tabsRow}>
        <div className={styles.tab}>Tổng quan</div>
        <div className={`${styles.tab} ${styles.activeTab}`}>Tổng hợp năm 2025</div>
      </div>

      <div className={styles.content}>
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <div className={styles.iconBox} style={{ color: '#3b82f6', backgroundColor: '#eff6ff' }}>
                <TrendingUp size={20} />
              </div>
              <span className={styles.statValue} style={{ color: '#3b82f6' }}>16.733.116.732 đ</span>
            </div>
            <div className={styles.statLabel}>Tổng lương đã chi</div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <div className={styles.iconBox} style={{ color: '#f59e0b', backgroundColor: '#fffbeb' }}>
                <Activity size={20} />
              </div>
              <span className={styles.statValue} style={{ color: '#f59e0b' }}>15.433.555.423 đ</span>
            </div>
            <div className={styles.statLabel}>Quỹ lương chi năm trước</div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <div className={styles.iconBox} style={{ color: '#8b5cf6', backgroundColor: '#f5f3ff' }}>
                <BarChart2 size={20} />
              </div>
              <span className={styles.statValue} style={{ color: '#8b5cf6' }}>1.000.324.677 đ</span>
            </div>
            <div className={styles.statLabel}>Dự kiến quỹ lương tháng hiện tại</div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <div className={styles.iconBox} style={{ color: '#ef4444', backgroundColor: '#fef2f2' }}>
                <Users size={20} />
              </div>
              <span className={styles.statValue} style={{ color: '#ef4444' }}>997.434.322 đ</span>
            </div>
            <div className={styles.statLabel}>Số lượng đã chi tháng trước</div>
          </div>
        </div>

        <div className={styles.chartsGrid}>
          <div className={styles.chartCardLarge}>
            <h3 className={styles.chartTitle}>Lương chi theo phòng ban</h3>
            <div className={styles.placeholderChart}>
              <div className={styles.mockLineChart}>
                {/* SVG mock for line chart */}
                <svg viewBox="0 0 500 150" className={styles.svgChart}>
                  <path d="M0,100 C50,50 100,150 150,100 C200,50 250,120 300,80 C350,40 400,100 450,50 L500,80 L500,150 L0,150 Z" fill="rgba(16, 185, 129, 0.1)" stroke="none" />
                  <path d="M0,100 C50,50 100,150 150,100 C200,50 250,120 300,80 C350,40 400,100 450,50 L500,80" fill="none" stroke="#10b981" strokeWidth="3" />
                  <circle cx="50" cy="50" r="4" fill="#ef4444" />
                  <circle cx="150" cy="100" r="4" fill="#3b82f6" />
                  <circle cx="250" cy="120" r="4" fill="#8b5cf6" />
                  <circle cx="350" cy="40" r="4" fill="#f59e0b" />
                </svg>
              </div>
            </div>
          </div>

          <div className={styles.chartCardSmall}>
            <h3 className={styles.chartTitle}>Lương theo ngày công</h3>
            <div className={styles.barChart}>
              <div className={styles.barRow}><span className={styles.barLabel}>Kỹ thuật</span><div className={styles.barTrack}><div className={styles.barFill} style={{ width: '80%', backgroundColor: '#8b5cf6' }}></div></div></div>
              <div className={styles.barRow}><span className={styles.barLabel}>Kinh doanh</span><div className={styles.barTrack}><div className={styles.barFill} style={{ width: '65%', backgroundColor: '#06b6d4' }}></div></div></div>
              <div className={styles.barRow}><span className={styles.barLabel}>Nhân sự</span><div className={styles.barTrack}><div className={styles.barFill} style={{ width: '40%', backgroundColor: '#f59e0b' }}></div></div></div>
              <div className={styles.barRow}><span className={styles.barLabel}>Kế toán</span><div className={styles.barTrack}><div className={styles.barFill} style={{ width: '50%', backgroundColor: '#3b82f6' }}></div></div></div>
              <div className={styles.barRow}><span className={styles.barLabel}>Marketing</span><div className={styles.barTrack}><div className={styles.barFill} style={{ width: '70%', backgroundColor: '#ec4899' }}></div></div></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
