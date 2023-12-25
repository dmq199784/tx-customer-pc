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
      table: new Table(),

      loginColumns: {
        username: "账号",
        ip: "IP地址",
        description: "状态",
        createTime: "操作时间",
        deviceTypeDes: "客户端"
      },
      loginListUrl: "log/login_record/list",

      exceptionColumns: {
        username: "账号",
        ip: "IP地址",
        operationName: "操作名称",
        url: "请求地址",
        exceptionMsg: "异常信息",
        createTime: "操作时间",
        deviceTypeDes: "客户端"
      },
      exceptionListUrl: "log/exception_record/list",

      writeColumns: {
        username: "账号",
        ip: "IP地址",
        operationName: "操作名称",
        url: "请求地址",
        times: "请求时长（毫秒）",
        msg: "描述",
        createTime: "操作时间",
        deviceTypeDes: "客户端"
      },
      writeListUrl: "log/write_record/list",

      readColumns: {
        username: "账号",
        ip: "IP地址",
        operationName: "操作名称",
        url: "请求地址",
        times: "请求时长（毫秒）",
        msg: "描述",
        createTime: "操作时间",
        deviceTypeDes: "客户端"
      },
      readListUrl: "log/read_record/list"
    };
  },
  created() {
    this.table.setOptions({
      title: "日志",
      checkbox: false,
      columns: this.loginColumns,
      // path: "/uc/",
      listUrl: this.loginListUrl,
      load: true,
      tabs: {
        arr: [
          {
            title: "登录日志",
            value: "login"
          },
          {
            title: "异常日志",
            value: "exception"
          },
          {
            title: "更新日志",
            value: "write"
          },
          {
            title: "查询日志",
            value: "read"
          }
        ],
        // key: "p_status",
        active: "login",
        click: (tab) => {
          const options = this.table.option;
          if (tab.name == "login") {
            options.columns = this.loginColumns;
            options.listUrl = this.loginListUrl;
          } else if (tab.name == "exception") {
            options.columns = this.exceptionColumns;
            options.listUrl = this.exceptionListUrl;
          } else if (tab.name == "write") {
            options.columns = this.writeColumns;
            options.listUrl = this.writeListUrl;
          } else if (tab.name == "read") {
            options.columns = this.readColumns;
            options.listUrl = this.readListUrl;
          }
          this.table.setOptions(options);
        }
      },
      // 搜索条件待完善
      search: {
        input: "",
        placeholder: "请输入关键字",
        key: "s_username",
        select: [
          { key: "s_username", title: "账号" },
          { key: "s_ip", title: "IP地址" }
        ]
      },
      operation: false,
      add: false,
      batchDelete: false
    });
  }
};
</script>
