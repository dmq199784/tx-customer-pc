<template>
  <div>
    <el-input v-model.number="modelValue" class="input-wrapper" style="width: 300px" :placeholder="placeholder">
      <template slot="append">{{ text }}
        <i v-if="tip" class="el-icon-question"></i>
      </template>
    </el-input>
    <small class="small-tip">{{ tip }}</small>
  </div>
</template>

<script>
  export default {
    name: "InputAppend",

    model: {
      event: "valueChange"
    },

    props: {
      value: {
        type: [String, Number],
        default: ""
      },
      placeholder: {
        type: String,
        default: "请输入"
      },
      text: {
        type: String,
        default: "单位"
      },
      tip: {
        type: String,
        default: ""
      }
    },

    computed: {
      modelValue: {
        get() {
          return this.value;
        },
        set(val) {
          this.$emit("valueChange", val);
        }
      }
    }
  };
</script>

<style lang="scss" scoped>
  .input-wrapper:hover + .small-tip {
    opacity: 1;
    transition: .3s;
  }

  .small-tip {
    position: absolute;
    width: 300px;
    line-height: 1.2;
    color: #abb2bb;
    display: inline-block;
    opacity: 0;
    padding-left: 10px;
  }
</style>
