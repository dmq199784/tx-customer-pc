<template>
  <zc-form :form="form">
  </zc-form>
</template>

<script>
import {Form} from "@/utils/zhangchu-form";

export default {
  data() {
    return {
      content: "",
      form: new Form({
        items: [
          {
            title: "签名名称",
            name: "signName",
            maxlength: 20,
            required: true
          },
          {
            title: "模板代码",
            name: "templateCode",
            maxlength: 20,
            required: true
          },
          {
            title: "短信模板内容详情",
            name: "content",
            maxlength: 200,
            required: true
          }
        ],
        // 请求表单数据的链接 可以为function 为false或没有该参数则不会请求数据
        dataUrl: () => {
          return this.$route.query.id ? "/cms/template/find" : false;
        },
        // 请求数据的参数  %{}表示从当前url中取参数  如果没有该参数  默认从url中取id请求  可以是function返回值
        dataParams: {
          id: "%{id}"
        },
        data: {},
        // afterFetch: data => {
        //   // 获取表单数据后执行 如果有返回值 返回值会覆盖表单 data
        //   return data;
        // }
        rules: {
        },
        submitUrl: () => {
          return this.$route.query.id ? "/cms/template/update" : "/cms/template/add";
        },
        // 提交表单前执行  返回false终止提交
        beforeSubmit: () => {
        },
        afterSubmit: data => {
          // console.log(data);
        }
      }),
      options: []
    };
  },
  created() {
  }
};
</script>
