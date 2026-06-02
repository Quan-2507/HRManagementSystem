'use client';

import React from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Users, Briefcase, FileCheck2, UserMinus } from 'lucide-react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, 
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  BarChart, Bar
} from 'recharts';
import styles from './page.module.css';

export default function Dashboard() {
  // Mock data for charts
  const contractData = [
    { name: 'Hợp đồng 1 năm', value: 45, color: '#f44336' },
    { name: 'Hợp đồng 3 năm', value: 30, color: '#4caf50' },
    { name: 'Hợp đồng vô thời hạn', value: 15, color: '#2196f3' },
    { name: 'Thử việc', value: 10, color: '#9c27b0' }
  ];

  const decisionData = [
    { name: 'Jan', value: 5 },
    { name: 'Feb', value: 2 },
    { name: 'Mar', value: 8 },
    { name: 'Apr', value: 4 },
    { name: 'May', value: 7 },
  ];

  const positionData = [
    { name: 'Chuyên viên', value: 35 },
    { name: 'Trưởng phòng', value: 10 },
    { name: 'Giám đốc', value: 3 },
    { name: 'Cộng tác viên', value: 15 },
  ];

  return (
    <DashboardLayout>
      <div className={`${styles.dashboardContainer} animate-fade-in-up`}>
        
        {/* Top Stat Cards */}
        <div className={styles.statsGrid}>
          <div className="card">
            <div className={styles.statContent}>
              <div className={styles.statIconWrapper} style={{ backgroundColor: '#e3f2fd', color: '#1976d2' }}>
                <Users size={24} />
              </div>
              <div className={styles.statInfo}>
                <span className={styles.statLabel}>Tổng số nhân sự</span>
                <span className={styles.statValue} style={{ color: '#1976d2' }}>221</span>
              </div>
            </div>
          </div>
          <div className="card">
            <div className={styles.statContent}>
              <div className={styles.statIconWrapper} style={{ backgroundColor: '#e8f5e9', color: '#388e3c' }}>
                <Users size={24} />
              </div>
              <div className={styles.statInfo}>
                <span className={styles.statLabel}>Nhân sự đang làm việc</span>
                <span className={styles.statValue} style={{ color: '#388e3c' }}>154</span>
              </div>
            </div>
          </div>
          <div className="card">
            <div className={styles.statContent}>
              <div className={styles.statIconWrapper} style={{ backgroundColor: '#fff3e0', color: '#f57c00' }}>
                <Briefcase size={24} />
              </div>
              <div className={styles.statInfo}>
                <span className={styles.statLabel}>Nhân sự mới</span>
                <span className={styles.statValue} style={{ color: '#f57c00' }}>10</span>
              </div>
            </div>
          </div>
          <div className="card">
            <div className={styles.statContent}>
              <div className={styles.statIconWrapper} style={{ backgroundColor: '#ffebee', color: '#d32f2f' }}>
                <UserMinus size={24} />
              </div>
              <div className={styles.statInfo}>
                <span className={styles.statLabel}>Nhân sự nghỉ việc</span>
                <span className={styles.statValue} style={{ color: '#d32f2f' }}>67</span>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className={styles.chartsGrid}>
          
          {/* Main Left Area: Bar Chart */}
          <div className={`card ${styles.chartSpan2}`}>
            <h3 className={styles.chartTitle}>Biểu đồ nhân sự theo vị trí</h3>
            <div className={styles.chartContainer}>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={positionData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={100} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#f4b400" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Right Area: Pie Chart */}
          <div className="card">
            <h3 className={styles.chartTitle}>Biểu đồ theo loại hợp đồng</h3>
            <div className={styles.chartContainer}>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={contractData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {contractData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Bottom Right Area: Line Chart */}
          <div className="card">
            <h3 className={styles.chartTitle}>Quyết định trong tháng</h3>
            <div className={styles.chartContainer}>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={decisionData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="#1a73e8" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Info Mini Cards */}
          <div className={styles.miniStatsGrid}>
             <div className="card">
                <div className={styles.miniStatContent}>
                  <FileCheck2 size={28} color="#1976d2" />
                  <div className={styles.miniStatInfo}>
                    <span className={styles.miniStatLabel}>Hợp đồng mới</span>
                    <span className={styles.miniStatValue} style={{ color: '#1976d2' }}>5</span>
                  </div>
                </div>
             </div>
             <div className="card">
                <div className={styles.miniStatContent}>
                   <FileCheck2 size={28} color="#f57c00" />
                   <div className={styles.miniStatInfo}>
                      <span className={styles.miniStatLabel}>Sắp hết hạn</span>
                      <span className={styles.miniStatValue} style={{ color: '#f57c00' }}>1</span>
                   </div>
                </div>
             </div>
          </div>
          
        </div>
      </div>
    </DashboardLayout>
  );
}
