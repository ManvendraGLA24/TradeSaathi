import { WebSocket, WebSocketServer } from 'ws';
import { INDEX_TOKENS, NIFTY50, NSE_TOKENS } from './_tokens.js';
import { requireWebSocketSession } from './_auth.js';
import { streamingCredentials } from './_smartapi.js';

const ANGEL_STREAM_URL = 'wss://smartapisocket.angelone.in/smart-stream';
const TOKEN_TO_SYMBOL = new Map([
  ...Object.entries(NSE_TOKENS).map(([symbol, token]) => [String(token), symbol]),
  ...Object.entries(INDEX_TOKENS).map(([symbol, token]) => [String(token), symbol]),
  ...NIFTY50.map(([symbol, token]) => [String(token), symbol]),
]);
const NSE_TOKENS_TO_SUBSCRIBE = [...new Set([
  ...Object.values(NSE_TOKENS),
  ...Object.values(INDEX_TOKENS),
  ...NIFTY50.map(([, token]) => token),
])].map(String);
const EXCHANGE_TYPES = { 1: 'NSE' };

let upstream = null;
let heartbeat = null;
let retryTimer = null;
let retryDelay = 1000;
let stopped = false;
const clients = new Set();

function sendClient(client, message) {
  if (client.readyState === WebSocket.OPEN) client.send(JSON.stringify(message));
}

function broadcast(message) {
  for (const client of clients) sendClient(client, message);
}

export function decodePacket(packet) {
  if (!Buffer.isBuffer(packet) || packet.length < 51) return null;
  const mode = packet.readUInt8(0);
  const exchangeType = packet.readUInt8(1);
  const token = packet.subarray(2, 27).toString('utf8').replace(/\0/g, '').trim();
  const symbol = TOKEN_TO_SYMBOL.get(token);
  if (!symbol || ![1, 2, 3].includes(mode)) return null;

  const tick = {
    type: 'tick',
    symbol,
    exchange: EXCHANGE_TYPES[exchangeType] || String(exchangeType),
    ltp: Number(packet.readBigInt64LE(43)) / 100,
    sequence: packet.readBigInt64LE(27).toString(),
    exchangeTimestamp: packet.readBigInt64LE(35).toString(),
    receivedAt: Date.now(),
  };

  if (mode >= 2 && packet.length >= 123) {
    tick.volume = Number(packet.readBigInt64LE(67));
    tick.open = Number(packet.readBigInt64LE(91)) / 100;
    tick.high = Number(packet.readBigInt64LE(99)) / 100;
    tick.low = Number(packet.readBigInt64LE(107)) / 100;
    tick.close = Number(packet.readBigInt64LE(115)) / 100;
  }
  if (mode === 3 && packet.length >= 139) {
    tick.oi = Number(packet.readBigInt64LE(131));
  }
  return tick;
}

function stopUpstream() {
  stopped = true;
  clearInterval(heartbeat);
  clearTimeout(retryTimer);
  heartbeat = null;
  retryTimer = null;
  if (upstream) {
    const socket = upstream;
    upstream = null;
    socket.close();
  }
}

function scheduleReconnect() {
  if (stopped || clients.size === 0 || retryTimer) return;
  retryTimer = setTimeout(() => {
    retryTimer = null;
    connectUpstream();
  }, retryDelay + Math.floor(Math.random() * 500));
  retryDelay = Math.min(retryDelay * 2, 30000);
}

async function connectUpstream() {
  if (upstream || stopped || clients.size === 0) return;
  broadcast({ type: 'status', state: 'connecting' });
  try {
    const credentials = await streamingCredentials();
    if (stopped || clients.size === 0) return;
    const socket = new WebSocket(ANGEL_STREAM_URL, {
      headers: {
        Authorization: credentials.jwt,
        'x-api-key': process.env.SMARTAPI_API_KEY,
        'x-client-code': process.env.SMARTAPI_CLIENT_CODE,
        'x-feed-token': credentials.feedToken,
      },
      handshakeTimeout: 15000,
    });
    upstream = socket;

    socket.on('open', () => {
      retryDelay = 1000;
      socket.send(JSON.stringify({
        correlationID: 'TradeSaathi',
        action: 1,
        params: {
          mode: 2,
          tokenList: [{ exchangeType: 1, tokens: NSE_TOKENS_TO_SUBSCRIBE }],
        },
      }));
      heartbeat = setInterval(() => {
        if (socket.readyState === WebSocket.OPEN) socket.ping();
      }, 10000);
      broadcast({ type: 'status', state: 'connected' });
    });

    socket.on('message', (data, isBinary) => {
      if (!isBinary) {
        const text = data.toString();
        if (text.toLowerCase() === 'ping') socket.send('pong');
        if (text.toLowerCase() === 'pong') return;
        try {
          const control = JSON.parse(text);
          if (control.errorCode || control.error) {
            broadcast({ type: 'status', state: 'error', message: 'Angel One stream rejected the subscription.' });
          }
        } catch {
          broadcast({ type: 'status', state: 'error', message: 'Angel One returned an unreadable stream message.' });
        }
        return;
      }
      try {
        const tick = decodePacket(data);
        if (tick) broadcast(tick);
      } catch (error) {
        console.error('Unable to decode Angel One market packet:', error.message);
      }
    });

    socket.on('error', (error) => {
      console.error('Angel One stream error:', error.message);
      broadcast({ type: 'status', state: 'error', message: 'Angel One stream is temporarily unavailable.' });
    });

    socket.on('close', () => {
      if (upstream === socket) upstream = null;
      clearInterval(heartbeat);
      heartbeat = null;
      broadcast({ type: 'status', state: 'disconnected' });
      scheduleReconnect();
    });
  } catch (error) {
    console.error('Unable to start Angel One stream:', error.message);
    broadcast({ type: 'status', state: 'error', message: 'Angel One stream could not authenticate. Check server credentials and TOTP clock.' });
    scheduleReconnect();
  }
}

export function attachMarketStream(server) {
  const wss = new WebSocketServer({ noServer: true, maxPayload: 1024 });

  server.on('upgrade', (req, socket, head) => {
    let pathname;
    try {
      pathname = new URL(req.url, 'http://localhost').pathname;
    } catch {
      socket.destroy();
      return;
    }
    if (pathname !== '/stream') {
      socket.destroy();
      return;
    }
    const origin = req.headers.origin;
    if (origin) {
      try {
        if (new URL(origin).host !== req.headers.host) throw new Error('origin mismatch');
      } catch {
        socket.write('HTTP/1.1 403 Forbidden\r\nConnection: close\r\n\r\n');
        socket.destroy();
        return;
      }
    }
    if (!requireWebSocketSession(req)) {
      socket.write('HTTP/1.1 401 Unauthorized\r\nConnection: close\r\n\r\n');
      socket.destroy();
      return;
    }
    wss.handleUpgrade(req, socket, head, (client) => wss.emit('connection', client, req));
  });

  wss.on('connection', (client) => {
    clients.add(client);
    stopped = false;
    sendClient(client, { type: 'status', state: upstream?.readyState === WebSocket.OPEN ? 'connected' : 'connecting' });
    if (!upstream) connectUpstream();
    client.on('close', () => {
      clients.delete(client);
      if (clients.size === 0) stopUpstream();
    });
  });

  server.on('close', () => {
    stopUpstream();
    wss.close();
  });
}

