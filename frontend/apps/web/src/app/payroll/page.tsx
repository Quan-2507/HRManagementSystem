'use client';

import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  Upload, 
  UserPlus, 
  CheckCircle, 
  RefreshCcw,
  ChevronRight,
  ChevronDown,
  Paperclip,
  CreditCard,
  X
} from 'lucide-react';
import styles from './payroll.module.css';

// --- Dummy Data ---
const dummyData = [
  {
    id: '1',
    name: 'A. CÔNG TY CỔ PHẦN 1OFFICE',
    isExpanded: true,
    level: 0,
    headcount: 24,
    basicSalary: 326400000,
    travelAllow: 25000000,
    phoneAllow: 13800000,
    uniformAllow: 10000000,
    housingAllow: 16500000,
    mealAllow: 680000,
    respAllow: 41100000,
    children: [
      {
        id: '1.1',
        name: '1. [GTV] Chi nhánh HCM 1Office',
        isExpanded: true,
        level: 1,
        headcount: 24,
        basicSalary: 326400000,
        travelAllow: 25000000,
        phoneAllow: 13800000,
        uniformAllow: 10000000,
        housingAllow: 16500000,
        mealAllow: 680000,
        respAllow: 41100000,
        children: [
          {
            id: '1.1.1',
            name: '1.1. [GTV] Phòng BOD chi nhánh',
            isExpanded: true,
            level: 2,
            headcount: 5,
            basicSalary: 99400000,
            travelAllow: 6000000,
            phoneAllow: 3000000,
            uniformAllow: 3600000,
            housingAllow: 11000000,
            mealAllow: 200000,
            respAllow: 2500000,
            children: [
              {
                id: '1.1.1.1',
                name: '1.1.1. [GTV] Phòng Cố Vấn Chi Nhánh',
                isExpanded: false,
                level: 3,
                headcount: 2,
                basicSalary: 42800000,
                travelAllow: 2000000,
                phoneAllow: 1200000,
                uniformAllow: 800000,
                housingAllow: 4000000,
                mealAllow: 60000,
                respAllow: 0,
              },
              {
                id: '1.1.1.2',
                name: '1.1.2. [GTV] Phòng Giám Sát Nội Bộ Chi Nhánh',
                isExpanded: false,
                level: 3,
                headcount: 1,
                basicSalary: 12700000,
                travelAllow: 1000000,
                phoneAllow: 600000,
                uniformAllow: 400000,
                housingAllow: 0,
                mealAllow: 30000,
                respAllow: 2500000,
              }
            ]
          },
          {
            id: '1.1.2',
            name: '1.2. [GTV] Phòng Kinh Doanh HCM',
            isExpanded: true,
            level: 2,
            headcount: 7,
            basicSalary: 73900000,
            travelAllow: 7000000,
            phoneAllow: 4200000,
            uniformAllow: 2000000,
            housingAllow: 1000000,
            mealAllow: 150000,
            respAllow: 10000000,
            children: [
              {
                id: '1.1.2.1',
                name: '1.2.1. [GTV] Phòng Kinh Doanh 1 - HCM',
                isExpanded: false,
                level: 3,
                headcount: 2,
                basicSalary: 20000000,
                travelAllow: 2000000,
                phoneAllow: 1200000,
                uniformAllow: 400000,
                housingAllow: 0,
                mealAllow: 30000,
                respAllow: 0,
              },
              {
                id: '1.1.2.2',
                name: '1.2.2. [GTV] Phòng Kinh Doanh 2 - HCM',
                isExpanded: false,
                level: 3,
                headcount: 3,
                basicSalary: 33300000,
                travelAllow: 3000000,
                phoneAllow: 1800000,
                uniformAllow: 800000,
                housingAllow: 1000000,
                mealAllow: 60000,
                respAllow: 5000000,
              }
            ]
          }
        ]
      }
    ]
  }
];

// Flatting function for tree rendering
const flattenData = (nodes: any[], result: any[] = []) => {
  nodes.forEach(node => {
    result.push(node);
    if (node.isExpanded && node.children && node.children.length > 0) {
      flattenData(node.children, result);
    }
  });
  return result;
};

