<template>
  <zc-form :form="form">
  </zc-form>
</template>

<script>
import { Form } from "@/utils/zhangchu-form";

export default {
  data() {
    return {
      form: new Form({
        items: [
          {
            title: "名称",
            name: "name",
            maxlength: 20,
            required: true
          },
          {
            title: "收件人姓名",
            name: "receiverName",
            maxlength: 20,
            required: true
          },
          {
            title: "收件人手机号",
            name: "receiverPhone",
            maxlength: 20,
            required: true
          },
          {
            title: "收件地址",
            name: "receiverAddress",
            maxlength: 80,
            required: true
          }
        ],
        // 请求表单数据的链接 可以为function 为false或没有该参数则不会请求数据
        dataUrl: () => {
          return this.$route.query.id ? "/cms/receiver/find" : false;
        },
        // 请求数据的参数  %{}表示从当前url中取参数  如果没有该参数  默认从url中取id请求  可以是function返回值
        dataParams: {
          id: "%{id}"
        },
        data: {
        },
        // afterFetch: data => {
        //   // 获取表单数据后执行 如果有返回值 返回值会覆盖表单 data
        //   return data;
        // }
        rules: {
          receiverPhone: [
            {
              pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
              message: "请输入正确的手机号码",
              trigger: "blur"
            }
          ]
        },
        submitUrl: () => {
          return this.$route.query.id ? "/cms/receiver/update" : "/cms/receiver/add";
        },
        // 提交表单前执行  返回false终止提交
        beforeSubmit: () => {},
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
