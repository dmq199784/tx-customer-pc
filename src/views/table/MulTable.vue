<template>
  <div>
    <zc-table :table="table" />
  </div>

</template>
<script>
import { Table } from "@/utils/zhangchu-table";

export default {
  data() {
    return {
      table: new Table()
    };
  },
  created() {
    this.table.setOptions({
      title: "用户",
      columns: {
        name: "姓名",
        username: "登录名",
        statusText: "状态"
      },
      path: "/uc/",
      load: false,
      tabs: {
        arr: [
          {
            title: "全部订单",
            value: "ACTIVE"
          },
          {
            title: "待付款",
            value: "EXPIRED"
          },
          {
            title: "已完成",
            value: "FROZEN"
          }
        ],
        key: "p_status"
        // active: "FROZEN",
        // click : (tab)=>{}
      },
      search: {
        // 通过setOptions 设置参数时需要加
        input: ""
      }
    });
  }
};
</script>
