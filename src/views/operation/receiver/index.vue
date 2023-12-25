<template>
  <div>
  <zc-table :table="table" />
  <el-dialog title="详情" :visible.sync="dialogVisible" width="50%">
    <VerticalTable :field="bindInfoField" :info-data="bindInfoData"></VerticalTable>
    <span slot="footer" class="dialog-footer"></span>
  </el-dialog>
  </div>
</template>

<script>

import {Table} from "@/utils/zhangchu-table";
import zc from "@/utils/zhangchu";
import VerticalTable from "@/components/VerticalTable";

export default {
  components: {VerticalTable},
  data() {
    return {
      bindInfoData: {},
      dialogVisible: false,
      bindInfoField: [
        {
          name: "name",
          label: "名称"
        },
        {
          name: "receiverName",
          label: "收件人姓名"
        },
        {
          name: "receiverPhone",
          label: "收件人电话"
        },
        {
          name: "receiverAddress",
          label: "收件地址"
        }
      ],
      table: new Table({
        title: "收货地址",
        columns: {
          name: "名称",
          receiverName: "收件人姓名",
          receiverPhone: "收件人电话",
          receiverAddress: "收件地址"
        },
        load: true, // 是否初始化时加载数据
        operation: {
          delete: false,
          buttons: [
            {
              title: "详情",
              click: (e, item, arr, index) => {
                this.getDetails(item);
              }
            }]
        },
        columnName: "title", // 删除的提示字段,没有设置搜索key时也会使用此"p_{{columnName}}"搜索
        key: "id", // 删除和更新时传的字段 默认为id
        path: "/cms/receiver/list",
        batchDelete: false,
        // load: true,
        search: {
          input: "",
         // placeholder: "请输入客户名称",
          key: "s_name",
          select: [
            {key: "s_name", title: "名称"},
            {key: "s_receiverPhone", title: "收件人电话"}
          ]
        }
      })
    };
  },
  methods: {
    getDetails(item, type) {
      const {id} = item;
      console.log(id);
      zc.postL("/cms/receiver/find", {id: id}, res => {
        const data = res.data;
        console.log(data);
        this.bindInfoData = data;
        console.log(this.bindInfoData);
        this.dialogVisible = true;
      });
    }
  }
};
</script>
