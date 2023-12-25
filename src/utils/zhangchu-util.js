import router from "../router";

export function getQueryString(name, url) {
  if (!url) {
    try {
      const val = router.history.current.query[name];
      if (val) {
        return val;
      }
    } catch (e) {
      // 没有router
    }
    url = location.href;
  }
  var reg = new RegExp("(^|\\?|&)" + name + "=([^&]*)(\\s|&|$)", "i");
  if (reg.test(url)) return unescape(RegExp.$2.replace(/\+/g, " "));
  return "";
}

export function getOssUrl(url) {
  if (url.startsWith("http")) {
    return url;
  }
  return process.env.VUE_APP_OSS_BASE_URL
    ? process.env.VUE_APP_OSS_BASE_URL + url
    : process.env.VUE_APP_BASE_API + url;
}

export function deepClone(data) {
  const type = this.judgeType(data);
  let obj;
  if (type === "array") {
    obj = [];
  } else if (type === "object") {
    obj = {};
  } else {
    // 不再具有下一层次
    return data;
  }
  if (type === "array") {
    for (let i = 0, len = data.length; i < len; i++) {
      obj.push(this.deepClone(data[i]));
    }
  } else if (type === "object") {
    // 对原型上的方法也拷贝了....
    for (const key in data) {
      obj[key] = this.deepClone(data[key]);
    }
  }
  return obj;
}

export function judgeType(obj) {
  // tostring会返回对应不同的标签的构造函数
  const toString = Object.prototype.toString;
  const map = {
    "[object Boolean]": "boolean",
    "[object Number]": "number",
    "[object String]": "string",
    "[object Function]": "function",
    "[object Array]": "array",
    "[object Date]": "date",
    "[object RegExp]": "regExp",
    "[object Undefined]": "undefined",
    "[object Null]": "null",
    "[object Object]": "object"
  };
  if (obj instanceof Element) {
    return "element";
  }
  return map[toString.call(obj)];
}

export function getString(obj, ...args) {
  const type = typeof obj;
  if (type == "string") {
    return obj;
  }
  if (type == "function") {
    return obj(...args);
  }
  return JSON.stringify(obj);
}

export function toCamelCase(str) {
  var re = /-(\w)/g;
  const s = str.replace(re, function($0, $1) {
    return $1.toUpperCase();
  });
  return s.substring(0, 1).toUpperCase() + s.substring(1);
}

export default {
  getQueryString,
  getString,
  judgeType,
  deepClone,
  toCamelCase,
  getOssUrl
};
