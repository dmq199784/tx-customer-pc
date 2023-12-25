const components = {
  install: function (Vue) {
    const context = require.context("@/components", true, /\.vue$/);
    context.keys().forEach(key => {
      const module = context(key);
      if (module.default.name) {
        Vue.component(module.default.name, module.default);
      }
    });
  }
};
export default components;
