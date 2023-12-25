import Layout from "@/layout";

const operationRouter = {
  name: "Operation",
  path: "/operation",
  component: Layout,
  redirect: "/operation/announcement/list",
  meta: {
    title: "运营",
    icon: "operation",
    menu: true
  },

  children: [
    {
      path: "/operation/blogroll/list",
      name: "Blogroll",
      component: () => import("@/views/operation/blogroll"),
      meta: {
        title: "链接",
        menu: true
      }
    },
    {
      path: "blogroll/add",
      name: "AddBlogroll",
      component: () => import("@/views/operation/blogroll/form"),
      meta: {
        title: "添加链接",
        father: "Blogroll",
        activeMenu: "/operation/blogroll/list"
      }
    },
    {
      path: "blogroll/update",
      name: "UpdateBlogroll",
      component: () => import("@/views/operation/blogroll/form"),
      meta: {
        title: "编辑链接",
        father: "Blogroll",
        activeMenu: "/operation/blogroll/list"
      }
    },
    {
      path: "/operation/slide-settings/slide",
      name: "CmsSlideSettings",
      component: () => import("@/views/operation/slide-settings"),
      meta: {
        title: "首页轮播图",
        menu: true
      }
    },

    {
      path: "productControl",
      name: "ProductControl",
      redirect: "/operation/productControl/product/list",
      component: () => import("@/views/operation/productControl/index"),
      meta: {
        title: "产品管理",
        menu: true
      },
      children: [
        {
          path: "/operation/productControl/product/list",
          name: "Product",
          component: () => import("@/views/operation/productControl/product"),
          meta: {
            title: "产品系列",
            menu: true
          }
        },
        {
          path: "product/add",
          name: "AddProduct",
          component: () => import("@/views/operation/productControl/product/form"),
          meta: {title: "添加产品系列", father: "Product", activeMenu: "/operation/productControl/product/list"}
        },
        {
          path: "product/update",
          name: "UpdateProduct",
          component: () => import("@/views/operation/productControl/product/form"),
          meta: {title: "编辑产品系列", father: "Product", activeMenu: "/operation/productControl/product/list"}
        },
        {
          path: "/operation/productControl/batch/list",
          name: "Batch",
          component: () => import("@/views/operation/productControl/batch"),
          meta: {
            title: "批次管理",
            menu: true
          }
        },
        {
          path: "batch/add",
          name: "AddBatch",
          component: () => import("@/views/operation/productControl/batch/form"),
          meta: {title: "添加批次", father: "Batch", activeMenu: "/operation/productControl/batch/list"}
        },
        {
          path: "batch/update",
          name: "UpdateBatch",
          component: () => import("@/views/operation/productControl/batch/form"),
          meta: {title: "编辑批次", father: "Batch", activeMenu: "/operation/productControl/batch/list"}
        },
        {
          path: "/operation/list/barCode",
          name: "BarCode",
          component: () => import("@/views/operation/list/BarCode"),
          meta: {
            title: "条码管理",
            father: "Batch",
            activeMenu: "/operation/productControl/batch/list"
          }
        }
      ]
    },
    {
      path: "/operation/detection/list",
      name: "Detection",
      component: () => import("@/views/operation/detection"),
      meta: {
        title: "检测管理",
        menu: true
      }
    },
    {
      path: "/operation/PdfFile/list",
      name: "PdfFile",
      component: () => import("@/views/operation/pdfFile"),
      meta: {
        title: "文件下载",
        menu: true
      }
    },
    {
      path: "/operation/customer/list",
      name: "Customer",
      component: () => import("@/views/operation/customer"),
      meta: {
        title: "客户管理",
        menu: true
      }
    },
    {
      path: "customer/update",
      name: "UpdateCustomer",
      component: () => import("@/views/operation/customer/form"),
      meta: {
        title: "编辑客户信息",
        father: "Customer",
        activeMenu: "/operation/customer/list"
      }
    },
    {
      path: "customer/add",
      name: "AddCustomer",
      component: () => import("@/views/operation/customer/form"),
      meta: {
        title: "添加客户",
        father: "Customer",
        activeMenu: "/operation/customer/list"
      }
    },
    {
      path: "/operation/receiver/list",
      name: "Receiver",
      component: () => import("@/views/operation/receiver"),
      meta: {
        title: "收货地址管理",
        menu: true
      }
    },
    {
      path: "receiver/update",
      name: "UpdateReceiver",
      component: () => import("@/views/operation/receiver/form"),
      meta: {
        title: "编辑收货地址",
        father: "Receiver",
        activeMenu: "/operation/receiver/list"
      }
    },
    {
      path: "receiver/add",
      name: "AddReceiver",
      component: () => import("@/views/operation/receiver/form"),
      meta: {
        title: "添加收货地址",
        father: "Receiver",
        activeMenu: "/operation/receiver/list"
      }
    },
    {
      path: "/operation/template/list",
      name: "Template",
      component: () => import("@/views/operation/template"),
      meta: {
        title: "短信模板管理",
        menu: true
      }
    },
    {
      path: "/operation/template/details",
      name: "TemplateDetails",
      component: () => import("@/views/operation/template/details"),
      meta: {
        title: "修改短信模板",
        father: "Template",
        activeMenu: "/operation/template/list"
      }
    },
    {
      path: "template/add",
      name: "AddTemplate",
      component: () => import("@/views/operation/template/form"),
      meta: {
        title: "添加短信模板",
        father: "Template",
        activeMenu: "/operation/template/list"
      }
    }
  ]
};

export default operationRouter;
