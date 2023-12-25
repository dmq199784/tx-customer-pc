<template>
  <div>
    <div style="display: flex">
      <div style="width: 50px"></div>
      <div style="flex: 1; margin-top: 50px">
        <div id="line" style="width: 100%; height: 400px"></div>
      </div>
    </div>
  </div>
</template>
<script>
// 1、引入echarts
import * as echarts from "echarts";
import zc from "@/utils/zhangchu";

export default {

  mounted() {
    this.initDetection();
  },
  methods: {
   initDetection() {
     // 2、初始化echarts
     const chartDom = document.getElementById("line");
     const myChart = echarts.init(chartDom);
     // 3、设置echarts参数
     zc.post("/cms/report/getDetectionReport").then((res) => {
       myChart.setOption(
         {
           title: {
             text: "检测统计"
           },
           tooltip: {},
           legend: {
             data: ["检测数量"]
           },
           xAxis: {
             data: res.data.months
           },
           yAxis: {
             type: "value"
           },
           series: [{
             name: "检测数量",
             type: "line",
             data: res.data.memberCount
           }]
         });
     });
   }
  }
};
</script>
<style>
#detection {
  width: 500px;
  height: 500px;
  border: 1px solid red;
}
</style>
