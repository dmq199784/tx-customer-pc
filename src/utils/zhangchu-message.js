import { MessageBox, Message, Notification } from "element-ui";

const success = (title, msg) => {
  // Message.success(msg || '操作成功');
  Notification({
    title: title || "操作成功",
    message: msg,
    type: "success"
  });
};

const info = (title, msg) => {
  Notification.info({
    title: title || "提示",
    message: msg
  });
};

const err = (title, msg) => {
  // Message.error(msg || '服务器忙，请稍后重试');
  Notification.error({
    title: title || "服务器忙，请稍后重试",
    message: msg,
    type: "warning"
  });
};

const warning = (title, msg) => {
  // Message.warning(msg || '警告');
  Notification({
    title: title || "警告",
    message: msg,
    type: "warning"
  });
};

const confirm = (msg, title, confirmButtonText, cancelButtonText, type) => {
  return MessageBox.confirm(msg, title, {
    confirmButtonText: confirmButtonText || "确定",
    cancelButtonText: cancelButtonText || "取消",
    type: type || "warning"
  });
};
const prompt = function(msg, title, confirmButtonText, cancelButtonText) {
  let option = {
    confirmButtonText:
      typeof confirmButtonText == "string" ? confirmButtonText : "确定",
    cancelButtonText:
      typeof confirmButtonText == "string" ? cancelButtonText : "取消"
  };
  for (let i = 0; i < arguments.length; i++) {
    const arg = arguments[i];
    if (typeof arg == "object") {
      option = { ...option, ...arg };
    }
  }

  return MessageBox.prompt(msg, title || "提示", option);
};

export default {
  success,
  err,
  info,
  warning,
  confirm,
  prompt,
  message: Message,
  notify: Notification
};
