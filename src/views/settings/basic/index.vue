<template>
  <div style="padding-top: 20px">

    <el-radio-group v-model="settingType" style="width: 180px;margin-left: 500px" @change="changeRadio">
      <el-radio-button label="ZH">中&nbsp;&nbsp;&nbsp;&nbsp;文</el-radio-button>
      <el-radio-button label="EN">English</el-radio-button>
    </el-radio-group>

    <zc-form v-show="settingType === 'ZH'" :form="chineseForm" label-width="150px">
      <template #aboutUs>
        <el-form-item :label="languageLabel[settingType]['aboutUs']" style="width: 60vw">
          <tinymce ref="aboutUs" v-model="chineseForm.data.aboutUs" :height="300" />
        </el-form-item>
      </template>
      <template #userAgreementWithPrivacyPolicy>
        <el-form-item :label="languageLabel[settingType]['userAgreementWithPrivacyPolicy']" style="width: 60vw">
          <tinymce ref="userAgreementWithPrivacyPolicy" v-model="chineseForm.data.userAgreementWithPrivacyPolicy" :height="300" />
        </el-form-item>
      </template>

      <template #version>
        <el-form-item :label="languageLabel[settingType]['version']">
          <el-row>
            <el-col :span="4">
              <el-form-item prop="num1" :rules="[{required: true,message: '必填'}]">
                <el-input-number v-model="chineseForm.data.num1" style="width: 80px" :controls="false"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <span>.</span>
            </el-col>
            <el-col :span="4">
              <el-form-item prop="num2" :rules="[{required: true,message: '必填'}]">
                <el-input-number v-model="chineseForm.data.num2" style="width: 80px" :controls="false"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <span style="width: 80px;text-align: center">.</span>
            </el-col>
            <el-col :span="4">
              <el-form-item prop="num3" :rules="[{required: true,message: '必填'}]">
                <el-input-number v-model="chineseForm.data.num3" style="width: 80px" :controls="false"></el-input-number>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form-item>
      </template>
    </zc-form>

    <zc-form v-show="settingType === 'EN'" :form="englishForm" label-width="150px">
      <template #aboutUs>
        <el-form-item :label="languageLabel[settingType]['aboutUs']" style="width: 60vw">
          <tinymce ref="aboutUs" v-model="englishForm.data.aboutUs" :height="300" />
        </el-form-item>
      </template>
      <template #userAgreementWithPrivacyPolicy>
        <el-form-item :label="languageLabel[settingType]['userAgreementWithPrivacyPolicy']" style="width: 60vw">
          <tinymce ref="userAgreementWithPrivacyPolicy" v-model="englishForm.data.userAgreementWithPrivacyPolicy" :height="300" />
        </el-form-item>
      </template>

      <template #version>
        <el-form-item :label="languageLabel[settingType]['version']">
          <el-row>
            <el-col :span="4">
              <el-form-item prop="num1" :rules="[{required: true,message: '必填'}]">
                <el-input-number v-model="englishForm.data.num1" style="width: 80px" :controls="false"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <span>.</span>
            </el-col>
            <el-col :span="4">
              <el-form-item prop="num2" :rules="[{required: true,message: '必填'}]">
                <el-input-number v-model="englishForm.data.num2" style="width: 80px" :controls="false"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <span style="width: 80px;text-align: center">.</span>
            </el-col>
            <el-col :span="4">
              <el-form-item prop="num3" :rules="[{required: true,message: '必填'}]">
                <el-input-number v-model="englishForm.data.num3" style="width: 80px" :controls="false"></el-input-number>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form-item>
      </template>
    </zc-form>
  </div>
</template>

