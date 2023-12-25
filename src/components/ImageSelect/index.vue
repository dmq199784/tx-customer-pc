<template>
  <div class="img-select">
    <draggable
      :list="images"
      class="img-wrapper"
      tag="ul"
      draggable=".img-box"
      ghost-class="ghost"
      :sort="multiple && sortable"
      @end="draggableSort"
    >
      <li
        v-for="(item,index) in images"
        :key="index"
        class="img-box"
        :style="'width:'+width+'; height:'+height"
      >
        <el-image class="image" :src="item" :preview-src-list="images" />
        <i class="el-icon-close" @click="imgDelete(index)"></i>
      </li>
      <li
        v-if="images.length < limit"
        class="add-btn"
        :style="'width:calc('+width+' - 20px); height:calc('+height+' - 20px);'"
        @click="buttonClick"
      >
        <i class="el-icon-plus"></i>
      </li>
    </draggable>
  </div>
</template>
<script>
import draggable from "vuedraggable";
export default {
  name: "ZcImageSelect",
  components: {
    draggable
  },
  model: {
    event: "imageChange"
  },
  props: {
    value: {
      type: null,
      default: ""
    },
    click: {
      type: null,
      default: null
    },
    callback: {
      type: null,
      default: null
    },
    // 最多可选择的图片数量
    limit: {
      type: Number,
      default: 1
    },
    // 多图片时是否可以拖拽修改排序
    sortable: {
      type: Boolean,
      default: true
    },
    // 图片组件的宽度
    width: {
      type: String,
      default: "120px"
    },
    // 图片组件的高度
    height: {
      type: String,
      default: "120px"
    }
  },
  computed: {
    modelValue: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("imageChange", val);
      }
    },
    images() {
      if (!this.modelValue) {
        return [];
      }
      return this.multiple ? JSON.parse(this.modelValue) : [this.modelValue];
    },
    multiple() {
      return this.limit > 1;
    }
  },
  methods: {
    buttonClick() {
      if (this.click) {
        this.click();
      } else {
        this.$store.dispatch("app/setResourceDialogOption", {
          type: "IMAGE", // 要加上, 会监听变化
          title: "选择图片",
          limit: this.limit,
          visible: true,
          selectedNum: this.images.length,
          choose: (val, images) => {
            if (this.callback) {
              return this.callback(val, images);
            } else {
              if (this.multiple && this.images.length > 0) {
                this.modelValue = JSON.stringify(
                  JSON.parse(this.modelValue).concat(images)
                );
              } else {
                this.modelValue = val;
              }
            }
          }
        });
      }
    },
    imgDelete(index) {
      this.images.splice(index, 1);
      this.imagesToModelValue();
    },
    draggableSort() {
      this.imagesToModelValue();
    },
    imagesToModelValue() {
      if (this.images.length > 0) {
        this.modelValue = this.multiple
          ? JSON.stringify(this.images)
          : this.images[0];
      } else {
        this.modelValue = "";
      }
    }
  }
};
</script>
<style scoped>
.img-select {
  overflow: hidden;
}
.img-select .img-wrapper {
  display: flex;
  flex-wrap: wrap;
  padding: 0px;
  margin-top: 0px;
}
.img-select .img-box.ghost {
  overflow: visible !important;
}
.img-select .img-box {
  position: relative;
  list-style-type: none;
}
.img-select .add-btn {
  float: left;
  text-align: center;
  width: 100px;
  height: 100px;
  border: 1px dashed #ccc;
  border-radius: 5px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 9px;
}
.img-select .add-btn > i {
  font-size: 24px;
  display: block;
  color: #ccc;
}
.img-select .add-btn:hover {
  border-color: #409eff;
}
.img-select .img-box .image {
  width: calc(100% - 20px);
  height: calc(100% - 20px);
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-size: contain;
  background-position: center center;
  background-repeat: no-repeat;
  cursor: pointer;
  position: relative;
  margin: 9px;
}
.img-select .img-box .el-icon-close {
  position: absolute;
  right: 0px;
  top: 0;
  line-height: 12px;
  padding: 3px;
  color: #fff;
  background-color: rgba(0, 0, 0, 0.3);
  border-radius: 100%;
  text-align: cneter;
  font-size: 12px;
  transition: background-color 0.2s;
  cursor: pointer;
}
.img-select .img-box .el-icon-close:hover {
  background-color: #f84545;
}
</style>
