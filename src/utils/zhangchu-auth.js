import util from "@/utils/zhangchu-util";
import cache from "@/utils/zhangchu-cache";

const AUTH_KEY = "authorization";
const headers = {
  [AUTH_KEY]: getAuthorization,
  user_id: getUserId,
  device_type: "CUSTOMER_PC"
};

const params = {
  userId: getUserId
};

function getUserId() {
  const userId = util.getQueryString("userId");
  if (userId) {
    return userId;
  }
  const json = cache.get(AUTH_KEY);
  return json ? json.userId : "";
}

function addAuth(headers) {
  if (!headers[AUTH_KEY]) {
    return;
  }
  const userId = headers["user_id"];
  if (userId) {
    cache.set(
      AUTH_KEY,
      { [AUTH_KEY]: headers[AUTH_KEY], userId: userId },
      { userId }
    );
  }
}

export function getAuthorization() {
  const json = cache.get(AUTH_KEY);
  return json ? json[AUTH_KEY] : "";
}

export function removeAuth() {
  cache.remove(AUTH_KEY);
}

export function getHeaders() {
  const h = {};
  for (const key in headers) {
    h[key] = util.getString(headers[key]);
  }
  return h;
}

export default {
  headers,
  params,
  addAuth,
  removeAuth,
  getHeaders,
  getAuthorization
};
