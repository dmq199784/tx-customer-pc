<template>
  <div>
    <!--    <div @click="sds">sdsd</div>-->
    <zc-table :table="table"/>
    <el-dialog title="确认收样时间" :visible.sync="deliverDialogVisibles">
      <el-form label-width="auto" :model="deliverForm">
        <el-form-item label="确认收样时间:" v-model="deliverForm.deliveryTime">
          <el-date-picker
            type="date"
            placeholder="选择日期"
            v-model="deliverForm.deliveryTime"
            value-format="yyyy-MM-dd"
            style="width: 100%;"></el-date-picker>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="confirmDelivery">确认收样</el-button>
      </span>
    </el-dialog>
    <el-dialog title="确认收样时间" :visible.sync="deliverDialogVisiblesOne">
      <el-form label-width="auto" :model="deliverForm">
        <el-form-item label="确认收样时间:" v-model="deliverForm.deliveryTime">
          <el-date-picker
            type="date"
            placeholder="选择日期"
            v-model="deliverForm.deliveryTime"
            value-format="yyyy-MM-dd"
            style="width: 100%;"></el-date-picker>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="confirmDeliveryOne">确认收样</el-button>
      </span>
    </el-dialog>
    <el-dialog title="完成检测时间" :visible.sync="deliverDialogVisibles2">
      <el-form label-width="auto" :model="deliverForm2">
        <el-form-item label="完成检测时间:" v-model="deliverForm2.finishTime">
          <el-date-picker
            type="date"
            placeholder="选择日期"
            v-model="deliverForm2.finishTime"
            value-format="yyyy-MM-dd"
            style="width: 100%;"></el-date-picker>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="confirmFinish">确认完成</el-button>
      </span>
    </el-dialog>
    <el-dialog title="完成检测时间" :visible.sync="deliverDialogVisibles2One">
      <el-form label-width="auto" :model="deliverForm2">
        <el-form-item label="完成检测时间:" v-model="deliverForm2.finishTime">
          <el-date-picker
            type="date"
            placeholder="选择日期"
            v-model="deliverForm2.finishTime"
            value-format="yyyy-MM-dd"
            style="width: 100%;"></el-date-picker>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="confirmFinishOne">确认完成</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {Table} from "@/utils/zhangchu-table";
import zc from "@/utils/zhangchu";
import message from "@/utils/zhangchu-message";

