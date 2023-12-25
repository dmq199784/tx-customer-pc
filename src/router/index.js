import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

/* Layout */
import Layout from "@/layout";

/* Router Modules */
import operationRouter from "@/router/modules/operation";
import settingsRouter from "@/router/modules/settings";
// import clientsRouter from "@/router/modules/clients";
// import userMgmtRouter from "@/router/modules/user-mgmt";

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: "/",
    component: () => import("@/views/login/index"),
    hidden: true
  },
  {
    path: "/two",
    component: () => import("@/views/loginTwo/indexTwo"),
    hidden: true
  },
  {
    path: "/404",
    component: () => import("@/views/404"),
    hidden: true
  },
  {
    path: "/home",
    name: "Home",
    component: Layout,
    redirect: "/overview/list"
  },
  {
    name: "Overview",
    path: "/overview",
    component: Layout,
    redirect: "list",
    children: [
      {
        path: "list",
        name: "OverviewIndex",
        component: () => import("@/views/overview"),
        meta: {
          title: "概况",
          icon: "overview",
          menu: true// 是否是菜单
        }
      }
    ]
  },

  operationRouter,

  // operationMgmtRouter,

  // userMgmtRouter,

  // clientsRouter,
  // projectsRouter,

  // equipmentRouter,

  // mallRouter,

  settingsRouter,

  // 404 page must be placed at the end !!!
  { path: "*", redirect: "/404", hidden: true }
];

const routeMap = new Map();

const formatRoutes = (routes) => {
  routes.forEach(route => {
    if (route.name) {
      routeMap.set(route.name, route);
    }
    if (route.children) {
      formatRoutes(route.children);
    }
    // meta 中加 father 不会被加入到导航栏
    if (route.meta && route.meta.father) {
      route.hidden = route.hidden !== false;
    }
  });
  return routes;
};

const createRouter = () => {
  routeMap.clear();
  const routes = formatRoutes(constantRoutes);
  return new Router({
    mode: "history",
    base: "/pc_admin/",
    scrollBehavior: () => ({ y: 0 }),
    routes: routes
  });
};

const router = createRouter();

router.getByName = (name) => {
  return routeMap.get(name);
};

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher; // reset router
}

export default router;