<script>
  import { Form } from "@/utils/zhangchu-form";
  import {languageType} from "./language-type";
  // import {isEmpty} from "@/utils/index";

  let outLabelName = languageType.ZH;
  export default {
    data() {
      return {
        languageLabel: languageType,
        settingType: "ZH",
        chineseForm: new Form(
          {
            items: [
              "settingType",
              {
                title: "标志",
                name: "logo",
                type: "imageSelect",
                required: true
              },
              "aboutUs",
              "userAgreementWithPrivacyPolicy",
              "version",
              {
                title: "客服热线",
                name: "customerHotLine"
              }
            ],
            // 请求表单数据的链接 可以为function 为false或没有该参数则不会请求数据
            dataUrl: () => {
              return "/cms/basicSetting/find";
            },
            // 请求数据的参数  %{}表示从当前url中取参数  如果没有该参数  默认从url中取id请求  可以是function返回值
            dataParams: {
              settingType: "ZH"
            },
            afterFetch: data => {
              // 获取表单数据后执行 如果有返回值 返回值会覆盖表单 data
              const versionArray = data.version.split(".");
              data.num1 = versionArray[0];
              data.num2 = versionArray[1];
              data.num3 = versionArray[2];
              return data;
            },
            // rules:{}  // 表单校验规则
            submitUrl: () => {
              return "/cms/basicSetting/addOrUpdate";
            },
            // 提交表单前执行  返回false终止提交
            beforeSubmit: () => {
              this.chineseForm.data.version = [this.chineseForm.data.num1, this.chineseForm.data.num2, this.chineseForm.data.num3].join(".");
              this.chineseForm.data.settingType = this.settingType;
            },
            afterSubmit: () => {
              this.$message({message: "操作成功", type: "success"});
              this.form.fetchData();
              return false;
            },
            cancelButton: false
          }
        ),
        englishForm: new Form(
          {
            items: [
              "settingType",
              {
                title: "Logo",
                name: "logo",
                type: "imageSelect",
                required: true
              },
              "aboutUs",
              "userAgreementWithPrivacyPolicy",
              "version",
              {
                title: "Customer HotLine",
                name: "customerHotLine"
              }
            ],
            // 请求表单数据的链接 可以为function 为false或没有该参数则不会请求数据
            dataUrl: () => {
              return "/cms/basicSetting/find";
            },
            // 请求数据的参数  %{}表示从当前url中取参数  如果没有该参数  默认从url中取id请求  可以是function返回值
            dataParams: {
              settingType: "EN"
            },
            afterFetch: data => {
              // 获取表单数据后执行 如果有返回值 返回值会覆盖表单 data
              const versionArray = data.version.split(".");
              data.num1 = versionArray[0];
              data.num2 = versionArray[1];
              data.num3 = versionArray[2];
              return data;
            },
            // rules:{}  // 表单校验规则
            submitUrl: () => {
              return "/cms/basicSetting/addOrUpdate";
            },
            // 提交表单前执行  返回false终止提交
            beforeSubmit: () => {
              this.englishForm.data.version = [this.englishForm.data.num1, this.englishForm.data.num2, this.englishForm.data.num3].join(".");
              this.englishForm.data.settingType = this.settingType;
            },
            afterSubmit: () => {
              this.$message({message: "操作成功", type: "success"});
              this.form.fetchData();
              return false;
            },
            cancelButton: false
          }
        )
      };
    },

    computed: {
      labelName() {
        console.log("outLabelName");
        outLabelName = languageType[this.form.data.settingType];
        this.form.option.items.forEach(ele => {
          if (ele.title) {
            ele.title = outLabelName[ele.name];
          }
        });
        return languageType[this.form.data.settingType];
      }
    },

    watch: {
      "form.data": {
        handler(val) {
          if (val.data) return;
          this.form.data = val;
          // this.$refs.aboutUs && this.$refs.aboutUs.setContent(val.aboutUs);
          // this.$refs.userAgreementWithPrivacyPolicy && this.$refs.userAgreementWithPrivacyPolicy.setContent(val.userAgreementWithPrivacyPolicy);
        }
      }
    },

    methods: {
      changeRadio() {
        // console.log(this.form.option);
        // for (const ele of this.form.option.items) {
        //   ele.title = languageType[this.settingType][ele.name];
        // }
        if (this.settingType === "ZH") {
          this.chineseForm.fetchData();
        }
        if (this.settingType === "EN") {
          this.englishForm.fetchData();
        }
        // this.form.option.dataParams.settingType = this.settingType;
      }
    }
  };
</script>
