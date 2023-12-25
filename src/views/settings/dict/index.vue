<template>
  <div>
    <zc-table :table="table" />
    <el-dialog title="添加表格类型" :visible.sync="dialog.show" width="26%" @close="handleDialogClose(false)">
      <el-form ref="addOrUpdate" :model="dialog.form" :rules="dialog.rules" label-width="80px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="dialog.form.name" maxlength="100" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="表格类型" prop="type">
          <el-input v-model="dialog.form.type" maxlength="100" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="是否启用" prop="enabled">
          <el-switch
            v-model="dialog.form.enabled"
            active-value="T"
            inactive-value="F"
          >
          </el-switch>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="dialog.form.remark" maxlength="100" show-word-limit></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addOrUpdate()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {Table} from "@/utils/zhangchu-table";
import zc from "@/utils/zhangchu";
import request from "@/utils/zhangchu-request";
import message from "@/utils/zhangchu-message";

export default {
  data() {
    return {
      dialog: {
        form: {
          id: "",
          name: "",
          type: "",
          enabled: "",
          remark: ""
        },
        show: false,
        rules: {
          name: [{required: true, message: "名称必须填写", trigger: "blur"}],
          type: [{required: true, message: "表格类型必须填写", trigger: "blur"}]
        }
      },
      table: new Table({
        title: "字典",
        columns: {
          name: "名称",
          type: "表格类型",
          enabled: {
            title: "是否启用",
            type: "el-switch",
            ":active-value": "T",
            ":inactive-value": "F",
            "@change": (value, item, arr, index) => {
              zc.post("/cms/dictType/isOnSale", {id: item.id, enabled: value}).then(() => {
                this.$message({
                  type: "success",
                  message: "操作成功"
                });
                this.table.list();
              });
            }
          },
          remark: "备注",
          createTime: "创建时间"
        },
        add: {
          show: true, // show为false时不显示添加按钮
          click: (e, item, arr, index) => {
            this.dialog.form.enabled = "T";
            this.dialog.show = true;
          }
        },
        path: "/cms/dictType/",
        // params: {
        //   p_userType: "ENGINEER"
        // },
        columnName: "name", // 删除的提示字段,没有设置搜索key时也会使用此"p_{{columnName}}"搜索
        key: "id", // 删除和更新时传的字段 默认为id
        load: true, // 是否初始化时加载数据
        // 不配置key则按columnName设置的字段搜索，若没设置columnName则按cloumns第一个显示字段搜索
        search: {
          input: "",
          // placeholder: "请输入",
          key: "s_name",
          select: [
            {key: "s_name", title: "名称"},
            {key: "s_type", title: "表格类型"}
          ]
        },
        operation: {
          update: (item, arr, index) => {
            request.post("/cms/dictType/find", {id: item.id}).then(data => {
              this.dialog.form.id = data.data.id;
              this.dialog.form.name = data.data.name;
              this.dialog.form.type = data.data.type;
              this.dialog.form.enabled = data.data.enabled;
              this.dialog.form.remark = data.data.remark;
            });
            this.dialog.show = true;
          },
          delete: false,
          buttons: [
            {
              title: "删除",
              click: (e, item, arr, index) => {
                // console.log("click:", e);
                this.$confirm("确定要删除吗", "删除", {
                  confirmButtonText: "确定",
                  cancelButtonText: "取消"
                }).then(() => {
                  zc.post("/cms/dictType/delete", {
                    id: item.id
                  }).then(() => {
                    this.$notify({
                      title: "删除成功",
                      type: "success"
                    });
                    this.table.list();
                  });
                }).catch(() => {
                  this.$message({
                    type: "info",
                    message: "已取消删除"
                  });
                });
              }
            },
            {
              title: "列表",
              click: (e, item, arr, index) => {
                this.$router.push({name: "DictData", query: {type: item.type, id: item.id}});
              }
            }
          ]
        }
        // add为false时不显示添加按钮  为string时点击按钮跳转  为function时点击按钮执行function 如果结果返回string则跳转
        // add: {
        //   // title: "添加用户x"
        //   // show: false   // show为false时不显示添加按钮
        // }
        // batchDelete为false时不显示批量删除  为function时点击按钮执行function
        // batchDelete: {
        //   url:""
        //   title: "", // 默认 批量删除
        //   show: true, // 默认true
        //   click: function() {}
        // }
        // showHeader: false  // 是否显示顶部添加按钮和搜索框 默认true
        // showTabs: false  // 是否显示顶部标签栏 默认true
      })
    };
  },
  methods: {
    handleDialogClose(falg) {
      this.dialog.show = false;
      if (falg) {
        this.table.list();
      }
      this.dialog.form.id = "";
      this.dialog.form.name = "";
      this.dialog.form.type = "";
      this.dialog.form.enabled = "T";
      this.dialog.form.remark = "";
      this.$refs.addOrUpdate.clearValidate();
    },

    addOrUpdate() {
      // 校验
      let isValid = true;
      this.$refs.addOrUpdate.validate((valid) => {
        isValid = valid;
      });
      if (!isValid) {
        return false;
      }
      let url = "/cms/dictType/add";
      if (this.dialog.form.id) {
        url = "/cms/dictType/update";
      }
      request.postL(url, this.dialog.form).then(data => {
        message.success("操作成功");
        this.handleDialogClose(true);
      });
    }
  }
};
</script>
