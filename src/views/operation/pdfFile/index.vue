<template>
  <div>
    <zc-table :table="table"/>

    <el-dialog title="文件" :visible.sync="dialog.show" width="26%" @close="handleDialogClose(false)">
      <el-form ref="addOrUpdate" :model="dialog.form" :rules="dialog.rules" label-width="80px">
        <el-form-item label="上传文件">
          <el-upload
            class="upload-demo"
            :action="uploadUrl"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :before-remove="beforeRemove"
            :limit="100"
            multiple
            :on-exceed="handleExceed"
            :on-success="onSuccess"
            :headers="uploadHeader"
            :data="uploadData"
            accept=".doc,.pdf,.xlsx,.docx,.xls"
            :file-list="fileList"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只允许上传doc/pdf/xlsx/docx文件</div>
          </el-upload>
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
import auth from "@/utils/zhangchu-auth";

export default {
  data() {
    return {
      dialogType: "add",
      mimeType: "",
      fileType: "PDF",
      table: new Table({
        title: "pdf文件",
        columns: {
          fileName: "文件名称",
          url: "文件地址",
          userName: "上传人",
          createTime: "上传时间"
        },
        path: "/cms/filePdf/",
        params: {p_fileType: "PDF"},
        load: true,
        search: {
          // 通过setOptions 设置参数时需要加
          input: "",
          placeholder: "请输入标题",
          key: "s_title"
        },
        batchDelete: false,

        operation: {
          // 为false时不显示操作列
          title: "操作",
          update: (item, arr, index) => {
            request.post("/cms/filePdf/find", {id: item.id}).then(data => {
              this.dialogType = "update";
              this.dialog.form.id = data.data.id;
              this.dialog.form.fileName = data.data.fileName;
              this.dialog.form.url = data.data.url;
              this.form = data.data;
              try {
                this.form.link = JSON.parse(this.form.link);
              } catch (e) {
                this.form.link = null;
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
          title: "添加文件",
          show: true, // show为false时不显示添加按钮
          click: (e, item, arr, index) => {
            this.dialogType = "add";
            this.dialog.show = true;
          }
        }
      }),

      dialog: {
        form: {
          id: "",
          fileName: "",
          url: ""
        },
        show: false
        // rules: {
        //   title: [{required: true, message: "标题必须填写", trigger: "blur"}],
        //   theme: [{required: true, message: "主题必须填写", trigger: "blur"}]
        // }
      },

      fileList: []
    };
  },
  computed: {
    uploadUrl() {
      const baseUrl = process.env.VUE_APP_BASE_API;
      // const baseUrl = "http://dgb.zhang-chu.com/";
      return `${baseUrl}/cms/file_upload/upload`;
    },
    uploadHeader() {
      return auth.getHeaders();
    },
    uploadData() {
      return {
        // userType: "ADMIN"
      };
    }
  },
  methods: {
    selectedLink(e) {
      this.form.link = e;
    },

    handleCloseTag() {
      console.log("close");
      this.form.link = null;
    },
    imageChange(coverPic) {
      console.log(coverPic);
      this.dialog.form.coverPic = coverPic;
    },
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
      // if (response.status == "0") {
      //   console.log(file)
      //   console.log(fileList)
      //   console.log(response)
      //   const url = response.data.url;
      //   const mimeType = response.data.mimeType;
      //   if (url) {
      //     console.log(url);
      //     this.dialog.form.url = url;
      //     this.mimeType = mimeType;
      //     const obj = {name: url.substring(url.lastIndexOf("/") + 1), url: url};
      //     const files = [];
      //     files.push(obj);
      //     this.fileList = files;
      //   }
      // } else if (response.status == "-1") {
      //   this.fileList = [];
      //   message.err(response.msg);
      // } else {
      //   message.err("上传失败");
      // }

      if (fileList.every(item => item.status == "success")) {
        fileList.map(item => {
          /** 这时只需要push进带有response的数据就好 */

          if (item.response) {
            this.fileList.push({
              name: item.response.data.fileName,
              url: item.response.data.url
            });
          }
        });
      }
    },
    // onSuccess(response, file, fileList) {
    //   this.uploadFileCount++;
    //   console.log(fileList);
    //   console.log(fileList.length);
    //   console.log(this.uploadFileCount);
    //   if (this.uploadFileCount >= fileList.length) {
    //     this.listFiles();
    //     this.uploadFileCount = 0;
    //     message.success("上传成功");
    //     this.$refs.upload.clearFiles();
    //   }
    // },
    handleDialogClose(falg) {
      this.dialog.show = false;
      if (falg) {
        this.table.list();
      }

      this.fileList = [];
      this.dialog.form.id = "";
      this.dialog.form.url = "";
      this.$refs.addOrUpdate.clearValidate();
    },
    addOrUpdate() {
      this.$message({
        type: "success",
        message: "操作成功"
      });
      this.dialog.show = false;
      this.table.list();
    }
  }
};
</script>
