<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
  import echarts from "echarts";
  require("echarts/theme/macarons"); // echarts theme
  import resize from "./mixins/resize";

  export default {
    mixins: [resize],
    props: {
      className: {
        type: String,
        default: "chart"
      },
      width: {
        type: String,
        default: "100%"
      },
      height: {
        type: String,
        default: "300px"
      },
      gaugeValue: {
        type: [Number, String],
        default: 0
      }
    },
    data() {
      return {
        chart: null
      };
    },
    mounted() {
      this.$nextTick(() => {
        this.initChart();
      });
    },
    beforeDestroy() {
      if (!this.chart) {
        return;
      }
      this.chart.dispose();
      this.chart = null;
    },
    methods: {
      initChart() {
        this.chart = echarts.init(this.$el, "macarons");

        this.chart.setOption({
          tooltip: {
            formatter: "{a} <br/>{b} : {c}%"
          },
          toolbox: {
            feature: {}
          },
          series: [{
            name: "业务指标",
            type: "gauge",
            min: 0,				// 最小的数据值,默认 0 。映射到 minAngle。
            max: 450,
            splitNumber: 9,
            detail: {
              show: false
            },
            data: [{
              value: this.gaugeValue
            }],
            axisTick: {splitNumber: 1}
          }]

        });
      }
    }
  };
</script>
