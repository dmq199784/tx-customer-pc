<template>
  <el-tabs v-model="activeTab" @tab-click="handleClickTab">
    <el-tab-pane label="系统链接" name="system">
      <div class="pane-wrapper">
        <div v-if="!systemData.length">暂无数据</div>

        <div v-for="(system, systemIndex) in systemData" v-else :key="systemIndex" class="item-wrapper">
          <div
            :key="systemIndex"
            style="padding-left: 20px;display: flex;justify-content: space-between;align-items: center"
          >
            <span>{{ system.name }}</span>
            <el-button type="text" @click="handleChooseSystemLink(system)">选择</el-button>
          </div>

        </div>
      </div>
    </el-tab-pane>
    <el-tab-pane label="商品链接" name="products">
      <div class="pane-wrapper">
        <div style="display: flex;justify-content: flex-end">
          <el-input v-model="productName" placeholder="搜索商品" style="width: 150px" size="small"></el-input>
          <el-button size="small" @click="onClickSearch">搜索</el-button>
        </div>

        <div v-if="!productsData.length">暂无数据</div>
        <div v-for="(product, productIndex) in productsData" v-else :key="productIndex" class="item-wrapper">
          <div style="display: flex;justify-content: space-between;padding: 10px 0">
            <div style="display: flex;justify-content: space-between;align-items: center">
              <div style="width: 50px;height: 50px">
                <img style="width: 100%;height: 100%;object-fit: cover" :src="getPic(product.pics)" alt="">
              </div>
              <span style="padding-left: 10px">{{ product.name }}</span>
            </div>
            <el-button type="text" @click="handleChooseProductLink(product)">选择</el-button>
          </div>
        </div>
      </div>
      <el-pagination
        style="float: right"
        layout="total, sizes, prev, pager, next"
        :page-sizes="pagination.pageSizes"
        :page-size="pagination.pageSize"
        :total="pagination.total"
        :current-page="pagination.page"
        @current-change="onPageChange"
        @size-change="onSizeChange"
      />
    </el-tab-pane>
    <el-tab-pane label="分类链接" name="category">
      <div class="pane-wrapper">
        <div v-if="!categoryData.length">暂无数据</div>

        <div v-for="(category, categoryIndex) in categoryData" v-else :key="categoryIndex" class="item-wrapper">

          <div style="display: flex;justify-content: space-between;align-items: center">
            <h4>{{ category.name }}</h4>
            <el-button type="text" @click="handleChooseLink('one', category)">选择</el-button>
          </div>
          <div
            v-for="(item, itemIndex) in category.children"
            :key="itemIndex"
            style="padding-left: 20px;display: flex;justify-content: space-between;align-items: center"
          >
            <span>{{ item.name }}</span>
            <el-button type="text" @click="handleChooseLink('two',category, item)">选择</el-button>
          </div>

        </div>
      </div>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
  import zc from "@/utils/zhangchu";

  export default {
    name: "ChooseLink",

    data() {
      return {
        activeTab: "system",

        productsData: [],

        pagination: {
          total: 0,
          page: 1,
          pageSize: 10,
          pageSizes: [10, 20, 30]
        },
        productName: "",
        categoryData: [],
        systemData: [
          {name: "全部分类", type: "allCategory", url: "/pages/mall/categoriesPage/categoriesPage/categoriesPage"},
          {name: "全部商品", type: "allProducts", url: "/pages/mall/allGoods/allGoods/allGoods"},
          {name: "最新商品", type: "latestProducts", url: "/pages/mall/latestProducts/latestProducts/latestProducts"}
        ]
      };
    },

    created() {
      this.getCategoryList();
      this.getProductsList();
    },

    methods: {
      getCategoryList() {
        zc.post("/mall/product_category/list", {toTree: "T", flag: "F"}).then(res => {
          this.categoryData = res.data;
        });
      },

      getProductsList() {
        const postData = {
          s_name: this.productName,
          page: this.pagination.page,
          pageSize: this.pagination.pageSize
        };
        zc.post("/mall/product/listProduct", postData).then(res => {
          const data = res;
          this.productsData = data.data;
          this.pagination.total = data.count;
          this.pagination.pageSize = data.pageSize;
          this.pagination.page = data.page;
        });
      },

      handleClickTab() {
        // console.log(this.activeTab);
      },

      handleChooseSystemLink(system) {
        const tip = `系统 / ${system.name}`;
        this.$emit("selectedLink", {name: tip, link: system.url});
      },

      handleChooseLink(type, one, two) {
        let tip = "分类 /";
        if (type === "one") {
          tip = `${tip} ${one.name}`;
          const url = `/pages/mall/categoriesPage/categoriesPage/categoriesPage?categoryId=${one.id}`;
          this.$emit("selectedLink", {name: tip, link: url});
        } else {
          tip = `${tip} ${one.name} / ${two.name}`;
          const url = `/pages/mall/latestProducts/latestProducts/latestProducts?categoryId=${two.id}&categoryName=${two.name}`;
          this.$emit("selectedLink", {name: tip, link: url});
        }
      },

      handleChooseProductLink(product) {
        const tip = `商品 / ${product.name}`;
        const url = `/pages/mall/goodsDetail/goodsDetail?productId=${product.id}`;
        this.$emit("selectedLink", {name: tip, link: url});
      },

      getPic(pics) {
        let pic;
        try {
          const tempPics = JSON.parse(pics);
          pic = tempPics[0];
        } catch (e) {
          pic = "https://images.pexels.com/photos/213780/pexels-photo-213780.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500";
        }
        return pic;
      },

      onClickSearch() {
        this.pagination.page = 1;
        this.pagination.pageSize = 10;
        this.getProductsList();
      },

      onPageChange(val) {
        this.pagination.page = val;
        this.getProductsList();
      },

      onSizeChange(val) {
        this.pagination.pageSize = val;
        this.getProductsList();
      }
    }

  };
</script>

<style scoped>
  .pane-wrapper {
    height: 420px;
    overflow-y: auto;
    padding: 10px;
  }
  .item-wrapper {
    border-bottom: 1px solid #e4e7ed
  }

  .item-wrapper:last-of-type {
    border-bottom: none;
  }
</style>
