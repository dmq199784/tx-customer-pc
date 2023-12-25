<template>
  <zc-form :form="form">
    <template #productId>
      <el-form-item label="产品选择">
        <el-select v-model="form.data.productId" placeholder="请选择"   style="width: 100%">
          <el-option v-for="item in options" :key="item.id" :label="item.productName" :value="item.id"><span style="float: left">{{ item.productCode }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.productName }}</span></el-option>
        </el-select>
      </el-form-item>
    </template>
      <template #customerId>
      <el-form-item label="选择客户">
        <el-select v-model="form.data.customerId" placeholder="请选择"   style="width: 100%">
          <el-option v-for="item in optionsOne" :key="item.id" :label="item.name" :value="item.id"><span style="float: left">{{ item.name }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.customerCode }}</span></el-option>
        </el-select>
      </el-form-item>
    </template>
  </zc-form>
</template>

<script>
import {Form} from "@/utils/zhangchu-form";
import zc from "@/utils/zhangchu";

export default {
  data() {
    return {
      form: new Form({
        items: [
          {
            title: "批次名称",
            name: "batchName",
            placeholder: "请输入产品编码",
            maxlength: 40,
            required: true
          },
          "productId",
          "productCode",
          "customerId"
          // "id"
        ],
        // 请求表单数据的链接 可以为function 为false或没有该参数则不会请求数据
        dataUrl: () => {
          return this.$route.query.id ? "/cms/batch/find" : false;
        },
        // 请求数据的参数  %{}表示从当前url中取参数  如果没有该参数  默认从url中取id请求  可以是function返回值
        dataParams: {
          id: "%{id}"
        },
        data: {
          productId: "",
          customerId: ""
        },
        afterFetch: data => {
          const param = (({id, batchName, productName, productId, customerId}) => ({
            id,
            batchName,
            productName,
            productId,
            customerId
          }))(data);
          return param;
        },
        // afterFetch: data => {
        //   // 获取表单数据后执行 如果有返回值 返回值会覆盖表单 data
        //   return data;
        // }
        // rules:{}  // 表单校验规则
        submitUrl: () => {
          return this.$route.query.id ? "/cms/batch/update" : "/cms/batch/add";
        },
        // 提交表单前执行  返回false终止提交
        beforeSubmit: () => {
          Object.assign(this.form.data);
          console.log(this.form.data);
          if (this.$route.query.id) {
            this.form.data.id = this.$route.query.id;
          }
        },
        afterSubmit: data => {
          console.log(data);
        }
      }),
      options: [],
      optionsOne: [],
      value: ""
    };
  },
  created() {
    // 加载详情
    this.getProductAll();
    this.getUserAll();
  },
  methods: {
    getProductAll() {
      zc.post("/cms/product/listAll", {}, res => {
        this.options = res.data;
      });
    },
    getUserAll() {
      zc.post("/upms/user/listCustomerAll", {}, res => {
        this.optionsOne = res.data;
      });
    }
  }
};
</script>
