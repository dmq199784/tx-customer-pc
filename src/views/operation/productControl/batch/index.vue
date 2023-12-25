<template>
  <div>
    <zc-table :table="table"/>
    <!-- 生成条码 -->
    <el-dialog :title="renewDialog.title" :visible.sync="renewDialog.show" width="26%">
      <el-form
        ref="renewDialog"
        :model="renewDialog.form"
        :rules="renewDialog.rules"
        label-width="80px"
        @submit.native.prevent
      >
        <el-form-item label="条码个数" prop="quantity">
          <el-input v-model="renewDialog.form.quantity" placeholder="请输入数字">
            <template slot="append">个</template>
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addBarCode()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {Table} from "@/utils/zhangchu-table";
import zc from "@/utils/zhangchu";
import { getAuthorization } from "@/utils/zhangchu-auth";
import axios from "axios";

export default {
  data() {
    var checkInt = (rule, value, callback) => {
      var reg = /^\d+$/;
      if (!reg.test(value)) {
        return callback(new Error("请输入正确的数字"));
      }
      callback();
    };
    return {
      // 生成条码
      renewDialog: {
        title: "生成条码",
        show: false,
        form: {
          batchId: "",
          quantity: ""
        },
        rules: {
          quantity: [
            {required: true, message: "请输入正确的数字", trigger: "blur"},
            {validator: checkInt, trigger: "blur"}
          ]
        }
      },
      table: new Table({
        title: "批次管理",
        columns: {
          batchName: "批次名称",
          totalNum: "批次数量",
          productName: "产品名称",
          productCode: "产品编号",
          customerName: "客户名称",
          customerCode: "客户编号",
          auditorName: "审核人名称",
          createName: "创建人",
          auditType: {
            title: "审核状态",
            type: "html",
            formatter: (item, arr, index) => {
              switch (item.auditType) {
                case "UNREVIEWED":
                  return "<span style='color: #e01e5b'>未审核</span>";
                case "PASSED":
                  return "<span style='color: #48c12c'>已通过</span>";
                case "NOTPASS":
                  return "<span style='color: #0b5c9c'>未通过</span>";
                default:
                  return "<span style='color: #696f72'>无状态</span>";
              }
            }
          }
        },
        path: "/cms/batch/list",
        tabs: {
          arr: [
            {
              title: "全部类型",
              value: ""
            },
            {
              title: "未审核",
              value: "UNREVIEWED"
            },
            {
              title: "已通过",
              value: "PASSED"
            },
            {
              title: "未通过",
              value: "NOTPASS"
            }
          ],
          key: "p_auditType"
        },
        load: true, // 是否初始化时加载数据
        operation: {
          delete: (item, arr, index) => {
            this.$confirm("确定要删除吗", "删除", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            }).then(() => {
              zc.post("/cms/batch/delete", {id: item.id}).then(() => {
                this.$notify({
                  title: "删除成功",
                  type: "success"
                });
                this.table.list();
              });
            }).catch(() => {
              this.$message({
                type: "info",
                message: "已取消删除"
              });
            });
          },
          buttons: [
            {
              title: "审核通过",
              click: (e, item, arr, index) => {
                // console.log("click:", e);
                this.$confirm("确定通过吗", "通过", {
                  confirmButtonText: "确定",
                  cancelButtonText: "取消"
                }).then(() => {
                  zc.post("/cms/batch/auditPass", {
                    id: item.id,
                    auditType: "PASSED"
                  }).then(() => {
                    this.$notify({
                      title: "审核通过",
                      type: "success"
                    });
                    this.table.list();
                  });
                }).catch(() => {
                  this.$message({
                    type: "info",
                    message: "已取消审核"
                  });
                });
              },
              show: function (item, arr, index) {
                if (item.auditType === "UNREVIEWED") {
                  return true;
                } else {
                  return false;
                }
              }
            },
            {
              title: "审核不通过",
              click: (e, item, arr, index) => {
                // console.log("click:", e);
                this.$confirm("确定不通过吗", "不通过", {
                  confirmButtonText: "确定",
                  cancelButtonText: "取消"
                }).then(() => {
                  zc.post("/cms/batch/auditPass", {
                    id: item.id,
                    auditType: "NOTPASS"
                  }).then(() => {
                    this.$notify({
                      title: "审核完成",
                      type: "success"
                    });
                    this.table.list();
                  });
                }).catch(() => {
                  this.$message({
                    type: "info",
                    message: "已取消审核"
                  });
                });
              },
              show: function (item, arr, index) {
                if (item.auditType === "UNREVIEWED") {
                  return true;
                } else {
                  return false;
                }
              }
            },
            {
              title: "条码管理",
              click: (e, item, arr, index) => {
                this.$router.push({name: "BarCode", query: {id: item.id}});
              }
            },
            {
              title: "条码生成",
              click: (e, item, arr, index) => {
                this.renewDialog.form.batchId = item.id;
                this.renewDialog.show = true;
              }
            },
            {
              title: "导出excel",
              click: (e, item) => {
                console.log(item.id);
                this.getQRCode(item.id, item.batchName);
              },
              show: function (item, arr, index) {
                if (item.auditType === "PASSED") {
                  return true;
                } else {
                  return false;
                }
              }
            }
          ]
        },
        // add为false时不显示添加按钮  为string时点击按钮跳转  为function时点击按钮执行function 如果结果返回string则跳转
        add: {
          title: "添加批次"
        },
        batchDelete: {
          url: "/cms/batch/batchDelete"
        },
        // batchDelete为false时不显示批量删除  为function时点击按钮执行function
        // batchDelete: {
        //   url:""
        //   title: "", // 默认 批量删除
        //   show: true, // 默认true
        //   click: function() {}
        // }
        // showHeader: false  // 是否显示顶部添加按钮和搜索框 默认true
        // showTabs: false  // 是否显示顶部标签栏 默认true
        // params: {p_faultType: "0"},
        // 不配置key则按columnName设置的字段搜索，若没设置columnName则按cloumns第一个显示字段搜索
        search: {
          input: "",
          placeholder: "请输入批次名称",
          key: "s_batchName",
          select: [
            {key: "s_batchName", title: "批次名称"}
          ]
        }
      })
    };
  },
  methods: {
    // 续费升级
    addBarCode() {
      const postData = {
        batchId: this.renewDialog.form.batchId,
        quantity: this.renewDialog.form.quantity
      };
      zc.post("/cms/barCode/addBarCode", postData).then(data => {
        this.$message({
          type: "success",
          message: "操作成功"
        });
        this.table.list();
        this.renewDialog.show = false;
      });
    },
    getQRCode(id, batchName) {
      const url = process.env.VUE_APP_BASE_API + "/cms/barCode/getExcel?batchId=" + id;
      const Authorization = getAuthorization();

      axios.get(url, {
        headers: {
          "Content-Type": "application/vnd.ms-excel",
          "Authorization": Authorization
        },
        responseType: "blob"
      }).then(function (res) {
        // 创建Blob对象
          const blob = new Blob([res.data], { type: "application/vnd.ms-excel"});
          // 获取路径
          const url = window.URL.createObjectURL(blob);
          // 创建a标签
          const link = document.createElement("a");
          // 设置a标签链接参数
          link.href = url;
          // 重命名文件
          link.download = batchName + ".xlsx";
          link.click();
          // 下载完成释放URL 对象
          URL.revokeObjectURL(url);
          // 移除a标签
          document.body.removeChild(link);
        console.log(res);
      }).catch(function (error) {
        console.log(error);
      });
    }
  }
};
</script>

<style lang="scss" scoped>
/deep/ .lock-btn {
  color: #ff0000;
}

/deep/ .unlock-btn {
  color: #e7a75e;
}
</style>
