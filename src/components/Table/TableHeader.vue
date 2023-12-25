<template>
  <el-row :style="paddingBottom" :gutter="20" type="flex" justify="space-between">
    <el-col>
      <el-button
        v-if="table.option.add && table.option.add.show"
        type="primary"
        plain
        @click="table.onAddClick()"
      >{{ table.option.add.title }}</el-button>
      <el-button
        v-if="table.option.batchDelete && table.option.batchDelete.show"
        plain
        @click="table.onBatchDeleteClick()"
      >{{ table.option.batchDelete.title }}</el-button>
      <template v-if="table.option.topButtons && table.option.topButtons.length>0">
        <el-button
          v-for="button in table.option.topButtons"
          v-show="button.show !== false"
          :key="button.title"
          v-bind="button.props"
          @click="button.click"
        >{{ button.title }}</el-button>
      </template>
    </el-col>
    <el-col v-if="table.option.search">
      <el-row type="flex" justify="end" :gutter="10">
        <el-col :span="8">
          <el-select
            v-if="table.option.search.select && table.option.search.select.length > 0"
            v-model="table.option.search.key"
            placeholder="请选择"
            clearable
          >
            <el-option
              v-for="item in table.option.search.select"
              :key="item.key"
              :label="item.title"
              :value="item.key"
            />
          </el-select>
        </el-col>
        <el-col :span="12">
          <el-input
            v-model.trim="table.option.search.input"
            :placeholder="table.option.search.placeholder || '请输入搜索关键词'"
            clearable
          />
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="table.option.search.onClick">搜索</el-button>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>
<script>
export default {
  name: "ZcTableHeader",
  props: {
    table: { type: Object, default: () => {} },
    bottom: {
      type: String,
      default: "10"
    }
  },
  data() {
    return {};
  },
  computed: {
    paddingBottom() {
      if (isNaN(parseInt(this.bottom))) {
        return "";
      }
      return "padding-bottom:" + this.bottom + "px;";
    }
  }
};
</script>
