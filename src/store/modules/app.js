import Cookies from "js-cookie";

const state = {
  sidebar: {
    opened: Cookies.get("sidebarStatus")
      ? !!+Cookies.get("sidebarStatus")
      : true,
    withoutAnimation: false
  },
  device: "desktop",
  resourceDialog: {
    disabled: true,
    visible: false,
    type: "IMAGE",
    title: "选择图片",
    limit: 1,
    selectedNum: 0,
    choose: () => {}
  }
};

const mutations = {
  TOGGLE_SIDEBAR: state => {
    state.sidebar.opened = !state.sidebar.opened;
    state.sidebar.withoutAnimation = false;
    if (state.sidebar.opened) {
      Cookies.set("sidebarStatus", 1);
    } else {
      Cookies.set("sidebarStatus", 0);
    }
  },
  CLOSE_SIDEBAR: (state, withoutAnimation) => {
    Cookies.set("sidebarStatus", 0);
    state.sidebar.opened = false;
    state.sidebar.withoutAnimation = withoutAnimation;
  },
  TOGGLE_DEVICE: (state, device) => {
    state.device = device;
  },
  TOGGLE_RESOURCE_DIALOG: state => {
    state.resourceDialog.visible = !state.resourceDialog.visible;
    if (state.resourceDialog.visible) {
      state.resourceDialog.disabled = false;
    }
  },
  CLOSE_RESOURCE_DIALOG: state => {
    state.resourceDialog.visible = false;
  },
  SET_RESOURCE_DIALOG_CHOOSE: (state, fun) => {
    state.resourceDialog.choose = fun;
  },
  SET_RESOURCE_DIALOG_OPTIONS: (state, option) => {
    for (const key in option) {
      state.resourceDialog[key] = option[key];
    }
    state.resourceDialog.disabled = false;
  }
};

const actions = {
  toggleSideBar({ commit }) {
    commit("TOGGLE_SIDEBAR");
  },
  closeSideBar({ commit }, { withoutAnimation }) {
    commit("CLOSE_SIDEBAR", withoutAnimation);
  },
  toggleDevice({ commit }, device) {
    commit("TOGGLE_DEVICE", device);
  },
  toggleResourceDialog({ commit }) {
    commit("TOGGLE_RESOURCE_DIALOG");
  },
  closeResourceDialog({ commit }) {
    commit("CLOSE_RESOURCE_DIALOG");
  },
  setResourceDialogChoose({ commit }, fun) {
    commit("SET_RESOURCE_DIALOG_CHOOSE", fun);
  },
  setResourceDialogOption({ commit }, option) {
    commit("SET_RESOURCE_DIALOG_OPTIONS", option);
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
