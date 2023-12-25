<template>
  <zc-form :form="form">
    <template #roleCode>
      <el-form-item label="权限" prop="roleCode">
        <el-select v-model="form.data.roleCode" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.roleCode"
            :label="item.name"
            :value="item.roleCode"
          ></el-option>
        </el-select>
      </el-form-item>
    </template>
  </zc-form>
</template>

<script>
  import { Form } from "@/utils/zhangchu-form";
  import request from "@/utils/zhangchu-request";

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
              title: "账号",
              name: "username",
              maxlength: 20,
              required: true
            },
            {
              title: "姓名",
              name: "name",
              maxlength: 20,
              required: true
            },
            // {
            //   title: "手机号",
            //   name: "phone",
            //   maxlength: 20,
            //   required: true
            // },
            {
              title: "密码",
              name: "password",
              maxlength: 20,
              required: true,
              "show-password": true
            },
            "roleCode"
          ],
          // 请求表单数据的链接 可以为function 为false或没有该参数则不会请求数据
          dataUrl: () => {
            return this.initData(this.$route.query.id);
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
            roleCode: [
              { required: true, message: "请选择权限", trigger: "blur" }
            ],
            username: [
              { validator: checkUsername, trigger: "blur" }
            ],
            password: [
              { validator: checkPassword, trigger: "blur" }
            ]
          },
          submitUrl: () => {
            return this.$route.query.id ? "/upms/user/updateAdmin" : "/upms/user/addAdmin";
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
    },
    methods: {
      initData(id) {
        request.post("/upms/role/listByType", {type: "ROLE"}).then(data => {
          this.options = data.data;

          if (id) {
            request.post("/upms/user/find", {id: id}).then(res => {
              this.form.data = res.data;
            });
          }
        });
      }
    }
  };
</script>
