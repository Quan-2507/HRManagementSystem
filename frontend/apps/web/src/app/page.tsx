'use client';

import React from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';

export default function Dashboard() {
  return (
    <DashboardLayout>
      <div className="glass-panel" style={{ padding: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>Tổng quan hệ thống</h2>
        <p style={{ color: 'var(--color-text-muted)' }}>
          Chào mừng bạn đến với Hệ thống Quản trị Nhân sự (phiên bản Next.js). Vui lòng chọn chức năng ở menu bên trái.
        </p>
      </div>
    </DashboardLayout>
  );
}
