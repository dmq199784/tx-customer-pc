const warningRange = [
  {name: "标准范围", field: "STANDARD_VALUE", type: "standard"},
  {name: "黄色预警范围", field: "YELLOW_EARLY_WARN", type: "yellow"},
  {name: "橙色预警范围", field: "ORANGE_EARLY_WARN", type: "orange"},
  {name: "红色预警范围", field: "RED_EARLY_WARN", type: "red"}
];

const warningRangeMap = {
  "ORANGE_EARLY_WARN": "橙色预警",
  "RED_EARLY_WARN": "红色预警",
  "STANDARD_VALUE": "标准值",
  "YELLOW_EARLY_WARN": "黄色预警"
};

export default {warningRangeMap, warningRange};
