import React, { createContext, useContext, useState, useCallback } from 'react';

type ToastType = 'success' | 'error' | 'info';
interface Toast { id: number; message: string; type: ToastType; }
interface ToastCtx { show: (message: string, type?: ToastType) => void; }

const Ctx = createContext<ToastCtx>({ show: () => {} });

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const show = useCallback((message: string, type: ToastType = 'info') => {
    const id = Date.now() + Math.random();
    setToasts(t => [...t, { id, message, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 4000);
  }, []);
  const colors: Record<ToastType, string> = { success: '#198754', error: '#ef4444', info: '#0F4CA4' };
  return (
    <Ctx.Provider value={{ show }}>
      {children}
      <div style={{ position: 'fixed', top: 16, right: 16, zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {toasts.map(t => (
          <div key={t.id} style={{ background: colors[t.type], color: '#fff', padding: '0.75rem 1.25rem', borderRadius: 10, boxShadow: '0 4px 12px rgba(0,0,0,0.15)', fontSize: '0.85rem', fontWeight: 600, maxWidth: 360 }}>
            {t.message}
          </div>
        ))}
      </div>
    </Ctx.Provider>
  );
};

export const useToast = () => useContext(Ctx);
