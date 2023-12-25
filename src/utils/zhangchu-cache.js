import util from "@/utils/zhangchu-util";
const DEFAULT_CACHE_KEYS = ["userId"];

class Cache {
  constructor(...keys) {
    if (!keys || keys.length == 0) {
      keys = DEFAULT_CACHE_KEYS;
    }
    this.keys = keys;
    this.storage = localStorage;
  }
  getKeyStr(key, defaultValues) {
    if (!this.keys || this.keys.length == 0) {
      return key;
    }
    return key + "_" + this.keys.map(element => {
      let value;
      if (defaultValues && defaultValues[element]) {
        value = defaultValues[element];
      } else {
        value = util.getQueryString(element);
      }

      return value || "";
    }).join("_");
  }
  get(key, defaultValues) {
    const k = this.getKeyStr(key, defaultValues);
    const value = this.storage[k];
    if (value) {
      return JSON.parse(value);
    }
    return "";
  }
  set(key, value, defaultValues) {
    const k = this.getKeyStr(key, defaultValues);
    if (value) {
      value = JSON.stringify(value);
    }
    this.storage[k] = value;
  }
  remove(key, defaultValues) {
    const k = this.getKeyStr(key, defaultValues);
    this.storage.removeItem(k);
  }
  clear(defaultValues) {
    const k = this.getKeyStr("", defaultValues);
    if (k == "_") {
      this.storage.clear();
      return;
    }
    for (var i = 0; i < this.storage.length; i++) {
      const key = this.storage.key(i);
      if (key.endsWith(k)) {
        this.storage.removeItem(key);
        i--;
      }
    }
  }
  setStorage(storage) {
    this.storage = storage;
  }
}
const DEFAULT_CACHE = new Cache();
export default {
  cache: DEFAULT_CACHE,
  Cache,
  get: (...args) => DEFAULT_CACHE.get(...args),
  set: (...args) => DEFAULT_CACHE.set(...args),
  remove: (...args) => DEFAULT_CACHE.remove(...args),
  clear: (...args) => DEFAULT_CACHE.clear(...args)
};
