<!--预警模板的 -- 预警参数的表格-->
<template>
  <table width="100%" border="1">
    <tr>
      <th colspan="2"></th>
      <th v-for="type in warningRange" :key="type.field">{{ type.name }}</th>
      <th>单位</th>
    </tr>

    <template v-for="(parameter,parameterIndex) in parameters">
      <tr v-for="(data,index) in parameter.earlyWarnDataNameList" :key="`${parameterIndex}_${index}`">
        <th v-if="index === 0" :rowspan="parameter.earlyWarnDataNameList.length">{{ parameter.parameterName }}</th>

        <td>{{ data.dataName }}</td>
        <td v-for="type in warningRange" :key="type.field">
          <div v-for="(ele,eleIndex) in data.earlyWarnConditionJson[type.field]" :key="eleIndex">{{ ele.parameterOne }}
            ~ {{ ele.parameterTwo }}
          </div>
        </td>
        <td>{{ data.unit }}</td>
      </tr>
    </template>
  </table>
</template>

<script>
  export default {
    name: "WarnContentTable",

    props: {
      parameters: {
        type: Array,
        default: () => []
      }
    },

    data() {
      return {
        warningRange: [
          {name: "标准范围", field: "STANDARD_VALUE"},
          {name: "黄色预警范围", field: "YELLOW_EARLY_WARN"},
          {name: "橙色预警范围", field: "ORANGE_EARLY_WARN"},
          {name: "红色预警范围", field: "RED_EARLY_WARN"}
        ]
      };
    }
  };
</script>

<style scoped>
  td,
  th {
    border: 1px solid rgb(190, 190, 190);
    padding: 10px;
  }

  td {
    border: 1px solid rgb(190, 190, 190);
    padding: 10px;
  }

  tr:nth-child(even) {
    background-color: #eee;
  }

  table {
    margin: 0 auto;
    border-collapse: collapse;
    border: 2px solid rgb(200, 200, 200);
    letter-spacing: 1px;
    font-family: sans-serif;
    font-size: 0.8rem;
  }
</style>
