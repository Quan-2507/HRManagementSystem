'use client';

import { fetchApi } from '@/lib/api';
import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Table, Column } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import styles from './attendance.module.css';

interface AttendanceRecord {
  id: string;
  employeeName: string;
  checkInTime: string | null;
  checkOutTime: string | null;
  checkInLocationName: string | null;
  checkOutLocationName: string | null;
  workingHours: number;
  isLate: boolean;
  isEarlyLeave: boolean;
  status: number;
}

export default function AttendancePage() {
  const [data, setData] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchAttendance = async () => {
    setLoading(true);
    try {
      
      const res = await fetchApi('http://localhost:5205/api/attendance/today', {
        
      });
      if (!res.ok) throw new Error('Lỗi tải dữ liệu chấm công');
      const json = await res.json();
      setData(json);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  const getPosition = (): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Trình duyệt của bạn không hỗ trợ định vị GPS.'));
      } else {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        });
      }
    });
  };

  const handleAttendance = async (type: 'check-in' | 'check-out') => {
    setIsProcessing(true);
    try {
      // 1. Lấy GPS
      let pos: GeolocationPosition;
      try {
        pos = await getPosition();
      } catch (e: any) {
        if (e.code === 1) {
          throw new Error('Bạn đã từ chối cấp quyền Vị trí. Vui lòng bật GPS để chấm công!');
        }
        throw new Error('Lỗi lấy tọa độ GPS: ' + e.message);
      }

      const { latitude, longitude } = pos.coords;

      // 2. Gọi API
      
      const endpoint = type === 'check-in' ? 'check-in' : 'check-out';
      const res = await fetchApi(`http://localhost:5205/api/attendance/${endpoint}`, {
        method: 'POST',
        
        body: JSON.stringify({
          latitude,
          longitude,
          locationName: `Tọa độ: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
        })
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Chấm công thất bại');
      }

      alert(`Chấm công ${type === 'check-in' ? 'VÀO' : 'RA'} thành công!`);
      fetchAttendance();

    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const formatTime = (isoString: string | null) => {
    if (!isoString) return '--:--';
    return new Date(isoString).toLocaleTimeString('vi-VN');
  };

  const columns: Column<AttendanceRecord>[] = [
    { header: 'Nhân viên', accessor: 'employeeName', width: '20%' },
    { 
      header: 'Giờ vào', 
      accessor: (row) => formatTime(row.checkInTime), 
      width: '15%' 
    },
    { 
      header: 'Vị trí Check-in', 
      accessor: (row) => row.checkInLocationName || '-', 
      width: '25%' 
    },
    { 
      header: 'Giờ ra', 
      accessor: (row) => formatTime(row.checkOutTime), 
      width: '15%' 
    },
    { 
      header: 'Vị trí Check-out', 
      accessor: (row) => row.checkOutLocationName || '-', 
      width: '15%' 
    },
    { 
      header: 'Trạng thái', 
      accessor: (row) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div>
            {row.status === 1 ? <Badge variant="success">Đủ công</Badge> : 
             row.status === 2 ? <Badge variant="neutral">Nửa công</Badge> : 
             <Badge variant="danger">Vắng</Badge>}
          </div>
          <div style={{ display: 'flex', gap: '4px' }}>
            {row.isLate && <Badge variant="danger" style={{ fontSize: '0.7rem' }}>Đi muộn</Badge>}
            {row.isEarlyLeave && <Badge variant="danger" style={{ fontSize: '0.7rem' }}>Về sớm</Badge>}
          </div>
          {row.checkOutTime && <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{row.workingHours} giờ</div>}
        </div>
      ), 
      width: '15%' 
    }
  ];

  return (
    <DashboardLayout>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Chấm công bằng GPS</h1>
      </div>

      <div className={styles.attendanceCard}>
        <div className={styles.clock}>
          {currentTime.toLocaleTimeString('vi-VN')}
        </div>
        <p style={{ marginBottom: '2rem', color: 'var(--text-light)' }}>
          Hệ thống yêu cầu quyền truy cập Vị trí (GPS) để ghi nhận tọa độ.
        </p>
        
        <div className={styles.actionButtons}>
          <Button 
            className={styles.checkInBtn} 
            onClick={() => handleAttendance('check-in')}
            disabled={isProcessing}
          >
            📍 Chấm công VÀO
          </Button>
          <Button 
            className={styles.checkOutBtn} 
            onClick={() => handleAttendance('check-out')}
            disabled={isProcessing}
          >
            📍 Chấm công RA
          </Button>
        </div>
      </div>

      <div className={styles.tableContainer}>
        <h3 style={{ marginBottom: '1.5rem', fontWeight: 600 }}>Lịch sử chấm công hôm nay</h3>
        {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
        <Table<AttendanceRecord> 
          columns={columns} 
          data={data} 
          keyExtractor={(row) => row.id} 
        />
      </div>
    </DashboardLayout>
  );
}
