<template>
  <div>
    <el-table
      :data="
        tableData.filter(
          (data) =>
            !search || data.name.toLowerCase().includes(search.toLowerCase())
        )
      "
      style="width: 100%"
    >
      <el-table-column label="序号" prop="id"> </el-table-column>
      <el-table-column label="书名" prop="bookname"> </el-table-column>
      <el-table-column label="作者" prop="author"> </el-table-column>
      <el-table-column label="出版社" prop="publisher"> </el-table-column>
      <el-table-column label="操作" prop="name"> </el-table-column>
      <el-table-column align="right">
        <template slot="header" slot-scope>
          <input
            type="text"
            placeholder="请输入您要查找的图书名称"
            :class="{ search: isTrue }"
            v-model.trim="searchInfo"
            @keyup.enter="searchFn"
          />
        </template>
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="delFn(scope.$index, scope.row.id)"
            :plain="true"
            >删除</el-button
          >
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
            >详情</el-button
          >
        </template>
      </el-table-column>
      <div style="margin: 20px"></div>
    </el-table>
    <el-form
      :label-position="labelPosition"
      label-width="80px"
      :model="booksObj"
      class="lable-books"
    >
      <el-form-item label="书名">
        <el-col :span="8">
          <el-input v-model.trim="booksObj.bookname"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="作者">
        <el-col :span="8">
          <el-input v-model.trim="booksObj.author"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="出版社">
        <el-col :span="8">
          <el-input v-model.trim="booksObj.publisher"></el-input>
        </el-col>
      </el-form-item>
      <el-button type="success" plain @click="addFn">新增图书信息</el-button>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [],
      search: "",
      labelPosition: "right",
      booksObj: {
        bookname: "",
        author: "",
        publisher: "",
      },
      searchInfo: "",
      isTrue: false,
    };
  },
  methods: {
    async delFn(index, id) {
      const res = await this.$axios({
        method: "GET",
        url: "/api/delbook",
        params: { id },
      });
      // console.log(res);
      if (res.data.status == 200) {
        this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            this.tableData.splice(index, 1);
            this.$message({
              type: "success",
              message: "删除成功!",
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除",
            });
          });
      } else {
        const h = this.$createElement;
        this.$notify({
          title: "标题名称",
          message: h(
            "i",
            { style: "color: teal" },
            "抱歉，删除该条数据需要有管理员权限"
          ),
          duration: 1000,
        });
      }
    },
    async addFn() {
      let { bookname, author, publisher } = this.booksObj;
      if (bookname == "" || author == "" || publisher == "") {
        return this.$message({
          showClose: true,
          message: "请输入完整信息后再进行查询！",
          type: "warning",
        });
      }
      const res = await this.$axios({
        method: "POST",
        url: "/api/addbook",
        data: { ...this.booksObj },
      });
      if (res.status == 201) {
        alert(res.meg);
      } else {
        this.$axios({
          method: "GET",
          url: "/api/getbooks",
        }).then((res) => {
          this.tableData = res.data.data;
        });
      }
      bookname = "";
    },
    async searchFn() {
      const res = await this.$axios({
        url: "/api/getbooks",
        params: { bookname: this.searchInfo },
      });
      if (this.searchInfo.length == 0) {
        return this.$message({
          showClose: true,
          message: "请输入有效信息后再进行查询！",
          type: "warning",
        });
      }
      if (res.data.data.length !== 0) {
        console.log(res.data.data.length);
        const { data } = res.data;
        this.tableData = data;
      } else {
        console.log(res);
        this.$message({
          showClose: true,
          message: "抱歉，您要查找的信息不存在！",
          type: "error",
        });
      }
    },
    handleDelete(index, obj) {
      this.$alert(
        `该图书名称为 :${obj.bookname} 
        作者为: ${obj.author}\n\t 
        出版社名称为 :${obj.publisher}`,
        {
          confirmButtonText: "确定",
        }
      );
    },
    // change() {
    //   console.log(222);
    //   this.isTrue = true;
    // },
  },
  created() {
    this.$axios({
      method: "GET",
      url: "/api/getbooks",
    }).then((res) => {
      this.tableData = res.data.data;
      console.log(res);
    });
  },
};
</script>
<style  scoped>
input {
  width: 220px;
  height: 30px;
  border: 0;
  border: 3px solid violet;
  border-radius: 10px;
  margin-right: 50px;
  text-align: center;
}
.search {
  border: 3px solid violet !important;
}
.search::placeholder {
  font-size: 14px;
  color: violet;
}
.lable-books {
  margin-top: 50px;
}
</style>