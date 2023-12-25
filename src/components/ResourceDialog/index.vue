<template>
  <div>
    <el-dialog
      class="resource-dialog"
      :title="resourceDialog.title"
      :visible.sync="resourceDialog.visible"
      width="850px"
    >
      <el-container>
        <el-aside class="resource-aside" width="150px">
          <el-button-group class="opt-button-group">
            <el-button icon="el-icon-plus" type="text" title="添加分组" @click="addDir"></el-button>
            <el-button icon="el-icon-edit" type="text" title="编辑分组" @click="editDir"></el-button>
            <el-button icon="el-icon-delete" type="text" title="删除分组" @click="deleteDir"></el-button>
          </el-button-group>
          <el-radio-group v-model="currentDirId" size="small" @change="dirChange">
            <el-radio v-for="item in dirArr" :key="item.id" :label="item.id">
              {{ item.name.length > 8? item.name.substring(0, 9 - item.fileCount.toString().length) +"...": item.name }}
              ({{ item.fileCount }})
            </el-radio>
          </el-radio-group>
        </el-aside>
        <el-container>
          <el-main class="resource-main">
            <div>
              <span>
                <el-checkbox v-model="isSelectedAll" @change="selectAll">全选</el-checkbox>
              </span>
              <span class="v-space"></span>
              <el-button size="small" :disabled="!selectedArr.length" @click="batchDelete">批量删除</el-button>
              <el-button size="small" :disabled="!selectedArr.length" @click="batchMoveDir">修改分组</el-button>
            </div>
            <ul class="resource-container flex-wrap">
              <li
                v-for="item in resourceArr"
                :key="item.id"
                :class="
                  selectedIds.indexOf(item.id) > -1
                    ? 'file-box chosen'
                    : 'file-box'
                "
                @click="fileClick(item)"
              >
                <el-image v-if="newType === 'IMAGE'" :src="item.fileUrl" class="file-img" />
                <video v-if="newType === 'VIDEO'" width="90%" height="100%" :src="item.fileUrl" class="file-img"></video>
                <span class="file-name">{{ item.fileName }}</span>
                <div class="file-options flex">
                  <el-button
                    type="text"
                    icon="el-icon-search"
                    title="预览"
                    @click.stop="previewImg(item)"
                  ></el-button>
                  <el-button
                    type="text"
                    icon="el-icon-document-copy"
                    title="移动分组"
                    @click.stop="showMoveDirDialog(item)"
                  ></el-button>
                  <el-button
                    type="text"
                    icon="el-icon-edit"
                    title="编辑"
                    @click.stop="editFile(item)"
                  ></el-button>
                  <el-button
                    type="text"
                    icon="el-icon-delete"
                    title="删除"
                    @click.stop="deleteFile(item)"
                  ></el-button>
                </div>
              </li>
              <li v-show="resourceArr.length" class="fill-box"></li>
              <!--              <li v-show="resourceArr.length" class="fill-box"></li>-->
              <!--              <li v-show="resourceArr.length" class="fill-box"></li>-->
              <!--              <li v-show="resourceArr.length" class="fill-box"></li>-->
              <!--              <li v-show="resourceArr.length" class="fill-box"></li>-->
              <!--              <li v-show="resourceArr.length" class="fill-box"></li>-->
              <!--              <li v-show="resourceArr.length" class="fill-box"></li>-->
              <!--              <li v-show="resourceArr.length" class="fill-box"></li>-->
              <!--              <li v-show="resourceArr.length" class="fill-box"></li>-->

              <li v-show="!resourceArr.length" class="empty-box">
                <i class="anticon icon-inbox"></i>
                <small>没有图片哦，先上传一些吧</small>
              </li>
            </ul>
          </el-main>
          <el-footer height="20px">
            <el-row type="flex" justify="space-between">
              <el-col :span="6">
                <el-pagination
                  layout="prev, pager, next"
                  :current-page="pagination.page"
                  :total="pagination.total"
                  :page-size="pagination.pageSize"
                  @current-change="pagination.pageChange"
                ></el-pagination>
              </el-col>
              <el-col :span="8" class="opt-buttons">
                <el-upload
                  ref="upload"
                  :action="uploadUrl"
                  :show-file-list="false"
                  name="file"
                  :data="uploadData"
                  :headers="uploadHeader"
                  :accept="acceptFileTypes"
                  multiple
                  :on-success="uploadSuccess"
                  :on-error="uploadError"
                  :disabled="uploadFileCount>0"
                >
                  <el-button type="primary" plain size="small">
                    <i class="el-icon-upload"></i>点击上传
                  </el-button>
                </el-upload>
                <span class="v-space"></span>
                <el-button
                  :disabled="chooseDisabled"
                  type="primary"
                  size="small"
                  @click="chooseResource"
                >
                  <i class="el-icon-check"></i>
                  {{ chooseText }}
                </el-button>
              </el-col>
            </el-row>
          </el-footer>
        </el-container>
      </el-container>
    </el-dialog>
    <el-dialog
      class="dialog-move-dir"
      title="移动到分组"
      width="420px"
      :visible.sync="moveDialogVisible"
    >
      <el-select v-model="moveTargetDirId" placeholder="请选择">
        <el-option v-for="item in dirArr" :key="item.id" :label="item.name" :value="item.id"></el-option>
      </el-select>
      <span slot="footer" class="dialog-footer">
        <el-button @click="moveDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="moveDir">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog class="dialog-img-preview" title="预览" :visible.sync="previewVisible">
      <img v-if="newType === 'IMAGE'" width="100%" :src="imgPreviewSrc" alt />
      <video v-if="newType === 'VIDEO'" width="100%" height="100%" :src="imgPreviewSrc" controls></video>
    </el-dialog>
  </div>
