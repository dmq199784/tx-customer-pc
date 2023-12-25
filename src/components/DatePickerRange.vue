<template>
  <el-date-picker
    v-model="modelValue"
    type="daterange"
    align="right"
    unlink-panels
    range-separator="至"
    start-placeholder="开始日期"
    end-placeholder="结束日期"
    :picker-options="pickerOptions"
    value-format="yyyy-MM-dd"
    :clearable="false"
    @change="changeDatePicker"
  >
  </el-date-picker>
</template>

<script>
  import { getDefaultTime } from "@/utils/index";

  export default {
    name: "DatePickerRange",

    model: {
      prop: "dateValue",
      event: "dateValueChange"
    },

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

    computed: {
      modelValue: {
        get() {
          return this.dateValue;
        },
        set(val) {
          this.$emit("dateValueChange", val);
        }
      }
    },

    methods: {
      changeDatePicker() {
        this.$emit("change");
      }
    }
  };
</script>
