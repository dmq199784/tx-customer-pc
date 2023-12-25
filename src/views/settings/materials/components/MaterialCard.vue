<template>
  <div class="card" @click="handleClickCard(material)">
    <div v-show="tempSelectedIds.includes(material.id)" class="selected-card">
      <i class="el-icon-check"></i>
    </div>
    <div class="thumbnail">
      <div
        v-if="fileType === 'IMAGE'"
        class="img"
        :style="{'background-image': `url(${connectLink(material.url)})`}"
      ></div>
      <video v-else width="100%" height="100%" :src="connectLink(material.url)"></video>
    </div>
    <span class="name" :title="material.name">{{ material.name }}</span>
    <div class="operations">
      <el-button type="text" icon="el-icon-zoom-in" @click.stop="handlePreview(material)"></el-button>
      <el-button type="text" icon="el-icon-folder" @click.stop="handleMoveGroup(material.id)"></el-button>
      <el-button type="text" icon="el-icon-edit" @click.stop="handleEditName(material)"></el-button>
      <el-button type="text" icon="el-icon-delete" @click.stop="handleDelete(material.id)"></el-button>
    </div>

  </div>
</template>

<script>
  export default {
    name: "MaterialCard",

    props: {
      selectedIds: {
        type: Array,
        default: () => []
      },

      fileType: {
        type: String,
        default: ""
      },

      material: {
        type: Object,
        default: () => ({})
      }
    },

    data() {
      return {
        tempSelectedIds: this.selectedIds
      };
    },

    watch: {
      selectedIds: {
        handler(val) {
          this.tempSelectedIds = val;
        }
      }
    },

    methods: {
      connectLink(url) {
        // const baseUrl = process.env.VUE_APP_BASE_API;
        return url;
      },

      handleClickCard(item) {
        if (!this.tempSelectedIds.includes(item.id)) {
          this.tempSelectedIds.push(item.id);
        } else {
          const index = this.tempSelectedIds.findIndex(id => {
            return id === item.id;
          });
          this.tempSelectedIds.splice(index, 1);
        }
        this.$emit("onClickCard", this.tempSelectedIds);
      },

      handleDelete(id) {
        this.$confirm("删除后，所有使用到这些图片的模块都无法显示这些图片，确认删除 ?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.$emit("onClickDelete", id);
        }).catch(() => {
          this.$message({type: "info", message: "已取消删除"});
        });
      },

      handleEditName(material) {
        this.$emit("onClickEditName", {
          type: "input",
          form: {
            value: material.name,
            id: material.id
          }
        });
      },

      handleMoveGroup(id) {
        this.$emit("onClickMove", {
          form: {
            value: "", // 分组的选项置空
            id: id
          },
          isBatchMove: false
        });
      },

      handlePreview(material) {
        this.$emit("onClickPreview", material);
      }
    }
  };
</script>

<style lang="scss" scoped>
  .card {
    position: relative;
    margin: 10px;
    padding: 10px 10px 0 10px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;
    align-self: flex-start;
    width: calc(20% - 20px);
    min-width: 160px;
    height: 260px;
    background-color: #f8f8f8;
    border-radius: 8px;
    overflow: hidden;

    .selected-card {
      position: absolute;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 60px;
      color: #f8f8f8;
      background-color: rgba(0, 0, 0, .3);
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
    }

    .thumbnail {
      width: 100%;
      flex-grow: 1;
      border-radius: 8px;
      overflow: hidden;

      .img {
        background-size: contain;
        background-position: center center;
        background-repeat: no-repeat;
        width: 100%;
        height: 100%;
      }
    }

    .name {
      padding: 10px;
      width: 100%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      text-align: center;
    }

    .operations {
      width: 100%;
      display: flex;
      justify-content: space-between;
      padding: 0 20px;

      .el-button {
        font-size: 18px;
      }
    }
  }
</style>
