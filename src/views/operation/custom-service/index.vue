<template>
  <zc-form :form="form" />
</template>

<script>
  import { Form } from "@/utils/zhangchu-form";
  export default {
    data() {
      return {
        form: new Form({
          items: [
            {
              title: "客服",
              name: "serviceUrl",
              placeholder: "请输入链接",
              required: true
            }
          ],
          // 请求表单数据的链接 可以为function 为false或没有该参数则不会请求数据
          dataUrl: "/cms/customerService/getCustomerService",
          // 请求数据的参数  %{}表示从当前url中取参数  如果没有该参数  默认从url中取id请求  可以是function返回值
          dataParams: {
            id: "%{id}"
          },
          data: {
            // range: 1
          },
          // afterFetch: data => {
          //   // 获取表单数据后执行 如果有返回值 返回值会覆盖表单 data
          //   return data;
          // }
          // rules:{}  // 表单校验规则
          submitUrl: () => {
            return this.$route.query.id ? "/uc/update" : "/cms/customerService/addOrUpdate";
          },
          cancelButton: false,
          // 提交表单前执行  返回false终止提交
          beforeSubmit: () => {},
          afterSubmit: data => {
            // console.log(data);
            this.$message({
              type: "success",
              message: "保存成功！"
            });
            return false;
          }
        })
      };
    }
  };
</script>
