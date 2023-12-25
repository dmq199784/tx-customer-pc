<template>
  <zc-form :form="form">
    <template #addressId>
      <el-form-item label="地址选择">
        <el-select v-model="form.data.addressId" placeholder="请选择" style="width: 100%">
          <el-option v-for="item in optionsOne" :key="item.id" :label="item.name" :value="item.id">
            <span style="float: left">{{ item.name }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.receiverName }}</span></el-option>
        </el-select>
      </el-form-item>
    </template>
    <template #dictTypeId>
      <el-form-item label="动态表格选择">
        <el-select v-model="form.data.dictTypeId" placeholder="请选择"   style="width: 100%">
          <el-option v-for="item in options" :key="item.id" :label="item.type" :value="item.id"><span style="float: left">{{ item.name }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.type }}</span></el-option>
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
            title: "产品编码",
            name: "productCode",
            placeholder: "请输入产品编码",
            maxlength: 40,
            required: true
          },
          {
            title: "产品名称",
            placeholder: "请输入产品名称",
            name: "productName",
            maxlength: 80,
            required: true
          },
          "dictType",
          "dictTypeId",
          "addressId",
          "receiverName"
          // "id"
        ],
        // 请求表单数据的链接 可以为function 为false或没有该参数则不会请求数据
        dataUrl: () => {
          return this.$route.query.id ? "/cms/product/find" : false;
        },
        // 请求数据的参数  %{}表示从当前url中取参数  如果没有该参数  默认从url中取id请求  可以是function返回值
        dataParams: {
          id: "%{id}"
        },
        data: {
          dictType: "",
          addressId: ""
        },
        afterFetch: data => {
          const param = (({id, addressId, dictType,dictTypeId, productCode, productName}) => ({
            id,
            addressId,
            dictType,
            dictTypeId,
            productCode,
            productName
          }))(data);
          return param;
        },
        // afterFetch: data => {
        //   // 获取表单数据后执行 如果有返回值 返回值会覆盖表单 data
        //   return data;
        // }
        // rules:{}  // 表单校验规则
        submitUrl: () => {
          return this.$route.query.id ? "/cms/product/update" : "/cms/product/add";
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
    this.getDictType();
    this.getEquipmentType();
  },
  methods: {
    getDictType() {
      zc.post("/cms/dictType/listType", {}, res => {
        this.options = res.data;
      });
    },
    getEquipmentType() {
      zc.post("/cms/receiver/listAll", {}, res => {
        this.optionsOne = res.data;
      });
    }
  }
};
</script>
