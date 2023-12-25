<template>
  <div style="height: 100%">
    <div style="margin-bottom: 20px">
      <el-checkbox v-model="checkedAll">全选</el-checkbox>
      <el-button size="small" :disabled="canUseBatch" @click="clickBatchDelete(tempSelectedIds)">批量删除</el-button>
      <el-button size="small" :disabled="canUseBatch" @click="clickBatchMove(tempSelectedIds)">修改分组</el-button>
      <UploadBtn
        style="float: right"
        :dir-id="dirId"
        :file-type="fileType"
        @uploadSuccess="uploadSuccess"
      ></UploadBtn>
    </div>

    <div class="right-content">
      <!--素材 card-->
      <MaterialCard
        v-for="(material, materialIndex) in materialsData"
        :key="materialIndex"
        :material="material"
        :file-type="fileType"
        :selected-ids="tempSelectedIds"
        @onClickPreview="handlePreview"
        @onClickMove="clickMove"
        @onClickEditName="handleEditName"
        @onClickDelete="clickDelete"
        @onClickCard="handleClickCard"
      ></MaterialCard>
    </div>

    <el-pagination
      :current-page="currentPage"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next"
      :total="total"
      @current-change="changeCurrentPage"
      @size-change="changePageSize"
    >
    </el-pagination>

    <el-dialog
      :title="dialog.type ==='input' ? '名称' : '移动到分组'"
      :visible.sync="dialog.visible"
      width="30%"
    >
      <el-form ref="form" :model="form" @submit.native.prevent>
        <el-form-item prop="value" :rules="{ required: true, message: '必填', trigger: 'blur' }">
          <el-select v-if="dialog.type === 'select'" v-model="form.value" style="width: 100%;">
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>

          <el-input v-if="dialog.type === 'input'" v-model="form.value"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialog.visible = false">取 消</el-button>
        <el-button size="small" type="primary" :disabled="isConfirmDisabled" @click="handleConfirm">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 弹窗预览-->
    <el-dialog
      class="dialog-style"
      :visible.sync="previewDialog"
      @closed="handleClosePreview"
    >
      <img v-if="fileType ==='IMAGE'" width="100%" :src="previewUrl" alt="">
      <video v-if="fileType ==='VIDEO'" width="100%" :src="previewUrl" controls></video>
    </el-dialog>
  </div>
</template>