</template>
<script>
  import request from "@/utils/zhangchu-request";
  import util from "@/utils/zhangchu-util";
  import message from "@/utils/zhangchu-message";
  import auth from "@/utils/zhangchu-auth";

  export default {
    name: "ZcResourceDialog",
    data() {
      return {
        selectedArr: [],
        selectedNum: 0,
        dirArr: [],
        resourceArr: [],
        currentDirId: "",
        currentFileId: "",
        lastFetchTime: null,
        uploadFileCount: 0,
        moveDialogVisible: false,
        moveTargetDirId: "",
        previewVisible: false,
        imgPreviewSrc: "",
        isSelectedAll: false,
        pagination: {
          total: 0,
          page: 1,
          pageSize: 15,
          pageChange: page => {
            this.pagination.page = page;
            this.listFiles();
          }
        },
        fileType: "file"
      };
    },

    computed: {
      resourceDialog() {
        return this.$store.state.app.resourceDialog;
      },
      newType() {
        return this.resourceDialog.type === "IMAGE" ? "IMAGE" : "VIDEO";
      },
      format() {
        return this.resourceDialog.type;
      },
      limit() {
        return this.resourceDialog.limit;
      },
      selectedIds() {
        return this.selectedArr.map(item => {
          return item.id;
        });
      },
      chooseDisabled() {
        return (
          !this.selectedArr.length ||
          this.selectedArr.length > this.limit - this.resourceDialog.selectedNum
        );
      },
      chooseText() {
        if (this.resourceDialog.type === "IMAGE") {
          const num = this.limit - this.resourceDialog.selectedNum;
          return this.selectedArr.length > num ? "最多" + num + "张" : "使用图片";
        } else {
          return "使用视频";
        }
      },
      uploadHeader() {
        return auth.getHeaders();
      },
      uploadData() {
        return {
          dirId: this.currentDirId,
          userType: "ADMIN",
          userId: this.$route.query.userId
        };
      },
      uploadUrl() {
        const baseUrl = process.env.VUE_APP_BASE_API;
        return `${baseUrl}/oss/${this.fileType}_upload/upload`;
      },
      uploadName() {
        return this.resourceDialog.type === "IMAGE" ? "image" : "file";
      },
      acceptFileTypes() {
        return this.resourceDialog.type === "IMAGE" ? ".png,.jpg,.jpeg,.gif" : ".mp4";
      }
    },
    watch: {
      "resourceDialog.visible": {
        handler(val) {
          if (val) {
            const isHasCache = this.isHasCache();
            if (isHasCache) return;
            this.fetchData();
          }
          this.selectedArr = [];
        },
        deep: true
      },

      "resourceDialog.type": {
        handler(val) {
          this.fetchData();
          this.selectedArr = [];
        }
      }
    },
    created() {
      this.fetchData();
    },
    methods: {
      uploadSuccess(response, file, fileList) {
        this.uploadFileCount++;
        if (this.uploadFileCount >= fileList.length) {
          this.listFiles();
          this.uploadFileCount = 0;
          message.success("上传成功");
          this.$refs.upload.clearFiles();
        }
      },
      uploadError(err, file) {
        message.err("上传失败", file.name);
        this.listFiles();
        this.uploadFileCount = 0;
        this.$refs.upload.clearFiles();
        console.error(err);
      },
      chooseResource() {
        if (this.selectedArr.length == 0) {
          return;
        }
        if (this.selectedArr.length > this.limit) {
          this.selectedArr = this.selectedArr.slice(0, this.limit);
        }
        const str =
          this.limit > 1
            ? JSON.stringify(
            this.selectedArr.map(item => {
              return item.fileUrl;
            })
            )
            : this.selectedArr[0].fileUrl;
        const res = this.resourceDialog.choose(
          str,
          this.selectedArr.map(file => file.fileUrl)
        );
        if (res !== false) {
          this.$store.dispatch("app/setResourceDialogOption", {
            visible: false,
            choose: () => {
            }
          });
        }
      },
      isHasCache() {
        let isHasCache = false;
        if (this.lastFetchTime != null && this.lastFetchTime.getTime() + 18000 > new Date().getTime()) {
          isHasCache = true ;
          return isHasCache;
        }
        this.lastFetchTime = new Date();
        return isHasCache;
      },
      fetchData() {
        // const isHasCache = this.isHasCache();
        // if (isHasCache) return;
        this.listDirs().then(() => this.listFiles());
      },
      // 获取分组数据
      fetchDirsData() {
        return new Promise((resolve, reject) => {
          request
            .findArr(`/oss/${this.fileType}_dir/list`, {format: this.format})
            .then(arr => {
              resolve(
                arr.map(item => {
                  item.fileCount = item[`${this.fileType}Count`];
                  item.fixed = item.type === "SYSTEM";
                  return item;
                })
              );
            })
            .catch(() => {});
        });
      },
      fetchFilesData() {
        return request.post(`/oss/${this.fileType}/list`, {
          fileDirId: this.currentDirId,
          page: this.pagination.page,
          pageSize: this.pagination.pageSize
        });
      },
      fileClick(item) {
        const index = this.selectedArr.findIndex(obj => item.id === obj.id);
        if (index < 0) {
          this.selectedArr.push(item);
        } else {
          this.selectedArr.splice(index, 1);
        }
      },
      listDirs() {
        return this.fetchDirsData().then(arr => {
          this.dirArr = arr;
          if (this.dirArr.length > 0) {
            this.currentDirId = this.dirArr[0].id;
          }
        });
      },
      listFiles() {
        this.fetchFilesData().then(data => {
          // const baseUrl = process.env.VUE_APP_BASE_API;
          const { page, count } = data;
          const arr = data.data;
          this.pagination.total = count;
          this.pagination.page = page;
          this.resourceArr = arr.map(item => {
            return {
              id: item.id,
              fileName: item.name,
              fileUrl: `${item.url}`,
              dirId: item.dirId
            };
          });
        });
      },
      addDir() {
        message
          .prompt("输入分组名称", "添加分组", {
            inputPattern: /^[\u4e00-\u9fa5_a-zA-Z0-9]{1,20}$/,
            inputErrorMessage: "请输入长度20以内的非特殊字符"
          })
          .then(({ value }) => {
            request.postL(`/oss/${this.fileType}_dir/add`, {name: value, format: this.resourceDialog.type}).then(() => {
              message.success("添加成功");
              this.listDirs();
            });
          })
          .catch(() => {});
      },
      dirChange(id) {
        this.currentDirId = id;
        this.pagination.page = 1;
        this.selectedArr = [];
        this.listFiles();
      },
      editDir() {
        const dir = this.findCurrentDir();
        if (!dir) {
          message.err("分组不存在");
          return;
        }
        if (dir.fixed) {
          message.warning("系统分组不能修改");
          return;
        }
        message
          .prompt("输入分组名称", "编辑分组", {
            inputPattern: /^[\u4e00-\u9fa5_a-zA-Z0-9]{1,20}$/,
            inputErrorMessage: "请输入长度20以内的非特殊字符",
            inputValue: dir.name
          })
          .then(({ value }) => {
            request
              .postL(`/oss/${this.fileType}_dir/update`, {
                id: this.currentDirId,
                name: value
              })
              .then(() => {
                message.success("编辑成功");
                dir.name = value;
              });
          })
          .catch(() => {});
      },
      deleteDir() {
        const dir = this.findCurrentDir();
        if (!dir) {
          message.err("分组不存在");
          return;
        }
        if (dir.fixed) {
          message.warning("系统分组不能删除");
          return;
        }
        message
          .confirm("确定要删除分组'" + dir.name + "'吗？", "删除分组")
          .then(() => {
            request
              .postL(`/oss/${this.fileType}_dir/delete`, {
                id: this.currentDirId
              })
              .then(() => {
                message.success("删除成功");
                this.currentDirId = null;
                this.listDirs().then(() => this.listFiles());
              });
          })
          .catch(() => {});
      },
      findCurrentDir() {
        if (!this.currentDirId) {
          return null;
        }
        const index = this.dirArr.findIndex(item => item.id === this.currentDirId);
        if (index < 0) {
          return null;
        }
        return this.dirArr[index];
      },
      showMoveDirDialog(item) {
        this.moveDialogVisible = true;
        this.currentFileId = item.id;
        this.moveTargetDirId = item.dirId;
      },
      moveDir() {
        this.moveDialogVisible = false;
        request
          .postL(`/oss/${this.fileType}/move`, {
            ids: this.currentFileId,
            fileDirId: this.moveTargetDirId,
            sourceDirId: this.currentDirId
          })
          .then(() => {
            this.listDirs().then(() => this.listFiles());
            message.success("移动成功");
          })
          .catch(() => {});
      },
      editFile(item) {
        message
          .prompt("输入文件名称", "编辑文件", {
            inputPattern: /^[\u4e00-\u9fa5_a-zA-Z0-9\.\(\)\@\$\%]{1,20}$/,
            inputErrorMessage: "请输入长度20以内的非特殊字符",
            inputValue: item.fileName
          })
          .then(({ value }) => {
            request
              .postL(`/oss/${this.fileType}/update`, {id: item.id, name: value, fileDirId: this.currentDirId})
              .then(() => {
                message.success("编辑成功");
                item.fileName = value;
              });
          });
      },
      deleteFile(item) {
        message
          .confirm(
            "确定要删除'" +
            item.fileName +
            "'吗？删除后所有引用该图片的地方将无法显示",
            "删除图片"
          )
          .then(() => {
            request
              .postL(`/oss/${this.fileType}/delete`, {
                id: item.id
              })
              .then(() => {
                message.success("删除成功");
                const dir = this.findCurrentDir();
                if (dir) {
                  dir.fileCount = dir.fileCount - 1;
                }
                this.listFiles();
              });
          })
          .catch(() => {});
      },
      previewImg(item) {
        this.previewVisible = true;
        this.imgPreviewSrc = item.fileUrl;
      },
      batchDelete() {
        message
          .confirm(
            "确定要删除这" + this.selectedArr.length + "张图片吗?",
            "批量删除"
          )
          .then(() => {
            request
              .postL(`/oss/${this.fileType}/deleteBatchIds`, {
                ids: this.selectedIds.join(",")
              })
              .then(() => {
                message.success("删除成功");
                const dir = this.findCurrentDir();
                if (dir) {
                  dir.fileCount = dir.fileCount - this.selectedArr.length;
                }
                this.selectedArr = [];
                this.listFiles();
              });
          })
          .catch(() => {});
      },
      batchMoveDir() {
        const dir = this.findCurrentDir();
        if (!this.selectedIds.length || !dir) {
          return;
        }
        this.moveDialogVisible = true;
        this.currentFileId = this.selectedIds.join(",");
        this.moveTargetDirId = this.findCurrentDir().id;
      },
      selectAll() {
        this.selectedArr = this.isSelectedAll
          ? util.deepClone(this.resourceArr)
          : [];
      }
    }
  };
