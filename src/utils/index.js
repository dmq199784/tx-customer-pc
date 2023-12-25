/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string | null}
 */
export function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null;
  }
  const format = cFormat || "{y}-{m}-{d} {h}:{i}:{s}";
  let date;
  if (typeof time === "object") {
    date = time;
  } else {
    if ((typeof time === "string") && (/^[0-9]+$/.test(time))) {
      time = parseInt(time);
    }
    if ((typeof time === "number") && (time.toString().length === 10)) {
      time = time * 1000;
    }
    date = new Date(time);
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  };
  const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key];
    // Note: getDay() returns 0 on Sunday
    if (key === "a") { return ["日", "一", "二", "三", "四", "五", "六"][value ]; }
    return value.toString().padStart(2, "0");
  });
  return time_str;
}

/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function formatTime(time, option) {
  if (("" + time).length === 10) {
    time = parseInt(time) * 1000;
  } else {
    time = +time;
  }
  const d = new Date(time);
  const now = Date.now();

  const diff = (now - d) / 1000;

  if (diff < 30) {
    return "刚刚";
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + "分钟前";
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + "小时前";
  } else if (diff < 3600 * 24 * 2) {
    return "1天前";
  }
  if (option) {
    return parseTime(time, option);
  } else {
    return (
      d.getMonth() +
      1 +
      "月" +
      d.getDate() +
      "日" +
      d.getHours() +
      "时" +
      d.getMinutes() +
      "分"
    );
  }
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj(url) {
  const search = url.split("?")[1];
  if (!search) {
    return {};
  }
  return JSON.parse(
    "{\"" +
      decodeURIComponent(search)
        .replace(/"/g, "\\\"")
        .replace(/&/g, "\",\"")
        .replace(/=/g, "\":\"")
        .replace(/\+/g, " ") +
      "\"}"
  );
}

/**
 * @param {Function} func
 * @param {number} wait
 * @param {boolean} immediate
 * @return {*}
 */
export function debounce(func, wait, immediate) {
  let timeout, args, context, timestamp, result;

  const later = function() {
    // 据上一次触发时间间隔
    const last = +new Date() - timestamp;

    // 上次被包装函数被调用时间间隔 last 小于设定时间间隔 wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last);
    } else {
      timeout = null;
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      }
    }
  };

  return function(...args) {
    context = this;
    timestamp = +new Date();
    const callNow = immediate && !timeout;
    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait);
    if (callNow) {
      result = func.apply(context, args);
      context = args = null;
    }

    return result;
  };
}

/**
 * 获取当前时间
 * @param type 得到年月日（date) 得到年月日时分秒（time)
 * @returns {string}
 */
export function getCurrentDate(type = "time") {
  const now = new Date();
  const year = now.getFullYear(); // 得到年份
  let month = now.getMonth(); // 得到月份
  let date = now.getDate(); // 得到日期
  // const day = now.getDay(); // 得到周几
  let hour = now.getHours(); // 得到小时
  let minu = now.getMinutes(); // 得到分钟
  let sec = now.getSeconds(); // 得到秒
  month = month + 1;
  if (month < 10) month = "0" + month;
  if (date < 10) date = "0" + date;
  if (hour < 10) hour = "0" + hour;
  if (minu < 10) minu = "0" + minu;
  if (sec < 10) sec = "0" + sec;
  let time = "";

  if (type === "time") {
    time = year + "-" + month + "-" + date + " " + hour + ":" + minu + ":" + "00";
  } else if (type === "date") {
    time = year + "-" + month + "-" + date;
  }
  return time;
}

/**
 * 转时间
 * @param type 得到年月日（date) 得到年月日时分秒（time)
 * @returns {string}
 */
export function changeTime(time, type = "time") {
  const d = new Date(time);
  const yy = d.getFullYear().toString();
  let m = d.getMonth() + 1;
  let dd = d.getDate();
  let hh = d.getHours();
  let MM = d.getMinutes();
  // let ss = d.getSeconds();
  m = m < 10 ? "0" + m : m.toString();
  dd = dd < 10 ? "0" + dd : dd.toString();
  hh = hh < 10 ? "0" + hh : hh.toString();
  MM = MM < 10 ? "0" + MM : MM.toString();
  // ss = ss < 10 ? "0" + ss : ss.toString();
  if (type === "time") {
    time = yy + "-" + m + "-" + dd + " " + hh + ":" + MM + ":" + "00";
  } else if (type === "date") {
    time = yy + "-" + m + "-" + dd;
  }
  return time;
}

/**
 * 获取默认时间段（年、月、周）
 * @returns {[string, string]}
 */
export function getDefaultTime(type = "week") {
  const defaultEndDate = getCurrentDate("date");
  const nowDate = new Date().getTime();
  let tempDate, defaultStartDate;
  switch (type) {
    case "year":
       tempDate = nowDate - 3600 * 1000 * 24 * 365;
       defaultStartDate = changeTime(tempDate, "date");
      return [defaultStartDate, defaultEndDate];
    case "month":
       tempDate = new Date().getTime() - 3600 * 1000 * 24 * 30;
       defaultStartDate = changeTime(tempDate, "date");
      return [defaultStartDate, defaultEndDate];
    case "week":
       tempDate = new Date().getTime() - 3600 * 1000 * 24 * 7;
       defaultStartDate = changeTime(tempDate, "date");
      return [defaultStartDate, defaultEndDate];
    default:
      //
  }
}

/**
 * 如果传的值是空值，返回真
 * @param value
 * @returns {boolean|boolean}
 */
export function isEmpty(value) {
  return (
    value === undefined ||
    value === null ||
    (typeof value === "object" && Object.keys(value).length === 0) ||
    (typeof value === "string" && value.trim().length === 0)
  );
}
