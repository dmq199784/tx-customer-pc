<template>
  <div class="app-container">
    <el-form ref="form" :model="form.data" :label-width="labelWidth" :rules="form.option.rules">
      <template v-for="item in form.option.items">
        <zc-form-item
          v-if="!item.slot"
          v-show="item.show !== false"
          :key="item.name"
          v-model="form.data[item.name]"
          :type="item.type"
          :title="item.title"
          :name="item.name"
          :props="item"
          :required="item.required"
        />
        <template v-else>
          <slot v-if="item.show !== false" :name="item.name" />
        </template>
      </template>
      <slot />
      <el-form-item>
        <el-button v-if="form.option.submitButton !== false" type="primary" @click="click">保存</el-button>
        <el-button v-if="form.option.cancelButton !== false" @click="cancel">取消</el-button>
        <slot name="buttons" />
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  name: "ZcForm",
  props: {
    labelWidth: {type: String, default: "auto"},
    form: { type: Object, default: () => {} }
  },
  computed: {
    formData: function() {
      return this.form.data;
    }
  },
  methods: {
    click() {
      this.$refs["form"].validate(valid => {
        if (!valid) {
          return;
        }
        this.form.submit();
      });
    },
    cancel() {
      this.form.cancel ? this.form.cancel() : this.$router.go(-1);
    }
  }
};
</script>
<style scoped>
.el-form {
  width: 460px;
}
</style>
