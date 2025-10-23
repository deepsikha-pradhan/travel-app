// cache.js
const cache = new Map(); // key -> { otp, generatedTime }

const set = (key, value, ttl = 10 * 60 * 1000) => {
  cache.set(key, value);
  setTimeout(() => cache.delete(key), ttl); // auto-delete after TTL
};

const get = (key) => {
  return cache.get(key);
};

const del = (key) => {
  cache.delete(key);
};

module.exports = { set, get, del };
