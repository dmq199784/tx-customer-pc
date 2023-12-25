<template>
  <zc-form :form="form">
    <template #status>
      <el-form-item label="权限内容" prop="status">
        <PermissionContent></PermissionContent>
      </el-form-item>
    </template>
  </zc-form>
</template>

<script>
  import PermissionContent from "./components/PermissionContent";
  import { Form } from "@/utils/zhangchu-form";
  export default {

    components: {PermissionContent},
    data() {
      return {
        form: new Form({
          items: [
            {
              title: "岗位名称",
              name: "name",
              maxlength: 20,
              required: true
            },
            {
              title: "岗位编码",
              name: "username",
              maxlength: 20,
              required: true
            },
            "status"
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
