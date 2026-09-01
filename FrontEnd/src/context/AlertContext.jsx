import { createContext, useState, useContext } from 'react';

const AlertContext = createContext();

export const AlertProvider = ({ children }) => {
  const [alertMessage, setAlertMessage] = useState(null);

  const showAlert = (message) => setAlertMessage(message);
  const closeAlert = () => setAlertMessage(null);

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}

      {alertMessage && (
        <div
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)',
            backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center',
            justifyContent: 'center', zIndex: 99999, padding: '20px',
          }}
          onClick={closeAlert}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'var(--bg-card, #fff)', borderRadius: '16px',
              padding: '28px 24px 24px', maxWidth: '340px', width: '100%',
              textAlign: 'center', boxShadow: '0 20px 50px rgba(0,0,0,0.25)',
            }}
          >
            <div style={{
              width: '48px', height: '48px', borderRadius: '50%',
              background: 'var(--danger-light, #fee2e2)', display: 'flex',
              alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px',
              fontSize: '24px', color: 'var(--danger, #ef4444)', fontWeight: '900',
            }}>
              !
            </div>
            <p style={{
              fontSize: '15px', fontWeight: '600', color: 'var(--text-primary, #1f2937)',
              margin: '0 0 20px', lineHeight: 1.5,
            }}>
              {alertMessage}
            </p>
            <button
              onClick={closeAlert}
              style={{
                width: '100%', padding: '11px', borderRadius: '10px', border: 'none',
                background: 'var(--accent, #2563eb)', color: '#fff', fontSize: '14px',
                fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit',
              }}
            >
              ตกลง
            </button>
          </div>
        </div>
      )}
    </AlertContext.Provider>
  );
};

export const useAlert = () => useContext(AlertContext);