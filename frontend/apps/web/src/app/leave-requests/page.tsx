'use client';

import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Table, Column } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import styles from './leave-requests.module.css';

interface LeaveRequest {
  id: string;
  employeeName: string;
  leaveType: number;
  startDate: string;
  endDate: string;
  reason: string;
  status: number;
  approverName: string | null;
}

const LeaveTypeMap: Record<number, string> = {
  1: 'Nghỉ ốm',
  2: 'Phép năm',
  3: 'Không lương',
  4: 'Thai sản'
};

export default function LeaveRequestsPage() {
  const [data, setData] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [viewMode, setViewMode] = useState<'all' | 'my'>('all');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    leaveType: 2, // Phép năm by default
    startDate: '',
    endDate: '',
    reason: ''
  });

  const fetchRequests = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const endpoint = viewMode === 'all' ? 'api/leaveRequests' : 'api/leaveRequests/my';
      const res = await fetch(`http://localhost:5205/${endpoint}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error('Lỗi khi lấy dữ liệu đơn từ');
      const json = await res.json();
      setData(json);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [viewMode]);

  const handleSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5205/api/leaveRequests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Lỗi khi tạo đơn');
      }

      setIsModalOpen(false);
      setFormData({ leaveType: 2, startDate: '', endDate: '', reason: '' });
      fetchRequests();
      alert('Nộp đơn thành công!');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApproveReject = async (id: string, newStatus: number) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5205/api/leaveRequests/${id}/approve`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Lỗi khi duyệt đơn');
      }
      fetchRequests();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const columns: Column<LeaveRequest>[] = [
    { header: 'Nhân viên', accessor: 'employeeName', width: '15%' },
    { 
      header: 'Loại nghỉ', 
      accessor: (row) => LeaveTypeMap[row.leaveType] || 'Khác',
      width: '10%' 
    },
    { 
      header: 'Thời gian', 
      accessor: (row) => `${new Date(row.startDate).toLocaleDateString('vi-VN')} - ${new Date(row.endDate).toLocaleDateString('vi-VN')}`,
      width: '20%' 
    },
    { header: 'Lý do', accessor: 'reason', width: '20%' },
    { 
      header: 'Trạng thái', 
      accessor: (row) => {
        // 1: Pending, 2: Approved, 3: Rejected
        if (row.status === 1) return <Badge variant="neutral">Chờ duyệt</Badge>;
        if (row.status === 2) return <Badge variant="success">Đã duyệt</Badge>;
        return <Badge variant="danger" style={{ backgroundColor: '#dc3545' }}>Từ chối</Badge>;
      },
      width: '15%' 
    },
    {
      header: 'Hành động',
      accessor: (row) => (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {row.status === 1 && viewMode === 'all' && (
            <>
              <Button variant="secondary" onClick={() => handleApproveReject(row.id, 2)} style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem', backgroundColor: '#28a745', color: '#fff' }}>Duyệt</Button>
              <Button onClick={() => handleApproveReject(row.id, 3)} style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem', backgroundColor: '#dc3545', color: '#fff', borderColor: '#dc3545' }}>Từ chối</Button>
            </>
          )}
        </div>
      ),
      width: '20%'
    }
  ];

  return (
    <DashboardLayout>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Quản lý Đơn từ</h1>
        <Button onClick={() => setIsModalOpen(true)}>+ Tạo đơn nghỉ phép</Button>
      </div>

      <div className={styles.filterBar}>
        <select 
          className={styles.filterSelect}
          value={viewMode} 
          onChange={(e) => setViewMode(e.target.value as 'all' | 'my')}
        >
          <option value="all">Tất cả đơn (Admin)</option>
          <option value="my">Đơn của tôi</option>
        </select>
      </div>

      <div className={styles.tableContainer}>
        {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
        <Table<LeaveRequest> 
          columns={columns} 
          data={data} 
          keyExtractor={(row) => row.id} 
        />
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => !isSubmitting && setIsModalOpen(false)} 
        title="Tạo đơn xin nghỉ phép"
      >
        <form onSubmit={handleSubmitRequest} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.9rem' }}>Loại nghỉ *</label>
            <select 
              required
              className={styles.filterSelect}
              style={{ width: '100%' }}
              value={formData.leaveType}
              onChange={(e) => setFormData({...formData, leaveType: Number(e.target.value)})}
            >
              <option value={2}>Phép năm</option>
              <option value={1}>Nghỉ ốm</option>
              <option value={3}>Không lương</option>
              <option value={4}>Thai sản</option>
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
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.9rem' }}>Đến ngày *</label>
              <Input 
                required
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({...formData, endDate: e.target.value})}
              />
            </div>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.9rem' }}>Lý do xin nghỉ</label>
            <Input 
              placeholder="Nhập lý do chi tiết..." 
              value={formData.reason}
              onChange={(e) => setFormData({...formData, reason: e.target.value})}
            />
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)} disabled={isSubmitting}>
              Hủy
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Đang nộp...' : 'Nộp đơn'}
            </Button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
}
