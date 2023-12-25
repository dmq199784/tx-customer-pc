<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
  import echarts from "echarts";

  require("echarts/theme/macarons"); // charts theme
  import resize from "./mixins/resize";

  export default {
    name: "DoubleLineChart",
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
      },
      oneLegend: {
        type: String,
        default: "图例一"
      },
      twoLegend: {
        type: String,
        default: "图例二"
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

      setOptions({dataOne, dataTwo} = {}) {
        this.chart.setOption({
          xAxis: {
            data: dataOne.xData,
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
          color: ["#3888fa", "#fc917f"],
          legend: {

            data: [
              {
                name: this.oneLegend,
                icon: "react"

              },
              {
                name: this.twoLegend,
                icon: "react",
                color: "#fc917f",
                textStyle: {
                  color: "#fc917f"
                }
              }]
          },
          series: [
            {
              name: this.oneLegend,
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
              data: dataOne.data,
              animationDuration: 2800,
              animationEasing: "quadraticOut"
            },
            {
              name: this.twoLegend,
              smooth: this.smooth,
              type: "line",
              itemStyle: {
                normal: {
                  lineStyle: {
                    color: "#fc917f",
                    width: 2
                  },
                  areaStyle: {
                    color: "#fc917f"
                  }
                }
              },
              data: dataTwo.data,
              animationDuration: 2800,
              animationEasing: "quadraticOut"
            }

          ]
        });
      }
    }
  };
</script>
