import React from 'react';

export default function Loading() {
  return (
    <div
      style={{
        minHeight: '70vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '20px',
        padding: '60px 24px',
      }}
    >
      {/* Sleek rotating ring loader */}
      <div
        style={{
          position: 'relative',
          width: '54px',
          height: '54px',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            border: '3px solid rgba(163, 29, 36, 0.15)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            border: '3px solid transparent',
            borderTopColor: '#A31D24',
            animation: 'qwca-spin 0.85s linear infinite',
          }}
        />
      </div>

      <div style={{ textAlign: 'center' }}>
        <p
          style={{
            fontSize: '13px',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            fontWeight: 700,
            color: '#A31D24',
            margin: '0 0 6px 0',
          }}
        >
          Loading Practice Details
        </p>
        <p
          style={{
            fontSize: '14px',
            color: '#6C757D',
            margin: 0,
          }}
        >
          Preparing regulatory data &amp; advisory models...
        </p>
      </div>

      <style>{`
        @keyframes qwca-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
