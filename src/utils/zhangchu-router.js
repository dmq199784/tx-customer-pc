import router from "../router";

const push = option => {
  router.push(option);
};

const replace = option => {
  router.replace(option);
};

const go = option => {
  router.go(option);
};

export default {
  push,
  replace,
  go
};
