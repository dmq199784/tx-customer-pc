import util from "@/utils/zhangchu-util";
import { QueryPage } from "@/utils/zhangchu-page";
import request from "@/utils/zhangchu-request";
import message from "@/utils/zhangchu-message";
import router from "@/utils/zhangchu-router";
import session from "@/utils/zhangchu-session";
import md5 from "js-md5";
export class Table {
  constructor(option) {
    try {
      this.setOptions(option);
    } catch (e) {
      console.error(e);
    }
  }
  setOptions(option) {
    this.loading = false;
    this.arr = [];
    this.option = option || {};
    if (this.option.operation !== false) {
      this.option.operation = this.option.operation || {};
    }
    this.option.checkbox = this.option.checkbox !== false;
    if (this.option.search !== false) {
      this.option.search = this.option.search || {};
      if (!this.option.search.input) {
        this.option.search.input = "";
      }
    }
    if (option) {
      this.init();
    }
  }
  checkCache() {
    if (!this.option.disableCache) {
      const cache = session.get(md5(location.href));
      if (cache) {
        if (cache.page) {
          this.queryPage.setPage(cache.page);
          this.pagination.page = cache.page;
        }
        this.queryPage.setSize(cache.pageSize);
        this.pagination.pageSize = cache.pageSize;
        if (cache.search) {
          this.option.search = { ...this.option.search, ...cache.search };
        }
        if (cache.searchParams) {
          this.option.searchParams = cache.searchParams;
        }
        if (cache.tabs) {
          this.option.tabs.active = cache.tabs.active;
        }
        if (cache.params) {
          this.operation.params = cache.params;
        }
      }
    }
  }
  formatColumns() {
    const columns = this.option.columns;
    this.columns = {};

    for (const key in columns) {
      const value = columns[key];
      let column = {
        name: key,
        show: true
      };
      if (typeof value == "string") {
        column.title = value;
      } else {
        column = { ...column, ...value };
      }
      if (column.props) {
        for (const prop in column.props) {
          column[":" + prop] = column.props[prop];
        }
      }
      this.columns[column.name] = column;
    }
  }
  createHeaders() {
    this.headers = [];
    this.columnProps = {};
    const columns = this.columns;
    for (const key in columns) {
      const column = columns[key];
      if (column.show === false) {
        continue;
      }
      this.headers.push({
        name: column.name,
        title: column.title || "",
        sortable: column.sortable ? "custom" : false
      });
      this.columnProps[column.name] = [];
    }
  }
  initPagination() {
    this.showPagination = this.option.showPagination !== false;
    this.disablePagination = this.option.pagination === false;
    if (this.disablePagination) {
      this.showPagination = false;
      return;
    }
    this.pagination = {
      total: 0,
      pageSizes: [10, 20, 30, 40, 50],
      pageSize: 10,
      page: 1
    };

    if (typeof this.option.pagination == "object") {
      this.pagination = { ...this.pagination, ...this.option.pagination };
    }
    this.queryPage = new QueryPage({
      page: this.pagination.page,
      pageSize: this.pagination.pageSize,
      url: this.getListUrl()
    });
    this.queryPage.beforeQuery(() => {
      this.loading = true;
    });
    this.queryPage.afterQuery(() => {
      this.loading = false;
    });
    this.pagination.onPageChange =
      this.pagination.onPageChange ||
      (page => {
        this.queryPage.setPage(page);
        this.list();
      });
    this.pagination.onSizeChange =
      this.pagination.onSizeChange ||
      (pageSize => {
        this.queryPage.setSize(pageSize);
        this.list();
      });
  }
  formatUrl(sourceUrl, extUrl) {
    let url = sourceUrl;
    if (url) {
      url = util.getString(url);
    } else if (this.option.path) {
      url = this.option.path;
    } else {
      return extUrl;
    }
    if (url.endsWith("/")) {
      url = url + extUrl;
    }
    return url;
  }
  getListUrl() {
    return this.formatUrl(this.option.listUrl, "list");
  }
  list() {
    // console.log(this.option);
    let params = this.option.params || {};
    const sortParams = this.option.sortParams || {};
    const searchParams = this.option.searchParams || {};
    const tabsParams =
      this.option.tabs && this.option.tabs.params
        ? this.option.tabs.params
        : {};
    if (sortParams) {
      params = { ...params, ...sortParams, ...searchParams, ...tabsParams };
    }
    if (!this.disablePagination) {
      this.queryPage
        .setParams(params)
        .query()
        .then(arr => this.fillTable(arr))
        .catch(() => {});
    } else {
      request
        .findArr(this.getListUrl(), params)
        .then(arr => this.fillTable(arr))
        .catch(() => {});
    }
    if (!this.option.disableCache) {
      // pagination false 报错，现注释掉了
      // session.set(md5(location.href), {
      //   page: this.queryPage.option.page,
      //   pageSize: this.queryPage.option.pageSize,
      //   search: this.option.search,
      //   searchParams: this.option.searchParams,
      //   params: this.option.params,
      //   tabs: this.option.tabs
      // });
    }
  }
  fillTable(arr) {
    this.headers.forEach(header =>
      arr.forEach(item => {
        if (typeof item[header.name] == "undefined") {
          item[header.name] = "";
        }
      })
    );
    this.createButtons(arr);
    arr.forEach((item, index) => {
      for (const key in item) {
        const column = this.columns[key];
        if (column) {
          if (column.formatter) {
            item[key] = column.formatter(item, arr, index);
          }
        }
      }
    });
    const columnProps = {};
    this.headers.forEach(header => {
      columnProps[header.name] = [];
      const column = this.columns[header.name];
      arr.forEach((item, index) => {
        const prop = {
          value: item,
          bindProps: {},
          onProps: {}
        };
        for (const key in column) {
          if (key.startsWith(":")) {
            prop.bindProps[key.substring(1)] = util.getString(
              column[key],
              item,
              arr,
              index
            );
          } else if (key.startsWith("@")) {
            prop.onProps[key.substring(1)] = (...args) => {
              if (args && args.length == 1) {
                args = args[0];
              }
              return column[key](args, item, arr, index);
            };
          }
        }
        columnProps[header.name].push(prop);
      });
    });
    this.columnProps = columnProps;
    this.arr = arr;
    if (this.queryPage) {
      this.pagination.total = this.queryPage.total || 0;
      this.pagination.page = this.queryPage.option.page;
      this.pagination.pageSize = this.queryPage.option.pageSize;
    }
  }
  createButtons(arr) {
    try {
      const operation = this.option.operation;
      if (!operation.buttons || operation.buttons.length == 0) {
        return;
      }

      this.buttons = [];
      arr.forEach((e, index) => {
        const button = [];
        operation.buttons.forEach(btn => {
          const item = {};
          item.title = btn.title;
          item.show = btn.show !== false;
          item.onClick = event => {
            if (btn.click) {
              btn.click(event, e, arr, index);
            }
          };
          if (typeof btn.show == "function") {
            item.show = btn.show(e, arr, index);
          }
          const props = {};
          if (btn.props) {
            for (const prop in btn.props) {
              props[prop] = util.getString(btn.props[prop], e, arr, index);
            }
          }
          item.props = props;
          if (item.show) {
            button.push(item);
          }
        });
        this.buttons.push(button);
      });
    } catch (e) {
      console.log(e);
    }
  }
  initOperationButtons() {
    this.buttons = [];
    const operation = this.option.operation;
    operation.buttons = this.option.operation.buttons || [];
    operationButtonWidth(operation);
  }
  onUpdateClick(index) {
    const item = this.arr[index];
    let update = this.option.operation.update || this.option.updateUrl;
    if (!update) {
      update = "update";
    }
    const res = util.getString(update, item, this.arr, index);
    const key = this.option.operation.key || this.option.key || "id";
    if (typeof res == "string") {
      router.push({
        path: res,
        query: {
          [key]: item[key]
        }
      });
    }
  }
  onDeleteClick(index) {
    const item = this.arr[index];
    let url = null;
    let res = true;
    if (typeof this.option.operation.delete == "function") {
      res = this.option.operation.delete(item, this.arr, index);
    }
    if (typeof this.option.deleteUrl == "function") {
      res = this.option.deleteUrl(item, this.arr, index);
    }
    if (!res) {
      return;
    }
    if (typeof res == "string") {
      url = res;
    } else if (typeof this.option.operation.delete === "string") {
      url = this.option.operation.delete;
    } else if (typeof this.option.deleteUrl === "string") {
      url = this.option.deleteUrl;
    }
    url = this.formatUrl(url, "delete");
    const key = this.option.operation.key || this.option.key || "id";
    let name = null;
    if (this.option.columnName) {
      name = item[this.option.columnName];
    } else {
      // 找到该列第一行作为删除提示
      for (const k in this.columns) {
        const column = this.columns[k];
        if (!column.type && column.show) {
          name = item[k];
          break;
        }
      }
    }
    if (!name) {
      name = "该行";
    } else {
      name = "\"" + name + "\"";
    }
    message
      .confirm("确定要删除" + name + "吗", "删除")
      .then(() => {
        request.postL(url, { [key]: item[key] }).then(() => {
          message.success("删除成功");
          this.list();
        });
      })
      .catch(() => {});
  }
  onSortChange(e) {
    const option = this.option;
    if (option.onSortChange) {
      if (option.onSortChange(e) === false) {
        return;
      }
    }
    option.sortParams = {};
    const sortBy = e.prop;
    if (!sortBy) {
      return;
    }
    const column = this.columns[sortBy];
    let key = "o_" + sortBy;
    let value = e.order == "ascending" ? "ASC" : "DESC";
    if (column) {
      if (column.sortKey) {
        key = column.sortKey;
      }
      if (column.sortValue) {
        value = util.getString(column.sortValue, e);
      }
    }
    option.sortParams[key] = value;
    this.list();
  }
  initSearch() {
    try {
      this.option.search =
        this.option.search === false
          ? false
          : this.option.search || { input: "" };
      if (this.option.search.select && this.option.search.select.length > 0) {
        this.option.search.key =
          this.option.search.key || this.option.search.select[0].key;
      }
      this.option.search.onClick =
        this.option.search.onClick ||
        (() => {
          let searchKey = this.option.search.key;
          if (!searchKey) {
            searchKey = this.option.columnName
              ? "s_" + this.option.columnName
              : "";
            if (!searchKey) {
              // 找到该列第一行作为搜索条件
              for (const k in this.columns) {
                const column = this.columns[k];
                if (column.show) {
                  searchKey = "s_" + k;
                  break;
                }
              }
            }
          }
          if (searchKey) {
            const keys = searchKey.split(",");
            this.option.searchParams = {};
            if (keys.length > 0 && this.option.search.input) {
              keys.forEach(key => {
                this.option.searchParams[key] = this.option.search.input;
              });
            }
          }
          if (this.queryPage) {
            this.pagination.page = 1;
            this.queryPage.setPage(1);
          }
          this.list();
        });
    } catch (e) {
      console.log(e);
    }
  }
  initHeaderButtons() {
    this.initAddButton();
    this.initBatchDelete();
  }
  initAddButton() {
    if (this.option.add === false) {
      this.option.add = { show: false };
      return;
    }
    let add = this.option.add || {};
    if (typeof add == "string" || typeof add == "function") {
      add = {
        click: add
      };
    }
    add.title = add.title || "添加" + (this.option.title || "");
    add.show = add.show !== false;
    add.click = add.click || "add";
    this.option.add = add;
  }
  initBatchDelete() {
    if (this.option.batchDelete === false) {
      this.option.batchDelete = { show: false };
      return;
    }
    let batchDelete = this.option.batchDelete || {};
    if (typeof batchDelete == "function") {
      batchDelete = {
        click: batchDelete
      };
    }
    batchDelete.title = batchDelete.title || "批量删除";
    batchDelete.show = batchDelete.show !== false;
    this.option.batchDelete = batchDelete;
  }
  onAddClick() {
    const url = util.getString(this.option.add.click);
    if (url && typeof url == "string") {
      router.push(url);
    }
  }
  onBatchDeleteClick() {
    if (
      this.option.batchDelete.click &&
      typeof this.option.batchDelete.click == "function"
    ) {
      return this.option.batchDelete.click(
        this.getSelectedKeysStr(),
        this.getSelectedKeys()
      );
    }
    const length = this.getSelectedKeys().length;
    if (length == 0) {
      message.warning("请选中要删除的行");
      return;
    }
    message
      .confirm("确定要删除这" + length + "行吗？")
      .then(() => {
        const url = this.formatUrl(this.option.batchDelete.url, "batchDelete");
        request
          .postL(url, { ids: this.getSelectedKeysStr() })
          .then(() => {
            message.success("删除成功");
            this.list();
          })
          .catch(() => {});
      })
      .catch(() => {});
  }
  onSelectionChange(arr) {
    this.selectedItems = arr;
  }
  getSelectedKeys() {
    if (!this.selectedItems) {
      return [];
    }
    const key = this.option.key || "id";
    const keys = [];
    this.selectedItems.forEach(item => {
      keys.push(item[key]);
    });
    return keys;
  }
  getSelectedKeysStr() {
    return (this.getSelectedKeys() || []).join(",");
  }
  initTabs() {
    if (
      !this.option.tabs ||
      !this.option.tabs.arr ||
      this.option.tabs.arr.length == 0
    ) {
      return;
    }
    if (!this.option.tabs.active) {
      this.option.tabs.active = this.option.tabs.arr[0].value;
    }
    const tabs = this.option.tabs;
    this.option.tabs.click = this.option.tabs.click
      ? this.option.tabs.click
      : tab => {
        if (tabs.key) {
          tabs.params = {
            [tabs.key]: tab.name
          };
          // 我加的
          this.initPagination();
          this.list();
        }
      };
    if (!tabs.params && tabs.key) {
      tabs.params = {
        [tabs.key]: tabs.active
      };
    }
  }
  init() {
    this.formatColumns();
    this.createHeaders();
    this.initPagination();
    if (this.option.operation) {
      this.initOperationButtons();
    }
    this.initSearch();
    this.initHeaderButtons();
    this.initTabs();
    this.inited = true;
    // this.checkCache();
    if (this.option.load !== false) {
      this.list();
    }
  }
}
function operationButtonWidth(operation) {
  let charCount = 0;
  if (operation.update !== false) {
    charCount += 2;
  }
  if (operation.delete !== false) {
    charCount += 2;
  }
  operation.buttons.forEach(e => {
    charCount += e.title.length;
  });
  charCount += operation.buttons.length + 1; // 按钮间隙算一个字符长度
  if (!operation.width) {
    operation.width = charCount * 12 + 60;
  }
}
