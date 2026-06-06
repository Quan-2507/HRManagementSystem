'use client';

import { fetchApi } from '@/lib/api';
import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Table, Column } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';

interface Candidate {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string | null;
  appliedPosition: string;
  applicationDate: string;
  status: number; // 1: Mới, 2: Phỏng vấn, 3: Pass, 4: Fail
  isOnboarded: boolean;
  notes: string | null;
}

export default function CandidatesPage() {
  const [data, setData] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    appliedPosition: ''
  });

  const fetchCandidates = async () => {
    setLoading(true);
    try {
      const res = await fetchApi('http://localhost:5205/api/candidates');
      if (!res.ok) throw new Error('Lỗi tải dữ liệu ứng viên');
      const json = await res.json();
      setData(json);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetchApi('http://localhost:5205/api/candidates', {
        method: 'POST',
        body: JSON.stringify(formData)
      });
      if (!res.ok) throw new Error('Lỗi khi thêm ứng viên');
      setIsModalOpen(false);
      fetchCandidates();
      alert('Thêm ứng viên thành công!');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: number) => {
    try {
      const res = await fetchApi(`http://localhost:5205/api/candidates/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status: newStatus })
      });
      if (!res.ok) throw new Error('Lỗi khi cập nhật trạng thái');
      fetchCandidates();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleOnboard = async (id: string) => {
    if (!confirm('Hệ thống sẽ tự động tạo tài khoản nhân viên (ApplicationUser) cho ứng viên này. Bạn có chắc chắn?')) return;
    try {
      const res = await fetchApi(`http://localhost:5205/api/candidates/${id}/onboard`, {
        method: 'POST'
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Lỗi khi onboard');
      }
      alert('Chuyển đổi thành nhân viên thành công! Tài khoản mật khẩu mặc định là: hr123456!');
      fetchCandidates();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const columns: Column<Candidate>[] = [
    { header: 'Ứng viên', accessor: (row) => <div><strong>{row.fullName}</strong><br/><span style={{fontSize: '0.8rem', color: '#64748b'}}>{row.email}</span></div>, width: '20%' },
    { header: 'Vị trí', accessor: 'appliedPosition', width: '15%' },
    { header: 'Ngày ứng tuyển', accessor: (row) => new Date(row.applicationDate).toLocaleDateString('vi-VN'), width: '15%' },
    { 
      header: 'Trạng thái', 
      accessor: (row) => {
        if (row.isOnboarded) return <Badge variant="success">Đã thành nhân viên</Badge>;
        if (row.status === 1) return <Badge variant="neutral">Mới</Badge>;
        if (row.status === 2) return <Badge variant="neutral">Đang phỏng vấn</Badge>;
        if (row.status === 3) return <Badge variant="success">Đậu (Pass)</Badge>;
        return <Badge variant="danger">Trượt (Fail)</Badge>;
      },
      width: '15%' 
    },
    {
      header: 'Hành động',
      accessor: (row) => (
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {!row.isOnboarded && row.status !== 3 && row.status !== 4 && (
            <>
              {row.status === 1 && <Button variant="secondary" onClick={() => handleUpdateStatus(row.id, 2)} style={{ padding: '0.2rem 0.4rem', fontSize: '0.75rem' }}>Phỏng vấn</Button>}
              {row.status === 2 && (
                <>
                  <Button variant="secondary" onClick={() => handleUpdateStatus(row.id, 3)} style={{ padding: '0.2rem 0.4rem', fontSize: '0.75rem', backgroundColor: '#22c55e', color: '#fff' }}>Pass</Button>
                  <Button variant="secondary" onClick={() => handleUpdateStatus(row.id, 4)} style={{ padding: '0.2rem 0.4rem', fontSize: '0.75rem', backgroundColor: '#ef4444', color: '#fff' }}>Fail</Button>
                </>
              )}
            </>
          )}
          {!row.isOnboarded && row.status === 3 && (
            <Button variant="primary" onClick={() => handleOnboard(row.id)} style={{ padding: '0.2rem 0.4rem', fontSize: '0.75rem' }}>Onboard Ngay</Button>
          )}
        </div>
      ),
      width: '35%'
    }
  ];

  return (
    <DashboardLayout>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem'}}>
        <h1 style={{fontSize: '1.5rem', fontWeight: 600}}>Quản lý Tuyển dụng</h1>
        <Button onClick={() => setIsModalOpen(true)}>+ Thêm ứng viên mới</Button>
      </div>

      <div style={{backgroundColor: '#fff', borderRadius: '8px', padding: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)'}}>
        {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
        <Table<Candidate> 
          columns={columns} 
          data={data} 
          keyExtractor={(row) => row.id} 
        />
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => !isSubmitting && setIsModalOpen(false)} 
        title="Thêm ứng viên mới"
      >
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.9rem' }}>Họ tên *</label>
            <Input required placeholder="VD: Nguyễn Văn A" value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.9rem' }}>Email *</label>
            <Input required type="email" placeholder="VD: email@example.com" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.9rem' }}>Số điện thoại</label>
            <Input placeholder="VD: 0987654321" value={formData.phoneNumber} onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.9rem' }}>Vị trí ứng tuyển *</label>
            <Input required placeholder="VD: Frontend Developer" value={formData.appliedPosition} onChange={(e) => setFormData({...formData, appliedPosition: e.target.value})} />
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)} disabled={isSubmitting}>
              Hủy
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Đang lưu...' : 'Lưu ứng viên'}
            </Button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
}
