<template>
  <zc-form :form="form">
    <template #menu>
      <el-form-item label="权限">
        <el-tree
          ref="menu"
          :data="options"
          show-checkbox
          node-key="id"
          :default-checked-keys="form.data.menuIdList || []"
          :props="defaultProps"
        >
        </el-tree>
      </el-form-item>
    </template>
  </zc-form>
</template>

<script>
  import { Form } from "@/utils/zhangchu-form";
  import request from "@/utils/zhangchu-request";
  import message from "@/utils/zhangchu-message";

  export default {
    data() {
      return {
        // 树
        options: [],
        defaultProps: {
          children: "children",
          label: "zhName"
        },

        form: new Form({
          items: [
            {
              title: "名称",
              name: "name",
              maxlength: 20,
              required: true
            },
            {
              title: "编码",
              name: "roleCode",
              maxlength: 20,
              required: true
            },
            "menu"
          ],
          // 请求表单数据的链接 可以为function 为false或没有该参数则不会请求数据
          dataUrl: () => {
            return this.$route.query.id ? "/upms/role/find" : false;
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
          rules: {
            roleCode: [
              { pattern: "^[a-zA-Z_]+$", message: "角色编码只能输入英文和下划线" }
            ]
          },
          submitUrl: () => {
            return this.$route.query.id ? "/upms/role/updateRole" : "/upms/role/addRole";
          },
          // 提交表单前执行  返回false终止提交
          beforeSubmit: () => {
            const menuIdList = this.$refs.menu.getCheckedKeys() || [];
            if (menuIdList.length <= 0) {
              message.err("至少选择一个菜单");
            }

            const postData = {};
            postData.id = this.$route.query.id || "";
            postData.type = this.$route.query.type;
            postData.name = this.form.data.name;
            postData.roleCode = this.form.data.roleCode;
            postData.menuIdList = menuIdList.join(",");
            this.form.data = postData;
          },
          afterSubmit: data => {
            // console.log(data);
          }
        })
      };
    },
    created() {
      // 所有菜单
      this.allMenu();
    },
    methods: {
      allMenu() {
        const type = this.$route.query.type;
        let deviceType = "";
        if (type == "ROLE") {
          deviceType = "SUPER_ADMIN_PC";
        } else if (type == "STATION") {
          deviceType = "USER_MOBILE";
        }
        request.post("upms/menu/listByType", {toTree: "T", type: deviceType}).then(data => {
          this.options = data.data;
        });
      }
    }
  };
</script>
