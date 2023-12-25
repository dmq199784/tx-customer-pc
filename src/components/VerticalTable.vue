<template>

  <table>
    <tr v-for="(item,index) in field" :key="index">
      <template v-if="title">
        <th v-if="index === 0" class="rowName" :rowspan="rowNum">{{ title }}</th>
      </template>
      <td class="rowName">{{ item.label }}</td>
      <td class="rowContent">
        <div v-if="item.type === 'earlyWarnContent'">
          <div v-for="(data,dataIndex) in infoData[item.name]" :key="dataIndex">
            <h5 class="args-label" :class="`label-${data.type}`">{{ warningRangeMap[data.type] }}</h5>
            <div>
              <span v-for="(con, conIndex) in data.content" :key="conIndex">
                <div style="margin-bottom: 10px">
                  <span>
                    {{ con.parameterName }} - {{ con.dataName }}（ {{ con.unit }} ）： {{ con.value }}
                  </span>
                  <span style="color: #b0b0b0; margin-left: 10px">
                    标准范围：<span v-for="(value,valueIndex) in con.standardValue" :key="valueIndex">{{ value.parameterOne }} ~ {{ value.parameterTwo }}，</span>
                  </span>
                </div>
              </span>
            </div>

          </div>
        </div>
        <div v-else>{{ infoData[item.name] }}</div>
      </td>
    </tr>
  </table>

</template>

<script>
  import warningRange from "@/utils/warningRange";

  export default {
    props: {
      field: {
        type: Array,
        default: () => []
      },
      infoData: {
        type: Object,
        default: () => ({})
      },
      title: {
        type: String,
        default: ""
      }
    },

    data() {
      return {
        warningRangeMap: warningRange.warningRangeMap
      };
    },
    computed: {
      rowNum() {
        return this.field.length;
      }
    }
  };
</script>

<style lang="scss" scoped>
  .rowName {
    width: 150px;
  }

  .rowContent {
    min-width: 500px;
  }

  td {
    border: 1px solid rgb(190, 190, 190);
    border-bottom: none;
    padding: 10px;
  }

  tr:nth-child(even) {
    background-color: #f8f9fa;
  }

  table {
    margin: 0 auto;
    border-collapse: collapse;
    border: 2px solid rgb(200, 200, 200);
    border-bottom: none;
    letter-spacing: 1px;
    font-family: sans-serif;
    font-size: 0.8rem;
  }

  table:last-child {
    border-bottom: 2px solid rgb(200, 200, 200);
  }

  @mixin label-prefix-circle($color: #00b8ff, $width: 10px) {
    position: relative;
    &::before {
      position: absolute;
      content: "";
      width: $width;
      height: $width;
      background-color: $color;
      border-radius: 50%;
      left: -(1.5 * $width);
      transform: translateY(20%);
    }
  }

  .args-label {
    margin-left: 10px;
    min-width: 100px;

    &.label-STANDARD_VALUE {
      @include label-prefix-circle($color: #1dc31a)
    }

    &.label-YELLOW_EARLY_WARN {
      @include label-prefix-circle($color: #f1e927)
    }

    &.label-ORANGE_EARLY_WARN {
      @include label-prefix-circle($color: orange)
    }

    &.label-RED_EARLY_WARN {
      @include label-prefix-circle($color: red)
    }
  }
</style>
