'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '../components/ui/Button';

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<{ email: string; fullName: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token) {
      router.push('/login');
    } else {
      if (userData) {
        setUser(JSON.parse(userData));
      }
      setLoading(false);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  if (loading) return null;

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-primary)' }}>HR Management</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span>Xin chào, <strong>{user?.fullName || user?.email}</strong></span>
          <Button variant="secondary" onClick={handleLogout}>Đăng xuất</Button>
        </div>
      </header>

      <main>
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h2>Tổng quan hệ thống</h2>
          <p style={{ color: 'var(--color-text-muted)', marginTop: '0.5rem' }}>
            Chào mừng bạn đến với Hệ thống Quản trị Nhân sự (phiên bản Next.js).
          </p>
        </div>
      </main>
    </div>
  );
}
