<template>
  <zc-form :form="form">
  </zc-form>
</template>

<script>
import { Form } from "@/utils/zhangchu-form";

export default {
  data() {
    var checkUsername = (rule, value, callback) => {
      var reg = /^[0-9A-Za-z_@.]{3,20}$/;
      if (!reg.test(value)) {
        return callback(new Error("用户名为3到20位数字或字母"));
      }
      callback();
    };

    var checkPassword = (rule, value, callback) => {
      var reg = /^[0-9A-Za-z,\./!@#\$%\^&\*\(\)_+\[\]-]{6,32}$/;
      if (!reg.test(value)) {
        return callback(new Error("密码为6到32位数字或字母"));
      }
      callback();
    };
    return {
      form: new Form({
        items: [
          {
            title: "客户编码",
            name: "customerCode",
            maxlength: 20,
            required: true
          },
          {
            title: "客户名称",
            name: "name",
            maxlength: 20,
            required: true
          },
          {
            title: "联系人",
            name: "contact",
            maxlength: 20,
            required: true
          },
          {
            title: "联系电话",
            name: "contactPhone",
            maxlength: 20,
            required: true
          },
          {
            title: "账号",
            name: "username",
            maxlength: 20,
            required: true
          },
          {
            title: "密码",
            name: "password",
            maxlength: 20,
            required: true,
            "show-password": true
          }
        ],
        // 请求表单数据的链接 可以为function 为false或没有该参数则不会请求数据
        dataUrl: () => {
          return this.$route.query.id ? "/upms/user/findCustomer" : false;
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
          username: [
            { validator: checkUsername, trigger: "blur" }
          ],
          password: [
            { validator: checkPassword, trigger: "blur" }
          ],
          contactPhone: [
            {
              pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
              message: "请输入正确的手机号码",
              trigger: "blur"
            }
          ]
        },
        submitUrl: () => {
          return this.$route.query.id ? "/upms/user/updateCustomer" : "/upms/user/addCustomer";
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
