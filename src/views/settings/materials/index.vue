<template>
  <div style="padding: 20px;height: calc(100vh - 50px)">
    <el-tabs v-model="fileType">
      <el-tab-pane label="图片素材" name="IMAGE">
        <ContentWrapper file-type="IMAGE"></ContentWrapper>
      </el-tab-pane>
      <el-tab-pane label="视频素材" name="VIDEO">
        <ContentWrapper file-type="VIDEO"></ContentWrapper>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import ContentWrapper from "@/views/settings/materials/components/ContentWrapper";

  export default {
    name: "Materials",
    components: {ContentWrapper},
    data() {
      return {
        fileType: "IMAGE"
      };
    }
  };
</script>

<style lang="scss" scoped>

</style>
