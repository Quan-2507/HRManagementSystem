'use client';

import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Table, Column } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import styles from './payroll.module.css';

interface Payroll {
  id: string;
  employeeName: string;
  month: number;
  year: number;
  basicSalary: number;
  allowances: number;
  deductions: number;
  netSalary: number;
  status: number;
}

export default function PayrollPage() {
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  const [data, setData] = useState<Payroll[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  
  // Modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState({
    allowances: 0,
    deductions: 0
  });

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5205/api/payrolls/${selectedYear}/${selectedMonth}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Lỗi tải bảng lương');
      const json = await res.json();
      setData(json);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedMonth, selectedYear]);

  const handleGenerate = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5205/api/payrolls/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ month: selectedMonth, year: selectedYear })
      });
      const resData = await res.json();
      if (!res.ok) throw new Error(resData.message || 'Lỗi tạo bảng lương');
      alert(resData.message);
      fetchData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId) return;
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5205/api/payrolls/${editingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editFormData)
      });
      if (!res.ok) throw new Error('Lỗi cập nhật bảng lương');
      
      setIsEditModalOpen(false);
      fetchData();
      alert('Đã cập nhật phụ cấp / khấu trừ!');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditModal = (row: Payroll) => {
    setEditingId(row.id);
    setEditFormData({
      allowances: row.allowances,
      deductions: row.deductions
    });
    setIsEditModalOpen(true);
  };

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const columns: Column<Payroll>[] = [
    { header: 'Nhân viên', accessor: 'employeeName', width: '20%' },
    { 
      header: 'Lương CB', 
      accessor: (row) => formatMoney(row.basicSalary),
      width: '15%' 
    },
    { 
      header: 'Phụ cấp (+)', 
      accessor: (row) => formatMoney(row.allowances),
      width: '15%' 
    },
    { 
      header: 'Khấu trừ (-)', 
      accessor: (row) => formatMoney(row.deductions),
      width: '15%' 
    },
    { 
      header: 'Thực lãnh', 
      accessor: (row) => <strong style={{ color: '#28a745' }}>{formatMoney(row.netSalary)}</strong>,
      width: '15%' 
    },
    {
      header: 'Hành động',
      accessor: (row) => (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Button variant="secondary" onClick={() => openEditModal(row)} style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}>Điều chỉnh</Button>
        </div>
      ),
      width: '10%'
    }
  ];

  return (
    <DashboardLayout>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Bảng Lương Tháng {selectedMonth}/{selectedYear}</h1>
        <Button onClick={handleGenerate}>⚙️ Tự động tính lương tháng {selectedMonth}</Button>
      </div>

      <div className={styles.filterBar}>
        <span>Chọn tháng:</span>
        <select 
          className={styles.filterSelect}
          value={selectedMonth} 
          onChange={(e) => setSelectedMonth(Number(e.target.value))}
        >
          {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
            <option key={m} value={m}>Tháng {m}</option>
          ))}
        </select>
        <select 
          className={styles.filterSelect}
          value={selectedYear} 
          onChange={(e) => setSelectedYear(Number(e.target.value))}
        >
          {[currentYear - 1, currentYear, currentYear + 1].map(y => (
            <option key={y} value={y}>Năm {y}</option>
          ))}
        </select>
      </div>

      <div className={styles.tableContainer}>
        {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
        <Table<Payroll> 
          columns={columns} 
          data={data} 
          keyExtractor={(row) => row.id} 
        />
        {data.length === 0 && !loading && (
          <p style={{ textAlign: 'center', marginTop: '1rem', color: '#666' }}>
            Chưa có bảng lương nào trong tháng này. Nhấn "Tự động tính lương" để hệ thống lấy dữ liệu từ Hợp đồng.
          </p>
        )}
      </div>

      <Modal 
        isOpen={isEditModalOpen} 
        onClose={() => !isSubmitting && setIsEditModalOpen(false)} 
        title="Điều chỉnh Phụ cấp & Khấu trừ"
      >
        <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.9rem' }}>Phụ cấp (Thưởng, Ăn trưa...)</label>
            <Input 
              type="number"
              min="0"
              value={editFormData.allowances}
              onChange={(e) => setEditFormData({...editFormData, allowances: Number(e.target.value)})}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.9rem' }}>Khấu trừ (Phạt, Tạm ứng...)</label>
            <Input 
              type="number"
              min="0"
              value={editFormData.deductions}
              onChange={(e) => setEditFormData({...editFormData, deductions: Number(e.target.value)})}
            />
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
            <Button type="button" variant="secondary" onClick={() => setIsEditModalOpen(false)} disabled={isSubmitting}>
              Hủy
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Đang lưu...' : 'Lưu điều chỉnh'}
            </Button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
}
