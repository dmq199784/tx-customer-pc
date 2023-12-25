<template>
  <div>
    <div class="button-wrapper">
      <el-button plain size="small" type="primary" icon="el-icon-plus" @click="handleAddGroup">添加分组</el-button>
    </div>
    <el-radio-group v-model="currentGroup">
      <el-radio v-for="group in groups" :key="group.id" :label="group.id">{{ group.name }} ( {{ group[`${type}Count`] }} )
        <el-button
          class="button-operation"
          type="text"
          icon="el-icon-edit"
          @click="handleEditGroup(group)"
        ></el-button>
        <el-button
          class="button-operation"
          type="text"
          icon="el-icon-delete"
          @click="handleDeleteGroup(group)"
        ></el-button>
      </el-radio>
    </el-radio-group>

    <el-dialog
      title="名称"
      :visible.sync="dialogVisible"
      width="30%"
    >
      <el-form ref="groupForm" :model="groupForm" @submit.native.prevent>
        <el-form-item prop="name" :rules="{ required: true, message: '必填', trigger: 'blur' }">
          <el-input v-model="groupForm.name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogVisible = false">取 消</el-button>
        <el-button size="small" type="primary" @click.enter="handleConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import zc from "@/utils/zhangchu";

  export default {
    props: {
      fileType: {
        type: String,
        default: ""
      }
    },
    data() {
      return {
        isAdd: true,
        currentGroup: "",
        dialogVisible: false,
        groupForm: {},
        groups: [],
        type: "file"
      };
    },

    // computed: {
    //   type() {
    //     return this.fileType === "IMAGE" ? "image" : "file";
    //   }
    // },

    watch: {
      currentGroup: {
        handler(val) {
          this.$emit("change:Group", val);
        }
      },

      fileType: {
        async handler(val) {
          const res = await zc.post(`/oss/${this.type}_dir/list`, {format: this.fileType});
          this.groups = res.data;
          this.currentGroup = this.groups[0].id;
        },
        immediate: true
      }

    },

    methods: {
      handleAddGroup() {
        this.isAdd = true;
        this.groupForm = {};
        this.dialogVisible = true;
      },

      handleDeleteGroup(group) {
        this.$confirm("确认删除该分组?", "提示", {confirmButtonText: "确定", cancelButtonText: "取消", type: "warning"}).then(() => {
          zc.post(`/oss/${this.type}_dir/delete`, {id: group.id}).then(() => {
            this.$message({type: "success", message: "删除成功!"});
            this.getList();
          });
        }).catch(() => {
          this.$message({type: "info", message: "已取消删除"});
        });
      },

      handleEditGroup(group) {
        this.isAdd = false;
        this.groupForm = {
          name: group.name,
          id: group.id
        };
        this.dialogVisible = true;
      },

      getList() {
        zc.post(`/oss/${this.type}_dir/list`, {format: this.fileType}).then((res) => {
          this.groups = res.data;
        });
      },

      handleConfirm() {
        this.$refs.groupForm.validate(valid => {
          if (!valid) return;
          const postData = {name: this.groupForm.name, format: this.fileType };

          if (!this.isAdd) {
            postData.id = this.groupForm.id;
          }
          zc.post(`/oss/${this.type}_dir/${this.isAdd ? "add" : "update"}`, postData).then(() => {
            this.$message({
              message: "操作成功",
              type: "success"
            });
            this.dialogVisible = false;
            this.getList();
          });
        });
      }
    }
  };
</script>

<style lang="scss" scoped>
  .button-wrapper {
    margin-bottom: 20px
  }

  .el-radio-group {
    height: calc(100vh - 250px);
    overflow: auto;
    display: flex;
    flex-direction: column;

    .el-radio {
      padding: 10px 20px;
    }

    .button-operation {
      padding: 0;margin-left: 10px;
    }
  }
</style>
