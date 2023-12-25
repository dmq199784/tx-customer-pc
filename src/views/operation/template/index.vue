<template>
  <div>
    <zc-table :table="table"/>
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
          name: "signName",
          label: "签名名称"
        },
        {
          name: "templateCode",
          label: "模板代码"
        },
        {
          name: "content",
          label: "短信模板内容详情"
        }
      ],
      table: new Table({
        title: "短信模板",
        columns: {
          signName: "签名名称",
          templateCode: "模板代码",
          content: "短信模板内容详情"
        },
        load: true, // 是否初始化时加载数据
        operation: {
          delete: false,
          update: false,
          buttons: [
            {
              title: "编辑",
              click: (e, item, arr, index) => {
                this.$router.push({name: "TemplateDetails", query: {id: item.id}});
              },
              show: function (item, arr, index) {
                return true;
              },
              props: {
                class: "buttonClass"
              }
            },
            {
              title: "详情",
              click: (e, item, arr, index) => {
                this.getDetails(item);
              }
            }
          ]
        },
        columnName: "title", // 删除的提示字段,没有设置搜索key时也会使用此"p_{{columnName}}"搜索
        key: "id", // 删除和更新时传的字段 默认为id
        path: "/cms/template/list",
        batchDelete: false,
        // load: true,
        search: {
          input: "",
          // placeholder: "请输入客户名称",
          key: "s_signName",
          select: [
            {key: "s_signName", title: "签名名称"},
            {key: "s_templateCode", title: "模板代码"}
          ]
        }
      })
    };
  },
  methods: {
    getDetails(item, type) {
      const {id} = item;
      zc.postL("/cms/template/find", {id: id}, res => {
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
