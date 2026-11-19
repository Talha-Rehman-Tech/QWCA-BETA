const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
const BROADCAST_CHANNEL_NAME = 'qwca_realtime_sync_channel';
const STORAGE_EVENT_KEY = 'qwca_realtime_sync_event';

export type RealtimeEvent = {
  type: 'tax_slabs_updated' | 'company_cost_updated' | 'connected' | 'ping';
  action?: 'save' | 'delete' | 'reset';
  year?: string;
  data?: any;
  timestamp?: string | number;
};

type RealtimeListener = (event: RealtimeEvent) => void;

class RealtimeSyncManager {
  private listeners: Set<RealtimeListener> = new Set();
  private broadcastChannel: BroadcastChannel | null = null;
  private eventSource: EventSource | null = null;
  private isInitialized = false;
  private reconnectTimer: any = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.init();
    }
  }

  private init() {
    if (this.isInitialized || typeof window === 'undefined') return;
    this.isInitialized = true;

    // 1. Same-Browser Multi-Tab BroadcastChannel (Instant 0-1ms DOM update)
    if ('BroadcastChannel' in window) {
      try {
        this.broadcastChannel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
        this.broadcastChannel.onmessage = (messageEvent: MessageEvent<RealtimeEvent>) => {
          if (messageEvent.data && messageEvent.data.type) {
            this.notify(messageEvent.data);
          }
        };
      } catch (err) {
        console.warn('[Realtime] BroadcastChannel init error:', err);
      }
    }

    // 2. Storage event listener fallback (for tabs in same browser)
    window.addEventListener('storage', (storageEvent) => {
      if (storageEvent.key === STORAGE_EVENT_KEY && storageEvent.newValue) {
        try {
          const parsed: RealtimeEvent = JSON.parse(storageEvent.newValue);
          this.notify(parsed);
        } catch {}
      }
    });

    // 3. Server-Sent Events (SSE) from Express Backend (cross-device & remote sync)
    this.connectSSE();

    // 4. Tab visibility / focus refetch check
    window.addEventListener('focus', () => {
      if (!this.eventSource || this.eventSource.readyState === EventSource.CLOSED) {
        this.connectSSE();
      }
    });
  }

  private connectSSE() {
    if (typeof window === 'undefined') return;

    if (this.eventSource) {
      try {
        this.eventSource.close();
      } catch {}
      this.eventSource = null;
    }

    try {
      const sseEndpoint = `${API_BASE}/events`;
      const es = new EventSource(sseEndpoint);

      es.addEventListener('tax_slabs_updated', (e: MessageEvent) => {
        try {
          const payload = JSON.parse(e.data);
          this.notify({ type: 'tax_slabs_updated', ...payload });
        } catch {}
      });

      es.addEventListener('company_cost_updated', (e: MessageEvent) => {
        try {
          const payload = JSON.parse(e.data);
          this.notify({ type: 'company_cost_updated', ...payload });
        } catch {}
      });

      es.addEventListener('connected', () => {
        // SSE connected
      });

      es.onerror = () => {
        try {
          es.close();
        } catch {}
        this.eventSource = null;

        // Retry connection after 5 seconds if backend was offline
        if (!this.reconnectTimer) {
          this.reconnectTimer = setTimeout(() => {
            this.reconnectTimer = null;
            this.connectSSE();
          }, 5000);
        }
      };

      this.eventSource = es;
    } catch {
      // Backend is offline; silent fallback
    }
  }

  private notify(event: RealtimeEvent) {
    this.listeners.forEach((fn) => {
      try {
        fn(event);
      } catch (err) {
        console.error('[Realtime] Listener callback error:', err);
      }
    });
  }

  /**
   * Subscribe to live updates. Returns an unsubscribe cleanup function.
   */
  public subscribe(listener: RealtimeListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Broadcast an update from this tab to all other open tabs in the browser instantly
   */
  public broadcastLocal(event: RealtimeEvent) {
    // Post to BroadcastChannel
    if (this.broadcastChannel) {
      try {
        this.broadcastChannel.postMessage(event);
      } catch {}
    }

    // Set localStorage item to trigger 'storage' event in other tabs
    try {
      localStorage.setItem(
        STORAGE_EVENT_KEY,
        JSON.stringify({ ...event, _ts: Date.now() })
      );
    } catch {}
  }
}

// Singleton instance
export const realtimeSync = new RealtimeSyncManager();

/**
 * React helper to subscribe to realtime tax slab & company cost updates
 */
export function subscribeToRealtime(listener: RealtimeListener): () => void {
  return realtimeSync.subscribe(listener);
}

/**
 * Broadcast an update from Admin Panel to all open client tabs
 */
export function broadcastLocalUpdate(
  type: 'tax_slabs_updated' | 'company_cost_updated',
  data?: any
): void {
  realtimeSync.broadcastLocal({
    type,
    data,
    timestamp: Date.now(),
  });
}
