import { Router, Request, Response } from 'express';
import {
  addSSEClient,
  removeSSEClient,
  getSSEClientCount,
} from '../services/realtimeService.js';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  // Set SSE streaming headers
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
  res.flushHeaders?.();

  const clientId = `client_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  addSSEClient(clientId, res);

  // Send initial handshake
  res.write(
    `event: connected\ndata: ${JSON.stringify({
      status: 'connected',
      clientId,
      activeClients: getSSEClientCount(),
      timestamp: new Date().toISOString(),
    })}\n\n`
  );

  // Keep-alive ping every 20 seconds so intermediate proxies/browsers don't timeout
  const pingInterval = setInterval(() => {
    try {
      res.write(`event: ping\ndata: ${JSON.stringify({ timestamp: Date.now() })}\n\n`);
    } catch {
      clearInterval(pingInterval);
      removeSSEClient(clientId);
    }
  }, 20000);

  req.on('close', () => {
    clearInterval(pingInterval);
    removeSSEClient(clientId);
  });
});

export default router;
