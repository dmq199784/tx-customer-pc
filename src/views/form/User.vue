<template>
  <zc-form :form="form">
    <template #status>
      <el-form-item label="帐号状态" prop="status">
        <el-select v-model="form.data.status" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
    </template>
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
            title: "姓名",
            name: "name",
            maxlength: 20,
            required: true
          },
          {
            title: "登录名",
            name: "username",
            maxlength: 20,
            required: true
          },
          {
            title: "登录密码",
            name: "password",
            maxlength: 20,
            required: true,
            "show-password": true
          },
          "status",
          {
            title: "到期时间",
            name: "expiryTime",
            type: "date-picker",
            ":type": "datetime", // 传入属性可以用:开头  传入事件用@开头
            "value-format": "yyyy-MM-dd HH:mm:ss",
            placeholder: "选择到期时间"
          },
          {
            title: "备注",
            name: "description",
            ":type": "textarea"
          },
          {
            title: "单图选择",
            name: "pic",
            type: "imageSelect"
          },
          {
            title: "多图选择",
            name: "pic1",
            type: "imageSelect",
            limit: 2
          }
        ],
        // 请求表单数据的链接 可以为function 为false或没有该参数则不会请求数据
        dataUrl: () => {
          return this.$route.query.id ? "/uc/find" : false;
        },
        // 请求数据的参数  %{}表示从当前url中取参数  如果没有该参数  默认从url中取id请求  可以是function返回值
        dataParams: {
          id: "%{id}"
        },
        data: {
          status: "ACTIVE"
        },
        // afterFetch: data => {
        //   // 获取表单数据后执行 如果有返回值 返回值会覆盖表单 data
        //   return data;
        // }
        // rules:{}  // 表单校验规则
        submitUrl: () => {
          return this.$route.query.id ? "/uc/update" : "/uc/add";
        },
        // 提交表单前执行  返回false终止提交
        beforeSubmit: () => {},
        afterSubmit: data => {
          console.log(data);
        }
      }),
      options: [
        {
          value: "ACTIVE",
          label: "正常"
        },
        {
          value: "EXPIRED",
          label: "已过期"
        },
        {
          value: "FROZEN",
          label: "已冻结"
        }
      ]
    };
  }
};
</script>
