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