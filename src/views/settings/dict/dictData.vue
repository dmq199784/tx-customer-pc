<template>
  <div>
    <el-form label-width="auto">
      <el-row :gutter="10">
        <el-col v-for="item in labelInfo" :key="item.name" :span="8">
          <el-form-item :label="`${item.label}：`">
            {{ info[item.name] }}
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-tabs v-model="DictType" style="padding: 20px">
      <el-tab-pane label="表格数据" name="dictType">
        <zc-table :table="dictType" />
      </el-tab-pane>
    </el-tabs>
    <el-dialog title="添加字典类型" :visible.sync="dialog.show" width="26%" @close="handleDialogClose(false)">
      <el-form ref="addOrUpdate" :model="dialog.form" :rules="dialog.rules" label-width="80px">
        <el-form-item label="表格标签" prop="dictLabel">
          <el-input v-model="dialog.form.dictLabel" maxlength="100" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="表格键值" prop="dictValue">
          <el-input v-model="dialog.form.dictValue" maxlength="100" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="表格类型" prop="dictType">
          <el-input v-model="dialog.form.dictType" maxlength="100" show-word-limit disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="优先级" prop="priority">
          <el-input-number v-model="dialog.form.priority" controls-position="right"></el-input-number>
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
import request from "@/utils/zhangchu-request";
import zc from "@/utils/zhangchu";
import message from "@/utils/zhangchu-message";

export default {
  data() {
    return {
      dialog: {
        form: {
          id: "",
          dictLabel: "",
          dictValue: "",
          dictType: this.$route.query.type,
          priority: "",
          enabled: "",
          remark: ""
        },
        show: false,
        rules: {
          name: [{required: true, message: "表格名称必须填写", trigger: "blur"}],
          type: [{required: true, message: "表格类型必须填写", trigger: "blur"}]
        }
      },
      DictType: "dictType",
      labelInfo: [
        {
          name: "name",
          label: "表格名称"
        },
        {
          name: "type",
          label: "表格类型"
        }
      ],
      // 基本信息
      info: {},
      // 字典数据
      dictType: new Table({
        batchDelete: {
          url: "/cms/dictData/batchDelete",
          show: true
        },
          add: {
            title: "添加表格数据",
            show: true, // show为false时不显示添加按钮
            click: (e, item, arr, index) => {
              this.dialog.form.priority = 0;
              this.dialog.form.enabled = "T";
              this.dialog.show = true;
            }
          },
          checkbox: false,
          columns: {
            dictLabel: "表格标签",
            dictValue: "表格键值",
            dictType: "表格类型",
            priority: "优先级",
            enabled: {
              title: "是否启用",
              type: "el-switch",
              ":active-value": "T",
              ":inactive-value": "F",
              "@change": (value, item, arr, index) => {
                zc.post("/cms/dictData/isOnSale", {id: item.id, enabled: value}).then(() => {
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
          params: {
            p_dictType: this.$route.query.type
          },
          path: "/cms/dictData/list",
          load: true,
          operation: {
            update: (item, arr, index) => {
              request.post("/cms/dictData/find", {id: item.id}).then(data => {
                this.dialog.form.id = data.data.id;
                this.dialog.form.dictLabel = data.data.dictLabel;
                this.dialog.form.dictValue = data.data.dictValue;
                this.dialog.form.priority = data.data.priority;
                this.dialog.form.dictType = data.data.dictType;
                this.dialog.form.enabled = data.data.enabled;
                this.dialog.form.remark = data.data.remark;
              });
              this.dialog.show = true;
            },
            title: "操作",
            // update: false,
            delete: false,
            props: { // 操作标签上的属性
              class: "operation"
            },
            buttons: []
          },
          showHeader: true,
          pagination: true
        }
      )
    };
  },
  created() {
    // 加载详情
    this.getDetails();
    this.setType();
  },
  methods: {
    handleDialogClose(falg) {
      this.dialog.show = false;
      if (falg) {
        this.dictType.list();
      }
      this.dialog.form.id = "";
      this.dialog.form.dictLabel = "";
      this.dialog.form.dictValue = "";
      this.dialog.form.dictType = this.$route.query.type;
      this.dialog.form.priority = "";
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
      let url = "/cms/dictData/add";
      if (this.dialog.form.id) {
        url = "/cms/dictData/update";
      }
      request.postL(url, this.dialog.form).then(data => {
        message.success("操作成功");
        this.handleDialogClose(true);
      });
      this.dictType.list();
    },
    getDetails() {
      request.post("cms/dictType/find", {id: this.$route.query.id}).then(data => {
        // 基本信息
        this.info = data.data;
      });
    },
    change(value) {
      // console.log(value);
      this.userId = value;
    }
  }
};
</script>

<style lang="scss" scoped>
.el-form {
  margin: 20px 20px 0 0;

  .el-select {
    width: 100%;
  }
}
</style>
