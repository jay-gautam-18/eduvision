const redis = require('redis');

const client = redis.createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
  socket: {
    reconnectStrategy: (retries) => {
      if (retries > 5) {
        console.log('Redis: Max retries reached. Caching disabled.');
        return new Error('Redis connection failed');
      }
      return Math.min(retries * 100, 3000);
    }
  }
});

let isConnected = false;

client.on('error', (err) => {
  // Suppress errors to prevent server crash
  // console.log('Redis Client Error', err.message);
});

client.on('connect', () => {
  console.log('Redis Client Connected');
  isConnected = true;
});

(async () => {
  try {
    await client.connect();
  } catch (err) {
    console.log('Redis Connection Failed. Running without cache.');
  }
})();

// Wrapper to safely execute Redis commands
const safeClient = {
  get: async (key) => {
    if (!isConnected) return null;
    try { return await client.get(key); } catch (e) { return null; }
  },
  set: async (key, value) => {
    if (!isConnected) return;
    try { await client.set(key, value); } catch (e) { }
  },
  setEx: async (key, seconds, value) => {
    if (!isConnected) return;
    try { await client.setEx(key, seconds, value); } catch (e) { }
  },
  del: async (key) => {
    if (!isConnected) return;
    try { await client.del(key); } catch (e) { }
  }
};

module.exports = safeClient;
