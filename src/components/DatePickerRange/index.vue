<template>
  <el-date-picker
    v-model="modelDateValue"
    type="daterange"
    align="right"
    unlink-panels
    range-separator="至"
    start-placeholder="开始时间"
    end-placeholder="结束时间"
    value-format="yyyy-MM-dd"
    :picker-options="pickerOptions"
    @change="changValue"
  >
  </el-date-picker>
</template>

<script>
  import { getDefaultTime } from "@/utils/index";

  export default {
    name: "DatePickerRange",

    // model: {
    //   prop: "modelDateValue",
    //   event: "modelDateValueChange"
    // },

    props: {
      dateValue: {
        type: [String, Array],
        default: () => {
          return getDefaultTime();
        }
      }
    },

    data() {
      return {
        modelDateValue: this.dateValue,

        pickerOptions: {
          shortcuts: [{
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          }, {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          }, {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }]
        }
      };
    },

    methods: {
      changValue(val) {
        console.log("change---", val);
        this.$emit("change", val);
      }
    }
  };
</script>
