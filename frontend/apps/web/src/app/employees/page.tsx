'use client';

import { fetchApi } from '@/lib/api';
import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Table, Column } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { Pagination } from '../../components/ui/Pagination';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import styles from './employees.module.css';

interface Employee {
  id: string;
  code: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  status: number;
}

interface PagedResult {
  items: Employee[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

export default function EmployeesPage() {
  const [data, setData] = useState<PagedResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [error, setError] = useState('');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    fullName: '',
    email: '',
    phoneNumber: ''
  });

  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState({
    fullName: '',
    phoneNumber: ''
  });

  const fetchEmployees = async (pageNum: number, search: string) => {
    setLoading(true);
    setError('');
    try {
      
      const res = await fetchApi(`http://localhost:5205/api/employees?pageNumber=${pageNum}&pageSize=10&searchTerm=${encodeURIComponent(search)}`, {
        
      });
      if (!res.ok) {
        if (res.status === 401) {
          window.location.href = '/login';
          return;
        }
        throw new Error('Lỗi khi lấy dữ liệu nhân sự');
      }
      const json = await res.json();
      setData(json);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees(page, searchTerm);
  }, [page]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchEmployees(1, searchTerm);
  };

  const handleCreateEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      
      const res = await fetchApi('http://localhost:5205/api/employees', {
        method: 'POST',
        
        body: JSON.stringify(formData)
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Lỗi khi tạo nhân viên');
      }

      // Thành công: Đóng modal, reset form, reload danh sách
      setIsModalOpen(false);
      setFormData({ code: '', fullName: '', email: '', phoneNumber: '' });
      fetchEmployees(page, searchTerm);
      alert('Tạo nhân viên thành công!');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId) return;
    setIsSubmitting(true);
    try {
      
      const res = await fetchApi(`http://localhost:5205/api/employees/${editingId}`, {
        method: 'PUT',
        
        body: JSON.stringify({
          fullName: editFormData.fullName,
          phoneNumber: editFormData.phoneNumber
        })
      });
      if (!res.ok) throw new Error('Lỗi cập nhật nhân viên');
      
      setIsEditModalOpen(false);
      fetchEmployees(page, searchTerm);
      alert('Cập nhật thành công!');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteEmployee = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn vô hiệu hóa nhân viên này?')) return;
    try {
      
      const res = await fetchApi(`http://localhost:5205/api/employees/${id}`, {
        method: 'DELETE',
        
      });
      if (!res.ok) throw new Error('Lỗi khi xóa nhân viên');
      fetchEmployees(page, searchTerm);
      alert('Đã xóa (vô hiệu hóa) nhân viên!');
    } catch (err: any) {
      alert(err.message);
    }
  };

  const openEditModal = (emp: Employee) => {
    setEditingId(emp.id);
    setEditFormData({
      fullName: emp.fullName,
      phoneNumber: emp.phoneNumber
    });
    setIsEditModalOpen(true);
  };

  const columns: Column<Employee>[] = [
    { header: 'Mã NV', accessor: 'code', width: '10%' },
    { header: 'Họ và tên', accessor: 'fullName', width: '25%' },
    { header: 'Email', accessor: 'email', width: '25%' },
    { header: 'Số điện thoại', accessor: 'phoneNumber', width: '20%' },
    { 
      header: 'Trạng thái', 
      accessor: (row) => {
        // Status: 1 = Active, 0 = Inactive
        if (row.status === 1) return <Badge variant="success">Đang làm</Badge>;
        return <Badge variant="neutral">Đã nghỉ</Badge>;
      },
      width: '15%'
    },
    {
      header: 'Hành động',
      accessor: (row) => (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Button variant="secondary" onClick={() => openEditModal(row)} style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}>Sửa</Button>
          <Button onClick={() => handleDeleteEmployee(row.id)} style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem', backgroundColor: '#dc3545', color: '#fff', borderColor: '#dc3545' }}>Xóa</Button>
        </div>
      ),
      width: '15%'
    }
  ];

  return (
    <DashboardLayout>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Danh sách nhân sự</h1>
        <Button onClick={() => setIsModalOpen(true)}>+ Thêm mới nhân viên</Button>
      </div>

      <div className={styles.toolbar}>
        <form className={styles.searchBox} onSubmit={handleSearch}>
          <Input 
            placeholder="Tìm theo Tên hoặc Email..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ marginBottom: 0 }}
          />
          <Button type="submit" variant="secondary">Tìm</Button>
        </form>
      </div>

      <div className={styles.tableContainer}>
        {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
        
        <Table<Employee> 
          columns={columns} 
          data={data?.items || []} 
          keyExtractor={(row) => row.id} 
        />

        {data && (
          <Pagination 
            currentPage={data.pageNumber}
            totalPages={data.totalPages}
            totalCount={data.totalCount}
            pageSize={data.pageSize}
            onPageChange={(p) => setPage(p)}
          />
        )}
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => !isSubmitting && setIsModalOpen(false)} 
        title="Thêm mới nhân viên"
      >
        <form onSubmit={handleCreateEmployee} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.9rem' }}>Mã nhân viên *</label>
            <Input 
              required
              placeholder="VD: NV001" 
              value={formData.code}
              onChange={(e) => setFormData({...formData, code: e.target.value})}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.9rem' }}>Họ và tên *</label>
            <Input 
              required
              placeholder="Nhập họ và tên..." 
              value={formData.fullName}
              onChange={(e) => setFormData({...formData, fullName: e.target.value})}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.9rem' }}>Email *</label>
            <Input 
              required
              type="email"
              placeholder="Email công ty..." 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.9rem' }}>Số điện thoại</label>
            <Input 
              placeholder="Nhập số điện thoại..." 
              value={formData.phoneNumber}
              onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
            />
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)} disabled={isSubmitting}>
              Hủy
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Đang lưu...' : 'Lưu nhân viên'}
            </Button>
          </div>
        </form>
      </Modal>

      <Modal 
        isOpen={isEditModalOpen} 
        onClose={() => !isSubmitting && setIsEditModalOpen(false)} 
        title="Sửa thông tin nhân viên"
      >
        <form onSubmit={handleUpdateEmployee} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.9rem' }}>Họ và tên *</label>
            <Input 
              required
              placeholder="Nhập họ và tên..." 
              value={editFormData.fullName}
              onChange={(e) => setEditFormData({...editFormData, fullName: e.target.value})}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.9rem' }}>Số điện thoại</label>
            <Input 
              placeholder="Nhập số điện thoại..." 
              value={editFormData.phoneNumber}
              onChange={(e) => setEditFormData({...editFormData, phoneNumber: e.target.value})}
            />
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
            <Button type="button" variant="secondary" onClick={() => setIsEditModalOpen(false)} disabled={isSubmitting}>
              Hủy
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Đang cập nhật...' : 'Cập nhật'}
            </Button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
}
