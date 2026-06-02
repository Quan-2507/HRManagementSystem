'use client';

import React, { useState } from 'react';
import styles from './login.module.css';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('http://localhost:5205/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        throw new Error('Email hoặc mật khẩu không chính xác');
      }

      const data = await res.json();
      localStorage.setItem('user', JSON.stringify({ email: data.email, fullName: data.fullName }));
      
      // Redirect to dashboard (mock for now)
      window.location.href = '/';
      
    } catch (err: any) {
      setError(err.message || 'Đã có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.backgroundDecoration} />
      <div className={styles.backgroundDecoration2} />
      
      <div className={`glass-panel animate-fade-in-up ${styles.loginCard}`}>
        <div className={styles.header}>
          <h1 className={styles.title}>HR Management</h1>
          <p className={styles.subtitle}>Đăng nhập để quản lý nhân sự</p>
        </div>

        {error && <div className={styles.globalError}>{error}</div>}

        <form className={styles.form} onSubmit={handleLogin}>
          <Input 
            label="Email" 
            type="email" 
            placeholder="admin@hrmanagement.com" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
          />
          <Input 
            label="Mật khẩu" 
            type="password" 
            placeholder="••••••••" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
          />
          
          <div className={styles.forgotPassword}>
            <a href="#">Quên mật khẩu?</a>
          </div>

          <Button 
            type="submit" 
            fullWidth 
            className={styles.submitBtn}
            disabled={isLoading}
          >
            {isLoading ? 'Đang xác thực...' : 'Đăng nhập'}
          </Button>
        </form>
      </div>
    </div>
  );
}
