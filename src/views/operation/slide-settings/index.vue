<template>
  <div style="padding: 20px">
    <el-form label-width="auto" label-position="right">
      <el-form-item label="轮播图">
        <div style="display: flex">
          <draggable
            v-model="swiperPic"
            v-bind="optionsDrag"
            style="display: flex"
          >
            <div v-for="(item, itemIndex) in swiperPic" :key="itemIndex" class="img-box" style="margin-right: 20px">
              <div class="swiper-img">
                <el-image
                  style="width: 150px; height: 150px"
                  :src="item.pic"
                  :preview-src-list="[item.pic]"
                  fit="cover"
                >
                </el-image>
                <div class="delete-icon">
                  <i class="el-icon-delete" style="cursor: pointer;" @click="deleteSlide(item)"></i>
                </div>
              </div>
              <div class="swiper-title" :title="tranData(item.link)">链接：{{ tranData(item.link) }}</div>
            </div>
          </draggable>
          <div v-show="swiperPic.length < 6" class="add-swiper" @click="showSwiperAdd">+</div>
        </div>
      </el-form-item>

      <el-form-item>
        <!--        <el-button type="primary" @click="submitSwiper">保存设置</el-button>-->
        <!--        <span style="font-size: 14px;color: #999999;">（ 最多 6 张 ）</span>-->
      </el-form-item>

    </el-form>

    <el-dialog title="添加轮播图" :visible.sync="dialogSwiperShow">
      <el-form
        ref="sForm"
        :model="sForm"
        label-width="100px"
        size="small"
        style="width: 80%"
        :rules="rules"
      >
        <el-form-item label="图片" prop="pic">
          <ImageSelect
            :limit="1"
            :value="sForm.pic"
            @imageChange="imageChange"
          ></ImageSelect>
        </el-form-item>
        <el-form-item label="路由路径" prop="link">
          <el-input v-model="sForm.link"></el-input>
        </el-form-item>
        <el-form-item label="优先级" prop="priority">
          <el-input-number v-model="sForm.priority" controls-position="right" :min="1" :max="10"></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogSwiperShow = false">取 消</el-button>
        <el-button type="primary" size="small" @click="confirmSlide('sForm')">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="linkDialogVisible" title="选择链接">
      <ChooseLink @selectedLink="selectedLink"></ChooseLink>
    </el-dialog>
  </div>

</template>

<script>
  import ChooseLink from "@/components/ChooseLink";
  import ImageSelect from "@/components/ImageSelect";
  import draggable from "vuedraggable";
  import zc from "@/utils/zhangchu";

  export default {
    name: "",
    components: {
      ChooseLink,
      ImageSelect,
      draggable
    },
    data() {
      return {
        activeTab: "products",
        linkDialogVisible: false,
        swiperPic: [],

        rules: {
          // 轮播图
          pic: [{required: true, message: "请选择"}]
        },

        dialogSwiperShow: false,
        sForm: {
          pic: "",
          link: null,
          shopId: "",
          shopName: "哈哈",
          priority: 1
        },
        options: [],

        // 多图片时是否可以拖拽修改排序
        draggable: {
          type: Boolean,
          default: true
        },

        // 获取图片所在的数组index
        index: {
          type: Number,
          default: -1
        }
      };
    },
    computed: {
      optionsDrag() {
        // window.console.log('options')
        const options = {
          sort: true,
          animation: 150,
          draggable: ".img-box",
          ghostClass: "ghost"
        };
        if (!this.draggable) options.sort = false;
        return options;
      }
    },

    created() {
      this.getData();
      this.getSwiperData();
    },

    methods: {
      imageChange(pic) {
        this.sForm.pic = pic;
      },

      // 轮播添加弹窗
      showSwiperAdd() {
        this.sForm.pic = "";
        this.sForm.link = null;
        this.sForm.priority = 0;
        this.dialogSwiperShow = true;
      },

      // 监听店铺选择
      shopIdChange() {
        const thisIndex = this.options.findIndex((item) => {
          return item.value === this.sForm.shopId;
        });
        this.sForm.shopName = this.options[thisIndex].label;
      },

      // 删除轮播
      deleteSlide(item) {
        // this.swiperPic.splice(index, 1);
        zc.message.confirm("确定删除吗").then(() => {
          zc.post("/cms/lantern_slide/delete", {id: item.id}).then(() => {
            this.$message({
              type: "success",
              message: "操作成功！"
            });
            this.getSwiperData();
          });
        }).catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
      },

      // 提交轮播图
      confirmSlide(form) {
        this.$refs[form].validate((valid) => {
          if (valid) {
            // this.swiperPic.push({
            //   pic: this.sForm.pic,
            //   shopId: this.sForm.shopId,
            //   shopName: this.sForm.shopName
            // });
            const postData = {
              pic: this.sForm.pic,
              link: this.sForm.link,
              priority: this.sForm.priority
            };
            zc.post("/cms/lantern_slide/add", postData).then(() => {
              this.$message({type: "success", message: "操作成功"});
              this.dialogSwiperShow = false;
              this.getSwiperData();
            });
          }
        });
      },

      // 获取基础设置
      getData() {

      },

      // 获取轮播图
      getSwiperData() {
        zc.post("/cms/lantern_slide/list").then(res => {
          this.swiperPic = res.data;
        });
      },

      // 保存轮播图设置
      submitSwiper() {
        if (this.swiperPic.length > 0) {
          let pics = "";
          try {
            pics = JSON.stringify(this.swiperPic);
          } catch (err) {
            //
          }
          const postData = {
            pics: pics
          };
          console.log("postData====", postData);
        } else {
          this.$message.error("请上传图片");
        }
      },

      selectedLink(e) {
        this.sForm.link = e;
        this.linkDialogVisible = false;
      },
      chooseLink() {
        this.linkDialogVisible = true;
      },
      handleCloseTag() {
        this.sForm.link = null;
      },
      tranData(link) {
        let newLlink;
        try {
          const tempLink = JSON.parse(link);
          newLlink = tempLink.name;
        } catch (e) {
          newLlink = "";
        }
        return newLlink;
      }

    }
  };
</script>

<style scoped>
  .add-swiper {
    min-width: 160px;
    height: 160px;
    line-height: 160px;
    text-align: center;
    font-size: 30px;
    border: 1px dashed #ccc;
    border-radius: 8px;
    cursor: pointer;
    color: #cccccc;
  }

  .swiper-img {
    border: 1px solid #ccc;
    min-width: 100px;
    min-height: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 5px;
    position: relative;
    cursor: pointer;
  }

  .swiper-img img {
    max-width: 100px;
    max-height: 100px;
  }

  .swiper-title {
    width: 150px;
    padding: 10px 0;
    text-align: center;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }

  .delete-icon {
    position: absolute;
    top: 0;
    right: 0;
    display: block;
    width: 20px;
    height: 20px;
    background-color: rgba(0, 0, 0, .5);
    line-height: 20px;
    text-align: center;
    font-size: 14px;
    color: #fff;
    cursor: pointer;
  }

  .delete-icon:hover {
    background-color: rgba(250, 250, 250, 1);
    color: #F56C6C;
  }

</style>
