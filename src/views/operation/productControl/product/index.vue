<template>
  <div>
    <zc-table :table="table"/>
    <el-dialog title="详情" :visible.sync="dialogAddress" width="50%">
      <VerticalTable :field="addressInfo" :info-data="addressInfoData"></VerticalTable>
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
      dialogAddress: false,
      addressInfoData: {},
      addressInfo: [
        {
          name: "name",
          label: "地址名称"
        },
        {
          name: "receiverName",
          label: "收件人姓名"
        },
        {
          name: "receiverPhone",
          label: "收件人手机号"
        },
        {
          name: "receiverAddress",
          label: "收件地址"
        }
      ],
      table: new Table({
        // 自定义按钮
        // topButtons: [
        //   {
        //     title: "同步设备",
        //     click: () => {
        //       zc.post("/project/equipment/synchronizationPC", {}).then(res => {
        //         console.log(res);
        //         this.$message({
        //           type: "success",
        //           message: "同步成功！"
        //         });
        //         this.table.list();
        //       });
        //     }
        //   }
        // ],
        title: "产品管理",
        columns: {
          productCode: "产品编码",
          productName: "产品名称",
          // addressId: "收货地址",
          dictType: "动态表格类型"
        },
        path: "/cms/product/list",
        load: true, // 是否初始化时加载数据
        operation: {
          delete: (item, arr, index) => {
            this.$confirm("确定要删除吗", "删除", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            }).then(() => {
              zc.post("/cms/product/delete", {id: item.id}).then(() => {
                this.$notify({
                  title: "删除成功",
                  type: "success"
                });
                this.table.list();
              });
            }).catch(() => {
              this.$message({
                type: "info",
                message: "已取消删除"
              });
            });
          },
          buttons: [
            {
              title: "详情",
              click: (e, item) => {
                this.getDetails(item);
              }
            }
          ]
        },
        // add为false时不显示添加按钮  为string时点击按钮跳转  为function时点击按钮执行function 如果结果返回string则跳转
        add: {
          title: "添加产品"
          // show: false   // show为false时不显示添加按钮
        },
        // batchDelete为false时不显示批量删除  为function时点击按钮执行function
        // batchDelete: {
        //   url:""
        //   title: "", // 默认 批量删除
        //   show: true, // 默认true
        //   click: function() {}
        // }
        // showHeader: false  // 是否显示顶部添加按钮和搜索框 默认true
        // showTabs: false  // 是否显示顶部标签栏 默认true
        // params: {p_faultType: "0"},
        // 不配置key则按columnName设置的字段搜索，若没设置columnName则按cloumns第一个显示字段搜索
        search: {
          input: "",
          placeholder: "请输入产品编码",
          key: "s_productCode",
          select: [
            {key: "s_productCode", title: "产品编码"},
            {key: "s_productName", title: "产品名称"}
          ]
        }
      })
    };
  },
  methods: {
    getDetails(item) {
      const {addressId} = item;
      zc.postL("/cms/receiver/find", {id: addressId}, res => {
        const data = res.data;
        this.addressInfoData = data;
        this.dialogAddress = true;
      });
    }
  }
};
</script>

<style lang="scss" scoped>
/deep/ .lock-btn {
  color: #ff0000;
}

/deep/ .unlock-btn {
  color: #e7a75e;
}
</style>
