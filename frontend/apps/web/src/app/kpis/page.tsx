'use client';

import { fetchApi } from '@/lib/api';
import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Table, Column } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';

interface EmployeeKpi {
  id: string;
  employeeId: string;
  employeeName: string;
  period: string;
  score: number;
  reviewerComment: string | null;
  reviewerName: string | null;
  status: number;
}

export default function KpisPage() {
  const [data, setData] = useState<EmployeeKpi[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // To keep it simple, we assume Admin assigns KPI to employee with ID
  // In a real app we would have an employee dropdown
  const [formData, setFormData] = useState({
    employeeId: '',
    period: new Date().getFullYear() + '-' + String(new Date().getMonth() + 1).padStart(2, '0'),
    score: 0
  });

  const fetchKpis = async () => {
    setLoading(true);
    try {
      const res = await fetchApi('http://localhost:5205/api/kpis');
      if (!res.ok) throw new Error('Lỗi tải dữ liệu KPI');
      const json = await res.json();
      setData(json);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKpis();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetchApi('http://localhost:5205/api/kpis', {
        method: 'POST',
        body: JSON.stringify(formData)
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Lỗi khi tạo KPI');
      }
      setIsModalOpen(false);
      fetchKpis();
      alert('Tạo bảng đánh giá thành công!');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApprove = async (id: string, newScore: number) => {
    const comment = prompt('Nhập nhận xét của người duyệt:');
    try {
      const res = await fetchApi(`http://localhost:5205/api/kpis/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ score: newScore, reviewerComment: comment, status: 3 })
      });
      if (!res.ok) throw new Error('Lỗi khi duyệt');
      fetchKpis();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const columns: Column<EmployeeKpi>[] = [
    { header: 'Nhân viên', accessor: 'employeeName', width: '20%' },
    { header: 'Kỳ đánh giá', accessor: 'period', width: '15%' },
    { 
      header: 'Điểm số', 
      accessor: (row) => <span style={{fontWeight: 'bold', color: row.score >= 80 ? '#22c55e' : (row.score >= 50 ? '#eab308' : '#ef4444')}}>{row.score}/100</span>, 
      width: '10%' 
    },
    { 
      header: 'Trạng thái', 
      accessor: (row) => {
        if (row.status === 1) return <Badge variant="neutral">Bản nháp</Badge>;
        if (row.status === 2) return <Badge variant="neutral">Chờ duyệt</Badge>;
        return <Badge variant="success">Đã duyệt</Badge>;
      },
      width: '15%' 
    },
    { header: 'Người duyệt', accessor: (row) => row.reviewerName || '-', width: '15%' },
    { header: 'Nhận xét', accessor: (row) => row.reviewerComment || '-', width: '15%' },
    {
      header: 'Hành động',
      accessor: (row) => (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {row.status !== 3 && (
            <Button variant="secondary" onClick={() => handleApprove(row.id, row.score)} style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem', backgroundColor: '#28a745', color: '#fff' }}>Duyệt & Nhận xét</Button>
          )}
        </div>
      ),
      width: '10%'
    }
  ];

  return (
    <DashboardLayout>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem'}}>
        <h1 style={{fontSize: '1.5rem', fontWeight: 600}}>Đánh giá Năng lực (KPI)</h1>
        <Button onClick={() => setIsModalOpen(true)}>+ Đánh giá nhân sự mới</Button>
      </div>

      <div style={{backgroundColor: '#fff', borderRadius: '8px', padding: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)'}}>
        {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
        <Table<EmployeeKpi> 
          columns={columns} 
          data={data} 
          keyExtractor={(row) => row.id} 
        />
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => !isSubmitting && setIsModalOpen(false)} 
        title="Tạo bảng đánh giá"
      >
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.9rem' }}>ID Nhân viên * (Sao chép từ màn hình nhân sự)</label>
            <Input 
              required
              placeholder="VD: a1b2c3d4-..." 
              value={formData.employeeId}
              onChange={(e) => setFormData({...formData, employeeId: e.target.value})}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.9rem' }}>Kỳ đánh giá (YYYY-MM) *</label>
            <Input 
              required
              placeholder="VD: 2026-06" 
              value={formData.period}
              onChange={(e) => setFormData({...formData, period: e.target.value})}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.9rem' }}>Điểm số (0-100) *</label>
            <Input 
              required
              type="number"
              min="0"
              max="100"
              value={formData.score}
              onChange={(e) => setFormData({...formData, score: Number(e.target.value)})}
            />
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)} disabled={isSubmitting}>
              Hủy
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Đang lưu...' : 'Tạo đánh giá'}
            </Button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
}
