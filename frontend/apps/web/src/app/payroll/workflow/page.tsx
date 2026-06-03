'use client';

import React, { useState } from 'react';
import { 
  X, 
  Search,
  Settings,
  Bell,
  Mail,
  CheckCircle2,
  XCircle,
  Play,
  Square
} from 'lucide-react';
import styles from './workflow.module.css';

export default function WorkflowPage() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(true);

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.orangeSquare}>+</div>
        <h1 className={styles.pageTitle}>Duyệt lương online theo quy trình</h1>
      </div>

      {/* Canvas */}
      <div className={styles.canvas}>
        
        {/* SVG Connectors */}
        <svg className={styles.svgLayer} width="1000" height="800">
          <defs>
            <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" className={styles.connectionArrow} />
            </marker>
          </defs>
          
          {/* Start to Condition */}
          <path d="M 120 150 L 180 150" className={styles.connectionLine} markerEnd="url(#arrow)" />
          
          {/* Condition to Accepted */}
          <path d="M 330 150 L 400 150" className={styles.connectionLine} markerEnd="url(#arrow)" />
          
          {/* Condition to Rejected (Down) */}
          <path d="M 255 180 L 255 240 L 400 240" className={styles.connectionLine} markerEnd="url(#arrow)" />

          {/* Accepted to Notification */}
          <path d="M 550 150 L 620 150" className={styles.connectionLine} markerEnd="url(#arrow)" />

          {/* Rejected to Email */}
          <path d="M 550 240 L 620 240" className={styles.connectionLine} markerEnd="url(#arrow)" />

          {/* Action to End */}
          <path d="M 770 150 L 850 150" className={styles.connectionLine} markerEnd="url(#arrow)" />
          <path d="M 770 240 L 820 240 L 820 170 L 850 170" className={styles.connectionLine} markerEnd="url(#arrow)" />
        </svg>

        {/* Nodes Layer */}
        <div className={styles.nodesLayer}>
          <div className={`${styles.node} ${styles.nodeStart}`} style={{ left: '40px', top: '130px', minWidth: '80px' }}>
            Bắt đầu
          </div>

          <div className={`${styles.node} ${styles.nodeCondition}`} style={{ left: '180px', top: '120px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontWeight: 600 }}>Điều kiện</span>
              <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>Duyệt theo cấp bậc</span>
            </div>
          </div>

          <div 
            className={`${styles.node} ${styles.nodeAccepted}`} 
            style={{ left: '400px', top: '130px' }}
            onClick={() => setIsSettingsOpen(true)}
          >
            Được chấp nhận
          </div>

          <div className={`${styles.node} ${styles.nodeRejected}`} style={{ left: '400px', top: '220px' }}>
            Không duyệt
          </div>

          <div className={`${styles.node} ${styles.nodeAction}`} style={{ left: '620px', top: '130px' }}>
            <Bell size={16} color="#f59e0b" style={{ marginRight: '0.5rem' }} />
            Gửi thông báo
          </div>

          <div className={`${styles.node} ${styles.nodeAction}`} style={{ left: '620px', top: '220px' }}>
            <Mail size={16} color="#3b82f6" style={{ marginRight: '0.5rem' }} />
            Gửi email
          </div>

          <div className={`${styles.node} ${styles.nodeEnd}`} style={{ left: '850px', top: '130px', minWidth: '80px' }}>
            Kết thúc
          </div>
        </div>

      </div>

      {/* Settings Modal (Right Overlay) */}
      <div className={`${styles.settingsOverlay} ${!isSettingsOpen ? styles.hidden : ''}`}>
        <div className={styles.settingsHeader}>
          <h2 className={styles.settingsTitle}>Bước duyệt</h2>
          <button className={styles.closeBtn} onClick={() => setIsSettingsOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <div className={styles.settingsBody}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Tên bước duyệt <span className={styles.required}>*</span></label>
            <input type="text" className={styles.formInput} defaultValue="Được chấp nhận" />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Mã bước duyệt</label>
            <input type="text" className={styles.formInput} defaultValue="giam_doc_duyet" />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Người duyệt</label>
            <div className={styles.userTagContainer}>
              <div className={styles.userTag}>
                <div className={styles.userAvatar}>T</div>
                [Thienduong] Giám Đốc
                <button className={styles.removeTagBtn}><X size={14}/></button>
              </div>
              <input type="text" style={{ border: 'none', outline: 'none', background: 'transparent', flex: 1, minWidth: '50px', fontSize: '0.85rem' }} placeholder="Thêm..." />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Người theo dõi</label>
            <div className={styles.inputIconWrapper}>
              <input type="text" className={`${styles.formInput} ${styles.formInputWithIcon}`} placeholder="Tìm kiếm" />
              <Search size={16} className={styles.inputIcon} />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.checkboxLabel}>
              <input type="checkbox" defaultChecked /> Cài đặt thời hạn duyệt cho bước duyệt
            </label>
            
            <div className={styles.timeRow}>
              <div className={styles.timeInputGroup}>
                <input type="text" defaultValue="20" />
                <span className={styles.timeLabel}>Ngày</span>
              </div>
              <div className={styles.timeInputGroup}>
                <input type="text" defaultValue="18" />
                <span className={styles.timeLabel}>Giờ</span>
              </div>
              <div className={styles.timeInputGroup}>
                <input type="text" defaultValue="60" />
                <span className={styles.timeLabel}>Phút</span>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.settingsFooter}>
          <button className={styles.btnSecondary} onClick={() => setIsSettingsOpen(false)}>Hủy bỏ</button>
          <button className={styles.btnPrimary}>Cập nhật</button>
        </div>
      </div>

    </div>
  );
}
