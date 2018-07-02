<template>
  <div class="table">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item v-for="(item, i) in breadcrumb" :key="i"><i class="el-icon-menu" v-if="i === 0"></i> {{item}}
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="handle-box">
      <el-date-picker
        class="handle-select"
        v-model="FYear"
        align="right"
        type="year"
        value-format="yyyy"
        placeholder="起始年度"
        :blur="search"
        size="small">
      </el-date-picker>
      <el-button type="primary" icon="el-icon-search" @click="search" size="small">查询</el-button>
      <el-button type="primary" icon="el-icon-download" @click="getExcel" size="small">导出并下载</el-button>
    </div>
    <el-table
      :data="tableData"
      v-loading="loading"
      style="width: 100%">
      <el-table-column
        prop="县（市区）"
        label="县(市区)"
        align="center"
        header-align="center"
        width="100">
      </el-table-column>
      <el-table-column
        prop="三年改造任务数"
        label="三年改造任务数"
        align="center"
        header-align="center"
        width="120">
      </el-table-column>
      <el-table-column :label="Number(FYear) + '年'" header-align="center">
        <el-table-column
          :prop="'Task' + Number(FYear) + 'Type1'"
          label="整体(或大部分)拆除退出工业用途"
          align="center"
          header-align="center">
        </el-table-column>
        <el-table-column
          :prop="'Task' + Number(FYear) + 'Type2'"
          label="整体(或大部分)拆除重建用于工业"
          align="center"
          header-align="center">
        </el-table-column>
        <el-table-column
          :prop="'Task' + Number(FYear) + 'Type3'"
          label="综合整治(含部分拆除)用于产业提升或转型"
          align="center"
          header-align="center">
        </el-table-column>
      </el-table-column>
      <el-table-column :label="Number(FYear) + 1 + '年'" header-align="center">
        <el-table-column
          :prop="'Task' + (Number(FYear) + 1) + 'Type1'"
          label="整体(或大部分)拆除退出工业用途"
          align="center"
          header-align="center">
        </el-table-column>
        <el-table-column
          :prop="'Task' + (Number(FYear) + 1) + 'Type2'"
          label="整体(或大部分)拆除重建用于工业"
          align="center"
          header-align="center">
        </el-table-column>
        <el-table-column
          :prop="'Task' + (Number(FYear) + 1) + 'Type3'"
          label="综合整治(含部分拆除)用于产业提升或转型"
          align="center"
          header-align="center">
        </el-table-column>
      </el-table-column>
      <el-table-column :label="Number(FYear) + 2 + '年'" header-align="center">
        <el-table-column
          :prop="'Task' + (Number(FYear) + 2) + 'Type1'"
          label="整体(或大部分)拆除退出工业用途"
          align="center"
          header-align="center">
        </el-table-column>
        <el-table-column
          :prop="'Task' + (Number(FYear) + 2) + 'Type2'"
          label="整体(或大部分)拆除重建用于工业"
          align="center"
          header-align="center">
        </el-table-column>
        <el-table-column
          :prop="'Task' + (Number(FYear) + 2) + 'Type3'"
          label="综合整治(含部分拆除)用于产业提升或转型"
          align="center"
          header-align="center">
        </el-table-column>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { formatDate } from '../../assets/js/date'
import fileDownload from 'js-file-download'
export default {
  data () {
    return {
      breadcrumb: [],
      tableData: [],
      loading: true,
      FYear: formatDate(new Date(), 'yyyy')
    }
  },
  methods: {
    /**
     * 获取面包屑
     */
    getBreadcrumb () {
      let blist = JSON.parse(sessionStorage.getItem('breadcrumb'))
      this.breadcrumb = [].concat(blist)
    },
    getList () {
      let self = this
      if (!this.FYear) {
        self.$message({
          message: '请选择起始年份',
          type: 'warning'
        })
        return false
      }
      this.loading = true
      this.$axios.get('Statistical/GetOldCityChangeSchDataByAgency', {
        params: {
          FYear: this.FYear
        }
      })
        .then(function (response) {
          let data = response.data
          self.loading = false
          if (data.code === 1) {
            self.tableData = [].concat(data.object)
          } else {
            self.$message.error(data.message)
          }
        })
        .catch(function (error) {
          console.log(error)
          self.$alert(error.message, '温馨提示', {
            confirmButtonText: '确定'
          })
        })
    },
    /**
     * 搜索事件
     */
    search () {
      this.getList()
    },
    getExcel () {
      let self = this
      this.$axios.get('Statistical/GetOldCityChangeSchExcelByAgency', {
        params: {
          FYear: this.FYear
        },
        responseType: 'blob'
      })
        .then(function (response) {
          // self.download(response.data)
          // let fileName = response.headers['content-disposition'].match(/fushun(\S*)xls/)[0]
          let fileName = '老旧工业区块' + Number(self.FYear) + '-' + (Number(self.FYear) + 2) + '三年改造任务表.xls'
          fileDownload(response.data, fileName)
        })
        .catch(function (error) {
          console.log(error)
          self.$alert(error.message, '温馨提示', {
            confirmButtonText: '确定'
          })
        })
    },
    download (data) {
      if (!data) {
        return
      }
      let url = window.URL.createObjectURL(new Blob([data]))
      let link = document.createElement('a')
      link.style.display = 'none'
      link.href = url
      link.setAttribute('download', 'excel.xls')

      document.body.appendChild(link)
      link.click()
    }
  },
  created () {
    this.getList()
    this.getBreadcrumb()
  }
}
</script>

<style scoped>
  .handle-box {
    margin-bottom: 20px;
  }

  .handle-input {
    width: 200px;
    display: inline-block;
  }
</style>
