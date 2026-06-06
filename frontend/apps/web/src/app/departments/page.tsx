'use client';

import { fetchApi } from '@/lib/api';
import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Table, Column } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import styles from './departments.module.css';

interface Department {
  id: string;
  name: string;
  description: string;
  employeeCount: number;
}

export default function DepartmentsPage() {
  const [data, setData] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [viewMode, setViewMode] = useState<'table' | 'chart'>('table');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    description: ''
  });

  const fetchDepartments = async () => {
    setLoading(true);
    setError('');
    try {
      
      const res = await fetchApi('http://localhost:5205/api/departments', {
        
      });
      if (!res.ok) throw new Error('Lỗi khi lấy dữ liệu phòng ban');
      const json = await res.json();
      setData(json);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      
      const method = formData.id ? 'PUT' : 'POST';
      const url = formData.id 
        ? `http://localhost:5205/api/departments/${formData.id}` 
        : 'http://localhost:5205/api/departments';

      const res = await fetchApi(url, {
        method,
        
        body: JSON.stringify({
          name: formData.name,
          description: formData.description
        })
      });
      
      if (!res.ok) throw new Error('Lỗi khi lưu phòng ban');

      setIsModalOpen(false);
      setFormData({ id: '', name: '', description: '' });
      fetchDepartments();
      alert('Lưu thành công!');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa phòng ban này?')) return;
    try {
      
      const res = await fetchApi(`http://localhost:5205/api/departments/${id}`, {
        method: 'DELETE',
        
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Lỗi khi xóa');
      }
      fetchDepartments();
      alert('Xóa thành công!');
    } catch (err: any) {
      alert(err.message);
    }
  };

  const openModal = (dept?: Department) => {
    if (dept) {
      setFormData({ id: dept.id, name: dept.name, description: dept.description || '' });
    } else {
      setFormData({ id: '', name: '', description: '' });
    }
    setIsModalOpen(true);
  };

  const columns: Column<Department>[] = [
    { header: 'Tên phòng ban', accessor: 'name', width: '30%' },
    { header: 'Mô tả', accessor: 'description', width: '40%' },
    { header: 'Số nhân sự', accessor: 'employeeCount', width: '15%' },
    {
      header: 'Hành động',
      accessor: (row) => (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Button variant="secondary" onClick={() => openModal(row)} style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}>Sửa</Button>
          <Button onClick={() => handleDelete(row.id)} style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem', backgroundColor: '#dc3545', color: '#fff', borderColor: '#dc3545' }}>Xóa</Button>
        </div>
      ),
      width: '15%'
    }
  ];

  return (
    <DashboardLayout>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Cơ cấu Tổ chức (Phòng ban)</h1>
        <div style={{display: 'flex', gap: '1rem'}}>
          <Button variant={viewMode === 'table' ? 'primary' : 'secondary'} onClick={() => setViewMode('table')}>Dạng Bảng</Button>
          <Button variant={viewMode === 'chart' ? 'primary' : 'secondary'} onClick={() => setViewMode('chart')}>Sơ đồ Tổ chức</Button>
          <Button onClick={() => openModal()}>+ Thêm mới</Button>
        </div>
      </div>

      <div className={styles.tableContainer}>
        {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
        
        {viewMode === 'table' ? (
          <Table<Department> 
            columns={columns} 
            data={data} 
            keyExtractor={(row) => row.id} 
          />
        ) : (
          <div style={{ padding: '2rem', textAlign: 'center', backgroundColor: '#f8fafc', borderRadius: '8px', minHeight: '400px' }}>
            <h2 style={{marginBottom: '2rem'}}>Sơ đồ Tổ chức Doanh nghiệp</h2>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>
              
              <div style={{ padding: '1rem 2rem', backgroundColor: '#2563eb', color: '#fff', borderRadius: '8px', fontWeight: 'bold' }}>
                Ban Giám Đốc
              </div>
              
              <div style={{ width: '2px', height: '30px', backgroundColor: '#cbd5e1' }}></div>
              
              <div style={{ display: 'flex', gap: '3rem', position: 'relative' }}>
                {/* Horizontal line connecting children */}
                <div style={{ position: 'absolute', top: '-15px', left: '10%', right: '10%', height: '2px', backgroundColor: '#cbd5e1' }}></div>
                
                {data.map(dept => (
                  <div key={dept.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ width: '2px', height: '15px', backgroundColor: '#cbd5e1' }}></div>
                    <div style={{ padding: '1rem', backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', width: '150px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                      <div style={{ fontWeight: 600, color: '#1e293b' }}>{dept.name}</div>
                      <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.5rem' }}>{dept.employeeCount} nhân sự</div>
                    </div>
                  </div>
                ))}
                
                {data.length === 0 && <div style={{color: '#64748b'}}>Chưa có phòng ban nào</div>}
              </div>
              
            </div>
          </div>
        )}
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => !isSubmitting && setIsModalOpen(false)} 
        title={formData.id ? "Sửa phòng ban" : "Thêm mới phòng ban"}
      >
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.9rem' }}>Tên phòng ban *</label>
            <Input 
              required
              placeholder="VD: Phòng IT..." 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.9rem' }}>Mô tả</label>
            <Input 
              placeholder="Chức năng, nhiệm vụ..." 
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)} disabled={isSubmitting}>
              Hủy
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Đang lưu...' : 'Lưu'}
            </Button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
}
