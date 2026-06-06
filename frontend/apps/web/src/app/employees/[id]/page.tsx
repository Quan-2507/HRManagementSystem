'use client';

import { fetchApi } from '@/lib/api';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { DashboardLayout } from '../../../components/layout/DashboardLayout';
import { Button } from '../../../components/ui/Button';
import styles from './profile.module.css';

interface EmployeeDetail {
  id: string;
  code: string;
  fullName: string;
  email: string;
  personalEmail?: string;
  avatarUrl?: string;
  gender?: string;
  maritalStatus?: string;
  emergencyContact?: string;
  dateOfBirth?: string;
  joinDate?: string;
  address?: string;
  identityNumber?: string;
  identityIssueDate?: string;
  identityIssuePlace?: string;
  taxCode?: string;
  bankAccount?: string;
  bankName?: string;
  status: number;
  departmentName?: string;
  positionTitle?: string;
}

export default function EmployeeProfilePage() {
  const params = useParams();
  const id = params.id as string;
  
  const [employee, setEmployee] = useState<EmployeeDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('info');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetchApi(`http://localhost:5205/api/employees/${id}`);
        if (!res.ok) throw new Error('Không tìm thấy thông tin nhân viên');
        const data = await res.json();
        setEmployee(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProfile();
  }, [id]);

  if (loading) return <DashboardLayout><div style={{padding: '2rem'}}>Đang tải dữ liệu...</div></DashboardLayout>;
  if (error || !employee) return <DashboardLayout><div style={{padding: '2rem', color: 'red'}}>{error || 'Lỗi dữ liệu'}</div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className={styles.profileContainer}>
        
        {/* Header Section */}
        <div className={styles.profileHeader}>
          <div className={styles.avatarSection}>
            <div className={styles.avatar}>
              {employee.avatarUrl ? (
                <img src={employee.avatarUrl} alt="Avatar" />
              ) : (
                <span>{employee.fullName.charAt(0)}</span>
              )}
            </div>
          </div>
          
          <div className={styles.basicInfo}>
            <h1 className={styles.name}>{employee.fullName} - {employee.code}</h1>
            <p className={styles.position}>{employee.positionTitle || 'Chưa cập nhật chức danh'} • {employee.departmentName || 'Chưa cập nhật phòng ban'}</p>
            <div className={styles.tags}>
              <span className={`${styles.tag} ${employee.status === 1 ? styles.active : ''}`}>
                {employee.status === 1 ? 'Đang làm việc' : 'Đã nghỉ'}
              </span>
              <span className={styles.tag}>Chính thức</span>
              <span className={styles.tag}>Bảo hiểm đầy đủ</span>
            </div>
          </div>

          <div className={styles.actions}>
            <Button variant="secondary" onClick={() => alert('Sửa thông tin chức năng đang phát triển')}>Chỉnh sửa</Button>
            <Button variant="secondary">Cấp quyền</Button>
          </div>
        </div>

        {/* Tabs */}
        <div className={styles.tabs}>
          <div className={`${styles.tab} ${activeTab === 'info' ? styles.active : ''}`} onClick={() => setActiveTab('info')}>Thông tin chung</div>
          <div className={`${styles.tab} ${activeTab === 'contract' ? styles.active : ''}`} onClick={() => setActiveTab('contract')}>Hợp đồng</div>
          <div className={`${styles.tab} ${activeTab === 'leave' ? styles.active : ''}`} onClick={() => setActiveTab('leave')}>Đơn từ / Nghỉ phép</div>
          <div className={`${styles.tab} ${activeTab === 'kpi' ? styles.active : ''}`} onClick={() => setActiveTab('kpi')}>Đánh giá KPI</div>
          <div className={`${styles.tab} ${activeTab === 'asset' ? styles.active : ''}`} onClick={() => setActiveTab('asset')}>Tài sản</div>
        </div>

        {/* Tab Content */}
        <div className={styles.tabContent}>
          {activeTab === 'info' && (
            <div className={styles.grid2}>
              <div className={styles.infoGroup}>
                <h3>Thông tin cá nhân</h3>
                <div className={styles.infoRow}><span className={styles.infoLabel}>Ngày sinh:</span><span className={styles.infoValue}>{employee.dateOfBirth ? new Date(employee.dateOfBirth).toLocaleDateString('vi-VN') : '---'}</span></div>
                <div className={styles.infoRow}><span className={styles.infoLabel}>Giới tính:</span><span className={styles.infoValue}>{employee.gender || '---'}</span></div>
                <div className={styles.infoRow}><span className={styles.infoLabel}>Tình trạng hôn nhân:</span><span className={styles.infoValue}>{employee.maritalStatus || '---'}</span></div>
                <div className={styles.infoRow}><span className={styles.infoLabel}>Số CCCD/CMND:</span><span className={styles.infoValue}>{employee.identityNumber || '---'}</span></div>
                <div className={styles.infoRow}><span className={styles.infoLabel}>Ngày cấp:</span><span className={styles.infoValue}>{employee.identityIssueDate ? new Date(employee.identityIssueDate).toLocaleDateString('vi-VN') : '---'}</span></div>
                <div className={styles.infoRow}><span className={styles.infoLabel}>Nơi cấp:</span><span className={styles.infoValue}>{employee.identityIssuePlace || '---'}</span></div>
                <div className={styles.infoRow}><span className={styles.infoLabel}>Địa chỉ thường trú:</span><span className={styles.infoValue}>{employee.address || '---'}</span></div>
              </div>

              <div className={styles.infoGroup}>
                <h3>Thông tin liên hệ & Công việc</h3>
                <div className={styles.infoRow}><span className={styles.infoLabel}>Email công ty:</span><span className={styles.infoValue}>{employee.email || '---'}</span></div>
                <div className={styles.infoRow}><span className={styles.infoLabel}>Email cá nhân:</span><span className={styles.infoValue}>{employee.personalEmail || '---'}</span></div>
                <div className={styles.infoRow}><span className={styles.infoLabel}>Liên hệ khẩn cấp:</span><span className={styles.infoValue}>{employee.emergencyContact || '---'}</span></div>
                <div className={styles.infoRow}><span className={styles.infoLabel}>Ngày gia nhập:</span><span className={styles.infoValue}>{employee.joinDate ? new Date(employee.joinDate).toLocaleDateString('vi-VN') : '---'}</span></div>
                <div className={styles.infoRow}><span className={styles.infoLabel}>Mã số thuế:</span><span className={styles.infoValue}>{employee.taxCode || '---'}</span></div>
                <div className={styles.infoRow}><span className={styles.infoLabel}>Tài khoản ngân hàng:</span><span className={styles.infoValue}>{employee.bankAccount ? `${employee.bankAccount} (${employee.bankName})` : '---'}</span></div>
              </div>
            </div>
          )}

          {activeTab === 'contract' && (
            <div>
              <h3>Danh sách hợp đồng</h3>
              <p style={{color: '#64748b'}}>Chưa có hợp đồng nào được lưu trên hệ thống.</p>
              <Button style={{marginTop: '1rem'}}>+ Tạo hợp đồng mới</Button>
            </div>
          )}

          {activeTab === 'leave' && (
            <div>
              <h3>Lịch sử Nghỉ phép</h3>
              <p style={{color: '#64748b'}}>Không có đơn nghỉ phép nào trong năm nay.</p>
            </div>
          )}

          {activeTab === 'kpi' && (
            <div>
              <h3>Kết quả Đánh giá Năng lực (ASK)</h3>
              <p style={{color: '#64748b'}}>Chưa có kỳ đánh giá nào được thực hiện.</p>
            </div>
          )}

          {activeTab === 'asset' && (
            <div>
              <h3>Tài sản cấp phát</h3>
              <p style={{color: '#64748b'}}>Nhân viên chưa được cấp phát tài sản nào (Máy tính, điện thoại...).</p>
            </div>
          )}
        </div>

      </div>
    </DashboardLayout>
  );
}
