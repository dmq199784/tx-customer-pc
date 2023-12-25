<template>
  <div>
    <zc-table :table="table" />

    <el-dialog title="版本更新" :visible.sync="dialog.show" width="26%" @close="handleDialogClose(false)">
      <el-form ref="addOrUpdate" :model="dialog.form" :rules="dialog.rules" label-width="80px">
        <el-form-item label="版本号" prop="version">
          <el-input v-model="dialog.form.version" maxlength="15" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="软件包">
          <el-upload
            class="upload-demo"
            :action="uploadUrl"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :before-remove="beforeRemove"
            :limit="1"
            :on-exceed="handleExceed"
            :on-success="onSuccess"
            :headers="uploadHeader"
            :data="uploadData"
            accept=".apk"
            :file-list="fileList"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只允许上传apk文件</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="最新版本" prop="isNew">
          <el-switch
            v-model="dialog.form.isNew"
            active-value="T"
            inactive-value="F"
          >
          </el-switch>
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
  import message from "@/utils/zhangchu-message";
  import auth from "@/utils/zhangchu-auth";

  export default {
    data() {
      return {
        table: new Table({
          title: "版本",
          columns: {
            version: "版本号",
            filePath: "安卓软件包",
            createTime: "上传时间",
            isNew: {
              title: "最新版本",
              type: "html",
              formatter: (item, arr, index) => {
                if (item.isNew == "T") {
                  return "<span style='color:red'>是</span>";
                } else {
                  return "否";
                }
              }
            }
          },
          path: "/cms/version_record/",
          load: true,
          search: {
            // 通过setOptions 设置参数时需要加
            input: "",
            placeholder: "请输入版本号",
            key: "s_version"
          },
          batchDelete: false,

          operation: {
            // 为false时不显示操作列
            title: "操作",
            update: (item, arr, index) => {
              request.post("/cms/version_record/find", {id: item.id}).then(data => {
                this.dialog.form.id = data.data.id;
                this.dialog.form.version = data.data.version;
                this.dialog.form.isNew = data.data.isNew;
                const filePath = data.data.filePath;
                if (filePath) {
                  this.dialog.form.filePath = filePath;

                  const obj = {name: filePath.substring(filePath.lastIndexOf("/") + 1), url: filePath};
                  const files = [];
                  files.push(obj);
                  this.fileList = files;
                }
              });
              this.dialog.show = true;
            },
            delete: true, // 不显示删除按钮 可以是function
            props: { // 操作标签上的属性
              class: "operation"
            }
            // width: "120"
          },
          add: {
            title: "添加新版本",
            show: true, // show为false时不显示添加按钮
            click: (e, item, arr, index) => {
              this.dialog.form.isNew = "T";
              this.dialog.show = true;
            }
          }
        }),

        dialog: {
          form: {
            id: "",
            version: "",
            filePath: "",
            isNew: ""
          },
          show: false,
          rules: {
            version: [{required: true, message: "版本号必须填写", trigger: "blur" }]
          }
        },

        fileList: []
      };
    },
    computed: {
      uploadUrl() {
        const baseUrl = process.env.VUE_APP_BASE_API;
        // const baseUrl = "http://dgb.zhang-chu.com/";
        return `${baseUrl}/oss/file_upload/upload`;
      },
      uploadHeader() {
        return auth.getHeaders();
      },
      uploadData() {
        return {
          userType: "ADMIN"
        };
      }
    },
    methods: {
      // 上传组件
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePreview(file) {
        console.log(file);
      },
      handleExceed(files, fileList) {
        this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
      },
      beforeRemove(file, fileList) {
        this.fileList = [];
        this.dialog.form.filePath = "";
        return;
      },
      onSuccess(response, file, fileList) {
        if (response.status == "0") {
          const filePath = response.data.url;
          if (filePath) {
            this.dialog.form.filePath = filePath;

            const obj = {name: filePath.substring(filePath.lastIndexOf("/") + 1), url: filePath};
            const files = [];
            files.push(obj);
            this.fileList = files;
          }
        } else if (response.status == "-1") {
          this.fileList = [];
          message.err(response.msg);
        } else {
          message.err("上传失败");
        }
      },

      handleDialogClose(falg) {
        this.dialog.show = false;
        if (falg) {
          this.table.list();
        }

        this.fileList = [];
        this.dialog.form.id = "";
        this.dialog.form.version = "";
        this.dialog.form.isNew = "T";
        this.dialog.form.filePath = "";
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
        let url = "/cms/version_record/add";
        if (this.dialog.form.id) {
          url = "/cms/version_record/update";
        }
        request.postL(url, this.dialog.form).then(data => {
          message.success("操作成功");
          this.handleDialogClose(true);
        });
      }
    }
  };
</script>
