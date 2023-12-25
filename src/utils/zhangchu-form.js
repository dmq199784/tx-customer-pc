import util from "@/utils/zhangchu-util";
import request from "@/utils/zhangchu-request";
import router from "@/utils/zhangchu-router";
export class Form {
  constructor(option) {
    try {
      this.setOptions(option);
    } catch (e) {
      console.error(e);
    }
  }
  setOptions(option) {
    this.option = option || {};
    if (option) {
      this.init();
    }
  }
  initData() {
    const items = this.option.items || [];
    this.data = this.option.data || {};
    for (let i = 0; i < items.length; i++) {
      let item = items[i];
      if (typeof item == "string") {
        item = {
          slot: true,
          name: item
        };
        items.splice(i, 1, item);
      } else {
        item.type = item.type || "input";
      }
      this.data[item.name] = this.data[item.name] || "";
    }

    this.option.items = items;
  }
  initRules() {
    const items = this.option.items;
    this.option.rules = this.option.rules || {};
    items.forEach(item => {
      if (item.required) {
        const rule = this.option.rules[item.name] || [];
        let find = false;
        for (const key in rule) {
          if (rule[key].required) {
            find = true;
            break;
          }
        }
        if (!find) {
          rule.push({
            required: true,
            message: item.title + "不能为空",
            trigger: "blur"
          });
          this.option.rules[item.name] = rule;
        }
      }
    });
  }
  fetchData() {
    if (!this.option.dataUrl) {
      return;
    }
    const url = util.getString(this.option.dataUrl);
    if (!url || typeof url != "string") {
      return;
    }
    if (!this.option.dataParams) {
      this.option.dataParams = {
        id: "%{id}"
      };
    }
    const params = {};
    for (const key in this.option.dataParams) {
      let value = util.getString(this.option.dataParams[key]);
      const reg = /%\{(.*)\}/;
      if (value && reg.test(value)) {
        value = util.getQueryString(reg.exec(value)[1].trim());
      }
      if (value) {
        params[key] = value;
      }
    }
    request
      .findData(url, params)
      .then(data => {
        if (this.option.afterFetch) {
          const formData = this.option.afterFetch(data);
          data = formData || data;
        }
        this.data = data;
      })
      .catch(() => {});
  }
  initCancelButton() {
    this.cancel = this.option.onCancelClick;
  }
  showItems(...names) {
    this.option.items.forEach(item => {
      if (names.indexOf(item.name) >= 0) {
        item.show = true;
      }
    });
  }
  hideItems(...names) {
    this.option.items.forEach(item => {
      if (names.indexOf(item.name) >= 0) {
        item.show = false;
      }
    });
  }
  submit() {
    const pass = this.option.beforeSubmit ? this.option.beforeSubmit() : true;
    if (pass === false) {
      return;
    }
    if (!this.option.submitUrl) {
      return;
    }
    const url = util.getString(this.option.submitUrl);
    request
      .postL(url, this.data)
      .then(data => {
        if (this.option.afterSubmit) {
          const res = this.option.afterSubmit(data);
          if (res === false) {
            return;
          }
          if (typeof res === "string") {
            router.push(res);
            return;
          }
        }
        router.go(-1);
      })
      .catch(() => {});
  }
  init() {
    this.initData();
    this.initRules();
    this.fetchData();
    this.initCancelButton();
  }
}