</script>

<style scoped>
  .flex-wrap {
    display: flex;
    flex-wrap: wrap;
  }
  .resource-dialog {
    padding: 6px;
    z-index: 50;
  }

  .resource-dialog .el-dialog {
    min-width: 850px;
    width: 60%;
    margin-top: 8vh !important;
    max-height: 75vh;
  }

  .resource-dialog .el-dialog__wrapper {
    z-index: 50 !important;
  }

  .resource-dialog .el-dialog__body {
    display: flex;
    padding-top: 0px !important;
  }
  .resource-dialog .resource-aside {
    height: calc(75vh - 250px);
    overflow-y: auto;
    margin-top: -45px;
  }
  .resource-dialog .el-radio-group > .el-radio {
    display: block;
    margin-left: 0 !important;
    margin-bottom: 18px;
    width: 120px;
  }

  .resource-dialog .el-radio-group {
    width: 150px;
  }
  .opt-buttons {
    display: inline-flex;
  }
  .resource-aside .opt-button-group button {
    padding-right: 20px;
  }
  .resource-main {
    flex-grow: 1;
    /* margin-left: 18px; */
    min-height: 50vh;
    margin-top: -85px;
  }
  .resource-main .tool-bar {
    padding: 12px;
    justify-content: space-between;
    align-content: center;
  }
  .resource-main .resource-container {
    justify-content: space-between;
    align-content: flex-start;
    padding: 12px 12px 0 12px;
    background-color: #f0f0f0;
    border-radius: 5px;
    height: calc(50vh);
    overflow-y: auto;
    margin-bottom: 0;
  }
  .resource-main .file-box {
    width: calc(20% - 20px);
    height: 120px;
    background-color: #f8f8f8;
    padding-bottom: 5px;
    margin: 0 10px 12px;
    position: relative;
    border-radius: 5px;
    transition: all 0.2s;
  }
  .resource-main .fill-box{
    width: calc(20% - 20px);
    height:0;
    margin: 0 10px;
  }
  .resource-main .resource-container .empty-box {
    flex-grow: 1;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-content: center;
    color: #959baa;
  }
  .resource-main .resource-container .empty-box > i {
    display: block;
    text-align: center;
    width: 100%;
    font-size: 88px;
    color: #d9dbe0;
  }
  .resource-main .file-box.chosen::after {
    content: "\e6da";
    font-family: element-icons !important;
    color: #f8f8f8;
    text-align: center;
    font-size: 32px;
    line-height: 70px;
    display: block;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    border-radius: 5px;
    background-color: rgba(0, 0, 0, 0.2);
  }
  .resource-main .file-box .file-img {
    max-width: 120px;
    height: 64px;
    background-size: contain;
    background-position: center center;
    background-repeat: no-repeat;
    margin: 5px;
    border-radius: 5px;
  }
  .resource-main .file-box .file-name {
    text-align: center;
    word-break: break-all;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    margin: 0 10px;
    font-size: 12px;
    width: calc(100% - 20px);
    display: inline-block;
  }
  .resource-main .file-box .file-options {
    width: 100%;
    justify-content: space-around;
  }
  .resource-main .file-box .file-options > .el-button {
    flex-grow: 1;
    margin: 0;
    padding: 6px 0;
    border-right: 1px solid #eee;
    color: #666;
  }
  .dialog-move-dir .el-select {
    width: 100%;
  }
  .dialog-img-preview {
    max-height: 100vh;
  }
</style>