<script>
  import MaterialCard from "./MaterialCard";
  import UploadBtn from "./UploadBtn";
  import zc from "@/utils/zhangchu";

  export default {
    name: "MaterialsList",

    components: {MaterialCard, UploadBtn},

    props: {
      fileType: {
        type: String,
        default: ""
      },
      dirId: {
        type: String,
        default: ""
      },
      options: {
        type: Array,
        default: () => []
      }
    },

    data() {
      return {
        isConfirmDisabled: false,
        form: {},
        dialog: {
          visible: false,
          type: "input"
        },

        checkedAll: false,

        materialsData: [],
        tempSelectedIds: [],

        isBatchMove: false,

        pageSize: 10,
        currentPage: 1,
        total: 0,

        previewDialog: false,
        previewUrl: "",

        type: "file"
      };
    },

    computed: {
      canUseBatch() {
        return this.tempSelectedIds.length === 0;
      }
      // type() {
      //   return this.fileType === "IMAGE" ? "image" : "file";
      // }
    },

    watch: {
      dirId: {
        handler() {
          this.checkedAll = false;
          this.tempSelectedIds = [];
          this.getData();
        }
      },
      checkedAll: {
        handler(val) {
          if (val) {
            this.tempSelectedIds = [];
            this.materialsData.forEach(material => {
              this.tempSelectedIds.push(material.id);
            });
          } else {
            this.tempSelectedIds = [];
          }
        }
      },

      fileType: {
        handler() {
          this.tempSelectedIds = [];
          this.currentPage = 1;
          this.pageSize = 10;
        }
      },

     "dialog.visible": {
        handler(val) {
          // 分组和重命名弹窗确认按钮可用
          if (val) {
            this.isConfirmDisabled = false;
          }
        }
     }
    },

    methods: {
      success() {
        this.$message({
          type: "success",
          message: "操作成功"
        });
      },

      handleConfirm() {
        this.$refs.form.validate(valid => {
          if (!valid) return;

          // 分组和重命名弹窗确认按钮禁用
          this.isConfirmDisabled = true;
          if (this.dialog.type === "input") {
            const postData = {
              name: this.form.value,
              id: this.form.id
            };
            // 改名
            zc.post(`/oss/${this.type}/update`, postData).then(() => {
              this.handleConfirmSuccess();
            });
          }

          if (this.dialog.type === "select") {
            const postData = {
              ids: this.isBatchMove ? this.tempSelectedIds.join(",") : this.form.id,
              sourceDirId: this.dirId,
              fileDirId: this.form.value
            };
            zc.post(`/oss/${this.type}/move`, postData).then(() => {
              this.handleConfirmSuccess();

              // 更新分组后面的数量
              this.$emit("update:Group");
            });
          }
        });
      },

      handleConfirmSuccess() {
        this.success(); // 成功提示
        this.dialog.visible = false; // 关闭弹窗
        this.getData(); // 重新获取数据
      },

      changeCurrentPage(val) {
        this.currentPage = val;
        this.getData();
      },

      changePageSize(val) {
        this.pageSize = val;
        this.getData();
      },

      handleClickCard(tempSelectedIds) {
        this.tempSelectedIds = tempSelectedIds;
      },

      clickBatchDelete(tempSelectedIds) {
        this.$confirm("删除后，所有使用到这些图片的模块都无法显示这些图片，确认删除 ?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          const id = tempSelectedIds.join(",");
          this.handleDelete(id, "batch");
        }).catch(() => {
          this.$message({type: "info", message: "已取消删除"});
        });
      },

      clickDelete(id) {
        this.handleDelete(id);
      },

      handleDelete(id, type) {
        if (type && type === "batch") {
          // 批量删除
          zc.post(`/oss/${this.type}/batchDelete`, {ids: id, fileDirId: this.dirId}).then(() => {
            this.$message({type: "success", message: "删除成功!"});
            this.$emit("update:Group");
            this.getData();
          });
        } else {
          zc.post(`/oss/${this.type}/delete`, {id: id}).then(() => {
            this.$message({type: "success", message: "删除成功!"});
            this.$emit("update:Group");
            this.getData();
          });
        }
      },

      handleEditName(args) {
        this.dialog.visible = true;
        this.dialog.type = args.type;
        this.form = {
          ...args.form
        };
      },

      clickMove(args) {
        this.isBatchMove = args.isBatchMove;
        this.initOptions();
        this.form = {
          ...args.form
        };
        this.handleMoveGroup();
      },

      clickBatchMove() {
        this.initOptions();
        this.form = {};
        this.isBatchMove = true;
        this.handleMoveGroup();
      },

      handleMoveGroup() {
        this.dialog.visible = true;
        this.dialog.type = "select";
      },

      initOptions() {
        this.$emit("onInitOptions");
        // this.options = this.$parent.groups.$data.groups;
      },

      getData() {
        const postData = {
          page: this.currentPage,
          pageSize: this.pageSize,
          fileDirId: this.dirId
        };
        zc.post(`/oss/${this.type}/list`, postData).then((res) => {
          this.materialsData = res.data;
          this.total = res.count;
        });
      },

      uploadSuccess() {
        // 更新分组后面的数量
        this.$emit("update:Group");
        // this.$refs.groups.getList();

        this.getData();
      },

      handlePreview(material) {
        // const baseUrl = process.env.VUE_APP_BASE_API;
        // this.previewUrl = `${baseUrl}${material.url}`;
        this.previewUrl = material.url;
        this.previewDialog = true;
      },

      handleClosePreview() {
        this.previewUrl = "";
      }
    }
  };
</script>

<style lang="scss" scoped>
  .el-checkbox {
    margin-right: 20px;
  }

  .right-content {
    height: calc(100vh - 250px);
    box-sizing: border-box;
    display: flex;
    flex-wrap: wrap;
    align-content: flex-start;
    background-color: #f0f0f0;
    border-radius: 8px;
    padding: 20px 10px;
    overflow-y: auto;
  }

  .el-pagination {
    margin-top: 20px;
    float: right;
  }
</style>
