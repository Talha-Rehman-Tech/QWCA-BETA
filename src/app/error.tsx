'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCw, Home, PhoneCall } from 'lucide-react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorBoundary({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log error to console or error reporting service
    console.error('QWCA Application Error:', error);
  }, [error]);

  return (
    <div
      style={{
        minHeight: '80vh',
        background: 'linear-gradient(180deg, #FAFAFB 0%, #FFFFFF 100%)',
        padding: '80px 24px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        className="container"
        style={{
          maxWidth: '640px',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '16px',
            backgroundColor: '#F8EBEB',
            color: '#A31D24',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '20px',
            border: '1px solid rgba(163, 29, 36, 0.2)',
          }}
        >
          <AlertTriangle size={32} />
        </div>

        <h1
          style={{
            fontSize: '26px',
            fontWeight: 800,
            color: '#1A1D20',
            marginBottom: '12px',
          }}
        >
          An Unexpected System Error Occurred
        </h1>

        <p
          style={{
            fontSize: '15px',
            color: '#6C757D',
            lineHeight: 1.6,
            marginBottom: '32px',
          }}
        >
          We encountered an unexpected issue while loading this page. Our corporate technical team has been notified. You can attempt to refresh the session or return to the main portal.
        </p>

        {error.digest && (
          <div
            style={{
              padding: '8px 14px',
              backgroundColor: '#F1F3F5',
              borderRadius: '6px',
              fontSize: '12px',
              fontFamily: 'monospace',
              color: '#495057',
              marginBottom: '28px',
              display: 'inline-block',
            }}
          >
            Incident Reference: {error.digest}
          </div>
        )}

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '12px',
            justifyContent: 'center',
            marginBottom: '40px',
          }}
        >
          <button
            type="button"
            onClick={() => reset()}
            className="button"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 24px',
              cursor: 'pointer',
            }}
          >
            <RefreshCw size={16} />
            <span>Try Again</span>
          </button>

          <Link
            href="/"
            className="button button-outline"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 24px',
              background: '#FFFFFF',
            }}
          >
            <Home size={16} />
            <span>Return to Home</span>
          </Link>
        </div>

        <div
          style={{
            borderTop: '1px solid #E9ECEF',
            paddingTop: '20px',
            fontSize: '13.5px',
            color: '#6C757D',
          }}
        >
          Need urgent advisory support? Call our main desk at{' '}
          <a
            href="tel:+92415392192"
            style={{ color: '#A31D24', fontWeight: 600, textDecoration: 'underline' }}
          >
            +92-41-5392192
          </a>
        </div>
      </div>
    </div>
  );
}
