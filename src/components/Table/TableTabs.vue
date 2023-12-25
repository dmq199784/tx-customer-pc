<template>
  <el-tabs
    v-if="table.option.tabs && table.option.tabs.arr && table.option.tabs.arr.length>0"
    v-model="table.option.tabs.active"
    @tab-click="tabClick"
  >
    <el-tab-pane
      v-for="item in table.option.tabs.arr"
      :key="item.value"
      :label="item.title"
      :name="item.value"
    />
  </el-tabs>
</template>
<script>
export default {
  name: "ZcTableTabs",
  props: {
    table: { type: Object, default: () => {} }
  },
  methods: {
    tabClick: function(tab) {
      this.table.option.tabs.click(tab);
    }
  }
};
</script>
