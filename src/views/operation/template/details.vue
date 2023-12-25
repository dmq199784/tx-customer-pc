<template>
  <div>
    <div style="padding: 20px">

      <el-form ref="form" inline-message :model="form" label-width="80px" class="border" style="padding: 20px">

        <div align="center">
          <el-button type="primary" style="width:200px;margin-bottom:15px;">模&nbsp;&nbsp;&nbsp;&nbsp;板&nbsp;&nbsp;&nbsp;&nbsp;详&nbsp;&nbsp;&nbsp;&nbsp;情</el-button>
        </div>
        <div align="center">
          <el-row style="margin-bottom:15px;">
            <el-col :span="7">
              <el-form-item label="签名名称:">
                <el-input v-model="form.signName"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="模板代码:">
                <el-input v-model="form.templateCode"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <!--            :disabled="true"-->
              <el-form-item label="模板详情:">
                <el-input type="textarea" v-model="form.content" :disabled="true"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <el-form-item>
          <div align="center">
            <el-button type="primary" @click="add">立即保存</el-button>
            <el-button type="primary" @click="cancellation">取消编辑</el-button>
          </div>
        </el-form-item>
      </el-form>
    </div>
  </div>

</template>

<script>
import request from "@/utils/zhangchu-request";

export default {
  data() {
    return {
      form: {
        signName: "",
        templateCode: "",
        content: ""
      },
      id: this.$route.query.id,

      // 基本信息
      info: {}
    };
  },
  created() {
    // 加载详情
    this.getDetails();
  },

  methods: {
    // 保存
    add() {
      const postData = {
        id: this.id,
        signName: this.form.signName,
        templateCode: this.form.templateCode,
        content: this.form.content
      };
      request.post("cms/template/update", postData).then(res => {
        console.log(postData);
        const {status} = res;
        if (status == 0) {
          this.$message({
            message: "修改成功",
            type: "success"
          });
        } else {
          this.$message({
            message: "保修改失败",
            type: "error"
          });
        }
      });
      this.$router.push({name: "Template"});
    },
    // 取消编辑
    cancellation() {
      this.$router.push({name: "Template"});
    },
    // 基本信息
    getDetails() {
      const postData = {id: this.id};
      request.post("cms/template/find", postData).then(res => {
        const {data} = res;
        this.form = data;
        console.log(this.form);
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.el-form {
  margin: 20px 20px 0 0;

  .el-select {
    width: 100%;
  }
}

.border {
  border: 2px solid #333;
  padding: 20 rpx;
  border-radius: 10px;
}
</style>
