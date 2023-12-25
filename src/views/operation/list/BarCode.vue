<template>
  <div>
    <zc-table :table="table" />
  </div>
</template>

<script>
  import {Table} from "@/utils/zhangchu-table";
  import request from "@/utils/zhangchu-request";

  export default {
    data() {
      return {
        table: new Table({
          Tree: true,
          checkbox: false,
          add: false,
          batchDelete: {
            show: false
          },
          // operation: false,
          columns: {
            barCode: "条码编号",
            // batchId: "批次ID",
            // productCode: "产品ID",
            isUse: {
              title: "是否使用",
              type: "html",
              formatter: (item, arr, index) => {
                switch (item.isUse) {
                  case 0:
                    return "<span style='color: #04dc94'>未使用</span>";
                  case 1:
                    return "<span style='color: #0130a5'>已使用</span>";
                  default:
                    return "<span style='color: #969b9f'>无状态</span>";
                }
              }
            }
            // address: "签到地址"
          },
          operation: {
            update: false,
            delete: false,
            buttons: [
              {
                title: "下载二维码",
                click: (e, item) => {
                  console.log(item.id);
                  this.getBarCode(item.id);
                }
              }
            ]
          },
          path: "/cms/barCode/list",
          params: {
            s_batchId: this.$route.query.id
          },
          // columnName: "username", // 删除的提示字段,没有设置搜索key时也会使用此"p_{{columnName}}"搜索
          // key: "id"  // 删除和更新时传的字段 默认为id
          load: true, // 是否初始化时加载数据
          update: false,
          delete: false,
          // operation: {
          //   update: false,
          //   delete: false // 不显示删除按钮 可以是function
          // },
          // 不配置key则按columnName设置的字段搜索，若没设置columnName则按cloumns第一个显示字段搜索
          search: false
        })
      };
    },
     methods: {
       getBarCode(id) {
         const postData = {id: id};
         request.post("/cms/barCode/getBarCode", postData).then(res => {
           const {data} = res;
           this.qrBase64 = data.base64;
           // 这里是获取到的图片base64编码,这里只是个例子哈，要自行编码图片替换这里才能测试看到效果
           const imgUrl = this.qrBase64;
           // 如果浏览器支持msSaveOrOpenBlob方法（也就是使用IE浏览器的时候），那么调用该方法去下载图片
           if (window.navigator.msSaveOrOpenBlob) {
             const bstr = atob(imgUrl.split(",")[1]);
             let n = bstr.length;
             const u8arr = new Uint8Array(n);
             while (n--) {
               u8arr[n] = bstr.charCodeAt(n);
             }
             const blob = new Blob([u8arr]);
             window.navigator.msSaveOrOpenBlob(blob, "chart-download" + "." + "png");
           } else {
             // 这里就按照chrome等新版浏览器来处理
             const a = document.createElement("a");
             a.href = imgUrl;
             a.setAttribute("download", "chart-download");
             a.click();
           }
         });
       }
     }
  };
</script>
