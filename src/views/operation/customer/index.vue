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
          name: "name",
          label: "客户名称"
        },
        {
          name: "contact",
          label: "联系人"
        },
        {
          name: "customerCode",
          label: "客户编码"
        },
        {
          name: "contactPhone",
          label: "联系电话"
        }
      ],
      table: new Table({
        title: "客户",
        columns: {
          customerCode: "客户编码",
          name: "客户名称",
          contactPhone: "联系电话",
          contact: "联系人"
        },
        path: "/upms/user/listCustomer",
        params: {},
        columnName: "name", // 删除的提示字段,没有设置搜索key时也会使用此"p_{{columnName}}"搜索
        key: "id", // 删除和更新时传的字段 默认为id
        load: true, // 是否初始化时加载数据
        // 不配置key则按columnName设置的字段搜索，若没设置columnName则按cloumns第一个显示字段搜索
        search: {
          input: "",
          placeholder: "请输入客户名称",
          key: "s_name"
        },
        operation: {
          delete: false,
          buttons: [
            {
              title: "详情",
              click: (e, item, arr, index) => {
                this.getDetails(item);
              }
            }
          ]
        },
        batchDelete: false
        // add为false时不显示添加按钮  为string时点击按钮跳转  为function时点击按钮执行function 如果结果返回string则跳转
        // add: {
        //   // title: "添加用户x"
        //   // show: false   // show为false时不显示添加按钮
        // }
        // showHeader: false  // 是否显示顶部添加按钮和搜索框 默认true
        // showTabs: false  // 是否显示顶部标签栏 默认true
      })
    };
  },
  methods: {
    getDetails(item, type) {
      const {id} = item;
      console.log(id);
      zc.postL("/upms/user/findCustomer", {id: id}, res => {
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
