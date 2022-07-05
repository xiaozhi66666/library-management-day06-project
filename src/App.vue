<template>
  <div class="t-all">
    <div><h1>图书信息管理系统</h1></div>
    <el-table
      :data="
        showBookList.filter(
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
      ref="booksList"
    >
      <el-form-item label="书名" prop="bookname">
        <el-col :span="8">
          <el-input v-model.trim="booksObj.bookname"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="作者" prop="author">
        <el-col :span="8">
          <el-input v-model.trim="booksObj.author"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="出版社" prop="publisher">
        <el-col :span="8">
          <el-input v-model.trim="booksObj.publisher"></el-input>
        </el-col>
      </el-form-item>
      <div>
        <el-button type="success" plain @click="addFn" class="btn-a"
          >新增图书信息</el-button
        >
      </div>
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
      isShow: true,
      isTrue: false,
      isSearch: false,
      time: null,
    };
  },
  methods: {
    delFn(index, id) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const res = await this.$axios({
            method: "GET",
            url: "/api/delbook",
            params: { id },
          });
          if (res.data.status == 200) {
            this.tableData.splice(index, 1);
            this.$message({
              type: "success",
              message: "删除成功!",
            });
          } else {
            this.$notify({
              title: "无权限",
              message: "抱歉，删除该条数据需要管理员权限",
              type: "warning",
            });
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    async addFn() {
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
          this.$message({
            message: "恭喜你，新增图书信息成功！",
            type: "success",
          });
        });
        this.$refs.booksList.resetFields();
      }
    },
    searchFn() {
      clearInterval(this.timer);
      this.timer = setTimeout(() => {
        if (this.searchInfo.length !== 0) {
          this.isSearch = true;
        } else {
          this.search = false;
        }
      }, 1000);
      //
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
  },
  watch: {
    searchInfo() {
      if (this.searchInfo.length == 0) {
        this.isSearch = false;
      }
    },
    // showBookList: {
    //   handler() {
    //     this.isSearch = false;
    //   },
    //   deep: true,
    // },
  },
  created() {
    this.$axios({
      method: "GET",
      url: "/api/getbooks",
    }).then((res) => {
      this.tableData = res.data.data;
    });
  },

  computed: {
    showBookList() {
      if (this.isSearch) {
        const arr = this.tableData.filter((item) => {
          return item.bookname.includes(this.searchInfo);
        });
        return arr;
      } else {
        return this.tableData;
      }
    },
  },
};
</script>
<style  scoped>
.t-all {
  text-align: center;
}
.t-all h1 {
  letter-spacing: 20px;
}
.btn-a {
  float: left;
}
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