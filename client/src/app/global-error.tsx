'use client';

import React from 'react';
import Link from 'next/link';

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          fontFamily: 'system-ui, -apple-system, sans-serif',
          backgroundColor: '#141618',
          color: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          padding: '24px',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            maxWidth: '560px',
            backgroundColor: '#1A1D20',
            border: '1px solid rgba(163, 29, 36, 0.4)',
            borderRadius: '16px',
            padding: '40px 32px',
            boxShadow: '0 20px 48px rgba(0, 0, 0, 0.6)',
          }}
        >
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '12px',
              backgroundColor: 'rgba(163, 29, 36, 0.2)',
              color: '#ff8a8f',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '28px',
              fontWeight: 'bold',
              marginBottom: '20px',
            }}
          >
            !
          </div>

          <h1 style={{ fontSize: '24px', margin: '0 0 12px 0', color: '#ffffff' }}>
            System Level Error
          </h1>

          <p style={{ fontSize: '15px', color: '#ADB5BD', lineHeight: 1.6, margin: '0 0 28px 0' }}>
            A critical root application error occurred. Our engineering operations team has been notified. You can attempt to refresh the application session below.
          </p>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button
              type="button"
              onClick={() => reset()}
              style={{
                backgroundColor: '#A31D24',
                color: '#ffffff',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '8px',
                fontSize: '14.5px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Try Again
            </button>
            <button
              type="button"
              onClick={() => {
                window.location.href = '/';
              }}
              style={{
                backgroundColor: 'transparent',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                padding: '12px 24px',
                borderRadius: '8px',
                fontSize: '14.5px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Return Home
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
