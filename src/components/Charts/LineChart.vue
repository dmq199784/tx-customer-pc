<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
  import echarts from "echarts";
  require("echarts/theme/macarons"); // charts theme
  import resize from "./mixins/resize";

  export default {
    name: "LineChart",
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
        default: "350px"
      },
      autoResize: {
        type: Boolean,
        default: true
      },
      chartData: {
        type: Object,
        required: true
      },
      smooth: {
        type: Boolean,
        default: false
      },
      lineColor: {
        type: String,
        default: "#3888fa"
      },
      areaColor: {
        type: String,
        default: "#f3f8ff"
      }
    },
    data() {
      return {
        chart: null
      };
    },
    watch: {
      chartData: {
        deep: true,
        handler(val) {
          this.setOptions(val);
        }
      }
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
        this.setOptions(this.chartData);
      },
      setOptions({xData, data} = {}) {
        this.chart.setOption({
          xAxis: {
            data: xData,
            boundaryGap: false,
            axisTick: {
              show: true
            },
            axisLine: {
              lineStyle: {
                color: "#333"
              }
            }
          },
          yAxis: {
            axisTick: {
              show: false
            },
            axisLine: {
              lineStyle: {
                color: "#333"
              }
            }
          },
          grid: {
            left: 10,
            right: 40,
            bottom: 20,
            top: 30,
            containLabel: true
          },
          tooltip: {
            trigger: "axis",
            axisPointer: {
              type: "cross"
            },
            padding: [5, 10]
          },
          series: [
            {
              smooth: this.smooth,
              type: "line",
              itemStyle: {
                normal: {
                  lineStyle: {
                    color: this.lineColor,
                    width: 2
                  },
                  areaStyle: {
                    color: this.areaColor
                  }
                }
              },
              data: data,
              animationDuration: 2800,
              animationEasing: "quadraticOut"
            }
          ],
          dataZoom: [
            {
              show: true,
              height: 30,
              xAxisIndex: [0],
              bottom: -10,
              start: 10,
              end: 80,
              handleIcon: "path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z",
              handleSize: "110%",
              handleStyle: {
                color: "#d3dee5"
              },
              textStyle: {color: "#fff" },
              borderColor: "#90979c"
            },
            {
              type: "inside",
              show: true,
              height: 15,
              start: 1,
              end: 35
            }
          ]
        });
      }
    }
  };
</script>
