import axios from "axios";
import auth from "@/utils/zhangchu-auth";
import util from "@/utils/zhangchu-util";
import message from "@/utils/zhangchu-message";
import router from "@/utils/zhangchu-router";
import loading from "@/utils/zhangchu-loading";

const LOGIN_URL = "/";

const STATUS = {
  SUCCESS: "0",
  ERROR: "-1",
  LOGIN_TIMEOUT: "-2",
  NO_PERMISSION: "-3"
};

const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
});

// request interceptor
service.interceptors.request.use(
  config => {
    addHeaders(config);
    addParams(config);
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

service.interceptors.response.use(
  response => {
    const res = response.data;
    if (res.status == STATUS.LOGIN_TIMEOUT) {
      loginTimeout();
      return;
    }
    auth.addAuth(response.headers);
    if (res.status != STATUS.SUCCESS) {
      return Promise.reject(response);
    } else {
      if (typeof res == "object") {
        res["__headers"] = response.headers;
      }
      return res;
    }
  },
  error => {
    return Promise.reject(error.response);
  }
);

function addHeaders(config) {
  if (auth.headers) {
    for (const key in auth.headers) {
      const value = util.getString(auth.headers[key]);
      if (value) {
        config.headers[key] = value;
      }
    }
  }
}

function addParams(config) {
  config.data = config.data || {};
  if (auth.params) {
    for (const key in auth.params) {
      if (config.data[key]) {
        continue;
      }
      const value = util.getString(auth.params[key]);
      if (value) {
        config.data[key] = value;
      }
    }
  }
}

function loginTimeout() {
  message.warning("登录超时，即将跳转到登录页");
  setTimeout(() => {
    router.push(LOGIN_URL);
  }, 2000);
}

function getMessage(response) {
  if (!response || !response.status) {
    return "请求失败";
  }
  switch (response.status) {
    case 400:
      return "参数不正确";
    case 403:
      return "没有访问权限";
    case 408:
      return "请求超时";
    case 404:
      return "路径不正确";
    case 500:
      return "服务器忙，请稍后重试";
  }
  const data = response.data;
  if (data && data.msg) {
    return data.msg;
  }
  return null;
}

export function request(option, callback, successCallback, errCallback) {
  return new Promise((resolve, reject) => {
    service(option)
      .then(data => {
        if (callback) {
          callback(data);
        }
        if (successCallback) {
          successCallback(data);
        } else {
          return resolve(data);
        }
      })
      .catch(response => {
        if (callback) {
          callback(response ? response.data : "");
        }
        if (!option.disableMsg) {
          const msg = getMessage(response);
          message.err(
            msg,
            response && response.status != 200 ? response.status : "ERR"
          );
        }

        if (errCallback) {
          errCallback(response);
        } else {
          return reject(response);
        }
      });
  });
}

function paramsShift() {
  const params = {};
  for (let i = 0; i < arguments.length; i++) {
    const element = arguments[i];
    switch (typeof element) {
      case "string":
        if (!params.url) params.url = element;
        break;
      case "function":
        if (!params.callback) params.callback = element;
        break;
      case "boolean":
        if (!params.disableMsg) params.disableMsg = element;
        break;
      default:
        if (!params.data) params.data = element;
    }
  }
  return params;
}

function formatUrl(path, ...args) {
  const { url, data, callback, disableMsg } = paramsShift(...args);
  let fullUrl = url;
  if (fullUrl.endsWith("/")) {
    fullUrl = fullUrl + path;
  }
  return { url: fullUrl, data, callback, disableMsg };
}

export function post() {
  const { url, data, callback, disableMsg } = paramsShift(...arguments);
  return request({ url, data, disableMsg, method: "POST" }, callback);
}

export function postL() {
  const { url, data, callback, disableMsg } = paramsShift(...arguments);
  loading.showLoading();
  return request({ url, data, disableMsg, method: "POST" }, (data, headers) => {
    loading.hideLoading();
    if (callback) callback(data, headers);
  });
}

export function get() {
  const { url, data, callback, disableMsg } = paramsShift(...arguments);
  return request({ url, data, disableMsg, method: "GET" }, callback);
}

function postFormat(url, data, callback, disableMsg, fun) {
  return new Promise((resolve, reject) => {
    post(url, data, callback, disableMsg)
      .then(data => {
        resolve(fun(data));
      })
      .catch(response => reject(response));
  });
}

export function findData() {
  const { url, data, callback, disableMsg } = formatUrl("find", ...arguments);
  return postFormat(url, data, callback, disableMsg, data => {
    for (const key in data) {
      if (key != "status") {
        return data[key];
      }
    }
    return "";
  });
}

export function findArr() {
  const { url, data, callback, disableMsg } = formatUrl("find", ...arguments);
  return postFormat(url, data, callback, disableMsg, data => {
    for (const key in data) {
      if (key != "status" && Array.isArray(data[key])) {
        return data[key];
      }
    }
    return [];
  });
}

export default {
  request,
  post,
  postL,
  get,
  findData,
  findArr
};
