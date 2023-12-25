<template>
  <zc-table :table="table" />
</template>
<script>
  import { Table } from "@/utils/zhangchu-table";

  export default {
    data() {
      return {
        table: new Table({
          title: "账户",
          columns: {
            name: "姓名",
            username: "账号",
            roleName: "权限",
            status: {
              title: "状态",
              type: "html",
              formatter: (item, arr, index) => {
                switch (item.status) {
                  case "ACTIVE":
                    return "正常";
                  case "EXPIRED":
                    return "已过期";
                  case "FROZEN":
                    return "<span style='color:blue'>已冻结</span>";
                }
              }
            }
          },
          path: "/upms/user/",
          params: {
            p_userType: "ADMIN"
          },
          columnName: "name", // 删除的提示字段,没有设置搜索key时也会使用此"p_{{columnName}}"搜索
          key: "id", // 删除和更新时传的字段 默认为id
          load: true, // 是否初始化时加载数据
          // listUrl: function or string
          // pagination: {
          //   // 分页配置
          //   pageSizes: [10, 20, 1],
          //   // 表格上的属性
          //   props: {
          //     class: "tableClass"
          //   }
          // }
          // operation: {
          // 为false时不显示操作列
          // title: "操作title"
          // update:false  // 不显示更新按钮 可以是function
          // update: function(item, arr, index) {
          //   console.log(item, arr, index);
          // }
          // delete:false //不显示删除按钮 可以是function
          // props: {   //操作标签上的属性
          //   class: "operation"
          // }
          // width: "120"
          // buttons: [
          //   {
          //     title: "按钮",
          //     click: function(e, item, arr, index) {
          //       console.log("click:", e, item, arr, index);
          //     },
          //     show: function(item, arr, index) {
          //       console.log(item, arr, index, index % 2 == 0);
          //       return index % 2 == 0;
          //     },
          //     props: {
          //       class: "buttonClass"
          //     }
          //   }
          // ]
          // }
          // 不配置key则按columnName设置的字段搜索，若没设置columnName则按cloumns第一个显示字段搜索
          search: {
            input: "",
            // placeholder: "请输入",
            key: "s_name",
            select: [
              { key: "s_name", title: "姓名" },
              { key: "s_username", title: "账号" }
            ]
          }
          // add为false时不显示添加按钮  为string时点击按钮跳转  为function时点击按钮执行function 如果结果返回string则跳转
          // add: {
          //   // title: "添加用户x"
          //   // show: false   // show为false时不显示添加按钮
          // }
          // batchDelete为false时不显示批量删除  为function时点击按钮执行function
          // batchDelete: {
          //   url:""
          //   title: "", // 默认 批量删除
          //   show: true, // 默认true
          //   click: function() {}
          // }
          // showHeader: false  // 是否显示顶部添加按钮和搜索框 默认true
          // showTabs: false  // 是否显示顶部标签栏 默认true
        })
      };
    }
  };
</script>
