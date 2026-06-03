'use client';

import React, { useState } from 'react';
import { 
  X, 
  UploadCloud, 
  FileSpreadsheet, 
  Plus, 
  Mic, 
  Send, 
  ChevronDown,
  CheckCircle2,
  Triangle
} from 'lucide-react';
import styles from './salary.module.css';

const formulaConfig = [
  { letter: 'A', value: 'STT', label: 'STT', keyword: 'STT', formula: '' },
  { letter: 'B', value: 'Mã nhân sự', label: 'Mã nhân sự', keyword: 'PERSONNEL_CODE', formula: '' },
  { letter: 'C', value: 'Họ tên', label: 'Họ và Tên', keyword: 'PERSONNEL_NAME', formula: '' },
  { letter: 'D', value: 'Import', label: 'Tổng số công làm việc', keyword: 'TOTAL_WORKDAY_PERSON', formula: '' },
  { letter: 'E', value: 'Công thức', label: 'Lương gross', keyword: 'GROSS_SALARY', formula: 'KPI_BONUS + SALARY_TYPE_CB' },
  { letter: 'F', value: 'Công thức', label: 'Tiền công chuẩn 1 giờ', keyword: 'STANDARD_HOURLY_WAGE', formula: 'SALARY_TYPE_CB / TOTAL_WORKDAY_PERSON / 8' },
  { letter: 'G', value: 'Import', label: 'Giờ làm thêm', keyword: 'OVERTIME_HOUR', formula: '' },
  { letter: 'H', value: 'Công thức', label: 'Tiền lương', keyword: 'OVERTIME_SALARY', formula: 'STANDARD_HOURLY_WAGE * OVERTIME_HOUR * 1.5' },
  { letter: 'I', value: 'Import', label: 'Phụ cấp Chuyên cần', keyword: 'ALLOW_ATTENDANCE', formula: '' },
  { letter: 'J', value: 'Công thức', label: 'Phụ cấp Ăn trưa', keyword: 'LUNCH_ALLOWANCE', formula: '30000 * TOTAL_WORKDAY_PERSON' },
  { letter: 'K', value: 'Công thức', label: 'Tăng ca miễn thuế', keyword: 'OVERTIME_TAX_FREE', formula: 'OVERTIME_SALARY / 1.5 * 50%' },
  { letter: 'L', value: 'Công thức', label: 'Tổng thu nhập chịu thuế', keyword: 'TAXABLE_TOTAL_INCOME', formula: 'SALARY_TYPE_CB + OVERTIME_SALARY - OVERTIME_TAX_FREE' },
  { letter: 'M', value: 'Import', label: 'Bản thân', keyword: 'PERSONAL_DEDUCTION', formula: '' },
  { letter: 'N', value: 'Số người phụ thuộc', label: 'Người phụ thuộc', keyword: 'NUMBER_DEPENDENT', formula: '' },
];

