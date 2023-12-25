<template>
  <div class="app-container">
    <zc-table-tabs v-if="table.option.showTabs!==false" :table="table" />
    <zc-table-header v-if="table.option.showHeader!==false" :table="table" />
    <el-table
      v-loading="table.loading"
      :data="table.arr"
      stripe
      border
      @sort-change="onSortChange"
      @selection-change="onSelectionChange"
    >
      <el-table-column
        v-if="!table.option.batchDelete || table.option.batchDelete.show || table.option.checkbox === true"
        type="selection"
        align="center"
        width="50"
      />
      <template v-for="header in table.headers">
        <el-table-column
          :key="header.name"
          :prop="header.name"
          :label="header.title"
          height="250"
          :sortable="header.sortable"
          v-bind="table.props || {}"
        >
          <template slot-scope="scope">
            <div
              v-if="!table.columns[scope.column.property].type"
            >{{ scope.row[scope.column.property] }}</div>
            <div
              v-else-if="table.columns[scope.column.property].type=='html'"
              v-html="scope.row[scope.column.property]"
            ></div>
            <div v-else>
              <component
                :is="table.columns[scope.column.property].type"
                v-model="scope.row[scope.column.property]"
                v-bind="table.columnProps[scope.column.property][scope.$index].bindProps || {}"
                v-on="table.columnProps[scope.column.property][scope.$index].onProps || {}"
              />
            </div>
          </template>
        </el-table-column>
      </template>
      <el-table-column
        v-if="table.option.operation"
        prop="operation"
        align="center"
        :width="table.option.operation.width"
        :label="table.option.operation.title || '操作'"
        v-bind="table.option.operation.props || {}"
      >
        <template slot-scope="scope">
          <el-button
            v-if="table.option.operation.update !== false"
            type="text"
            size="small"
            @click="table.onUpdateClick(scope.$index)"
          >编辑</el-button>
          <el-button
            v-if="table.option.operation.delete !== false"
            type="text"
            size="small"
            @click="table.onDeleteClick(scope.$index)"
          >删除</el-button>
          <template v-if="table.buttons && table.buttons.length>0">
            <el-button
              v-for="button in table.buttons[scope.$index]"
              :key="button.title"
              type="text"
              size="small"
              v-bind="button.props"
              @click="button.onClick"
            >{{ button.title }}</el-button>
          </template>
        </template>
      </el-table-column>
    </el-table>
    <el-row v-if="table.showPagination" class="table-pagination" type="flex" justify="end">
      <el-pagination
        layout="total, sizes, prev, pager, next"
        :page-sizes="table.pagination.pageSizes"
        :page-size="table.pagination.pageSize"
        :total="table.pagination.total"
        :current-page="table.pagination.page"
        @current-change="table.pagination.onPageChange"
        @size-change="table.pagination.onSizeChange"
      />
    </el-row>
  </div>
</template>
<script>
export default {
  name: "ZcTable",
  props: {
    table: { type: Object, default: () => {} }
  },
  methods: {
    onSortChange(e) {
      this.table.onSortChange(e);
    },
    onSelectionChange(e) {
      this.table.onSelectionChange(e);
    }
  }
};
</script>
<style scoped>
.table-pagination {
  margin-top: 15px;
}
</style>
