<template>
  <div :class="{'has-logo':showLogo}">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="false"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item v-for="route in routes" :key="route.path" :item="route" :base-path="route.path" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Logo from "./Logo";
import SidebarItem from "./SidebarItem";
import variables from "@/styles/variables.scss";
import zc from "@/utils/zhangchu";

export default {
  components: { SidebarItem, Logo },
  computed: {
    ...mapGetters([
      "sidebar"
    ]),
    routes() {
      // 所有路由
      const routes = JSON.parse(JSON.stringify(this.$router.options.routes));
      const user = zc.cache.get("user");
      const myMenuIds = user.menuList;
      // 没有权限的菜单隐藏
      this.hiddenMenu(routes, myMenuIds);
      console.log(routes);
      return routes;

      // return this.$router.options.routes;
    },
    activeMenu() {
      const route = this.$route;
      const { meta, path } = route;
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu;
      }
      return path;
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo;
    },
    variables() {
      return variables;
    },
    isCollapse() {
      return !this.sidebar.opened;
    }
  },
  methods: {
    hiddenMenu(routes, myMenuIds) {
      if (!routes || routes.length == 0) {
        return;
      }
      routes.forEach(menu => {
        if (myMenuIds.indexOf(menu.name) == -1) {
          menu.hidden = true;
        }
        // 下级菜单
        const children = menu.children;
        if (children && children.length > 0) {
          this.hiddenMenu(children, myMenuIds);
        }
      });
    }
  }
};
</script>
