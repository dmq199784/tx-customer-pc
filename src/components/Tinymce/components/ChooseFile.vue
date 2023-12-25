<template>
  <div class="upload-container">
    <el-button
      type="primary"
      plain
      size="mini"
      @click="handleClickUpload"
    >
      {{ name }}
    </el-button>
  </div>
</template>

<script>
  export default {
    name: "EditorSlideUpload",
    props: {
      color: {
        type: String,
        default: "#1890ff"
      },
      fileType: {
        type: String,
        default: "IMAGE"
      }
    },
    data() {
      return {
        dialogVisible: false,
        listObj: {},
        fileList: []
      };
    },

    computed: {
      name() {
        return this.fileType === "IMAGE" ? "图片" : "视频";
      }
    },
    methods: {
      handleClickUpload() {
        if (this.fileType === "IMAGE") {
          this.$store.dispatch("app/setResourceDialogOption", {
            type: "IMAGE",
            title: "选择图片",
            limit: 1,
            visible: true,
            selectedNum: 0,
            choose: (val, images) => {
              // console.log({val, images});
              this.$emit("successCBK", images);
            }
          });
        } else if (this.fileType === "VIDEO") {
          this.$store.dispatch("app/setResourceDialogOption", {
            type: "VIDEO",
            title: "选择视频",
            limit: 1,
            visible: true,
            selectedNum: 0,
            choose: (val, fileList) => {
              this.$emit("videoSuccessCBK", fileList);
            }
          });
        }
      }
    }
  };
</script>

<style lang="scss" scoped>
  .editor-slide-upload {
    margin-bottom: 20px;

    /deep/ .el-upload--picture-card {
      width: 100%;
    }
  }
</style>
