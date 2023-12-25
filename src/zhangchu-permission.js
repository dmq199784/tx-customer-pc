import router from "./router";
import NProgress from "nprogress"; // progress bar
import "nprogress/nprogress.css"; // progress bar style
import defaultSettings from "@/settings";
import auth from "@/utils/zhangchu-auth";
import util from "@/utils/zhangchu-util";
import cache from "@/utils/zhangchu-cache";

function addParams(toQuery) {
  const query = { ...toQuery };
  if (auth.params) {
    for (const key in auth.params) {
      if (query[key]) {
        continue;
      }
      const value = util.getString(auth.params[key]);
      if (value) {
        query[key] = value;
      }
    }
  }
  return query;
}

router.beforeEach(async (to, from, next) => {
  // 校验路由跳转权限
  const hasPermissinon = checkPermissinon(to, from);
  console.log(to.name, hasPermissinon);
  if (!hasPermissinon) {
    // next({
    //   path: "/404",
    // });
    return;
  }

  // start progress bar
  NProgress.start();
  // set page title
  document.title = to.meta && to.meta.title ? `${to.meta.title} - ${defaultSettings.title}` : defaultSettings.title;
  if (!from || !from.query || Object.keys(from.query).length == 0) {
    next();
    return;
  }
  const toQuery = addParams(to.query);
  if (JSON.stringify(toQuery) == JSON.stringify(to.query)) {
    next();
    return;
  }
  next({
    path: to.path,
    query: toQuery
  });
  NProgress.done();
  return;
});

router.afterEach(() => {
  // finish progress bar
  NProgress.done();
});

// 校验路由是否有跳转权限
function checkPermissinon(to, from) {
  // 登录页、404不校验、来自登录页面不校验
  if (to.path == "/" || to.path == "/404" || to.path == "/two") {
    return true;
  }

  const user = cache.get("user", {userId: to.query.userId});
  if (!user) {
    return false;
  }
  // 菜单缓存
  const myMenuIds = user.menuList;
  if (!myMenuIds || myMenuIds.length == 0) {
    return false;
  }

  if (!to.meta) {
    return false;
  }

  if (to.meta.menu) { // 菜单路由
    if (myMenuIds.indexOf(to.name) == -1) {
      return false;
    }
  } else { // 非菜单路由
    // 来自某个非菜单路由
    if (from.meta.father) {
      return true;
    }

    if (!to.meta.father) {
      return false;
    }
    if (myMenuIds.indexOf(to.meta.father) == -1) {
      return false;
    }
  }
  return true;
}
