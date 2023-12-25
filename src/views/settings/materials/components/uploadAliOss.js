import zc from "@/utils/zhangchu";

const baseUrl = process.env.VUE_APP_BASE_API;
let g_object_name = "";

export function signature_check(dirId, fileType, next) {
  const postData = {
    userType: "ADMIN",
    dirId: dirId,
    format: fileType
  };
  return zc.post(`${baseUrl}/oss/aliyun_oss/policy`, postData);
}

export function set_upload_param(data, filename) {
  calculate_object_name(filename);
  const new_multipart_params = {
    key: `${data.dir}${g_object_name}`,
    policy: data.policy,
    OSSAccessKeyId: data.accessid,
    success_action_status: "200", // 让服务端返回200,不然，默认会返回204
    callback: data.callback,
    signature: data.signature
  };

  return new_multipart_params;
}

function calculate_object_name(filename) {
  const exName = filename.substring(filename.lastIndexOf("."));
  if (filename && filename.length > 55) { filename = filename.substring(filename.length - 50); }
  g_object_name =
    new Date().getTime() +
    (Math.random() * 100000).toFixed(0) +
    "_" +
    (Math.random() * 100000).toFixed(0) +
    exName;
  return "";
}
