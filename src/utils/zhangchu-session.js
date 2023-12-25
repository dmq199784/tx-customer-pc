import cache from "@/utils/zhangchu-cache";

class Session {
  constructor(...keys) {
    this.cache = new cache.Cache(...keys);
    this.cache.setStorage(sessionStorage);
  }
  get(...args) {
    return this.cache.get(...args);
  }
  set(...args) {
    this.cache.set(...args);
  }
  remove(...args) {
    this.cache.remove(...args);
  }
  clear(...args) {
    this.cache.clear(...args);
  }
}
const DEFAULT_SESSION = new Session();
export default {
  session: DEFAULT_SESSION,
  Session,
  get: (...args) => DEFAULT_SESSION.get(...args),
  set: (...args) => DEFAULT_SESSION.set(...args),
  remove: (...args) => DEFAULT_SESSION.remove(...args),
  clear: (...args) => DEFAULT_SESSION.clear(...args)
};
