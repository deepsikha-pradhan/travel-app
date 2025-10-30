
const cache = new Map(); 

const set = (key, value, ttl = 10 * 60 * 1000) => {
  cache.set(key, value);
  setTimeout(() => cache.delete(key), ttl); 
};

const get = (key) => {
  return cache.get(key);
};

const del = (key) => {
  cache.delete(key);
};

module.exports = { set, get, del };
