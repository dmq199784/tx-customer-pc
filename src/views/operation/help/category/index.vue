<template>
  <div>
    <el-table
      :data="tableData"
      style="width: 100%;margin-bottom: 20px;"
      row-key="id"
      border
      default-expand-all
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
      <el-table-column
        prop="name"
        label="菜单名"
        width="180">
      </el-table-column>
      <el-table-column
        prop="priority"
        label="优先级"
        width="180">
      </el-table-column>
      <el-table-column
        prop="pathUrl"
        label="路由路径"
        width="260">
      </el-table-column>
<!--      <el-table-column-->
<!--        prop="independent"-->
<!--        label="是否独立"-->
<!--        width="260"-->
<!--        :formatter="independentFormat">-->
<!--      </el-table-column>-->
      <el-table-column
        prop="level"
        label="菜单级别"
        width="180">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope" >
          <el-button
            size="mini"
            @click="handleAdd(scope.$index, scope.row)">新增子级
          </el-button>
          <el-button
            size="mini"
            @click="handleEdit(scope.$index, scope.row)">编辑
          </el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="新增菜单" :visible.sync="deliverDialogVisible">
      <el-form label-width="auto" :model="deliverForm">
        <el-input v-model="deliverForm.id" type="hidden"></el-input>
        <el-input v-model="deliverForm.level" type="hidden"></el-input>
        <el-input v-model="deliverForm.fatherId" type="hidden"></el-input>
        <el-form-item label="菜单名">
          <el-input v-model="deliverForm.name"></el-input>
        </el-form-item>
<!--        <el-form-item label="是否独立">-->
<!--        <el-select v-model="independent" placeholder="请选择">-->
<!--          <el-option-->
<!--            v-for="item in options"-->
<!--            :key="item.value"-->
<!--            :label="item.label"-->
<!--            :value="item.value">-->
<!--          </el-option>-->
<!--        </el-select>-->
<!--        </el-form-item>-->
        <el-form-item label="路由路径">
          <el-input v-model="deliverForm.string"></el-input>
        </el-form-item>
        <el-form-item label="优先级">
          <el-input-number v-model="deliverForm.num" controls-position="right" :min="1" :max="10"></el-input-number>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addSpan">保存</el-button>
      </span>
    </el-dialog>

    <el-dialog title="编辑菜单" :visible.sync="deliverDialogVisibles">
      <el-form label-width="auto" :model="deliverForms">
        <el-input v-model="deliverForms.id" type="hidden"></el-input>
        <el-input v-model="deliverForms.level" type="hidden"></el-input>
        <el-input v-model="deliverForms.fatherId" type="hidden"></el-input>
        <el-form-item label="菜单名">
          <el-input v-model="deliverForms.name"></el-input>
        </el-form-item>
<!--        <el-form-item label="是否独立">-->
<!--          <el-select v-model="independent" placeholder="请选择">-->
<!--            <el-option-->
<!--              v-for="item in options"-->
<!--              :key="item.value"-->
<!--              :label="item.label"-->
<!--              :value="item.value">-->
<!--            </el-option>-->
<!--          </el-select>-->
<!--        </el-form-item>-->
        <el-form-item label="路由路径">
          <el-input v-model="deliverForms.string"></el-input>
        </el-form-item>
        <el-form-item label="优先级">
          <el-input-number v-model="deliverForms.num" controls-position="right" :min="1" :max="10"></el-input-number>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="updateSpan">保存</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import request from "@/utils/zhangchu-request";
  import zc from "@/utils/zhangchu";

  export default {
    inject: ["reload"],
    created() {
      this.getTableData();
    },
    data() {
      return {
        // options: [{
        //   value: 1,
        //   label: "独立"
        // }, {
        //   value: 2,
        //   label: "非独立"
        // }],
        // independent: "",
        handleAddbutton: false,
        tableData: [],
        deliverForm: {express: ""},
        deliverForms: {express: ""},
        num: 1,
        deliverDialogVisibles: false,
        deliverDialogVisible: false
      };
    },
    methods: {
      independentFormat(row, column) {
        console.log(row.independent);
        if (row.independent === 1) {
          return "独立";
        } else {
          return "非独立";
        }
      },
      handleAdd(index, row) {
        this.deliverDialogVisible = true;
        this.deliverForm.level = row.level + 1;
        this.deliverForm.fatherId = row.id;
      },
      handleEdit(index, row) {
        this.deliverDialogVisibles = true;
        this.$set(this.deliverForms, "id", row.id);
        this.$set(this.deliverForms, "string", row.pathUrl);
        this.$set(this.deliverForms, "name", row.name);
        this.$set(this.deliverForms, "num", row.priority);
        // this.independent = row.independent;
      },
      addSpan(index, row) {
        const postData = {
          name: this.deliverForm.name,
          level: this.deliverForm.level,
          priority: this.deliverForm.num,
          fatherId: this.deliverForm.fatherId,
          pathUrl: this.deliverForm.string,
          // independent: this.deliverForm.independent
        };
        // console.log(postData);
        zc.post("/cms/article_category/add", postData).then(() => {
          this.$message({
            type: "success",
            message: "操作成功"
          });
          this.deliverDialogVisible = false;
          this.deliverForm.name = "";
          this.deliverForm.level = "";
          this.deliverForm.num = "";
          this.deliverForm.independent = "";
          this.reload();
        });
      },
      updateSpan(index, row) {
        const postData = {
          id: this.deliverForms.id,
          name: this.deliverForms.name,
          priority: this.deliverForms.num,
          pathUrl: this.deliverForms.string,
          // independent: this.independent
        };
        console.log(postData);
        zc.post("/cms/article_category/update", postData).then(() => {
          this.$message({
            type: "success",
            message: "操作成功"
          });
          this.deliverDialogVisible = false;
          this.deliverForms.name = "";
          this.deliverForms.level = "";
          this.deliverForms.num = "";
          this.deliverForms.independent = "";
          this.reload();
        });
      },
      handleDelete(index, row, item) {
        const postData = {
          id: row.id,
          fatherId: row.fatherId
        };
        zc.post("/cms/article_category/delete", postData).then(() => {
          this.$message({
            type: "success",
            message: "操作成功"
          });
          this.reload();
        });
      },
      getTableData(index, row) {
        request.post("/cms/article_category/list").then(data => {
          // message.success("成功");
          this.tableData = data.data;
        });
      }
    }
  };
</script>
