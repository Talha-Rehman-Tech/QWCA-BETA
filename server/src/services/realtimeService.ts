import { Response } from 'express';

interface SSEClient {
  id: string;
  res: Response;
}

let clients: SSEClient[] = [];

/**
 * Register a new SSE client connection
 */
export function addSSEClient(id: string, res: Response): void {
  clients.push({ id, res });
  console.log(`📡 [Realtime SSE] Client connected: ${id} | Total active: ${clients.length}`);
}

/**
 * Remove an SSE client upon disconnect
 */
export function removeSSEClient(id: string): void {
  clients = clients.filter((c) => c.id !== id);
  console.log(`🔌 [Realtime SSE] Client disconnected: ${id} | Remaining active: ${clients.length}`);
}

/**
 * Get active connection count
 */
export function getSSEClientCount(): number {
  return clients.length;
}

/**
 * Broadcast an event to all connected SSE clients (frontend browser tabs)
 */
export function broadcastRealtimeEvent(event: string, payload: any): void {
  const dataString = JSON.stringify(payload);
  const sseMessage = `event: ${event}\ndata: ${dataString}\n\n`;

  const disconnectedIds: string[] = [];

  clients.forEach((client) => {
    try {
      client.res.write(sseMessage);
    } catch {
      disconnectedIds.push(client.id);
    }
  });

  if (disconnectedIds.length > 0) {
    clients = clients.filter((c) => !disconnectedIds.includes(c.id));
  }

  console.log(
    `📢 [Realtime SSE Broadcast] Event "${event}" pushed to ${clients.length} live client(s).`
  );
}