export default function SalaryConfigPage() {
  return (
    <div className={styles.container}>
      
      {/* LEFT COLUMN */}
      <div className={styles.configPanel}>
        <div className={styles.panelHeader}>
          <div className={styles.orangeSquare}>+</div>
          <h1 className={styles.panelTitle}>Tạo loại bảng lương</h1>
        </div>

        <div className={styles.configContent}>
          <div className={styles.configSectionTitle}>
            <ChevronDown size={18} />
            Cấu hình danh sách cột
          </div>

          <div className={styles.columnList}>
            <div className={styles.columnHeaderRow}>
              <div>Cột</div>
              <div>Giá trị cột <span className={styles.required}>*</span></div>
              <div>Tiêu đề cột <span className={styles.required}>*</span></div>
              <div>Từ khóa cột <span className={styles.required}>*</span></div>
              <div>Cách tính (Công thức/ Hằng số) <span className={styles.required}>*</span></div>
            </div>

            {formulaConfig.map((col, idx) => (
              <div key={idx} className={styles.configRow}>
                <div className={styles.colLetter}>{col.letter}</div>
                
                <div className={styles.inputWrapper}>
                  <input 
                    type="text" 
                    className={`${styles.configInput} ${col.value === 'Import' || col.value === 'Công thức' ? styles.valueTypeInput : ''}`} 
                    value={col.value} 
                    readOnly 
                  />
                  <button className={styles.clearIcon}><X size={14}/></button>
                </div>

                <div className={styles.inputWrapper}>
                  <input type="text" className={styles.configInput} defaultValue={col.label} />
                </div>

                <div className={styles.inputWrapper}>
                  <input type="text" className={styles.configInput} defaultValue={col.keyword} />
                </div>

                <div className={styles.inputWrapper}>
                  <input 
                    type="text" 
                    className={styles.configInput} 
                    defaultValue={col.formula} 
                    disabled={col.value === 'Import' || col.value === 'STT' || col.value === 'Mã nhân sự' || col.value === 'Số người phụ thuộc'}
                    style={col.formula ? { backgroundColor: '#fff' } : { backgroundColor: '#f8f9fa' }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.panelFooter}>
          <button className={styles.btnPrimary}>CẬP NHẬT</button>
          <button className={styles.btnSecondary}>HỦY BỎ</button>
          <button className={styles.btnSecondary}>LƯU NHÁP</button>
        </div>
      </div>


      {/* RIGHT COLUMN */}
      <div className={styles.aiPanel}>
        <div className={styles.aiHeader}>
          <div className={styles.aiTitle}>
            <Triangle size={18} className={styles.aiIcon} fill="currentColor" />
            1AI Salary
          </div>
          <button className={styles.closeBtn}><X size={20} /></button>
        </div>

        <div className={styles.chatContent}>
          {/* User message */}
          <div className={`${styles.messageRow} ${styles.messageUser}`}>
            <div className={`${styles.bubble} ${styles.bubbleUser}`}>
              Hi 1AI Salary, hãy tạo giúp tôi một bảng lương
            </div>
          </div>

          {/* AI message */}
          <div className={`${styles.messageRow} ${styles.messageAI}`}>
            <div className={`${styles.bubble} ${styles.bubbleAI}`}>
              <div>
                Ok chủ nhân, hãy tải lên bảng lương mẫu (Excel, Word hay PDF), tôi sẽ đọc hiểu cấu trúc, tự động bóc tách dữ liệu, và xây dựng bảng lương hoàn chỉnh.
              </div>
              <div className={styles.uploadAction}>
                <button className={styles.btnUpload}>
                  <UploadCloud size={14} /> Upload file
                </button>
              </div>
            </div>
          </div>

          {/* User Attachment */}
          <div className={styles.fileAttachment}>
            <div className={styles.fileIconBox}>
              <FileSpreadsheet size={18} />
            </div>
            <div className={styles.fileInfo}>
              <span className={styles.fileName}>Bảng lương mẫu</span>
              <span className={styles.fileSize}>1.020KB</span>
            </div>
          </div>

          {/* AI Analyzing */}
          <div className={`${styles.messageRow} ${styles.messageAI}`}>
            <div className={styles.analyzingText}>
              <span className={styles.dots}>...</span> Đang phân tích <span className={styles.dots}>...</span>
            </div>
          </div>
          <div className={`${styles.messageRow} ${styles.messageAI}`} style={{ marginTop: '-1rem' }}>
            <div className={styles.analyzingText} style={{ fontSize: '0.8rem' }}>
              1AI đang đọc và hiểu cấu trúc bảng lương mẫu bạn đã tải lên. Hệ thống sẽ tự động bóc tách dữ liệu, nhận diện các thông tin liên quan: phép toán, từ khóa, hàm... Sau đó, 1AI sẽ xây dựng bảng lương hoàn chỉnh dựa trên dữ liệu phân tích được.
            </div>
          </div>

          {/* AI Result */}
          <div className={`${styles.messageRow} ${styles.messageAI}`}>
            <div className={styles.aiResponseBox}>
              <div className={styles.aiResponseTitle}>
                <CheckCircle2 size={16} />
                Tôi sẽ tạo công thức cho các từ khóa sau:
              </div>
              <div className={styles.formulaList}>
                <div className={styles.formulaItem}><strong>A. STT</strong> - Số thứ tự của nhân sự trong bảng lương</div>
                <div className={styles.formulaItem}><strong>B. PERSONNEL_CODE</strong> - Mã nhân sự</div>
                <div className={styles.formulaItem}><strong>C. PERSONNEL_NAME</strong> - Họ tên nhân sự</div>
                <div className={styles.formulaItem}><strong>D. TOTAL_WORKDAY_PERSON</strong> - Tổng số công làm việc của nhân sự</div>
                <div className={styles.formulaItem}><strong>E. GROSS_SALARY</strong> - Lương gross</div>
                <div className={styles.formulaItem}><strong>F. STANDARD_HOURLY_WAGE</strong> - Tiền công chuẩn 1 giờ, tính bằng SALARY_TYPE_CB chia cho TOTAL_WORKDAY_PERSON chia cho 8.</div>
                <div className={styles.formulaItem}><strong>G. OVERTIME_HOUR</strong> - Số giờ làm thêm của nhân sự trong</div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.chatInputArea}>
          <div className={styles.inputWrapperAI}>
            <button className={styles.iconBtn}><Plus size={18} /></button>
            <button className={styles.iconBtn}><Mic size={18} /></button>
            <input type="text" className={styles.chatInput} placeholder="Viết tin nhắn" />
            <button className={styles.iconBtn}><Send size={18} /></button>
          </div>
        </div>
      </div>
      
    </div>
  );
}
