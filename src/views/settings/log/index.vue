<template>
  <div>
    <el-form label-width="100px">
      <el-row :gutter="10">
        <el-col :span="8">
          <el-form-item label="账号状态">
            <el-select v-model="accountStatus" placeholder="请选择">
              <el-option
                v-for="item in accountStatusOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">

          <el-form-item label="时间">
            <el-date-picker
              v-model="value2"
              style="width: 100%"
              type="daterange"
              align="right"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            >
            </el-date-picker>
          </el-form-item>

        </el-col>
        <el-col :span="8">
          <el-button type="primary" size="medium">查询</el-button>
        </el-col>
      </el-row>
    </el-form>

    <zc-table :table="table" />
  </div>
</template>
<script>
  import {Table} from "@/utils/zhangchu-table";

  export default {
    data() {
      return {
        value2: "",
        table: new Table(),
        accountStatusOptions: [],
        accountStatus: ""
      };
    },
    created() {
      this.table.setOptions({
        showHeader: false,
        batchDelete: {
          show: false
        },
        checkbox: false,
        title: "订单",
        columns: {
          name: "操作账号",
          orderContent: "操作模块",
          time: "操作页面",
          money: "操作时间",
          info: "操作人员 IP",
          num: "操作内容"
        },
        path: "/uc/",
        load: false,
        search: {
          // 通过setOptions 设置参数时需要加
          input: ""
        }
      });
    }
  };
</script>

<style lang="scss" scoped>
  .el-form {
    margin: 20px 20px 0 0;

    .el-select {
      width: 100%;
    }
  }
</style>