export default {
  data() {
    return {
      deliverForm: {express: ""},
      deliverForm2: {express: ""},
      deliverDialogVisibles: false,
      deliverDialogVisiblesOne: false,
      deliverDialogVisibles2: false,
      deliverDialogVisibles2One: false,
      pdfUrl: "pdfUrl",
      ids: [],
      table: new Table({
        title: "检测信息",
        topButtons: [
          {
            title: "批量收样",
            click: () => {
              const items = this.table.selectedItems || [];
              const idArray = [];
              for (let i = 0; i < items.length; i++) {
                const item = items[i].id;
                idArray.push(item);
              }
              this.ids = idArray;
              if (this.ids.length === 0) {
                message.warning("请选中要收样的行");
              } else {
                this.deliverDialogVisibles = true;
              }
            }
          },
          {
            title: "批量完成检测",
            click: () => {
              const items = this.table.selectedItems || [];
              const idArray = [];
              for (let i = 0; i < items.length; i++) {
                const item = items[i].id;
                idArray.push(item);
              }
              this.ids = idArray;
              if (this.ids.length === 0) {
                message.warning("请选中要完成检测的行");
              } else {
                this.deliverDialogVisibles2 = true;
              }
            }
          }
        ],
        columns: {
          productName: "关联产品名称",
          deliveryTime: {
            title: "收样时间",
            formatter: (item, arr, index) => {
              return item.deliveryTime.substring(0, 10);
            }
          },
          finishTime: {
            title: "完成检测时间",
            formatter: (item, arr, index) => {
              return item.finishTime.substring(0, 10);
            }
          },
          type: {
            title: "状态",
            type: "html",
            formatter: (item, arr, index) => {
              switch (item.type) {
                case "UNCOLLECTED_SAMPLE":
                  return "<span style='color:#ff0033'>未收样</span>";
                case "RECEIVED_SAMPLE":
                  return "<span style='color:#0048ff'>已收样</span>";
                case "FINISHED":
                  return "已完成";
              }
            }
          }
        },
        path: "/cms/detection/list",
        params: {},
        columnName: "name", // 删除的提示字段,没有设置搜索key时也会使用此"p_{{columnName}}"搜索
        key: "id", // 删除和更新时传的字段 默认为id
        load: true, // 是否初始化时加载数据
        tabs: {
          arr: [
            {
              title: "全部产品",
              value: ""
            },
            {
              title: "未收样",
              value: "UNCOLLECTED_SAMPLE"
            },
            {
              title: "已收样",
              value: "RECEIVED_SAMPLE"
            },
            {
              title: "已完成",
              value: "FINISHED"
            }
          ],
          key: "p_type",
          active: ""
          // click : (tab)=>{}

        },
        // 不配置key则按columnName设置的字段搜索，若没设置columnName则按cloumns第一个显示字段搜索
        search: {
          input: "",
          placeholder: "请输入产品名称",
          key: "s_productName"
        },
        operation: {
          delete: false,
          update: false,
          buttons: [
            {
              title: "预览PDF",
              click: (e, item, arr, index) => {
                const {pdfUrl} = item;
                window.open(pdfUrl);
              },
              show: (item, arr, index) => {
                if (item.pdfUrl) {
                  return true;
                } else {
                  return false;
                }
              }
            },
            {
              title: "完成收样",
              click: (e, item, arr, index) => {
                this.deliverDialogVisiblesOne = true;
                this.id = item.id;
              },
              show: (item, arr, index) => {
                if (item.type === "" || item.type === "UNCOLLECTED_SAMPLE") {
                  return true;
                } else {
                  return false;
                }
              }
            },
            {
              title: "完成检测",
              click: (e, item, arr, index) => {
                this.deliverDialogVisibles2One = true;
                this.id = item.id;
              },
              show: (item, arr, index) => {
                if (item.type === "RECEIVED_SAMPLE") {
                  return true;
                } else {
                  return false;
                }
              }
            }
          ]
        },
        add: false,
        batchDelete: false
        // add为false时不显示添加按钮  为string时点击按钮跳转  为function时点击按钮执行function 如果结果返回string则跳转
        // add: {
        //   // title: "添加用户x"
        //   // show: false   // show为false时不显示添加按钮
        // }
        // showHeader: false  // 是否显示顶部添加按钮和搜索框 默认true
        // showTabs: false  // 是否显示顶部标签栏 默认true
      })
    };
  },
  methods: {
    // sds() {
    //   const items = this.table.selectedItems || [];
    //   for (let i = 0; i < items.length; i++) {
    //     const item = items[i].id;
    //     console.log(item);
    //   }
    //   // console.log(this.table.selectedItems.id);
    // },
    // 批量确认收样
    confirmDelivery() {
      const postData = {
        ids: this.ids.join(","),
        deliveryTime: this.deliverForm.deliveryTime
      };
      zc.post("/cms/detection/batchDetection", postData).then(() => {
        this.$message({
          type: "success",
          message: "操作成功"
        });
        this.deliverDialogVisibles = false;
        this.deliverForm.string = "";
        this.table.list();
        this.ids = [];
        this.deliverForm.deliveryTime = "";
      });
    },
    // 单条确认收样
    confirmDeliveryOne() {
      const postData = {
        deliveryTime: this.deliverForm.deliveryTime,
        id: this.id,
        type: "RECEIVED_SAMPLE"
      };
      // console.log(postData);
      zc.post("/cms/detection/update", postData).then(() => {
        this.$message({
          type: "success",
          message: "操作成功"
        });
        this.deliverDialogVisiblesOne = false;
        this.table.list();
        this.deliverForm.deliveryTime = "";
      });
    },
    // 批量确认完成检测
    confirmFinish() {
      const postData = {
        ids: this.ids.join(","),
        finishTime: this.deliverForm2.finishTime
      };
      zc.post("/cms/detection/detectionFinish", postData).then(() => {
        this.$message({
          type: "success",
          message: "操作成功"
        });
        this.deliverDialogVisibles2 = false;
        this.deliverForm2.string = "";
        this.table.list();
        this.deliverForm2.finishTime = "";
      });
    },
    // 单条确认完成检测
    confirmFinishOne() {
      const postData = {
        finishTime: this.deliverForm2.finishTime,
        id: this.id,
        type: "FINISHED"
      };
      zc.post("/cms/detection/update", postData).then(() => {
        this.$message({
          type: "success",
          message: "操作成功"
        });
        this.deliverDialogVisibles2One = false;
        this.deliverForm2.string = "";
        this.table.list();
        this.deliverForm2.finishTime = "";
      });
    }
  }
};
</script>
