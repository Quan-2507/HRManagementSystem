'use client';

import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Table, Column } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import styles from './contracts.module.css';

interface Employee {
  id: string;
  fullName: string;
}

interface Contract {
  id: string;
  employeeName: string;
  contractNumber: string;
  type: number;
  startDate: string;
  endDate: string | null;
  basicSalary: number;
  status: number;
}

const ContractTypeMap: Record<number, string> = {
  1: 'Thử việc',
  2: 'Xác định thời hạn',
  3: 'Vô thời hạn'
};

export default function ContractsPage() {
  const [data, setData] = useState<Contract[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    employeeId: '',
    contractNumber: '',
    type: 2, // Xác định thời hạn
    startDate: '',
    endDate: '',
    basicSalary: 0
  });

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      
      const [contractRes, empRes] = await Promise.all([
        fetch('http://localhost:5205/api/contracts', { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch('http://localhost:5205/api/employees', { headers: { 'Authorization': `Bearer ${token}` } })
      ]);
      
      if (!contractRes.ok) throw new Error('Lỗi tải danh sách hợp đồng');
      
      const contracts = await contractRes.json();
      setData(contracts);

      if (empRes.ok) {
        const empData = await empRes.json();
        setEmployees(empData.items || []);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5205/api/contracts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          employeeId: formData.employeeId,
          contractNumber: formData.contractNumber,
          type: formData.type,
          startDate: formData.startDate,
          endDate: formData.endDate || null,
          basicSalary: formData.basicSalary
        })
      });
      
      if (!res.ok) throw new Error('Lỗi khi lưu hợp đồng');

      setIsModalOpen(false);
      setFormData({ employeeId: '', contractNumber: '', type: 2, startDate: '', endDate: '', basicSalary: 0 });
      fetchData();
      alert('Tạo hợp đồng thành công!');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTerminate = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn chấm dứt hợp đồng này?')) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5205/api/contracts/${id}/terminate`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error('Lỗi khi chấm dứt hợp đồng');
      fetchData();
      alert('Đã chấm dứt hợp đồng!');
    } catch (err: any) {
      alert(err.message);
    }
  };

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const columns: Column<Contract>[] = [
    { header: 'Số HĐ', accessor: 'contractNumber', width: '15%' },
    { header: 'Nhân viên', accessor: 'employeeName', width: '20%' },
    { 
      header: 'Loại HĐ', 
      accessor: (row) => ContractTypeMap[row.type] || 'Khác',
      width: '15%' 
    },
    { 
      header: 'Thời hạn', 
      accessor: (row) => `${new Date(row.startDate).toLocaleDateString('vi-VN')} - ${row.endDate ? new Date(row.endDate).toLocaleDateString('vi-VN') : 'Không thời hạn'}`,
      width: '20%' 
    },
    { 
      header: 'Lương CB', 
      accessor: (row) => formatMoney(row.basicSalary),
      width: '10%' 
    },
    { 
      header: 'Trạng thái', 
      accessor: (row) => {
        if (row.status === 1) return <Badge variant="success">Hiệu lực</Badge>;
        if (row.status === 2) return <Badge variant="neutral">Hết hạn</Badge>;
        return <Badge variant="danger" style={{ backgroundColor: '#dc3545' }}>Chấm dứt</Badge>;
      },
      width: '10%' 
    },
    {
      header: 'Hành động',
      accessor: (row) => (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {row.status === 1 && (
            <Button onClick={() => handleTerminate(row.id)} style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem', backgroundColor: '#dc3545', color: '#fff', borderColor: '#dc3545' }}>Chấm dứt</Button>
          )}
        </div>
      ),
      width: '10%'
    }
  ];

  return (
    <DashboardLayout>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Quản lý Hợp đồng</h1>
        <Button onClick={() => setIsModalOpen(true)}>+ Tạo hợp đồng mới</Button>
      </div>

      <div className={styles.tableContainer}>
        {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
        <Table<Contract> 
          columns={columns} 
          data={data} 
          keyExtractor={(row) => row.id} 
        />
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => !isSubmitting && setIsModalOpen(false)} 
        title="Tạo hợp đồng mới"
      >
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.9rem' }}>Nhân viên *</label>
            <select 
              required
              style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
              value={formData.employeeId}
              onChange={(e) => setFormData({...formData, employeeId: e.target.value})}
            >
              <option value="">-- Chọn nhân viên --</option>
              {employees.map(e => (
                <option key={e.id} value={e.id}>{e.fullName}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.9rem' }}>Số hợp đồng *</label>
            <Input 
              required
              placeholder="VD: HD-2026-001" 
              value={formData.contractNumber}
              onChange={(e) => setFormData({...formData, contractNumber: e.target.value})}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.9rem' }}>Loại hợp đồng *</label>
            <select 
              required
              style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
              value={formData.type}
              onChange={(e) => setFormData({...formData, type: Number(e.target.value)})}
            >
              <option value={1}>Thử việc</option>
              <option value={2}>Xác định thời hạn</option>
              <option value={3}>Vô thời hạn</option>
            </select>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.9rem' }}>Từ ngày *</label>
              <Input 
                required
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({...formData, startDate: e.target.value})}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.9rem' }}>Đến ngày</label>
              <Input 
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({...formData, endDate: e.target.value})}
              />
            </div>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.9rem' }}>Lương cơ bản (VND) *</label>
            <Input 
              required
              type="number"
              min="0"
              placeholder="VD: 15000000" 
              value={formData.basicSalary}
              onChange={(e) => setFormData({...formData, basicSalary: Number(e.target.value)})}
            />
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)} disabled={isSubmitting}>
              Hủy
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Đang lưu...' : 'Tạo hợp đồng'}
            </Button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
}
