<template>
  <el-row :gutter="40" class="panel-group">
    <el-col v-for="panel in panelData" :key="panel.type" :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData(panel.type)">
        <div class="card-panel-icon-wrapper" :style="{color: panel.iconColor}">
          <el-badge v-if="panel.hasNotice" :value="panel.noticeNum" class="item">
            <svg-icon :icon-class="panel.icon" class-name="card-panel-icon" />
          </el-badge>
          <svg-icon v-else :icon-class="panel.icon" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            {{ panel.name }}
          </div>
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
  import zc from "@/utils/zhangchu";
  export default {
    data() {
      return {
        panelData: [
          {
            name: "发布公告/ANNOUNCE",
            icon: "announce",
            iconColor: "#40c9c6",
            noticeNum: "0",
            type: "announce",
            hasNotice: false
          },
          // {
          //   name: "项目预警/PROJECT WARNING",
          //   icon: "projects",
          //   iconColor: "#36a3f7",
          //   noticeNum: "0",
          //   type: "projectWarning",
          //   hasNotice: true
          // },
          // {
          //   name: "设备报警/EQUIPMENT WARNING",
          //   icon: "equipment",
          //   iconColor: "#f4516c",
          //   noticeNum: "0",
          //   type: "equipmentWarning",
          //   hasNotice: true
          // },
          // {
          //   name: "订单管理 /ORDER MANAGEMENT",
          //   icon: "orders",
          //   iconColor: "#fd937c",
          //   noticeNum: "0",
          //   type: "orderManagement",
          //   hasNotice: true
          // }
        ]
      };
    },

    created() {
      this.createInterval();
    },

    methods: {
      createInterval() {
        this.getNotice();
        const timer = setInterval(this.getNotice, 8000);
        this.$on("hook:beforeDestroy", () => {
          clearInterval(timer);
        });
      },
      getNotice() {
        const postData = {};
        // zc.post("/report/report/count", postData).then(res => {
        //   console.log(res);
        //   this.panelData[1].noticeNum = res.data.earlyWarnNum;
        //   this.panelData[2].noticeNum = res.data.alarmNum;
        //   this.panelData[3].noticeNum = res.data.orderNum;
        // });
      },
      handleSetLineChartData(type) {
        console.log(type);
        switch (type) {
          case "announce":
            this.$router.push({name: "AddAnnouncement"});
            break;
          case "projectWarning":
            this.$router.push({name: "WarningList"});
            break;
          case "equipmentWarning":
            this.$router.push({name: "EquipmentAlarm"});
            break;
          case "orderManagement":
            this.$router.push({name: "OrdersList"});
            break;
          default:
             //
        }
        // this.$emit("handleSetLineChartData", type);
      }
    }
  };
</script>

<style lang="scss" scoped>
  .panel-group {
    padding-top: 10px;

    .card-panel-col {
      margin-bottom: 32px;
    }

    .card-panel {
      display: flex;
      align-items: center;
      cursor: pointer;
      font-size: 12px;
      color: #666;
      background: #fff;
      box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
      border-color: rgba(0, 0, 0, .05);

      .card-panel-icon-wrapper {
        padding: 16px;
        transition: all 0.38s ease-out;
        border-radius: 6px;
      }

      .card-panel-icon {
        font-size: 48px;
      }

      .card-panel-description {
        float: right;
        font-weight: bold;

        .card-panel-text {
          color: rgba(0, 0, 0, 0.45);
          font-size: 14px;
        }
      }
    }
  }

  @media (max-width: 550px) {
    .card-panel-description {
      display: none;
    }

    .card-panel-icon-wrapper {
      float: none !important;
      width: 100%;
      height: 100%;
      margin: 0 !important;

      .svg-icon {
        display: block;
        margin: 14px auto !important;
        float: none !important;
      }
    }
  }
</style>
