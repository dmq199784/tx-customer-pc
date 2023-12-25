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
              title: "链接名",
              name: "name",
              placeholder: "请输入链接名",
              maxlength: 20,
              required: true
            },
            {
              title: "链接地址",
              placeholder: "请输入链接地址",
              name: "url",
              maxlength: 200,
              required: true
            }
            // "id"
          ],
          // 请求表单数据的链接 可以为function 为false或没有该参数则不会请求数据
          dataUrl: () => {
            return this.$route.query.id ? "/cms/blogroll/find" : false;
          },
          // 请求数据的参数  %{}表示从当前url中取参数  如果没有该参数  默认从url中取id请求  可以是function返回值
          dataParams: {
            id: "%{id}"
          },
          data: {},
          afterFetch: data => {
            const param = (({id, name, url}) => ({
              id,
              name,
              url
            }))(data);
            return param;
          },
          // afterFetch: data => {
          //   // 获取表单数据后执行 如果有返回值 返回值会覆盖表单 data
          //   return data;
          // }
          // rules:{}  // 表单校验规则
          submitUrl: () => {
            return this.$route.query.id ? "/cms/blogroll/update" : "/cms/blogroll/add";
          },
          // 提交表单前执行  返回false终止提交
          beforeSubmit: () => {
            Object.assign(this.form.data);
            console.log(this.form.data);
            if (this.$route.query.id) {
              this.form.data.id = this.$route.query.id;
            }
          },
          afterSubmit: data => {
            console.log(data);
          }
        })
      };
    }
  };
</script>
