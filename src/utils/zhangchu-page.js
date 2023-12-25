import request from "@/utils/zhangchu-request";

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 10;

export class QueryPage {
  constructor(option) {
    this.option = option;
    this.onBeforeQuery = option.onBeforeQuery || (() => {});
    this.onAfterQuery = option.onAfterQuery || (() => {});
  }
  query() {
    const params = this.params || {};
    params.page = this.option.page || DEFAULT_PAGE;
    params.pageSize = this.option.pageSize || DEFAULT_PAGE_SIZE;
    return new Promise((resolve, reject) => {
      this.onBeforeQuery(params);
      request
        .post(this.option.url, params, this.onAfterQuery)
        .then(data => {
          let res = data;
          if (data.res) {
            res = data.res;
          }
          this.total = res.count;
          resolve(res.data || res.arr);
        })
        .catch(response => reject(response));
    });
  }
  changeSzie(pageSize) {
    return this.setSize(pageSize).query();
  }
  turnTo(page) {
    return this.setPage(page).query();
  }
  setSize(pageSize) {
    this.option.pageSize = pageSize || DEFAULT_PAGE_SIZE;
    return this;
  }
  setPage(page) {
    this.option.page = page || 1;
    return this;
  }
  setParams(params) {
    this.params = params;
    return this;
  }
  beforeQuery(fun) {
    this.onBeforeQuery = fun;
    return this;
  }
  afterQuery(fun) {
    this.onAfterQuery = fun;
    return this;
  }
}
