import Layout from "@/layout/index";

const settingsRouter = {
  name: "Settings",
  path: "/settings",
  component: Layout,
  redirect: "/settings/basic",
  meta: {
    title: "系统",
    icon: "settings",
    menu: true
  },
  children: [
    {
      path: "/settings/basic",
      name: "Basic",
      component: () => import("@/views/settings/basic"),
      meta: {
        title: "基础设置",
        menu: true
      }
    },
    {
      path: "/settings/materials",
      name: "Material",
      component: () => import("@/views/settings/materials"),
      meta: {
        title: "素材管理",
        menu: true
      }
    },
    {
      path: "/settings/dict/list",
      name: "Dict",
      component: () => import("@/views/settings/dict"),
      meta: {
        title: "动态表格",
        menu: true
      }
    },
    {
      path: "/settings/dict/dictData",
      name: "DictData",
      component: () => import("@/views/settings/dict/dictData"),
      meta: {
        title: "动态表格详情列表",
        father: "Dict",
        activeMenu: "/settings/dict/list"
      }
    },
    {
      path: "/settings/account/list",
      name: "Account",
      component: () => import("@/views/settings/account"),
      meta: {
        title: "账户管理",
        menu: true
      }
    },
    {
      path: "/settings/account/add",
      name: "AddAccount",
      component: () => import("@/views/settings/account/form"),
      meta: {
        title: "添加账户",
        father: "Account",
        activeMenu: "/settings/account/list"
      }
    },
    {
      path: "/settings/account/update",
      name: "UpdateAccount",
      component: () => import("@/views/settings/account/form"),
      meta: {
        title: "编辑账户",
        father: "Account",
        activeMenu: "/settings/account/list"
      }
    },
    {
      path: "/settings/authority/list",
      name: "Authority",
      component: () => import("@/views/settings/authority"),
      meta: {
        title: "权限管理",
        menu: true
      }
    },
    {
      path: "/settings/authority/add",
      name: "AddAuthorityPlatform",
      component: () => import("@/views/settings/authority/form"),
      meta: {
        title: "添加权限",
        father: "Authority",
        activeMenu: "/settings/authority/list"
      }
    },
    {
      path: "/settings/authority/update",
      name: "UpdateAuthorityPlatform",
      component: () => import("@/views/settings/authority/form"),
      meta: {
        title: "编辑权限",
        father: "Authority",
        activeMenu: "/settings/authority/list"
      }
    },
    {
      path: "/settings/version",
      name: "Version",
      component: () => import("@/views/settings/version/index"),
      meta: {
        title: "版本更新",
        menu: true
      }
    },
    {
      path: "/settings/log",
      name: "Log",
      component: () => import("@/views/settings/log/logIndex"),
      meta: {
        title: "操作日志",
        menu: true
      }
    }

  ]
};

export default settingsRouter;
