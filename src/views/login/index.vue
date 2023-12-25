<template>
  <div class="login-container" style>
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      label-position="left"
      label-width="0px"
      class="demo-ruleForm login-page"
    >
      <div class="dec-el dec-1"></div>
      <div class="dec-el dec-2"></div>
      <div class="dec-el dec-3"></div>
      <div class="title flex-center">
        <!-- <img class="main-logo" src="@/assets/images/logo_o_color.svg" /> -->
        <img class="main-logo" src="@/assets/images/logo.png" />
        <span>
          <div class="bigger bolder">唐兴资讯-管理平台</div>
          <div class="desc-text smaller text-color-info">为《唐兴资讯》倾力打造的SaaS管理软件</div>
        </span>
      </div>
      <el-form-item prop="username">
        <el-input
          v-model="loginForm.username"
          prefix-icon="el-icon-user"
          type="text"
          auto-complete="off"
          clearable
          placeholder="用户名/手机号"
        />
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          v-model="loginForm.password"
          prefix-icon="el-icon-lock"
          type="password"
          auto-complete="off"
          show-password
          placeholder="请输入密码"
          @keypress.native.enter="handleSubmit"
        />
      </el-form-item>
      <el-form-item style="width:100%;">
        <el-button
          type="primary"
          :loading="btnLoading"
          style="width:100%;"
          @click="handleSubmit"
        >登 录</el-button>
      </el-form-item>
    </el-form>

    <!-- <div class="footer">
      <div class="links">
        <a href="_self">帮助</a>
        <a href="_self">隐私</a>
        <a href="_self">条款</a>
      </div>
      <div class="copyright">Copyright &copy; 2020 掌触网络科技有限公司</div>
    </div> -->
  </div>
</template>

<script>
import zc from "@/utils/zhangchu";
import secure from "@/utils/secure";
import md5 from "js-md5";

export default {
  data() {
    return {
      loginForm: {
        username: "",
        password: ""
      },
      btnLoading: false,
      loginRules: {
        username: [{ required: true, message: "请输入账号", trigger: "blur" }],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }]
      }
    };
  },
  methods: {
    handleSubmit() {
      const { username } = this.loginForm;
      let { password } = this.loginForm;
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.btnLoading = true;
          zc.post("/upms/account_login/loginKey")
            .then(data => {
              const salt = data.data || data["__headers"].authorization;
              const time = new Date().getTime();
              password = secure.sha1(
                md5(secure.sha1(username + password) + salt) + time
              );
              zc.post("/upms/account_login/login", { username, password, salt, time })
                .then(data => {
                  // 校验菜单
                  const menuList = data.data.menuList;
                  if (!menuList || menuList.length == 0) {
                    zc.message.err("权限不足");
                    return;
                  }

                  zc.cache.set("user", data.data, { userId: data.data.id });

                  zc.routher.push(menuList[0] + "?userId=" + data.data.id);
                })
                .catch(() => {})
                .finally(() => {
                  this.btnLoading = false;
                });
            })
            .catch(() => {})
            .finally(() => {
              this.btnLoading = false;
            });
        }
      });
    }
  }
};
</script>

<style scoped>
.login-container {
  width: 100%;
  min-height: 100%;
  padding-top: 15vh;
  background: #f0f2f5 url("~@/assets/login_images/background.svg") no-repeat 50%;
  background-size: 100%;
  position: relative;
}
.login-page {
  -webkit-border-radius: 5px;
  border-radius: 5px;
  margin: 0 auto;
  width: 420px;
  padding: 50px 50px 25px;
  background: #fff;
  box-shadow: 0 15px 25px rgba(0, 0, 0, 0.05);
  position: relative;
}
label.el-checkbox.rememberme {
  margin: 0px 0px 15px;
  text-align: left;
}
.title {
  margin-bottom: 25px;
}
.main-logo {
  vertical-align: middle;
  height: 40px;
  margin-right: 10px;
  border-radius: 5px;
}
.desc-text{
  margin-top: 3px;
}
.dec-el {
  position: absolute;
  z-index: 3;
}
.dec-1 {
  right: 10px;
  top: -5px;
  width: 20px;
  height: 24px;
  background-image: url("~@/assets/login_images/dec_01.svg");
}
.dec-2 {
  left: -5px;
  bottom: -10px;
  width: 40px;
  height: 32px;
  background-image: url("~@/assets/login_images/dec_02.svg");
}
.dec-3 {
  right: -4px;
  bottom: 18px;
  width: 12px;
  height: 13px;
  background-image: url("~@/assets/login_images/dec_03.svg");
}

.footer {
  position: absolute;
  width: 100%;
  bottom: 0;
  padding: 0 16px;
  margin: 48px 0 24px;
  text-align: center;
}
.links {
  margin-bottom: 8px;
  font-size: 14px;
}
.links a {
  color: rgba(0, 0, 0, 0.45);
  transition: all 0.3s;
}
.links a:not(:last-child) {
  margin-right: 40px;
}
.copyright {
  color: rgba(0, 0, 0, 0.45);
  font-size: 12px;
}
</style>
