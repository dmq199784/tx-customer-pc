<template>
  <div class="main-wrapper">
    <div class="left-group">
      <GroupCrud ref="groups" :file-type="fileType" @change:Group="changeGroup"></GroupCrud>
    </div>

    <div class="right-list">
      <MaterialsList
        ref="materialsList"
        :file-type="fileType"
        :dir-id="dirId"
        :options="options"
        @update:Group="updateGroup"
        @onInitOptions="initOptions"
      ></MaterialsList>
    </div>
  </div>

</template>

<script>
  import GroupCrud from "./GroupCrud";
  import MaterialsList from "./MaterialsList";

  export default {
    name: "ContentWrapper",
    components: {GroupCrud, MaterialsList},

    props: {
      fileType: {
        type: String,
        default: ""
      }
    },

    data() {
      return {
        dirId: "",
        options: []

      };
    },

    methods: {
      updateGroup() {
        // 更新分组后面的数量
        this.$refs.groups.getList();
      },

      changeGroup(id) {
        this.dirId = id;
      },

      initOptions() {
        this.options = this.$refs.groups.$data.groups;
      }

    }
  };
</script>

<style lang="scss" scoped>
  .main-wrapper {
    display: flex;
    height: 100%;

    .left-group {
      min-width: 264px;
      overflow: hidden;
    }

    .right-list {
      flex-grow: 1;
    }

  }
</style>
