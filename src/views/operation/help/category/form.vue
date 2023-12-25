<template>
  <zc-form :form="form">
    <template #categoryId>
      <el-select v-model="value" placeholder="请选择">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </template>
  </zc-form>
</template>

<script>
import {Form} from "@/utils/zhangchu-form";

export default {
  data() {
    return {
      options: [{
        value: "1",
        label: "独立"
      }, {
        value: "2",
        label: "非独立"
      }],
      independent: "",
      form: new Form({
        items: [
          {
            title: "菜单名称",
            name: "name",
            placeholder: "请输入名称",
            maxlength: 20,
            required: true
          },
          {
            title: "优先级",
            placeholder: "请输入数字",
            type: "el-input-number",
            name: "priority",
            ":controls-position": "right",
            ":max": 10,
            ":min": 1,
            required: true
          },
          "independent"
        ],
        // 请求表单数据的链接 可以为function 为false或没有该参数则不会请求数据
        dataUrl: () => {
          return this.$route.query.id ? "/cms/article_category/find" : false;
        },
        // 请求数据的参数  %{}表示从当前url中取参数  如果没有该参数  默认从url中取id请求  可以是function返回值
        dataParams: {
          id: "%{id}"
        },
        data: {},
        // afterFetch: data => {
        //   // 获取表单数据后执行 如果有返回值 返回值会覆盖表单 data
        //   return data;
        // }
        // rules:{}  // 表单校验规则
        submitUrl: () => {
          return this.$route.query.id ? "/cms/article_category/update" : "/cms/article_category/add";
        },
        // 提交表单前执行  返回false终止提交
        beforeSubmit: () => {
          // 可以在这里对前端传到后端的数据进行一次过滤
          /* let newData = {};
          newData.id = this.form.data.id;
          newData.name = this.form.data.name;
          newData.priority = this.form.data.priority;
          this.form.data = newData;
          cnsole.log(this.form.data); */
        },
        afterSubmit: data => {
          console.log(data);
        }
      })
    };
  }
};
</script>
