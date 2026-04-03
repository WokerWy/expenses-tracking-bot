import NodeCache from 'node-cache';

let _cache: NodeCache;

if (!_cache) {
  _cache = new NodeCache();
}

const setData = (key: string, value: unknown) => {
  _cache.set(key, value);
};

const getData = <T>(key: string): T => _cache.get<T>(key);

const hasData = (key: string) => _cache.has(key);

const deleteData = (key: string) => {
  _cache.del(key);
};

const flushAll = () => {
  _cache.flushAll();
};

export default {
  setData,
  getData,
  hasData,
  deleteData,
  flushAll,
};
