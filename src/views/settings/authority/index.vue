<template>
  <div>
    <zc-table :table="table" />
  </div>

</template>
<script>
import { Table } from "@/utils/zhangchu-table";
import routher from "@/utils/zhangchu-router";

export default {
  data() {
    return {
      table: new Table()
    };
  },
  created() {
    this.table.setOptions({
      title: "角色",
      columns: {
        name: "姓名",
        num: "账号数量"
      },
      path: "/upms/role/",
      load: true,
      tabs: {
        arr: [
          {
            title: "平台权限",
            value: "ROLE"
          }
        ],
        key: "p_type",
        active: "ROLE",
        click: (tab) => {
          const options = this.table.option;
          options.tabs.params.p_type = tab.name;
          if (tab.name == "ROLE") {
            options.add.title = "添加角色";
          }
          // console.log(options);
          this.table.setOptions(options);
        }
      },
      search: {
        // 通过setOptions 设置参数时需要加
        input: "",
        placeholder: "请输入名称",
        key: "s_name"
      },
      batchDelete: false,
      checkbox: false,
      add: {
        title: "添加角色",
        show: true, // show为false时不显示添加按钮
        click: (e, item, arr, index) => {
          routher.push({path: "add", query: {type: this.table.option.tabs.active}});
        }
      },
      operation: {
        // 为false时不显示操作列
        title: "操作",
        update: (item, arr, index) => {
          routher.push({path: "update", query: {type: this.table.option.tabs.active, id: item.id}});
        }
      }
    });
  }
};
</script>
