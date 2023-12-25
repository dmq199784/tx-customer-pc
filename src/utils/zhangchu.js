import cache from "@/utils/zhangchu-cache";
import util from "@/utils/zhangchu-util";
import request from "@/utils/zhangchu-request";
import message from "@/utils/zhangchu-message";
import routher from "@/utils/zhangchu-router";
import loading from "@/utils/zhangchu-loading";
import session from "@/utils/zhangchu-session";

const cacheUtil = {
  cache: cache.cache,
  Cache: cache.Cache
};
const sessionUtil = {
  session: session.session,
  Session: session.Session
};

export default {
  ...cacheUtil, ...sessionUtil, ...util, ...request, ...loading,
  message: {
    ...message
  },
  routher: {
    ...routher
  }
};