// Formatter function
const formatCurrency = (amount: number) => {
  if (amount === 0) return '0';
  return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export default function PayrollSummaryPage() {
  const [data, setData] = useState(dummyData);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const toggleExpand = (id: string) => {
    const updateNode = (nodes: any[]): any[] => {
      return nodes.map(node => {
        if (node.id === id) {
          return { ...node, isExpanded: !node.isExpanded };
        }
        if (node.children) {
          return { ...node, children: updateNode(node.children) };
        }
        return node;
      });
    };
    setData(updateNode(data));
  };

  const flatList = flattenData(data);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerTop}>
          <div className={styles.titleArea}>
            <div className={styles.orangeSquare}>+</div>
            <h1 className={styles.pageTitle}>Bảng lương tổng hợp - Thiên Á Group 100%</h1>
          </div>
          <div className={styles.headerActions}>
            <div className={styles.searchBox}>
              <Search size={16} className={styles.searchIcon} />
              <input type="text" placeholder="Tìm kiếm" className={styles.searchInput} />
              <Filter size={16} className={styles.filterIcon} />
            </div>
            <button className={styles.actionBtn}>
              <Upload size={16} /> Import
            </button>
            <button className={styles.actionBtn}>
              <Download size={16} /> Export
            </button>
            <button className={styles.actionBtn}>
              <UserPlus size={16} /> Thêm người
            </button>
            <button className={styles.actionBtn}>
              <CheckCircle size={16} /> Chốt
            </button>
            <button className={styles.actionBtn}>
              <RefreshCcw size={16} /> Tính lại
            </button>
            <button className={styles.actionBtn} onClick={() => setIsPaymentModalOpen(true)} style={{ color: '#1a4388', borderColor: '#1a4388' }}>
              <CreditCard size={16} /> Thanh toán MB Bank
            </button>
          </div>
        </div>

        <div className={styles.tabsRow}>
          <div className={styles.tab}>Bảng lương</div>
          <div className={styles.tab}>Chi tiết công thức</div>
          <div className={`${styles.tab} ${styles.activeTab}`}>Tổng hợp lương</div>
          <div className={styles.tab}>Đính kèm</div>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.tableContainer}>
          <table className={styles.payrollTable}>
            <thead>
              <tr>
                <th className={`${styles.stickyCol} ${styles.colDept}`}>Phòng ban</th>
                <th className={styles.colNum}>Số nhân sự</th>
                <th className={styles.colNum}>Lương cơ bản gross</th>
                <th className={styles.colNum}>[GTV] Phụ cấp đi lại</th>
                <th className={styles.colNum}>[GTV] Phụ cấp điện thoại</th>
                <th className={styles.colNum}>[GTV] Phụ cấp đồng phục</th>
                <th className={styles.colNum}>[GTV] Phụ cấp nhà ở</th>
                <th className={styles.colNum}>[GTV] Phụ cấp tiền ăn</th>
                <th className={styles.colNum}>[GTV] Phụ cấp trách nhiệm</th>
              </tr>
            </thead>
            <tbody>
              {flatList.map((row, index) => (
                <tr key={row.id} className={row.level === 0 ? styles.rowLevel0 : row.level === 1 ? styles.rowLevel1 : ''}>
                  <td className={`${styles.stickyCol} ${styles.colDept}`}>
                    <div 
                      className={styles.deptCell} 
                      style={{ paddingLeft: `${row.level * 20 + 10}px` }}
                    >
                      {row.children && row.children.length > 0 ? (
                        <button 
                          className={styles.expandBtn} 
                          onClick={() => toggleExpand(row.id)}
                        >
                          {row.isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                        </button>
                      ) : (
                        <span className={styles.expandSpacer}></span>
                      )}
                      <span className={styles.deptName}>{row.name}</span>
                    </div>
                  </td>
                  <td className={styles.colNum}>{row.headcount}</td>
                  <td className={styles.colNum}>{formatCurrency(row.basicSalary)}</td>
                  <td className={styles.colNum}>{formatCurrency(row.travelAllow)}</td>
                  <td className={styles.colNum}>{formatCurrency(row.phoneAllow)}</td>
                  <td className={styles.colNum}>{formatCurrency(row.uniformAllow)}</td>
                  <td className={styles.colNum}>{formatCurrency(row.housingAllow)}</td>
                  <td className={styles.colNum}>{formatCurrency(row.mealAllow)}</td>
                  <td className={styles.colNum}>{formatCurrency(row.respAllow)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* PAYMENT MODAL */}
      {isPaymentModalOpen && (
        <div className={styles.modalBackdrop}>
          <div className={styles.paymentModal}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Thực hiện lệnh</h2>
              <button className={styles.closeBtn} onClick={() => setIsPaymentModalOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.paymentForm}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Tài khoản nguồn</label>
                  <select className={styles.formSelect}>
                    <option>MB Bank - 123456789 - 1,000,000,000 VND</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Nội dung chuyển khoản</label>
                  <input type="text" className={styles.formInput} defaultValue="Lương tháng 5/2026" />
                </div>
              </div>

              <div className={styles.recipientTableContainer}>
                <div style={{ padding: '1rem', borderBottom: '1px solid #e5e7eb' }}>
                  <div className={styles.tableTitle}>
                    Danh sách người nhận
                    <span style={{ fontSize: '0.85rem', color: '#6b7280', fontWeight: 'normal' }}>Tổng: 2 giao dịch / 45.000.000 VND</span>
                  </div>
                </div>
                <table className={styles.recipientTable}>
                  <thead>
                    <tr>
                      <th>STT</th>
                      <th>Tên người nhận</th>
                      <th>Số tài khoản</th>
                      <th>Ngân hàng</th>
                      <th>Số tiền</th>
                      <th>Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>1</td>
                      <td>Trần Minh Quân</td>
                      <td>123456789</td>
                      <td>Ngân hàng Quân đội MB</td>
                      <td style={{ fontWeight: 600 }}>20.000.000 đ</td>
                      <td><span className={styles.statusPending}>Đang chờ xử lý</span></td>
                    </tr>
                    <tr>
                      <td>2</td>
                      <td>Nguyễn Văn A</td>
                      <td>987654321</td>
                      <td>Ngân hàng Ngoại thương VCB</td>
                      <td style={{ fontWeight: 600 }}>25.000.000 đ</td>
                      <td><span className={styles.statusPending}>Đang chờ xử lý</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button className={styles.btnSecondary} onClick={() => setIsPaymentModalOpen(false)}>Đóng</button>
              <button className={styles.btnMBBank}>Thực hiện lệnh</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
