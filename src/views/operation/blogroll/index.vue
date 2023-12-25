<template>
  <zc-table :table="table" />
</template>
<script>
  import {Table} from "@/utils/zhangchu-table";
  import zc from "@/utils/zhangchu";

  export default {
    data() {
      return {
        table: new Table({
          title: "友情链接",
          columns: {
            longitude: {
              title: "链接名",
              type: "html",
              formatter: (item, arr, index) => {
                if (typeof item.name === "undefined") {
                  item.name = "";
                }
                return `<div>${item.name}</div>`;
              }
            },
            latitude: {
              title: "链接地址",
              type: "html",
              formatter: (item, arr, index) => {
                if (typeof item.url === "undefined") {
                  item.url = "";
                }
                return `<div>${item.url}</div>`;
              }
            },
            createTime: {
              title: "创建时间",
              type: "html",
              formatter: (item, arr, index) => {
                if (typeof item.createTime === "undefined") {
                  item.createTime = "";
                }
                return `<div>${item.createTime}</div>`;
              }
            },
            lastUpdateTime: {
              title: "修改时间",
              type: "html",
              formatter: (item, arr, index) => {
                if (typeof item.lastUpdateTime === "undefined") {
                  item.lastUpdateTime = "";
                }
                return `<div>${item.lastUpdateTime}</div>`;
              }
            }
          },
          path: "/cms/blogroll/list",
          load: true, // 是否初始化时加载数据
          operation: {
            delete: (item, arr, index) => {
              this.$confirm("确定要删除吗", "删除", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
              }).then(() => {
                zc.post("/cms/blogroll/delete", {id: item.id}).then(() => {
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
            }
          },
          params: {p_faultType: "0"},
          // 不配置key则按columnName设置的字段搜索，若没设置columnName则按cloumns第一个显示字段搜索
          search: {
            input: "",
            placeholder: "请输入友链名",
            key: "s_name", title: "友链名"
          }
        })
      };
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
