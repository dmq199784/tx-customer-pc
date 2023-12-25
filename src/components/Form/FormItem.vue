<template>
  <el-form-item :label="title" :prop="name">
    <component :is="itemType" v-model="modelValue" v-bind="bindProps" v-on="onProps" />
  </el-form-item>
</template>
<script>
import util from "@/utils/zhangchu-util";
export default {
  name: "ZcFormItem",
  model: {
    event: "itemChange"
  },
  props: {
    type: {
      type: String,
      default: ""
    },
    title: {
      type: String,
      default: ""
    },
    value: {
      type: null,
      default: ""
    },
    props: {
      type: Object,
      default: () => {}
    },
    name: {
      type: String,
      default: ""
    },
    required: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {};
  },
  computed: {
    modelValue: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("itemChange", val);
      }
    },
    itemType: function() {
      if (!this.type || this.type.length < 2) {
        return "";
      }
      const type = util.toCamelCase(this.type);
      let t = "Zc" + type;
      if (this.$root.$options.components[t]) {
        return t;
      }
      t = "El" + type;
      if (this.$root.$options.components[t]) {
        return t;
      }
      return this.type;
    },
    bindProps: function() {
      const props = util.deepClone(this.props);
      for (const key in this._props) {
        delete props[key];
      }
      for (const key in props) {
        if (key.startsWith(":")) {
          props[key.substring(1)] = props[key];
          delete props[key];
        } else if (key.startsWith("@")) {
          delete props[key];
        }
      }

      return props;
    },
    onProps: function() {
      const props = {};
      for (const key in this.props) {
        if (key.startsWith("@")) {
          props[key.substring(1)] = this.props[key];
        }
      }
      return props;
    }
  }
};
</script>
