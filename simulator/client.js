const WebSocket = require('ws');

const ws = new WebSocket('ws://localhost:8765');

ws.on('open', () => {
  console.log('✅ Connected to simulator WebSocket');
});

ws.on('message', (data) => {
  console.log('🌡️ Received event:', data.toString());
});

ws.on('close', () => {
  console.log('❌ Connection closed');
});

ws.on('error', (err) => {
  console.error('⚠️ Error:', err.message);
});
