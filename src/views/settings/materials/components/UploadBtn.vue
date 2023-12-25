<template>
  <div>
    <el-button
      plain
      type="primary"
      size="small"
      icon="el-icon-upload"
      @click="handleClickUploadBtn"
    >
      上传文件
    </el-button>

    <!-- 上传文件弹窗-->
    <el-dialog title="请上传" class="dialog-style" :visible.sync="uploadVisible">
      <el-upload
        ref="uploader"
        :auto-upload="false"
        :name="type"
        :accept="acceptFileTypes"
        :action="actionUrl"
        :headers="headers"
        :data="uploadData"
        :list-type="listType"
        :on-remove="handleRemove"
        :before-upload="beforeUpload"
        :on-success="uploadSuccess"
        :on-error="uploadError"
      >
        <i v-if="fileType === 'IMAGE'" class="el-icon-plus"></i>
        <el-button v-if="fileType !== 'IMAGE'">添加视频</el-button>
      </el-upload>

      <span slot="footer" class="dialog-footer" @click="startUploads">
        <el-button size="small" type="primary">开始上传</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  // import {signature_check, set_upload_param} from "./uploadAliOss";
  import zc from "@/utils/zhangchu";

  export default {
    name: "UploadBtn",

    props: {
      fileType: {
        type: String,
        default: "IMAGE"
      },

      dirId: {
        type: String,
        default: ""
      }
    },

    data() {
      return {
        uploadVisible: false,

        count: 0,

        // uploadData: null,
        type: "file"
        // actionUrl: ""
      };
    },

    computed: {
      headers() {
        const auth = zc.cache.get("authorization", this.$route.query.userId);
        return {
          // "Access-Control-Allow-Origin": "*",
          user_id: this.$route.query.userId,
          authorization: auth.authorization
        };
      },
      uploadData() {
        // const auth = zc.cache.get("authorization", this.$route.query.userId);
        return {
          // "Access-Control-Allow-Origin": "*",
          userId: this.$route.query.userId,
          userType: "ADMIN",
          dirId: this.dirId
        };
      },
      actionUrl() {
        // return "http://localhost:3000/upload"; // 我的地址
        const baseUrl = process.env.VUE_APP_BASE_API;
        return `${baseUrl}/oss/${this.type}_upload/upload`; // 后端的地址
      },
      acceptFileTypes() {
        return this.fileType === "IMAGE" ? ".png,.jpg,.jpeg,.gif" : ".mp4";
      },

      listType() {
        return this.fileType === "IMAGE" ? "picture-card" : "text";
      }

      // type() {
      //   return this.fileType === "IMAGE" ? "image" : "file";
      // }
    },

    watch: {
      fileType: {
        handler() {
          this.$refs.uploader && this.$refs.uploader.clearFiles();
        }
      }
    },

    methods: {
      handleClickUploadBtn() {
        this.uploadVisible = true;
      },

      uploadSuccess(response, file, fileList) {
        const fileLength = fileList.length;
        this.count++;
        // console.log(this.count >= fileLength);
        if (this.count >= fileLength) {
          this.$emit("uploadSuccess");
          this.uploadVisible = false;
          this.$refs.uploader.clearFiles();
        }
      },

      uploadError(err, file, fileList) {
        this.$message.error("出错了 ！");
        console.log("上传失败----", {err, file, fileList});
      },

      beforeUpload(file) {
        return new Promise(async (resolve, reject) => {
          const isInLimit = this.checkSize(file);
          if (!isInLimit) {
            reject();
          } else {
            // const res = await signature_check(this.dirId, this.fileType);
            // const newPostData = set_upload_param(res.data, file.name);
            // this.uploadData = {
            //   ...newPostData,
            //   name: file.name
            // };
            // this.actionUrl = res.data.host;
            resolve();
          }
        });
      },

      checkSize(file) {
        const sizeLimit = 1024; // 1024M
        const isLt2M = file.size / 1024 / 1024 < sizeLimit;
        if (!isLt2M) {
          this.$message.error(`上传文件大小不能超过 ${sizeLimit}MB ！`);
        }
        return isLt2M;
      },

      startUploads() {
        this.$refs.uploader.submit();
      },

      handleRemove(file, fileList) {
        // console.log("移除------", file, fileList);
      }
    }
  };
</script>

<style lang="scss" scoped>
  .dialog-style {
    max-height: 100vh;
  }
</style>
